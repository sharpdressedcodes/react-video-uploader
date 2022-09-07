#!/usr/bin/env bash

#
# Run remote commands through a Docker image
#
# Usage
# Either run in your IDE or run in the command line:
# ./bin/docker-run-command.sh npm run build
#

# Get the script's directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT_DIR="$( dirname "${DIR}" )"
CONTAINER_DIR=/home/node/app

# Get the project directory name
PROJECT_NAME="$( basename "${ROOT_DIR}" )"
DOCKER_IMAGE="${PROJECT_NAME}_node:latest"
NODE_DIR="$ROOT_DIR"
result=$( docker image inspect "${DOCKER_IMAGE}" )

if [[ "$result" == "[]" ]]; then
    echo "Error: Unable to locate image $DOCKER_IMAGE. Have you built the image using 'docker build' or 'docker-compose up -d --build'?"
    exit 1
elif [[ ! -n "$*" ]]; then
    echo "Error: No commands to run"
    exit 1
fi

echo "Running command through image $DOCKER_IMAGE..."

# Name this as command-runner. This way, if we try to run two commands at once, it will fail.
# If you want to be able to run more than 1 instance at once, remove the "--name command-runner" option
docker run \
  --rm \
  --tty \
  --volume "$NODE_DIR":"$CONTAINER_DIR" \
  --workdir "$CONTAINER_DIR" \
  --network "${PROJECT_NAME}"_custom \
  --name command-runner \
  "$DOCKER_IMAGE" \
  bash -c "$*"
