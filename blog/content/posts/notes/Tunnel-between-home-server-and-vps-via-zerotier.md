---
draft: false
# url: "" # slug
title: "Туннель между домашним сервером и VPS через ZeroTier"
description: "Очередная борьба с NAT!"
summary: "Очередная борьба с NAT!"
date: 2025-12-24
# lastmod: 2001-01-29
categories: ["Short Read", "Self-hosted"] # ["cat 1", "cat 2"]
tags: ["Linux", "ZeroTier"] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
# authorURL: [""] # ['link author 1', 'link author 2'], ex. ['', 'https://example.com']
# canonicalURL: "yourself"
# CanonicalLinkText: "Источник:"
# weight: 1
# robotsNoIndex: true

# sha1: "" # for giscus

showToc: true
# TocOpen: false
# hidemeta: true
# comments: false
# disableHLJS: true
# disableShare: true
# hideSummary: true
# hideFooter: true
# searchHidden: true
# ShowCodeCopyButtons: false
# ShowReadingTime: false
# ShowWordCount: false
# hideAuthor: true
# ShowBreadCrumbs: true
# ShowPostNavLinks: false
# ShowRssButtonInSectionTermList: false
# ShowCanonicalLink: true
# UseHugoToc: false
# math: true
# byai: true
cover:
  image: "@img/cover.tunnel-between-home-server-and-vps-via-zerotier.webp" # image url
  width: "1708" # only for img from url; EX: 1920
  height: "970" # only for img from url; EX: 1080
  alt: "Туннель между домашним сервером и VPS через ZeroTier - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  # hidden: true # only hide on current single page
---

{{< callout/note >}}
Суть этой заметки аналогична [этой](../installing-pangolin) заметки про Pangolin, но с использованием другого инструмента.
{{< /callout/note >}}

Если VPS новый и нету Docker:

```bash {linenos=false}
apt update && apt upgrade -y
```

```bash {linenos=false}
apt install -y curl wget sudo git
```

```bash {linenos=false}
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh ./get-docker.sh
```

{{< callout/warn >}}
Если у вас есть firewall разрешите порты 80/tcp и 443/tcp для получения SSL.
{{< /callout/warn >}}

## Установка скриптом

Это автоматический скрипт установки и настройки домена панели, а так же других доменов (если надо) и SSL для них. Но NGINX конфиг будет полностью настроен **только** для панели.

```bash {linenos=false}
git clone https://github.com/nozsh/home-server-vps-ztnet-init ztnet && cd ztnet && bash init/init.sh
```

Далее в админке создать сеть. Подключиться к сети на домашнем сервере по инструкции. И на VPS выполнить:

```bash {linenos=false}
NET_ID="XYZ"; docker exec ztnet sh -c "cd /var/lib/zerotier-one && mkdir networks.d && cd networks.d && touch $NET_ID.conf"
```

Где `XYZ` -- ID сети.

Если добавляли другие домены помимо панели нужно отредактировать NGINX конфиги -- изменить `proxy_pass`. {{< callout/inline >}}Можно не добавлять доп. домены сразу. Потом просто использовать [скрипт](#добавлениенастройка-сервисов-nginx).{{< /callout/inline >}} Где `<ZeroTier_IP>` IP домашнего сервера в ZeroTier сети, `APP_PORT` порт на котором работает сервис на домашнем сервере.

```bash {linenos=false}
docker compose down && docker compose up -d && docker compose logs -f
```

И если с домашним сервером потерялся коннект:

```bash {linenos=false}
sudo systemctl restart zerotier-one
```

## Вручную

```bash {linenos=false}
mkdir ztnet && cd ztnet && wget -O docker-compose.yml https://raw.githubusercontent.com/sinamics/ztnet/main/docker-compose.yml
```

```bash {linenos=false}
nano docker-compose.yml
```

Меняйте все как вам нужно согласно [документации](https://ztnet.network/installation/docker-compose?sl).

### Reverse proxy (NGINX)

```bash {linenos=false}
nano docker-compose.yml
```

Должно быть вот так:

```yml {hl_lines=[2,5,6,8,12,13,14,15,16,17]}
services:
  zerotier:
    ports:
      - "9993:9993/udp"
      - "80:80"
      - "443:443"

  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: unless-stopped
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - /etc/letsencrypt:/etc/letsencrypt:ro
    network_mode: "service:zerotier"
    depends_on:
      - zerotier
```

{{% details/1 "Пример полного docker-compose.yml" %}}
```yml
services:
  postgres:
    image: postgres:15.2-alpine
    container_name: postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: database_password
      POSTGRES_DB: ztnet
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  zerotier:
    image: zyclonite/zerotier:1.14.2
    hostname: zerotier
    container_name: zerotier
    restart: unless-stopped
    volumes:
      - zerotier:/var/lib/zerotier-one
    cap_add:
      - NET_ADMIN
      - SYS_ADMIN
    devices:
      - /dev/net/tun:/dev/net/tun
    networks:
      - app-network
    ports:
      - "9993:9993/udp"
      - "80:80"
      - "443:443"
    environment:
      - ZT_OVERRIDE_LOCAL_CONF=true
      - ZT_ALLOW_MANAGEMENT_FROM=172.31.255.0/29

  ztnet:
    image: sinamics/ztnet:latest
    container_name: ztnet
    working_dir: /app
    volumes:
      - zerotier:/var/lib/zerotier-one
    restart: unless-stopped
    ports:
      - 3000:3000
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: database_password
      POSTGRES_DB: ztnet
      NEXTAUTH_URL: "https://ztnet-panel.domain.org"
      NEXTAUTH_SECRET: "something_random"
      NEXTAUTH_URL_INTERNAL: "http://ztnet:3000"
    networks:
      - app-network
    links:
      - postgres
    depends_on:
      - postgres
      - zerotier

  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: unless-stopped
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - /etc/letsencrypt:/etc/letsencrypt:ro
    network_mode: "service:zerotier"
    depends_on:
      - zerotier
 
volumes:
  zerotier:
  postgres-data:
 
networks:
  app-network:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.31.255.0/29
```
{{% /details/1 %}}

### NGINX конфиги

```bash {linenos=false}
mkdir -p nginx/conf.d
```

```bash {linenos=false}
nano nginx/conf.d/panel-ztnet.domain.org.conf
```

{{% details/1 "Конфиг для панели" %}}
```nginx {hl_lines=[3,16,18,19]}
server {
    listen 80;
    server_name ztnet-panel.domain.org;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name ztnet-panel.domain.org;

    ssl_certificate /etc/letsencrypt/live/ztnet-panel.domain.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ztnet-panel.domain.org/privkey.pem;

    ssl_session_cache shared:le_nginx_SSL:10m;
    ssl_session_timeout 1440m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://ztnet:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
{{% /details/1 %}}

```bash {linenos=false}
nano nginx/conf.d/your-app.domain.org.conf
```

{{% details/1 "Конфиг для каких-то сервисов" %}}
```nginx {hl_lines=[3,16,18,19,27]}
server {
    listen 80;
    server_name your-app.domain.org;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name your-app.domain.org;

    ssl_certificate /etc/letsencrypt/live/your-app.domain.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-app.domain.org/privkey.pem;

    ssl_session_cache shared:le_nginx_SSL:10m;
    ssl_session_timeout 1440m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://<ZeroTier_IP>:APP_PORT;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
{{% /details/1 %}}

Поменять там где выделено. Где `<ZeroTier_IP>` IP домашнего сервера в ZeroTier сети, `APP_PORT` порт на котором работает сервис на домашнем сервере.

### SSL

SSL можно получить через тот же Docker, но проще будет через хост.

```bash {linenos=false}
apt install certbot
```

```bash {linenos=false}
certbot certonly --standalone --non-interactive --agree-tos --email cert@domain.org -d ztnet-panel.domain.org
```

```bash {linenos=false}
ls /etc/letsencrypt/live/
```

{{< callout/hint >}}
SSL не получится получить/обновить, если запущен контейнер zerotier, из-за конфликта портов.
{{< /callout/hint >}}

## Запуск

```bash {linenos=false}
docker compose up -d && docker compose logs -f
```

В админке создать сеть. Подключиться к сети на домашнем сервере по инструкции. Далее нужно добавить VPS на котором работает ZTNet в сеть с домашнем сервером:

```bash {linenos=false}
docker exec -it ztnet sh
```

```bash {linenos=false}
cd /var/lib/zerotier-one
```

```bash {linenos=false}
mkdir networks.d
```

```bash {linenos=false}
cd networks.d
```

```bash {linenos=false}
touch <network>.conf
```

Где `<network>` -- ID сети.

```bash {linenos=false}
exit
```

```bash {linenos=false}
docker compose down && docker compose up -d && docker compose logs -f
```

И если с домашним сервером потерялся коннект:

```bash {linenos=false}
sudo systemctl restart zerotier-one
```

## Добавление/Настройка сервисов (NGINX)

Чтобы добавить новый сервис, скопируйте существующую конфигурацию NGINX, и поменяйте домен и `proxy_pass`. И запросите <a href="#ssl">SSL</a> сертификат.

```bash {linenos=false}
docker compose down && docker compose up -d && docker compose logs -f
```

Или если вы использовали скрипт автоматической настройки, из директории где docker-compose.yml выполнить:

```bash {linenos=false}
bash init/add_new.sh
```

Скрипт остановит контейнеры, создаст NGINX конфиг, запросит SSL и запустит контейнеры. Если ошибок не было -- руками ничего делать не требуется.

## Полезные команды
### Docker

Проверить что соединение доходит до вашего домашнего сервера через контейнер NGINX, можно командой:

```bash {linenos=false}
docker exec nginx wget -O- http://<ZeroTier_IP>:APP_PORT --timeout=5
```

Если что-то не запустилось, и/или работает не правильно после:

```bash {linenos=false}
docker compose restart && docker compose logs -f
```

Выполните:

```bash {linenos=false}
docker compose down && docker compose up -d && docker compose logs -f
```

### ZeroTier

```bash {linenos=false}
sudo zerotier-cli join <network>
```

```bash {linenos=false}
sudo zerotier-cli leave <network>
```

```bash {linenos=false}
sudo zerotier-cli listnetworks
```

## Скрипты
### VPS

"certbot_renew.sh":

```bash
#!/bin/bash

cd /root/ztnet
docker compose down

certbot renew --quiet
#certbot renew

bash start_nologs.sh
#bash restart_nologs.sh
```

Там же где docker-compose.yml:

"start.sh":

```bash
#!/bin/bash

docker compose up -d && docker compose logs -f
```

"start_nologs.sh":

```bash
#!/bin/bash

docker compose up -d
```

"restart.sh":

```bash
#!/bin/bash

docker compose down
docker compose up -d && docker compose logs -f
```

"restart_nologs.sh":

```bash
#!/bin/bash

docker compose down
docker compose up -d
```

### Cron

```bash {linenos=false}
sudo crontab -e
```

**VPS:**

```bash {linenos=false}
0 4 1 * * /bin/bash /root/certbot_renew.sh
```

**Домашний сервер:**

```bash {linenos=false}
2 4 1 * * systemctl restart zerotier-one
```
