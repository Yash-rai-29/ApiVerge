from google.cloud import firestore, storage
from fastapi import HTTPException, status
from typing import Optional, List, Dict
from uuid import uuid4
import time
import uuid

db = firestore.Client()
storage_client = storage.Client()
GCS_BUCKET_NAME = "apiverge"
GCS_BUCKET = storage_client.bucket(GCS_BUCKET_NAME)

PROJECTS_COLLECTION = "projects"

def get_project_ref(uid: str, project_uuid: str) -> firestore.DocumentReference:
    """Returns a reference to the specific project document."""
    return db.collection(PROJECTS_COLLECTION).document(project_uuid)

def create_project(uid: str, project_create_request: Dict, file_content: bytes = None, filename: str = None) -> Dict:
    """Creates a new project in Firestore, handling URL or file upload."""
    project_uuid = str(uuid.uuid4())
    now_timestamp = int(time.time())

    project_data = {
        "project_uuid": project_uuid,
        "name": project_create_request["name"],
        "account_type": project_create_request["account_type"],
        "type": project_create_request["type"],
        "description": project_create_request.get("description"),
        "project_admin": uid,
        "access_users": [uid],
        "created_at": now_timestamp,
        "updated_at": now_timestamp,
    }

    if project_create_request["type"] == "url":
        project_data["openapi_url"] = project_create_request["openapi_url"]
        project_data["openapi_file"] = None
    elif project_create_request["type"] == "file":
        if not file_content or not filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File content and filename must be provided for type 'file'."
            )
        gcs_file_path = f"openapi_specs/{uid}/{project_uuid}/{filename}"
        blob = GCS_BUCKET.blob(gcs_file_path)
        blob.upload_from_string(file_content, content_type="application/json")
        project_data["openapi_file"] = gcs_file_path
        project_data["openapi_url"] = None

    project_ref = get_project_ref(uid, project_uuid)
    project_ref.set(project_data)

    return project_data

def get_project(uid: str, project_uuid: str) -> Dict:
    """Retrieves a specific project from Firestore."""
    project_ref = get_project_ref(uid, project_uuid)
    project_doc = project_ref.get()
    if not project_doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with UUID '{project_uuid}' not found."
        )
    project_data = project_doc.to_dict()
    # Ensure the user has access
    if uid not in project_data.get("access_users", []):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this project."
        )
    return project_data

def get_all_projects(uid: str) -> List[Dict]:
    """Retrieves all projects accessible by the user from Firestore."""
    projects_ref = db.collection(PROJECTS_COLLECTION)
    query = projects_ref.where("access_users", "array_contains", uid)
    projects = [doc.to_dict() for doc in query.stream()]
    return projects

def update_project(uid: str, project_uuid: str, updates: Dict, file_content: bytes = None, filename: str = None) -> Dict:
    """Updates an existing project in Firestore, handling changes in type."""
    project_ref = get_project_ref(uid, project_uuid)
    project_doc = project_ref.get()
    if not project_doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with UUID '{project_uuid}' not found."
        )
    
    project_data = project_doc.to_dict()

    # Ensure the user has admin rights to update
    if uid != project_data.get("project_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this project."
        )

    # Handle type change
    if "type" in updates and updates["type"] != project_data["type"]:
        if updates["type"] == "url":
            # Remove existing file from GCS if it exists
            if project_data.get("openapi_file"):
                blob = GCS_BUCKET.blob(project_data["openapi_file"])
                blob.delete()
            updates["openapi_url"] = updates.get("openapi_url")
            updates["openapi_file"] = None
        elif updates["type"] == "file":
            # Remove existing URL if exists
            updates["openapi_url"] = None
            if file_content and filename:
                gcs_file_path = f"openapi_specs/{uid}/{project_uuid}/{filename}"
                blob = GCS_BUCKET.blob(gcs_file_path)
                blob.upload_from_string(file_content, content_type="application/json")
                updates["openapi_file"] = gcs_file_path
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="File content and filename must be provided when changing type to 'file'."
                )

    # Handle updates based on type
    if updates.get("type") == "url":
        if "openapi_url" in updates and not updates["openapi_url"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="openapi_url cannot be empty when type is 'url'."
            )
        updates["openapi_file"] = None  # Ensure file path is None
    elif updates.get("type") == "file":
        if "openapi_file" in updates and not (file_content and filename):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="openapi_file requires file content and filename."
            )
        if file_content and filename:
            gcs_file_path = f"openapi_specs/{uid}/{project_uuid}/{filename}"
            blob = GCS_BUCKET.blob(gcs_file_path)
            blob.upload_from_string(file_content, content_type="application/json")
            updates["openapi_file"] = gcs_file_path
            updates["openapi_url"] = None

    # Update the updated_at timestamp
    updates["updated_at"] = int(time.time())

    # Perform the update
    project_ref.update(updates)

    # Retrieve and return the updated project
    updated_project = project_ref.get().to_dict()
    return updated_project

def delete_project(uid: str, project_uuid: str) -> Dict:
    """Deletes a project from Firestore and removes associated files from GCS."""
    project_ref = get_project_ref(uid, project_uuid)
    project_doc = project_ref.get()
    if not project_doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with UUID '{project_uuid}' not found."
        )
    
    project_data = project_doc.to_dict()

    # Ensure the user has admin rights to delete
    if uid != project_data.get("project_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this project."
        )

    # Delete associated file from GCS if present
    if project_data.get("openapi_file"):
        blob = GCS_BUCKET.blob(project_data["openapi_file"])
        blob.delete()

    # Delete the project document
    project_ref.delete()

    return {"message": f"Project with UUID '{project_uuid}' deleted successfully."}
