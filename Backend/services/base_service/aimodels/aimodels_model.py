from pydantic import BaseModel
from typing import Optional, Dict, Any, List
class AIModel(BaseModel):
    id: str
    name: str
    type: str
    model_id: str
    is_free: bool
    description: str
    created_at: Optional[int]
    updated_at: Optional[int]
    metadata: Optional[Dict[str, Any]] = {}
    
class AIModelsResponse(BaseModel):
    ai_models: List[AIModel]