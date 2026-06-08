#!/bin/sh
set -e

# build explicit --env flags from the env vars declared in .env.production
env_flags=""
while read -r var; do
  env_flags="$env_flags --env $var"
done < /tmp/env-vars.txt

# substitute runtime env vars into index.html, which injects window.__ENV__
envsub $env_flags /srv/index.html /srv/index.html

caddy run --config /etc/caddy/Caddyfile
