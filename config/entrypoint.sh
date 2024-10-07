#!/bin/sh
for filename in /bin/www/assets/*.js; do
  envsub $filename $filename
done

nginx -g 'daemon off;'
