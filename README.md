realtrends
==========


The realtrend apps needs access to a Elastic Search Server. 

It expects to get the details for the server via an Environment variables called `ES_SERVER_URL`. 

To start the application pass the variable via the command line or set it in the environment variables of the machine running the application

i.e
    ES_SERVER_URL=https://cydupqgzpx:p19ndm9l1a@realtrends-9107882958.eu-west-1.bonsai.io DEBUG=app npm start

## With Docker

if running on a local docker container use the `-e` tag to set the environment variables

e.g.

        docker run --rm -p 8080:3000 -v /path/to/projects/realtrendz/app:/app -e "ES_SERVER_URL=IP_OF_ES_SERVER_INSTANCE:9200" --name realtrends_web realtrendz_web

	
indexes

	building_data