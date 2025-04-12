from google.cloud import firestore
from fastapi import HTTPException
from uuid import uuid4
import time
from firebase_admin import auth
from manage_user.manage_user_model import Subscription, UserCreate, UserUpdate, UserResponse

db = firestore.Client()
USERS_COLLECTION = "users"

async def create_new_user(user_create: UserCreate):
    user_dict = user_create.dict(exclude={'password'})
    user_id = str(uuid4())
    user_dict["uuid"] = user_id
    user_dict["search_name"] = f"{user_dict['first_name'].lower()} {user_dict['last_name'].lower()}".strip()
    user_dict["created_at"] = user_dict["updated_at"] = int(time.time())
    user_dict["subscription"] = Subscription().dict()

    try:
        # Create user in Firebase Authentication
        firebase_user = auth.create_user(
            email=user_dict['email'],
            password=user_create.password,
            display_name=f"{user_dict['first_name']} {user_dict['last_name']}"
        )
        user_dict["uid"] = firebase_user.uid

        # Create user in Firestore
        doc_ref = db.collection(USERS_COLLECTION).document(user_id)
        doc_ref.set(user_dict)
        
        print(f"User created with ID: {user_id}")
        return UserResponse(**user_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

async def get_existing_user(uid: str):
    user_ref = db.collection(USERS_COLLECTION).document(uid)
    user_snapshot = user_ref.get()
    if user_snapshot.exists:
        return UserResponse(**user_snapshot.to_dict())
    raise HTTPException(status_code=404, detail="User not found")

async def update_existing_user(user_update: UserUpdate, uid: str):
    user_ref = db.collection(USERS_COLLECTION).document(uid)
    update_data = user_update.dict(exclude_none=True)
    update_data["updated_at"] = int(time.time())

    if "subscription" in update_data:
        update_data["subscription"] = Subscription(**update_data["subscription"]).dict()

    user_ref.update(update_data)
    updated_user = await get_existing_user(uid)
    return updated_user

async def delete_existing_user(uid: str):
    user_ref = db.collection(USERS_COLLECTION).document(uid)
    user_data = user_ref.get().to_dict()
    
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        # Delete from Firebase Authentication
        auth.delete_user(user_data.get('firebase_uid'))
        
        # Delete from Firestore
        user_ref.delete()
        return {"message": "User deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")

async def check_user_exists(email: str) -> dict:
    try:
        email = email.lower().strip()
        try:
            user = auth.get_user_by_email(email)
            return {"exists": True, "user_id": user.uid}
        except auth.UserNotFoundError:
            return {"exists": False, "user_id": None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking user existence: {str(e)}")

# Helper functions
async def get_user_by_email(email: str):
    users_ref = db.collection(USERS_COLLECTION)
    query = users_ref.where("email", "==", email).limit(1)
    results = query.stream()
    for user_doc in results:
        return UserResponse(**user_doc.to_dict())
    return None