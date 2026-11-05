---
draft: false
# url: "" # slug
title: "Установка Pangolin"
description: "Хотели мощный VPS/VDS, но нету денег? Проблемы с NAT? Есть решение!"
summary: "Хотели мощный VPS/VDS, но нету денег? Проблемы с NAT? Есть решение!"
date: 2025-08-09
# lastmod: 2001-01-29
categories: ["Short Read", "Self-hosted"] # ["cat 1", "cat 2"]
tags: ["Linux"] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
# authorURL: [""] # ['link author 1', 'link author 2'], ex. ['', 'https://example.com']
# canonicalURL: "yourself"
# CanonicalLinkText: "Источник:"
# weight: 1
# robotsNoIndex: true

# sha1: "" # for giscus

# showToc: true
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
# byai: true
cover:
  # image: "image" # image url
  # width: "1920" # only for img from url; EX: 1920
  # height: "1080" # only for img from url; EX: 1080
  alt: "Установка Pangolin - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: true # only hide on current single page
---

*Смотрите так же:*

{{< embedPost url="tunnel-between-home-server-and-vps-via-zerotier" >}}

Это короткая заметка о том как установить Pangolin для туннелирования трафика.

Понадобится сервер VPS/VDS с публичным IP адресом и доменное имя. Если вы используете Cloudflare и тп. проксирование для админки Pangolin должно быть выключено (DNS only).

{{< callout/note >}}
Где `domain.org` --- ваш домен.
{{< /callout/note >}}


Необходимо указать DNS запись на поддомен/домен для админки Pangolin, например "pangolin.domain.org". Указывать DNS запись на сам домен "domain.org" в таком случае -- необязательно.

Если вы используйте фаервол, нужно разрешить следующие порты: "80/tcp", "443/tcp", "51820/udp", "21820/udp". На примере ufw:

```bash
sudo sh -c 'ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 51820/udp && ufw allow 21820/udp'
```

Установка Docker:

```bash
sudo sh -c 'curl -fsSL https://get.docker.com -o get-docker.sh && sh ./get-docker.sh && rm -f get-docker.sh'
```

Далее следуйте установки из [документации](https://docs.digpangolin.com/self-host/quick-install?sl).

- Base domain: "domain.org", в любом случае, даже если вы не будите его использовать
- Dashboard domain: домен на котором будет админка, например "pangolin.domain.org", на него должна указывать DNS запись
- Email: любой, можно даже несуществующий, например "cert@domain.org"

Если вам не нужны какие-то специфичные настройки, везде где что-то спрашивает и есть "(default: X)" -- нажимайте Enter.

Если ошибок не было - открываете сайт, входите в аккаунт и настраиваете. *Newt советую использовать в Docker compose.*

{{< iframes/yt 8VdwOL7nYkY "Better Than Cloudflare Tunnels? - Pangolin Guide" "start=972" >}}

В прокси нужно добавлять локальный IP машины, и порт на котором работает приложение. Например, у VPS IP "a.a.a.a", у домашнего сервера динамический IP "b.b.b.b", а локальный (`hostname -I`) "c.c.c.c". Приложение работает в Docker на "8888" порту. Нужно указать IP - "c.c.c.c", и порт "8888".
