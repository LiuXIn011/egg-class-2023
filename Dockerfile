FROM node:16.17.1

RUN mkdir /opt/egg-class
WORKDIR /opt/egg-class

COPY /package.json /opt/egg-class/package.json
RUN yarn install

COPY / /opt/egg-class

CMD npm run start