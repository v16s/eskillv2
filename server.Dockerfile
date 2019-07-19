FROM node:10.16-alpine
WORKDIR /app
ADD ./ /app
RUN yarn
RUN yarn build
ENV NODE_ENV production
ENV DBURL 'mongodb://localhost:27017'
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install --production && mv node_modules ../
EXPOSE 5000
CMD node bin