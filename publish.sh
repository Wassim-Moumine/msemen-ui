#!/bin/sh
set -e
REGISTRY=${REGISTRY:-localhost:5000}
TAG=${TAG:-1.0}

docker compose build web
docker push $REGISTRY/msemen/web:$TAG

docker pull nginx:1.27-alpine
docker tag  nginx:1.27-alpine $REGISTRY/msemen/nginx:$TAG
docker push $REGISTRY/msemen/nginx:$TAG

docker pull matomo:5.14.0-apache
docker tag  matomo:5.14.0-apache $REGISTRY/msemen/matomo:$TAG
docker push $REGISTRY/msemen/matomo:$TAG

docker pull mariadb:11.4
docker tag  mariadb:11.4 $REGISTRY/msemen/db:$TAG
docker push $REGISTRY/msemen/db:$TAG
