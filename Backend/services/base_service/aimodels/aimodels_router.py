# /aimodels/aimodels_router.py
from fastapi import APIRouter, Depends
from get_user import get_current_user
from aimodels.aimodels_model import AIModel, AIModelsResponse
from aimodels.aimodels import get_all_ai_models 
from common_code.common_exceptions import incorrect_auth_cred_exception

router = APIRouter()

@router.get("/aimodels", response_model=AIModelsResponse, response_model_exclude_none=True, summary="Get all available AI models")
def get_all_ai_models_route(uid: str = Depends(get_current_user)):
    return get_all_ai_models()
