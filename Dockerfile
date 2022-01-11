FROM node:lts-alpine
ENV NODE_ENV=production

# Bundle app source
COPY ./app /usr/src/app
COPY ./node_modules /usr/src/app

# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
COPY ["./app/package.json", "./app/package-lock.json*"]

RUN npm install 


EXPOSE 8080



