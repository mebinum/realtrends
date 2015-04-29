 FROM elasticsearch:1.5.0

 MAINTAINER Mike Ebinum, mike@seeddigital.co

# Install HEAD plugin
RUN cd /usr/share/elasticsearch/ &&  bin/plugin -i mobz/elasticsearch-head && bin/plugin -i elasticsearch/marvel/latest

ADD elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

RUN usermod -u 1000 elasticsearch && chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/config

RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/data && groupmod --gid `stat --format=%g /usr/share/elasticsearch/data` elasticsearch

VOLUME  ["/var/log/elasticsearch"]