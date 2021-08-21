#!/bin/sh
for filename in /bin/www/js/*.js; do
    envsub $filename $filename
done

nginx -g 'daemon off;'
