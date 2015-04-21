 FROM elasticsearch:1.5.0

 MAINTAINER Mike Ebinum, mike@seeddigital.co

#RUN mkdir -p /usr/src

ADD app /app
WORKDIR /app
RUN npm install http-server -g

VOLUME ["/app"]

EXPOSE 8080
 
CMD ["http-server"]
