FROM node:10.16-alpine
WORKDIR /app
ADD ./ /app
RUN yarn
ENV NODE_ENV production
RUN yarn build
ENV DBURL 'mongodb://localhost:27017'
EXPOSE 5000
CMD node bin