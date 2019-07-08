FROM node:10.16-alpine
WORKDIR /app
ADD ./ /app
ENV PARCEL_WORKERS 1
RUN yarn
RUN yarn global add serve
RUN yarn fbuild
RUN rm -rf ./node_modules
ENV NODE_ENV production
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install --production && mv node_modules ../
RUN rm -rf build && mv ./dist ./build
EXPOSE 6000
CMD serve -l 6000 -s ./build