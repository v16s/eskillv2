FROM node:10.16-alpine
WORKDIR /app
ADD ./ /app
RUN yarn
RUN yarn global add prisma-cli
ENV NODE_ENV production
RUN prisma deploy --force
RUN yarn build
ENV DBURL 'mongodb://localhost:27017'
EXPOSE 5000
CMD node bin