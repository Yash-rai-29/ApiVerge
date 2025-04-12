from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import EmailStr
from get_user import get_current_user
from common_code.common_exceptions import incorrect_auth_cred_exception
from manage_user.manage_user import create_new_user, get_existing_user, update_existing_user, delete_existing_user, check_user_exists
from manage_user.manage_user_model import UserCreate, UserUpdate, UserResponse, UserExistsResponse, CheckUserExistsRequest

router = APIRouter()

@router.post("/users", response_model=UserResponse, response_model_exclude_none=True, summary="Create a new user")
async def create_user_route(user: UserCreate):
    return await create_new_user(user)

@router.get("/users/me", response_model=UserResponse, response_model_exclude_none=True, summary="Get details of the current user")
async def get_me_route(uid: str = Depends(get_current_user)):
    if not uid:
        raise incorrect_auth_cred_exception
    return await get_existing_user(uid)

@router.get("/users/{user_id}", response_model=UserResponse, response_model_exclude_none=True, summary="Get user details by ID")
async def get_user_by_id_route(user_id: str, uid: str = Depends(get_current_user)):
    if not uid:
        raise incorrect_auth_cred_exception
    return await get_existing_user(user_id)

@router.put("/users/", response_model=UserResponse, response_model_exclude_none=True, summary="Update user details")
async def update_user_route(user: UserUpdate, uid: str = Depends(get_current_user)):
    if not uid:
        raise incorrect_auth_cred_exception
    return await update_existing_user(user, uid)

@router.delete("/users/", summary="Delete a user")
async def delete_user_route(uid: str = Depends(get_current_user)):
    if not uid:
        raise incorrect_auth_cred_exception
    return await delete_existing_user(uid)

@router.post("/users/check-exists", response_model=UserExistsResponse, summary="Check if a user exists")
async def check_if_user_exists(request: CheckUserExistsRequest = Body(...)):
    return await check_user_exists(request.email)