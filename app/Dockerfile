 FROM node:0.12.2-onbuild

 MAINTAINER Mike Ebinum, mike@seeddigital.co

 WORKDIR /usr/src/app

 RUN ls -la
 VOLUME ["/usr/src/app"]

 EXPOSE 8080
 
 CMD ["node","node_modules/.bin/http-server"]
