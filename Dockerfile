# syntax=docker/dockerfile:1
FROM node:16-alpine
ARG ENV
ENV ENV=$ENV

# Install requirements
RUN npm install --global npm

# Install make
RUN apk add make

# copy code
WORKDIR /
ADD . /server/
WORKDIR server

# Run initialization
RUN echo $ENV
RUN npm install
RUN npm run build

CMD ["sh", "-c", "npm run prod"]
