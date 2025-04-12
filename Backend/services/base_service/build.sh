# build.sh
V=1
PROJECT_ID=apiverge-web-app
SERVICE_NAME=base-service
REPOSITORY_NAME=${PROJECT_ID}-images

IMAGE=asia-south1-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${SERVICE_NAME}:$V
docker buildx build --platform linux/amd64 --build-arg PROJECT_ID=${PROJECT_ID} -t ${IMAGE} .
docker push ${IMAGE}
