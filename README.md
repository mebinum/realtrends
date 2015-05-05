realtrends
==========


The realtrend apps needs access to a Elastic Search Server. 

It expects to get the details for the server via an Environment variables called `ES_SERVER_URL`. 

To start the application pass the variable via the command line or set it in the environment variables of the machine running the application

i.e
            ES_SERVER_URL=10.0.0.0 DEBUG=app npm start
			
indexes for elastic search

	building_data

## With Docker

if you are running the elasticsearch docker container use the command to start the service

		 docker run -d -v /path/to/elasticsearch/data/r:/usr/share/elasticsearch/data -p 9200:9200 --name realtrends_es rt-elasticsearch

if running on a local docker container use the `-e` tag to set the environment variables

e.g.

        docker run --rm -p 8080:3000 -v /path/to/projects/realtrendz/app:/app -e "ES_SERVER_URL=IP_OF_ES_SERVER_INSTANCE:9200" --name realtrends_web realtrendz_web

#Deploying on a production server

Log on to the production server for realtrends and pull down the latest image for `realtrends`

		docker pull docker-registry/realtrends_web
	
pull down the latest code changes from the github repo and run the deploy bash script at `devops/docker_deploy.sh`