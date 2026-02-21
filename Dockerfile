FROM node:20-alpine AS build
WORKDIR /usr/frontend
COPY . .

# prepend \ to variables that need to be substituted
# this prevents them from being substituted with empty values
RUN sed -i 's/\${/\\${/g' .env.production

RUN --mount=type=cache,target=/root/.npm npm install
RUN npm run build

FROM caddy:2-alpine
COPY --from=build /usr/frontend/dist /srv
COPY /config/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /usr/frontend/config/entrypoint.sh /usr/local/bin/

RUN apk add --no-cache nodejs npm
RUN npm i envsub -g
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

EXPOSE 80
