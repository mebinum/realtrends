#!/bin/bash

elastic_search_url="$1"
doc_id="$2"
permit_data="$3"
#permit_data=$(printf '%q' $3)

#echo "URL ${elastic_search_url}"
#echo "doc d ${doc_id}"
#echo "message ${permit_data}"

curl -XPUT "${elastic_search_url}/building_data/permits/${doc_id}" -d "${permit_data}"