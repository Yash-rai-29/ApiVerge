from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Union
from datetime import datetime
from enum import Enum
import time
from uuid import uuid4

class AccountType(str, Enum):
    INDIVIDUAL = "individual"
    ORGANIZATION = "organization"

class SubscriptionPlan(str, Enum):
    FREE = "free"
    BASIC = "basic"
    PRO = "pro"
    ENTERPRISE = "enterprise"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    EXPIRED = "expired"
    TRIAL = "trial"

class Subscription(BaseModel):
    plan: SubscriptionPlan = SubscriptionPlan.FREE
    status: SubscriptionStatus = SubscriptionStatus.TRIAL
    trial_started_at: Optional[int] = Field(None, description="Unix timestamp of trial start")
    trial_ends_at: Optional[int] = Field(None, description="Unix timestamp of trial end")
    subscription_started_at: Optional[int] = Field(None, description="Unix timestamp of subscription start")
    subscription_ends_at: Optional[int] = Field(None, description="Unix timestamp of subscription end")
    auto_renew: bool = Field(False, description="Auto-renewal status for subscription")

class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    first_name: str = Field(..., description="User's first name")
    last_name: str = Field(..., description="User's last name")

class UserCreate(UserBase):
    account_type: AccountType = AccountType.INDIVIDUAL
    organization_name: Optional[str] = Field(None, description="Organization name if account_type is ORGANIZATION")


class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, description="User's first name")
    last_name: Optional[str] = Field(None, description="User's last name")
    photo_url: Optional[str] = Field(None, description="User's photo URL")
    email: Optional[EmailStr] = Field(None, description="User's email address")
    subscription: Optional[Subscription] = Field(None, description="Subscription details to update")

class UserResponse(UserBase):
    uuid: str = Field(..., description="Unique user ID (UUID)")
    photo_url: Optional[str] = Field(None, description="User's photo URL")
    account_type: AccountType = AccountType.INDIVIDUAL
    organization_name: Optional[str] = Field(None, description="Organization name if account_type is ORGANIZATION")
    search_name: str = Field(..., description="Searchable full name (lowercase)")
    created_at: int = Field(default_factory=lambda: int(time.time()), description="Unix timestamp of user creation")
    updated_at: Optional[int] = Field(None, description="Unix timestamp of last user update")
    subscription: Subscription = Field(default_factory=Subscription, description="User's subscription details")
