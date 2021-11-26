FROM node:alpine

USER node


WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm ci

COPY . /app/

EXPOSE 8000

CMD npm run start:prod