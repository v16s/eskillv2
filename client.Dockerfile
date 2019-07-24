FROM node:10.16-alpine
WORKDIR /app
ADD ./ /app
ENV PARCEL_WORKERS 1
RUN yarn
RUN yarn fbuild
ENV NODE_ENV production
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install --production && mv node_modules ../
RUN rm -rf build && mv ./dist ./build
EXPOSE 6000
CMD yarn serve