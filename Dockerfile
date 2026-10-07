# Image du site MSEMEN
# Base : nginx "unprivileged" sur Alpine Linux

FROM nginxinc/nginx-unprivileged:1.27-alpine

# Métadonnées
LABEL org.opencontainers.image.title="msemen-ui" \
      org.opencontainers.image.description="Site vitrine sur le msemen marocain et ses déclinaisons" \
      org.opencontainers.image.authors="Wassim Moumine"

COPY nginx.conf /etc/nginx/conf.d/default.conf

# On copie le site statique dans le dossier nginx
COPY --chmod=755 site/ /usr/share/nginx/html/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1
