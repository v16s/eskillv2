FROM node:10.16-alpine
WORKDIR /app
ADD ./ /app
ENV PARCEL_WORKERS 1
RUN yarn
ENV NODE_ENV production
RUN yarn build
RUN rm -rf frontend
EXPOSE 6000
CMD yarn serve
