#!/bin/bash

elastic_search_url="$1"
doc_id="$2"
permit_data="$3"

#echo "URL ${elastic_search_url}"
#echo "doc d ${doc_id}"
#echo "tweet ${tweet_message}"

curl -XPUT "http://${elastic_search_url}/building_data/permit/${doc_id}" -d "${permit_data}"