FROM artifactory.devops.internal.unicreditgroup.eu/dxs-docker-internal/dxs/nginx-base:0.2.0

COPY default.conf "${NGINX_DEFAULT_CONF_PATH}"
COPY dist .
COPY public /opt/app-root/src/public
  
USER nginx

CMD ["nginx", "-g", "daemon off;"]