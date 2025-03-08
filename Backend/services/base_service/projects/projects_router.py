from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form, status
from typing import Optional

from projects.projects_model import (
    ProjectCreateRequest,
    ProjectResponse,
    ProjectListResponse,
    ProjectUpdateRequest,
    ProjectType
)
from projects.projects import (
    create_project,
    get_all_projects,
    get_project,
    update_project,
    delete_project
)
from get_user import get_current_user  # Ensure this is correctly implemented
from common_code.common_exceptions import incorrect_auth_cred_exception  # Ensure this is correctly implemented

router = APIRouter()

@router.post(
    "/projects",
    response_model=ProjectResponse,
    response_model_exclude_none=True,
    summary="Create a new project"
)
async def create_project_api(
    name: str = Form(..., description="Name of the project"),
    type: ProjectType = Form(..., description="Type of the project ('url' or 'file')"),
    account_type: str = Form(..., description="Account type ('individual' or 'organization')"),
    description: Optional[str] = Form(None, description="Description of the project"),
    openapi_url: Optional[str] = Form(None, description="URL to OpenAPI specification file, required if type is 'url'"),
    openapi_file: Optional[UploadFile] = File(None, description="File upload for OpenAPI specification, required if type is 'file'"),
    uid: str = Depends(get_current_user)
):
    if not uid:
        raise incorrect_auth_cred_exception

    project_create_request = {
        "name": name,
        "type": type,
        "account_type": account_type,
        "description": description,
        "openapi_url": openapi_url,
        "openapi_file": openapi_file.filename if openapi_file else None,
    }

    file_content = None
    filename = None
    if type == ProjectType.FILE:
        if not openapi_file:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OpenAPI file is required when type is 'file'."
            )
        file_content = await openapi_file.read()
        filename = openapi_file.filename

    project_data = create_project(
        uid=uid,
        project_create_request=project_create_request,
        file_content=file_content,
        filename=filename
    )

    return ProjectResponse(**project_data)

@router.get(
    "/projects",
    response_model=ProjectListResponse,
    response_model_exclude_none=True,
    summary="Get all projects for the user"
)
def get_all_projects_api(uid: str = Depends(get_current_user)):
    if not uid:
        raise incorrect_auth_cred_exception
    project_list = get_all_projects(uid)
    return ProjectListResponse(projects=[ProjectResponse(**project) for project in project_list])

@router.get(
    "/projects/{project_uuid}",
    response_model=ProjectResponse,
    response_model_exclude_none=True,
    summary="Get a specific project"
)
def get_project_api(
    project_uuid: str,
    uid: str = Depends(get_current_user)
):
    if not uid:
        raise incorrect_auth_cred_exception
    project_data = get_project(uid, project_uuid)
    return ProjectResponse(**project_data)

@router.put(
    "/projects/{project_uuid}",
    response_model=ProjectResponse,
    response_model_exclude_none=True,
    summary="Update an existing project"
)
async def update_project_api(
    project_uuid: str,
    name: Optional[str] = Form(None, description="Name of the project"),
    type: Optional[ProjectType] = Form(None, description="Type of the project ('url' or 'file')"),
    account_type: Optional[str] = Form(None, description="Account type ('individual' or 'organization')"),
    description: Optional[str] = Form(None, description="Description of the project"),
    openapi_url: Optional[str] = Form(None, description="URL to OpenAPI specification file"),
    openapi_file: Optional[UploadFile] = File(None, description="Filename of uploaded OpenAPI specification file"),
    uid: str = Depends(get_current_user)
):
    if not uid:
        raise incorrect_auth_cred_exception

    updates = {}
    if name is not None:
        updates["name"] = name
    if type is not None:
        updates["type"] = type
    if account_type is not None:
        updates["account_type"] = account_type
    if description is not None:
        updates["description"] = description
    if openapi_url is not None:
        updates["openapi_url"] = openapi_url
    if openapi_file is not None:
        updates["openapi_file"] = openapi_file.filename

    file_content = None
    filename = None
    if type == ProjectType.FILE and openapi_file:
        file_content = await openapi_file.read()
        filename = openapi_file.filename

    updated_project = update_project(
        uid=uid,
        project_uuid=project_uuid,
        updates=updates,
        file_content=file_content,
        filename=filename
    )

    return ProjectResponse(**updated_project)

@router.delete(
    "/projects/{project_uuid}",
    response_model=dict,
    summary="Delete a project"
)
def delete_project_api(
    project_uuid: str,
    uid: str = Depends(get_current_user)
):
    if not uid:
        raise incorrect_auth_cred_exception
    result = delete_project(uid, project_uuid)
    return result
