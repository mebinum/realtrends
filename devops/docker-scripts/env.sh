#!/bin/bash
# docker script to set env variables after the container starts
# remixed from - http://mike-clarke.com/2013/11/docker-links-and-runtime-env-vars/
# Docker doesn't have a great way to set runtime environment variables,
# so use this script to prepare the execution environnment for later processes.
export ES_SERVER_URL=$REALTRENDS_ES_PORT_9200_TCP_ADDR:$REALTRENDS_ES_PORT_9200_TCP_PORT
 
# Execute the commands passed to this script
# e.g. "./env.sh venv/bin/nosetests --with-xunit
exec "$@"