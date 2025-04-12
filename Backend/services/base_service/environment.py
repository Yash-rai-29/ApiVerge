# environment.py
import os
from enum import Enum


class Environment(str, Enum):
    """Whether the service is running locally, in stage, or in prod"""
    development = "development"
    staging = "staging"
    production = "production"


def get_environment() -> Environment:
    """Returns the environment, from the ENVIRONMENT environment variable"""

    try:
        return Environment(os.environ.get("ENV_TYPE", "development"))
    except ValueError:
        raise ValueError(
            f"Valid values of ENV_TYPE are {', '.join(e.value for e in Environment)}"
        )
