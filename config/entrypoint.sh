#!/bin/sh
for filename in /srv/assets/*.js; do
  envsub --syntax handlebars $filename $filename
done

caddy run --config /etc/caddy/Caddyfile
