#!/bin/sh
for filename in /srv/assets/*.js; do
  envsub --syntax dollar-basic $filename $filename
done

caddy run --config /etc/caddy/Caddyfile
