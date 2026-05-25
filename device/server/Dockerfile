FROM node:lts-alpine3.22

VOLUME ["/app/server/node_modules", "/app/frontend/node_modules"]


RUN apk add --no-cache iw

RUN npm install -g npm-check-updates

WORKDIR /app/server
COPY server/package*.json .
RUN npm install

WORKDIR /app/frontend
COPY frontend/package*.json .
RUN npm install

WORKDIR /app
COPY . .

ENTRYPOINT [""]
