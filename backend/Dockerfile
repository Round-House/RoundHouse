# ***DEVELOPMENT***

# From https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:16 AS development

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build

# Put the docker container on a port
EXPOSE 3000

CMD [ "node", "dist/main" ]


# ***PRODUCTION*** (Untested)

FROM node:16 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir
WORKDIR /usr/src/app

COPY --from=development /usr/src/app/ .

# Put the docker container on a port
EXPOSE 3000

CMD [ "node", "dist/main" ]