from pydantic import BaseModel
from typing import Optional, List

class StrResponse(BaseModel):
    response: str