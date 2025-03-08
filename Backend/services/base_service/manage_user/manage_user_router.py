# /manage_user/manage_user_router.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import EmailStr
from get_user import get_current_user 
from common_code.common_exceptions import incorrect_auth_cred_exception
from manage_user.manage_user import create_new_user, get_existing_user, update_existing_user, delete_existing_user   
from manage_user.manage_user_model import UserCreate, UserUpdate, UserResponse

router = APIRouter()

@router.post("/users", response_model=UserResponse, response_model_exclude_none=True, summary="Create a new user")
def create_user_route(user: UserCreate, uid: str = Depends(get_current_user)):
    return create_new_user(user, uid)

@router.get("/users/me", response_model=UserResponse, response_model_exclude_none=True, summary="Get details of the current user")
def get_me_route(uid: str = Depends(get_current_user)):
    if not uid:
        raise incorrect_auth_cred_exception()
    return get_existing_user(uid)


@router.get("/users/{user_id}", response_model=UserResponse, response_model_exclude_none=True, summary="Get user details by ID")
def get_user_by_id_route(user_id: str, uid: str = Depends(get_current_user)): # Added user_id as path parameter
    if not uid:
        raise incorrect_auth_cred_exception()
    return get_existing_user(user_id)


@router.put("/users/", response_model=UserResponse, response_model_exclude_none=True, summary="Update user details")
def update_user_route( user: UserUpdate, uid: str = Depends(get_current_user)):
    if not uid:
        raise incorrect_auth_cred_exception()
    return update_existing_user(user, uid)


@router.delete("/users/", summary="Delete a user")
def delete_user_route(user_id: str, uid: str = Depends(get_current_user)):
    if not uid:
        raise incorrect_auth_cred_exception()
    return delete_existing_user(uid)
