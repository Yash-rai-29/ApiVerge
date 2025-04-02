from typing import List, Optional, Dict, Any
from fastapi import UploadFile
from datetime import datetime
import uuid
import json
import yaml
import httpx
from fastapi import HTTPException
from google.cloud import firestore
from projects.projects_model import ProjectResponse, EndpointResponse, ProjectEndpoint, ProjectEndpointParameter, TestRun, TestResult

db = firestore.Client()
projects_collection = db.collection("projects")
endpoints_collection = db.collection("endpoints")
test_runs_collection = db.collection("test_runs")
test_results_collection = db.collection("test_results")

async def get_all_projects_service(user_id: str) -> List[ProjectResponse]:
    projects_ref = projects_collection.where("user_id", "==", user_id).order_by("created_at", direction="DESCENDING")
    projects = []
    for doc in projects_ref.stream():
        project_data = doc.to_dict()
        endpoints_count = sum(1 for _ in endpoints_collection.where("project_id", "==", doc.id).stream())
        tests_count = sum(run.to_dict().get("total_tests", 0) for run in test_runs_collection.where("project_id", "==", doc.id).stream())
        projects.append(ProjectResponse(**project_data, id=doc.id, endpoints_count=endpoints_count, tests_count=tests_count))
    return projects

async def get_project_service(project_id: str, user_id: str) -> Optional[ProjectResponse]:
    doc = projects_collection.document(project_id).get()
    if not doc.exists or doc.to_dict().get("user_id") != user_id:
        return None
    project_data = doc.to_dict()
    endpoints_count = sum(1 for _ in endpoints_collection.where("project_id", "==", project_id).stream())
    tests_count = sum(run.to_dict().get("total_tests", 0) for run in test_runs_collection.where("project_id", "==", project_id).stream())
    return ProjectResponse(**project_data, id=doc.id, endpoints_count=endpoints_count, tests_count=tests_count)

async def create_project_service(user_id: str, name: str, description: Optional[str], type_: str, account_type: str, openapi_url: Optional[str], openapi_file: Optional[UploadFile]) -> ProjectResponse:
    project_id = str(uuid.uuid4())
    project_data = {
        "user_id": user_id, "name": name, "description": description, "type": type_, "account_type": account_type,
        "created_at": datetime.utcnow(), "updated_at": datetime.utcnow(), "status": "active", "openapi_url": openapi_url
    }
    projects_collection.document(project_id).set(project_data)
    if openapi_url or openapi_file:
        await import_openapi_schema_service(project_id, user_id, openapi_url, await openapi_file.read() if openapi_file else None)
    return await get_project_service(project_id, user_id)

async def update_project_service(project_id: str, user_id: str, name: Optional[str], description: Optional[str], type_: Optional[str], account_type: Optional[str], openapi_url: Optional[str], openapi_file: Optional[UploadFile]) -> ProjectResponse:
    doc = projects_collection.document(project_id).get()
    if not doc.exists or doc.to_dict().get("user_id") != user_id:
        raise HTTPException(403)
    update_data = {"updated_at": datetime.utcnow()}
    if name: update_data["name"] = name
    if description: update_data["description"] = description
    if type_: update_data["type"] = type_
    if account_type: update_data["account_type"] = account_type
    if openapi_url: update_data["openapi_url"] = openapi_url
    doc.reference.update(update_data)
    if openapi_url or openapi_file:
        await import_openapi_schema_service(project_id, user_id, openapi_url, await openapi_file.read() if openapi_file else None)
    return await get_project_service(project_id, user_id)

async def delete_project_service(project_id: str, user_id: str):
    doc = projects_collection.document(project_id).get()
    if not doc.exists or doc.to_dict().get("user_id") != user_id:
        raise HTTPException(403)
    await delete_project_endpoints_service(project_id)
    await delete_project_test_runs_service(project_id)
    await doc.reference.delete()

async def get_project_endpoints_service(project_id: str, user_id: str) -> List[EndpointResponse]:
    if not await get_project_service(project_id, user_id):
        raise HTTPException(status_code=404)
    
    endpoints_ref = endpoints_collection.where("project_id", "==", project_id).order_by("path")
    endpoints = []
    
    for doc in endpoints_ref.stream():
        endpoint_data = doc.to_dict()
        # Remove 'id' and 'test_count' from the dictionary to avoid conflicts
        endpoint_data.pop("id", None)
        endpoint_data.pop("test_count", None)  # Add this line
        
        test_count = sum(1 for _ in test_results_collection.where("endpoint_id", "==", doc.id).stream())
        endpoints.append(EndpointResponse(**endpoint_data, id=doc.id, test_count=test_count))
    
    return endpoints

async def import_openapi_schema_service(project_id: str, user_id: str, openapi_url: Optional[str], openapi_file: Optional[bytes]) -> Dict[str, Any]:
    if not await get_project_service(project_id, user_id):
        raise HTTPException(404)
    openapi_data = None
    if openapi_url:
        async with httpx.AsyncClient() as client:
            res = await client.get(openapi_url)
            res.raise_for_status()
            openapi_data = res.json()
    elif openapi_file:
        try: openapi_data = yaml.safe_load(openapi_file)
        except yaml.YAMLError:
            try: openapi_data = json.loads(openapi_file)
            except json.JSONDecodeError: raise HTTPException(400)
    if not openapi_data: raise HTTPException(400)

    endpoints = parse_openapi_endpoints(openapi_data)
    created_count = 0
    updated_count = 0
    for endpoint in endpoints:
        endpoint_data = endpoint.dict()
        endpoint_data["project_id"] = project_id
        endpoint_data["created_at"] = datetime.utcnow()
        endpoint_data["updated_at"] = datetime.utcnow()

        existing_endpoint = await get_endpoint_service(project_id, endpoint.path, endpoint.method)
        if existing_endpoint:
            endpoints_collection.document(existing_endpoint.id).update(endpoint_data)
            updated_count += 1
        else:
            endpoints_collection.document(str(uuid.uuid4())).set(endpoint_data)
            created_count += 1
    return {"endpoints_created": created_count, "endpoints_updated": updated_count, "schema_count": len(endpoints)}

async def run_project_tests_service(project_id: str, user_id: str, test_config: Dict[str, Any]) -> TestRun:
    if not await get_project_service(project_id, user_id): raise HTTPException(404)
    test_run_id = str(uuid.uuid4())
    start_time = datetime.utcnow()
    test_run_data = {"id": test_run_id, "project_id": project_id, "created_at": start_time, "duration": 0, "total_tests": 0, "passed_tests": 0, "failed_tests": 0, "pass_rate": 0, "results": []}
    tests_to_run = [doc.id for doc in test_results_collection.where("project_id", "==", project_id).stream()] if test_config.get("test_ids") == 'all' else test_config.get("test_ids", [])

    results = []
    passed_tests = 0
    for test_id in tests_to_run:
        result = await run_test_service(test_id)
        results.append(result.id)
        if result.status: passed_tests += 1

    end_time = datetime.utcnow()
    test_run_data["duration"] = (end_time - start_time).total_seconds()
    test_run_data["total_tests"] = len(tests_to_run)
    test_run_data["passed_tests"] = passed_tests
    test_run_data["failed_tests"] = test_run_data["total_tests"] - test_run_data["passed_tests"]
    test_run_data["pass_rate"] = (passed_tests / test_run_data["total_tests"] * 100) if test_run_data["total_tests"] > 0 else 0
    test_run_data["results"] = results
    test_runs_collection.document(test_run_id).set(test_run_data)
    projects_collection.document(project_id).update({"last_run_at": datetime.utcnow()})
    return TestRun(**test_run_data, results=[])

async def get_project_test_history_service(project_id: str, user_id: str, limit: int) -> List[TestRun]:
    if not await get_project_service(project_id, user_id): raise HTTPException(404)
    test_runs_ref = test_runs_collection.where("project_id", "==", project_id).order_by("created_at", direction="DESCENDING").limit(limit)
    history = []
    for doc in test_runs_ref.stream():
        run_data = doc.to_dict()
        history.append(TestRun(**run_data, id=doc.id, results=[]))
    return history

async def get_test_run_details_service(project_id: str, run_id: str, user_id: str) -> Optional[TestRun]:
    if not await get_project_service(project_id, user_id): raise HTTPException(404)
    doc = test_runs_collection.document(run_id).get()
    if not doc.exists or doc.to_dict().get("project_id") != project_id: return None
    run_data = doc.to_dict()
    results = []
    for result_id in run_data.get("results", []):
        result_doc = test_results_collection.document(result_id).get()
        if result_doc.exists: results.append(TestResult(**result_doc.to_dict(), id=result_doc.id))
    return TestRun(**run_data, id=doc.id, results=results)

async def get_project_performance_service(project_id: str, user_id: str, timeRange: str) -> Dict[str, Any]:
    if not await get_project_service(project_id, user_id): raise HTTPException(404)
    return {"average_response_time": 250, "throughput": 1000, "error_rate": 0.5, "timeRange": timeRange, "chart_data": []}

async def delete_project_endpoints_service(project_id: str):
    for doc in endpoints_collection.where("project_id", "==", project_id).stream():
        await doc.reference.delete()

async def delete_project_test_runs_service(project_id: str):
    for doc in test_runs_collection.where("project_id", "==", project_id).stream():
        for result_id in doc.to_dict().get("results", []):
            await test_results_collection.document(result_id).delete()
        await doc.reference.delete()

async def get_endpoint_service(project_id: str, path: str, method: str) -> Optional[EndpointResponse]:
    for doc in endpoints_collection.where("project_id", "==", project_id).where("path", "==", path).where("method", "==", method).stream():
        endpoint_data = doc.to_dict()
        test_count = sum(1 for _ in test_results_collection.where("endpoint_id", "==", doc.id).stream())
        return EndpointResponse(**endpoint_data, id=doc.id, test_count=test_count)
    return None

def parse_openapi_endpoints(openapi_data: Dict[str, Any]) -> List[ProjectEndpoint]:
    endpoints = []
    for path, path_items in openapi_data.get("paths", {}).items():
        for method, method_data in path_items.items():
            params = []
            for param in method_data.get("parameters", []):
                params.append(ProjectEndpointParameter(
                    name=param.get("name"), in_field=param.get("in"), description=param.get("description"),
                    required=param.get("required", False), type=param.get("schema", {}).get("type"), schema_format=param.get("schema", {}).get("format")
                ))
            req_body = method_data.get("requestBody", {}).get("content", {}).get("application/json", {}).get("schema")
            responses = {code: {"description": resp.get("description"), "content": resp.get("content", {}).get("application/json", {}).get("schema")}
                         for code, resp in method_data.get("responses", {}).items()}

            endpoints.append(ProjectEndpoint(
                id=str(uuid.uuid4()), project_id="", path=path, method=method.upper(), tag=method_data.get("tags", [None])[0],
                description=method_data.get("description"), parameters=params or None, requestBody=req_body, responses=responses or None
            ))
    return endpoints

async def run_test_service(test_id: str) -> TestResult:
    test_doc = test_results_collection.document(test_id).get()
    if not test_doc.exists: raise HTTPException(404)
    test_data = test_doc.to_dict()
    passed = True
    return TestResult(**test_data, id=test_id, status=passed)