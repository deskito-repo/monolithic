FROM node:18-alpine
WORKDIR /app
EXPOSE 80
COPY . .
RUN yarn --production
RUN yarn build
CMD yarn start
