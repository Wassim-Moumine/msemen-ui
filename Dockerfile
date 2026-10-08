FROM alpine:3.20 AS libs
RUN apk add --no-cache curl
WORKDIR /libs
RUN curl -fsSLO https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js \
 && curl -fsSLO https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js \
 && curl -fsSLO https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Flip.min.js \
 && curl -fsSLO https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js

FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --chmod=755 site/ /usr/share/nginx/html/
COPY --from=libs --chmod=755 /libs/ /usr/share/nginx/html/js/vendor/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1
