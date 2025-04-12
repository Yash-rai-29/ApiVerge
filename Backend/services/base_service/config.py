# confing.py
"""
Configuration settings for the Base API
"""
from logging import Logger
import os
import json 
from google.cloud import storage
from pydantic import Field, BaseSettings
from fastapi import Depends

from logconfig import get_logger
from environment import Environment, get_environment
logger = get_logger()

class BaseConfig(BaseSettings):
    """
    Configuration for the Base service
    """

    environment: Environment = Field(..., env="ENVIRONMENT")


def get_config(env: Environment = Depends(get_environment)) -> BaseConfig:
    return BaseConfig(
        environment=env,
    )


def get_local_config() -> BaseConfig:
    """
    Configurations suitable for local development
    """
    return BaseConfig(
        environment=environment.development,
    )

def get_config_sm(secret_name) -> str :
    from google.cloud import secretmanager
    client = secretmanager.SecretManagerServiceClient()
    project_id = get_project_id()
    secret_name = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
    return client.access_secret_version(request={"name": secret_name})

def get_storage_bucket(bucket_name) -> str :
    storage_client = storage.Client()
    try:
        bucket = storage_client.get_bucket(bucket_name)
        return bucket
    except:
        logger.warn("Storage bucket not found. Please create it first.")


def get_project_id():
    # Python 3.7 only
    project_id = os.getenv("GCP_PROJECT", "your-gcp-project-id")  

    if not project_id:  
        # Check Google Metadata service
        try:
            import urllib.request

            url = "http://metadata.google.internal/computeMetadata/v1/project/project-id"
            req = urllib.request.Request(url)
            req.add_header("Metadata-Flavor", "Google")
            project_id = urllib.request.urlopen(req).read().decode()
        except: 
            logger.warn("Could not resolve project id from Metadata service.. Trying to resolve from local")

    #Running locally
    if not project_id:
        try:
            with open(os.environ["GOOGLE_APPLICATION_CREDENTIALS"], "r") as fp:
                credentials = json.load(fp)
            project_id = credentials["project_id"]
        except: 
            try: 
                with open(os.path.expanduser('~/.config/gcloud/application_default_credentials.json'), 'r') as fp:
                    credentials = json.load(fp)
                project_id = credentials.get("project_id")
            except: 
                logger.debug("Could not identify project id using service credentials")

    if not project_id:
        raise ValueError("Could not get a value for GCP_PROJECT")

    return project_id
