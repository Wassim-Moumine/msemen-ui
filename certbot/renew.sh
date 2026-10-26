#!/bin/sh
trap exit TERM

: "${DOMAIN:?DOMAIN manquant}"

ARGS="--webroot -w /var/www/certbot --cert-name msemen -d msemen.$DOMAIN -d analytics.$DOMAIN"
ARGS="$ARGS --agree-tos --no-eff-email --non-interactive --keep-until-expiring"

if [ -n "$EMAIL" ]; then
  ARGS="$ARGS --email $EMAIL"
else
  ARGS="$ARGS --register-unsafely-without-email"
fi

if [ "$STAGING" = "1" ]; then
  ARGS="$ARGS --staging"
fi

while :; do
  if certbot certonly $ARGS; then
    WAIT=43200
  else
    WAIT=300
  fi
  sleep $WAIT &
  wait $!
done
