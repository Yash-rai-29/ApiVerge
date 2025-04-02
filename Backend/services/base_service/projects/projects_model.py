from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class ProjectBase(BaseModel):
    name: str = Field(..., description="Name")
    description: Optional[str] = Field(None, description="Description")
    type: str = Field(..., description="Type")
    account_type: str = Field(..., description="Account Type")

class ProjectCreate(ProjectBase):
    openapi_url: Optional[HttpUrl] = Field(None, description="OpenAPI URL")

class ProjectUpdate(ProjectBase):
    openapi_url: Optional[HttpUrl] = Field(None, description="OpenAPI URL")

class ProjectResponse(ProjectBase):
    id: str = Field(..., description="Project ID")
    created_at: datetime = Field(..., description="Created At")
    updated_at: Optional[datetime] = Field(None, description="Updated At")
    status: str = Field("active", description="Status")
    openapi_url: Optional[HttpUrl] = Field(None, description="OpenAPI URL")
    endpoints_count: int = Field(0, description="Endpoints Count")
    tests_count: int = Field(0, description="Tests Count")

    class Config:
        orm_mode = True

class ProjectEndpointParameter(BaseModel):
    name: str = Field(..., description="Parameter Name")
    in_field: str = Field(..., alias="in", description="Parameter In")
    description: Optional[str] = Field(None, description="Description")
    required: bool = Field(False, description="Required")
    type: str = Field(..., description="Type")
    schema_format: Optional[str] = Field(None, description="Schema Format")

    class Config:
        allow_population_by_field_name = True

class ProjectEndpoint(BaseModel):
    id: str = Field(..., description="Endpoint ID")
    project_id: str = Field(..., description="Project ID")
    path: str = Field(..., description="Path")
    method: str = Field(..., description="Method")
    tag: Optional[str] = Field(None, description="Tag")
    description: Optional[str] = Field(None, description="Description")
    parameters: Optional[List[ProjectEndpointParameter]] = Field(None, description="Parameters")
    requestBody: Optional[Dict[str, Any]] = Field(None, description="Request Body")
    responses: Optional[Dict[str, Any]] = Field(None, description="Responses")
    test_count: int = Field(0, description="Test Count")
    status: str = Field("active", description="Status")

    class Config:
        orm_mode = True

class EndpointResponse(ProjectEndpoint):
    pass

class TestResult(BaseModel):
    id: str = Field(..., description="Test Result ID")
    endpoint_id: str = Field(..., description="Endpoint ID")
    method: str = Field(..., description="Method")
    path: str = Field(..., description="Path")
    status: str = Field(..., description="Status")
    response_time: float = Field(..., description="Response Time")
    status_code: int = Field(..., description="Status Code")
    assertions: List[Dict[str, Any]] = Field(..., description="Assertions")
    error: Optional[str] = Field(None, description="Error")

    class Config:
        orm_mode = True

class TestRun(BaseModel):
    id: str = Field(..., description="Test Run ID")
    project_id: str = Field(..., description="Project ID")
    created_at: datetime = Field(..., description="Created At")
    duration: float = Field(..., description="Duration")
    total_tests: int = Field(..., description="Total Tests")
    passed_tests: int = Field(..., description="Passed Tests")
    failed_tests: int = Field(..., description="Failed Tests")
    pass_rate: float = Field(..., description="Pass Rate")
    results: Optional[List[TestResult]] = Field(None, description="Results")

    class Config:
        orm_mode = True