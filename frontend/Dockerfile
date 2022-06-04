FROM node:16 AS development

WORKDIR /usr/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@14.0.0

COPY . .

RUN npm run build

EXPOSE 4200