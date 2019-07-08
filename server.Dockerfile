FROM node:10.16-alpine
WORKDIR /app
ADD ./ /app
RUN yarn
RUN yarn build
RUN rm -rf ./node_modules
ENV NODE_ENV production
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install --production && mv node_modules ../
EXPOSE 5000
CMD node bin