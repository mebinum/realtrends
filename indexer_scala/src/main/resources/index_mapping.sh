#!/bin/bash

elastic_search_url="$1"
mappings="$2"

#echo "URL ${elastic_search_url}"
#echo "doc d ${doc_id}"
#echo "tweet ${tweet_message}"

curl -XPUT "${elastic_search_url}/building_data/permits/_mapping" -d "${mappings}"