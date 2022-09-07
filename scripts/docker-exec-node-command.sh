#!/usr/bin/env bash

#
# Execute remote commands through a running Docker container
#
# Usage
# Either run in your IDE or run in the command line:
# ./bin/docker-exec-command.sh npm run build
#

# Get the script's directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT_DIR="$( dirname "${DIR}" )"
CONTAINER_DIR=/home/node/app

# Get the project directory name
PROJECT_NAME="$( basename "${ROOT_DIR}" )"
DOCKER_IMAGE="${PROJECT_NAME}_node"
result=$( docker ps --format "{{.Image}}" --filter "name=node" | grep "$DOCKER_IMAGE" )

if [[ "$result" == "" ]]; then
    echo "Error: Can't find running container of $DOCKER_IMAGE. Please run the container first."
    exit 1
elif [[ ! -n "$*" ]]; then
    echo "Error: No commands to execute"
    exit 1
fi

echo "Executing command through container $DOCKER_IMAGE..."

docker exec \
  -i \
  --tty \
  --workdir=$CONTAINER_DIR \
  node \
  bash -c "$*"
