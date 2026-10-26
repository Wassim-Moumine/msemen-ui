FROM certbot/certbot:v5.8.0

COPY --chmod=755 renew.sh /renew.sh

ENTRYPOINT ["/bin/sh", "/renew.sh"]
