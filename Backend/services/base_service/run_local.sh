# run_local.sh
V=1
SERVICE_NAME=base-service
PROJECT_ID=apiverge-web-app
REPOSITORY_NAME=${PROJECT_ID}-images

IMAGE=asia-south1-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${SERVICE_NAME}:$V

docker buildx build --platform linux/amd64 -t ${IMAGE} .
docker run -p 5004:5004 --env PORT=5004 --env GOOGLE_CLOUD_PROJECT=${PROJECT_ID} --env GCP_PROJECT=${PROJECT_ID} -v "$HOME/.config/gcloud/application_default_credentials.json":/gcp/creds.json:ro \
  --env GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json ${IMAGE}

  
# DETACH_FLAG=""
# if [ "$1" = "-d" ]; then
#     DETACH_FLAG="-d"
# fi

# docker run $DETACH_FLAG -p 5004:5004 \
#   --env PORT=5004 \
#   --env GOOGLE_CLOUD_PROJECT=${PROJECT_ID} \
#   --env GCP_PROJECT=${PROJECT_ID} \
#   --env ENV_TYPE=development \
#   -v "$HOME/.config/gcloud/application_default_credentials.json":/gcp/creds.json:ro \
#   --env GOOGLE_APPLICATION_CREDENTIALS=/gcp/creds.json \
#   us-central1-docker.pkg.dev/${PROJECT_ID}/gentoo-earth-images/${SERVICE_NAME}:$V
