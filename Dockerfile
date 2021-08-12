FROM node:16-alpine3.11

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 7071
EXPOSE 3003

CMD [ "node", "server.js" ]
