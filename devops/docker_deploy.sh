#!/bin/bash

set +e

#set fail on error
#set -e -x

#Adapted from https://blog.harbur.io/continuous-delivery-ghost/
# to change the domains to be bound use `docker_deploy.sh 'somedomain.com' '/path/to/elasticsearch/data'` 
APP_NAME=realtrends_web
APP_BLUE=${APP_NAME}"_blue"
APP_GREEN=${APP_NAME}"_green"
APP_IMAGE_NAME=docker-registry.seeddigital.co/realtrends_web
NGINX_PROXY=realtrends_proxy
ES_IMAGE_NAME=docker-registry.seeddigital.co/realtrends_elasticsearch
ES_CONAINTER_NAME=realtrends_es
DEFAULT_DOMAINS=*.realtrends.co
HOST_DOMAIN=$([ -z "$1" ] && echo $DEFAULT_DOMAINS || echo $DEFAULT_DOMAINS","$1)
ES_DATA_PATH_DEFAULT=$(pwd)"/esdatas"
ES_DATA_PATH=${2:-$ES_DATA_PATH_DEFAULT}

es_port () {
  PORT=$(docker inspect -f '{{(index ( index .NetworkSettings.Ports "9200/tcp") 0).HostPort}}' ${ES_CONAINTER_NAME})
  echo $PORT
}

is_container_running () {
  [[ $(docker inspect -f "{{.State.Running}}" $1) = "true" ]] && up=1 || up=0
  echo $up
}

run_container() {
  NAME=$1
  PORT=$(es_port)
  docker run -d -e VIRTUAL_HOST=$HOST_DOMAIN -e VIRTUAL_PORT=3000  -e "ES_SERVER_URL=realtrends.co:${PORT}" --name $NAME -P -v /data/logs:/data/logs -d $APP_IMAGE_NAME
}



#check if nginx proxy container is not running if it isn't start it

if [ $(is_container_running ${NGINX_PROXY}) -eq 0 ]; then
    echo "Staring nginx proxy ${NGINX_PROXY}"
    docker rm ${NGINX_PROXY}
    docker run --name ${NGINX_PROXY} -d -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock -t jwilder/nginx-proxy
fi

# start the elastic search container if it's not running
if [ $(is_container_running ${ES_CONAINTER_NAME}) -eq 0 ]; then
    echo "Staring elastic search container ${ES_CONAINTER_NAME} with image ${ES_IMAGE_NAME}"
    docker rm ${ES_CONAINTER_NAME}
    docker run -d -v ${ES_DATA_PATH}:/usr/share/elasticsearch/data -e VIRTUAL_HOST=$HOST_DOMAIN VIRTUAL_PORT=9200 -P --name ${ES_CONAINTER_NAME} ${ES_IMAGE_NAME}
fi

# Check if green instance is running
if [ $(is_container_running ${APP_GREEN}) -eq 0 ]; then  
  echo "Currently active node is ${APP_BLUE}, deploying ${APP_GREEN}"
  docker rm ${APP_GREEN}
  run_container ${APP_GREEN}
  sleep 20
  docker stop ${APP_BLUE}
else  
  echo "Currently active node is ${APP_GREEN}, deploying ${APP_BLUE}"
  docker rm ${APP_BLUE}
  run_container ${APP_BLUE}
  sleep 20
  docker stop ${APP_GREEN}
fi  