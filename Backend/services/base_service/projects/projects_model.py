from pydantic import BaseModel, Field, validator
from typing import Optional, List
from enum import Enum

class ProjectType(str, Enum):
    URL = "url"
    FILE = "file"

class AccountType(str, Enum):
    INDIVIDUAL = "individual"
    ORGANIZATION = "organization"

class ProjectCreateRequest(BaseModel):
    name: str = Field(..., description="Name of the project")
    type: ProjectType = Field(..., description="Type of the project ('url' or 'file')")
    account_type: AccountType = Field(..., description="Account type ('individual' or 'organization')")
    description: Optional[str] = Field(None, description="Description of the project")
    openapi_url: Optional[str] = Field(None, description="URL to OpenAPI specification file, required if type is 'url'")
    openapi_file: Optional[str] = Field(None, description="Filename of uploaded OpenAPI specification file, required if type is 'file'")

    @validator('openapi_url', always=True)
    def check_openapi_url(cls, v, values):
        if values.get('type') == ProjectType.URL and not v:
            raise ValueError("openapi_url is required when type is 'url'")
        return v

    @validator('openapi_file', always=True)
    def check_openapi_file(cls, v, values):
        if values.get('type') == ProjectType.FILE and not v:
            raise ValueError("openapi_file is required when type is 'file'")
        return v

class ProjectUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, description="Name of the project")
    type: Optional[ProjectType] = Field(None, description="Type of the project ('url' or 'file')")
    account_type: Optional[AccountType] = Field(None, description="Account type ('individual' or 'organization')")
    description: Optional[str] = Field(None, description="Description of the project")
    openapi_url: Optional[str] = Field(None, description="URL to OpenAPI specification file")
    openapi_file: Optional[str] = Field(None, description="Filename of uploaded OpenAPI specification file")

    @validator('openapi_url')
    def validate_openapi_url(cls, v, values):
        if 'type' in values and values['type'] == ProjectType.URL and not v:
            raise ValueError("openapi_url is required when type is 'url'")
        return v

    @validator('openapi_file')
    def validate_openapi_file(cls, v, values):
        if 'type' in values and values['type'] == ProjectType.FILE and not v:
            raise ValueError("openapi_file is required when type is 'file'")
        return v

class ProjectResponse(BaseModel):
    project_uuid: str = Field(..., description="Unique ID of the project")
    name: str = Field(..., description="Name of the project")
    account_type: AccountType = Field(..., description="Account type ('individual' or 'organization')")
    type: ProjectType = Field(..., description="Type of the project ('url' or 'file')")
    description: Optional[str] = Field(None, description="Description of the project")
    openapi_url: Optional[str] = Field(None, description="URL to OpenAPI specification file")
    openapi_file: Optional[str] = Field(None, description="GCS path of uploaded OpenAPI specification file")
    project_admin: str = Field(..., description="UID of the project administrator")
    access_users: List[str] = Field(..., description="List of user UIDs with access to the project")
    created_at: int = Field(..., description="Timestamp of project creation")
    updated_at: int = Field(..., description="Timestamp of project last update")

    class Config:
        orm_mode = True

class ProjectListResponse(BaseModel):
    projects: List[ProjectResponse] = Field(..., description="List of projects")
