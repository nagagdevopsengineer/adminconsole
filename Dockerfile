FROM node:16.14.2 as build

MAINTAINER "Divya Phani Tejaswi <divya.phani@vapprtech.com>"

WORKDIR /adminconsole_ws

COPY ./* /adminconsole_ws/

RUN apt-get update && apt-get install -y tree

RUN tree /adminconsole_ws

RUN apt update && apt install -y curl && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y gnupg

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt update && apt install -y yarn

RUN apt install --no-install-recommends yarn

RUN yarn --version

RUN yarn install

EXPOSE 3001

CMD yarn start
