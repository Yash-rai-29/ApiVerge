# run.sh
source ./build.sh  
gcloud run deploy ${SERVICE_NAME} --image ${IMAGE} --region asia-south1
