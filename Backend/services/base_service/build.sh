# backend-fastapi/build.sh
V=1
PROJECT_ID=test-yash-445816
SERVICE_NAME=apiverge-base
REPOSITORY_NAME=${PROJECT_ID}-images

IMAGE=us-central1-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${SERVICE_NAME}:$V
docker buildx build --platform linux/amd64 --build-arg PROJECT_ID=${PROJECT_ID} -t ${IMAGE} .
docker push ${IMAGE}
