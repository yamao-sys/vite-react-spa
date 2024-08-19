FROM node:20.14.0-alpine

WORKDIR /src
RUN apk add xdg-utils

CMD sh -c "npm ci && npm run dev"
