FROM node:16-alpine AS build
WORKDIR /usr/frontend
COPY . .
RUN yarn
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /usr/frontend/dist /bin/www
COPY /config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/frontend/config/entrypoint.sh /bin

RUN apk add --no-cache nodejs npm
RUN npm i envsub -g
RUN chmod +x /bin/entrypoint.sh

ENTRYPOINT ["/bin/entrypoint.sh"]

EXPOSE 80
