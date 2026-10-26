#!/bin/sh
CERTS=/etc/nginx/certs
LIVE=/etc/letsencrypt/live/msemen

mkdir -p "$CERTS" /var/www/certbot

link_certs() {
  if [ -f "$LIVE/fullchain.pem" ] && [ -f "$LIVE/privkey.pem" ]; then
    ln -sf "$LIVE/fullchain.pem" "$CERTS/fullchain.pem"
    ln -sf "$LIVE/privkey.pem" "$CERTS/privkey.pem"
  else
    ln -sf /etc/nginx/dummy/fullchain.pem "$CERTS/fullchain.pem"
    ln -sf /etc/nginx/dummy/privkey.pem "$CERTS/privkey.pem"
  fi
}

link_certs

(
  last=""
  while sleep 30; do
    now=$(sha256sum "$LIVE/fullchain.pem" 2>/dev/null | cut -d' ' -f1)
    if [ "$now" != "$last" ]; then
      link_certs
      nginx -s reload 2>/dev/null
      last="$now"
    fi
  done
) </dev/null &
