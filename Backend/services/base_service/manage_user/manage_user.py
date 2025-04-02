# manage_user/manage_user.py
from google.cloud import firestore
from fastapi import HTTPException
from uuid import uuid4
import time
from manage_user.manage_user_model import Subscription, UserCreate, UserUpdate, UserResponse
db = firestore.Client()

USERS_COLLECTION = "users"

def create_new_user(user_create: UserCreate):
    """Creates a new user in Firestore."""
    user_dict = user_create.dict()
    user_id = str(uuid4())
    user_dict["uuid"] = user_id
    user_dict["search_name"] = f"{user_dict['first_name'].lower()} {user_dict['last_name'].lower()}".strip()
    user_dict["created_at"] = int(time.time())
    user_dict["updated_at"] = int(time.time())
    user_dict["subscription"] = Subscription().dict()

    doc_ref = db.collection(USERS_COLLECTION).document(user_id)
    doc_ref.set(user_dict)

    user_snapshot = doc_ref.get()
    print(f"User created with ID: {user_id}")
    # Check if the user was created successfully
    if user_snapshot.exists:
        return UserResponse(**user_snapshot.to_dict())
    else:
        raise HTTPException(status_code=500, detail="Failed to create user in database.")


def get_existing_user(uid):
    """Retrieves user details from Firestore."""
    user_ref = db.collection(USERS_COLLECTION).document(uid)
    user_snapshot = user_ref.get()
    if user_snapshot.exists:
        return UserResponse(**user_snapshot.to_dict())
    raise HTTPException(status_code=404, detail="User not found")


def update_existing_user(user_update: UserUpdate, uid: str):
    """Updates an existing user's details in Firestore."""
    # Authorization should be implemented here to check if uid is allowed to update user_id

    user_ref = db.collection(USERS_COLLECTION).document(uid)
    update_data = user_update.dict(exclude_none=True)
    update_data["updated_at"] = int(time.time())

    # Handle nested subscription update
    if "subscription" in update_data:
        update_data["subscription"] = Subscription(**update_data["subscription"]).dict() # Validate and convert

    user_ref.update(update_data)

    user_snapshot = user_ref.get()
    if user_snapshot.exists:
        return UserResponse(**user_snapshot.to_dict())
    raise HTTPException(status_code=404, detail="User not found")


def delete_existing_user(uid: str):
    """Deletes a user from Firestore."""
    # Authorization should be implemented here to check if uid is allowed to delete user_id
    user_ref = db.collection(USERS_COLLECTION).document(uid)
    user_ref.delete()
    return {"message": "User deleted successfully"}


# Helper functions -  Implement these based on your data access pattern
def get_user_email(uid: str) -> str:
    """Helper function to get user email by ID - Implement based on your data access."""
    user = get_existing_user(uid)
    return user.email

def get_user_first_name(uid: str) -> str:
    """Helper to get user first name by ID - Implement based on your data access."""
    user = get_existing_user(uid)
    return user.first_name

def get_user_last_name(uid: str) -> str:
    """Helper to get user last name by ID - Implement based on your data access."""
    user = get_existing_user(uid)
    return user.last_name

def get_user_by_email(email: str):
    """Helper function to get user by email - Implement query against Firestore users collection."""
    users_ref = db.collection(USERS_COLLECTION)
    query = users_ref.where("email", "==", email).limit(1)
    results = query.stream()
    for user_doc in results:
        return UserResponse(**user_doc.to_dict())
    return None