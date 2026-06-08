FROM node:24-alpine AS build
WORKDIR /usr/frontend
COPY . .

# extract env var names that need runtime substitution from .env.production
# this list drives the entrypoint's envsub --env flags for index.html
RUN sed -n 's/^VITE_[^=]*=\${\([A-Z_][A-Z0-9_]*\)}[[:space:]]*$/\1/p' .env.production > /tmp/env-vars.txt

RUN --mount=type=cache,target=/root/.npm npm install
RUN npm run build

FROM caddy:2-alpine
COPY --from=build /usr/frontend/dist /srv
COPY /config/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /usr/frontend/config/entrypoint.sh /usr/local/bin/
COPY --from=build /tmp/env-vars.txt /tmp/env-vars.txt

RUN apk add --no-cache nodejs npm
RUN npm i envsub -g
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

EXPOSE 80
