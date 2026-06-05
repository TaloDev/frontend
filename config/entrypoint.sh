#!/bin/sh
set -e

# build explicit --env flags from the env vars declared in .env.production
env_flags=""
while read -r var; do
  env_flags="$env_flags --env $var"
done < /tmp/env-vars.txt

for filename in /srv/assets/*.js; do
  envsub $env_flags "$filename" "$filename"
done

caddy run --config /etc/caddy/Caddyfile
