FROM keymetrics/pm2:14-alpine

WORKDIR /usr/src/app

COPY . ./

RUN apk add yarn --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

RUN yarn
RUN yarn build

CMD ["yarn", "start:prod"]