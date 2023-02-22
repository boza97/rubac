# DEVELOPMENT

FROM node:16-alpine As development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY  . .

EXPOSE 3000
