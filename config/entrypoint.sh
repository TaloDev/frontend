#!/bin/sh
for filename in /srv/assets/*.js; do
  envsub --protect $filename $filename
done

caddy run --config /etc/caddy/Caddyfile
