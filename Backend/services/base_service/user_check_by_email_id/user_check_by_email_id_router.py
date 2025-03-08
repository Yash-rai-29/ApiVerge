from fastapi import APIRouter
from user_check_by_email_id.user_check_by_email_id import check_user_or_not
from pydantic import BaseModel

class CheckUserExistsOrNot(BaseModel):
    is_exists:bool

router=APIRouter()

@router.get(
    "/",
    summary="Check user Exists or Not",
    response_model= CheckUserExistsOrNot
)
def get_user_by_email_id(
    email_id:str
    
)-> CheckUserExistsOrNot:
    """
    Check user Exists or Not
    """
    email_id = email_id.lower().strip()
    return check_user_or_not(email_id)
