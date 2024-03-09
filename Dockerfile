FROM node:20
ADD . /COMP6905_GR_03
WORKDIR /COMP6905_GR_03
RUN npm install

CMD node ./server/main.js
