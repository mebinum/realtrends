 FROM elasticsearch:1.5.0

 MAINTAINER Mike Ebinum, mike@seeddigital.co

# Install HEAD plugin
RUN cd /usr/share/elasticsearch/ &&  bin/plugin -i mobz/elasticsearch-head && bin/plugin -i elasticsearch/marvel/latest

RUN usermod -u 1000 elasticsearch

RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/data && groupmod --gid `stat --format=%g /usr/share/elasticsearch/data` elasticsearch