#!/bin/bash

# Set environment variables
export PORT=5004
export GOOGLE_CLOUD_PROJECT=apiverge-web-app
export GCP_PROJECT=apiverge-web-app
export ENV_TYPE=development
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/gcloud/application_default_credentials.json"

# Prevent creation of __pycache__ folders
export PYTHONDONTWRITEBYTECODE=1

# Delete existing __pycache__ folders
find . -type d -name "__pycache__" -exec rm -r {} +

# Run the FastAPI application with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 5004