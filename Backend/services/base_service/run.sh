source ./build.sh  
gcloud run deploy ${SERVICE_NAME} --image ${IMAGE} --region=us-central1
