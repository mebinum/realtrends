FROM node:0.12.0

MAINTAINER Mike Ebinum, mike@seeddigital.co

ADD app /app

ADD devops/docker-scripts/env.sh /env.sh

WORKDIR /app

RUN npm install && npm install -g nodemon

VOLUME ["/app"]

EXPOSE 3000
 
CMD ["npm", "start"]