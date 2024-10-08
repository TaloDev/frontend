FROM node:20-alpine AS build
WORKDIR /usr/frontend
COPY . .

# prepend \ to variables that need to be substituted
# this prevents them from being substituted with empty values
RUN sed -i 's/\${/\\${/g' .env.production

RUN npm install
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /usr/frontend/dist /bin/www
COPY /config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/frontend/config/entrypoint.sh /bin

RUN apk add --no-cache nodejs npm
RUN npm i envsub -g
RUN chmod +x /bin/entrypoint.sh

ENTRYPOINT ["/bin/entrypoint.sh"]

EXPOSE 80
