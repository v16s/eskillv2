FROM node:10.16-alpine
WORKDIR /app
ADD ./ /app
ENV NODE_OPTIONS "--max-old-space-size=8192"
ENV PARCEL_WORKERS 1
RUN yarn
ENV NODE_ENV production
RUN yarn fbuild
RUN rm -rf build && rm -rf frontend && mv ./dist ./build
EXPOSE 6000
CMD yarn serve
