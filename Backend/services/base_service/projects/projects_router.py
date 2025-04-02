from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Path, Query
from typing import List, Optional, Dict, Any
from pydantic import HttpUrl
from projects.projects_model import ProjectResponse, EndpointResponse, TestRun
from projects.projects import (
    get_all_projects_service,
    get_project_service,
    create_project_service,
    update_project_service,
    delete_project_service,
    get_project_endpoints_service,
    import_openapi_schema_service,
    run_project_tests_service,
    get_project_test_history_service,
    get_test_run_details_service,
    get_project_performance_service
)
from get_user import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ProjectResponse])
async def get_all_projects(current_user: str = Depends(get_current_user)):
    return await get_all_projects_service(current_user)

@router.get("/{project_uuid}", response_model=ProjectResponse)
async def get_project(project_uuid: str = Path(...), current_user: str = Depends(get_current_user)):
    project = await get_project_service(project_uuid, current_user)
    if not project:
        raise HTTPException(404)
    return project

@router.post("/", response_model=ProjectResponse)
async def create_project(
    name: str = Form(...),
    type: str = Form(...),
    account_type: str = Form(...),
    description: Optional[str] = Form(None),
    openapi_url: Optional[HttpUrl] = Form(None),
    openapi_file: Optional[UploadFile] = File(None),
    current_user: str = Depends(get_current_user)
):
    if type == "url" and not openapi_url:
        raise HTTPException(400)
    if type == "file" and not openapi_file:
        raise HTTPException(400)
    return await create_project_service(current_user, name, description, type, account_type, openapi_url, openapi_file)

@router.put("/{project_uuid}", response_model=ProjectResponse)
async def update_project(
    project_uuid: str = Path(...),
    name: Optional[str] = Form(None),
    type: Optional[str] = Form(None),
    account_type: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    openapi_url: Optional[HttpUrl] = Form(None),
    openapi_file: Optional[UploadFile] = File(None),
    current_user: str = Depends(get_current_user)
):
    project = await get_project_service(project_uuid, current_user)
    if not project:
        raise HTTPException(404)
    return await update_project_service(project_uuid, current_user, name, description, type, account_type, openapi_url, openapi_file)

@router.delete("/{project_uuid}", response_model=Dict[str, str])
async def delete_project(project_uuid: str = Path(...), current_user: str = Depends(get_current_user)):
    project = await get_project_service(project_uuid, current_user)
    if not project:
        raise HTTPException(404)
    await delete_project_service(project_uuid, current_user)
    return {"message": "Project deleted"}

@router.get("/{project_uuid}/endpoints", response_model=List[EndpointResponse])
async def get_project_endpoints(project_uuid: str = Path(...), current_user: str = Depends(get_current_user)):
    project = await get_project_service(project_uuid, current_user)
    if not project:
        raise HTTPException(404)
    return await get_project_endpoints_service(project_uuid, current_user)

@router.post("/{project_uuid}/import-schema", response_model=Dict[str, Any])
async def import_openapi_schema(
    project_uuid: str = Path(...),
    openapi_url: Optional[HttpUrl] = Form(None),
    openapi_file: Optional[UploadFile] = File(None),
    current_user: str = Depends(get_current_user)
):
    project = await get_project_service(project_uuid, current_user)
    if not project:
        raise HTTPException(404)
    if not openapi_url and not openapi_file:
        raise HTTPException(400)
    return await import_openapi_schema_service(project_uuid, current_user, openapi_url, openapi_file)

@router.post("/{project_uuid}/run-tests", response_model=TestRun)
async def run_project_tests(
    project_uuid: str = Path(...),
    test_config: Dict[str, Any] = None,
    current_user: str = Depends(get_current_user)
):
    project = await get_project_service(project_uuid, current_user)
    if not project:
        raise HTTPException(404)
    return await run_project_tests_service(project_uuid, current_user, test_config or {})

@router.get("/{project_uuid}/test-history", response_model=List[TestRun])
async def get_project_test_history(
    project_uuid: str = Path(...),
    limit: int = Query(10),
    current_user: str = Depends(get_current_user)
):
    project = await get_project_service(project_uuid, current_user)
    if not project:
        raise HTTPException(404)
    return await get_project_test_history_service(project_uuid, current_user, limit)

@router.get("/{project_uuid}/test-runs/{run_id}", response_model=TestRun)
async def get_test_run_details(
    project_uuid: str = Path(...),
    run_id: str = Path(...),
    current_user: str = Depends(get_current_user)
):
    project = await get_project_service(project_uuid, current_user)
    if not project:
        raise HTTPException(404)
    test_run = await get_test_run_details_service(project_uuid, run_id, current_user)
    if not test_run:
        raise HTTPException(404)
    return test_run

@router.get("/{project_uuid}/performance", response_model=Dict[str, Any])
async def get_project_performance(
    project_uuid: str = Path(...),
    timeRange: str = Query("7d"),
    current_user: str = Depends(get_current_user)
):
    project = await get_project_service(project_uuid, current_user)
    if not project:
        raise HTTPException(404)
    return await get_project_performance_service(project_uuid, current_user, timeRange)