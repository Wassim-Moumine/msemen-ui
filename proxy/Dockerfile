FROM alpine:3.20 AS dummy
RUN apk add --no-cache openssl \
 && mkdir /dummy \
 && openssl req -x509 -nodes -newkey rsa:2048 -days 3650 -subj "/CN=dummy" \
      -keyout /dummy/privkey.pem -out /dummy/fullchain.pem

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=dummy /dummy /etc/nginx/dummy
COPY --chmod=755 certs.sh /docker-entrypoint.d/40-certs.sh

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health || exit 1
