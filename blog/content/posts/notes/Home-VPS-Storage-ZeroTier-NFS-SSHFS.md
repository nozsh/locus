---
draft: true
# url: "" # slug
title: "Дом. VPS. Хранилище. ZeroTier. NFS. SSHFS"
description: "О том как подключить сетевое хранилище и не забыть про проблемы с SSHFS."
summary: "О том как подключить сетевое хранилище и не забыть про проблемы с SSHFS."
date: 2026-01-25
# lastmod: 2026-01-24
categories: ["Short Read", "System"] # ["cat 1", "cat 2"]
tags: ["Linux"] # ['tag 1', 'tag 2']
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
  image: "@img/cover.home-vps-storage-zerotier-nfs-sshfs.webp" # image url
  width: "1920" # only for img from url; EX: 1920
  height: "1280" # only for img from url; EX: 1080
  alt: "Дом. VPS. Хранилище. ZeroTier. NFS. SSHFS - Cover" # alt text
  caption: "Photo by [gentina danurendra](https://unsplash.com/@gentinadanurendra#?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  # hidden: true # only hide on current single page
---

{{< callout/warn >}}
Эта заметка слегка хаотичная и "спонтанная", потому если вы не совсем шарите --- лучше не надо. Или надо, но очень медленно.

И что более вероятно, но неизвестно когда, эта заметка либо будет дополнена, либо вовсе превращена в статью.

Не делайте то что здесь указано вслепую! Это своего рода эксперимент.<br>Когда этот текст исчезнет, значит можно <span style="white-space: nowrap;">┐(´ー｀)┌</span>
{{< /callout/warn >}}

И да, тут опять Docker, потому без демонов обойдемся. Уж извините :\)

Для начала разберемся:

- Дом - это ваш домашний сервер, который может быть в т.ч. за NAT
- VPS - это сервер с публичным IP, не за NAT соответственно
- NAS - это некое удаленное хранилище с публичный IP и доступно откуда угодно **ИЛИ** локальным IP внутри сети хостера (доступно только с VPS хостера)

## Схема первая

![](@img/home-server-zerotier-nfs-vps-sshfs-nas-scheme.avif)

*Схема не очень, но и я не художник.*

Закономерный вопрос, а зачем? А почему бы и нет? Но если без приколов, смысл есть, правда очень редко.

К вопросу "а зачем?"; если вы что-то хостите у себя на домашнем сервере и делаете это публичным используя тот же VPS как шлюз, и вы используете или хотите использовать хранилище для того что хостите -- получится серьезный такой круг:

```txt {linenos=false}
Client --> VPS --> Home --> VPS --> NAS --> VPS --> Home --> VPS --> Client
```

*В случае второй схемы которая описана <a href="#схема-вторая">ниже</a>:*

```txt {linenos=false}
Client --> VPS --> Home --> NAS --> Home --> VPS --> Client
```

*Лучше вторая схема, кто не понял.*

На словах про первую схему.

У вас есть домашний сервер и сетевой диск (хранилище, какое-то пространство и тп.) и вы хотите подключить его к домашнему серверу. Как это можно сделать?

1. [NFS](https://ru.wikipedia.org/wiki/Network_File_System)
2. [SSHFS](https://ru.wikipedia.org/wiki/SSHFS)
3. [VPN](https://ru.wikipedia.org/wiki/VPN)

NFS по умолчанию **не** шифрует передаваемые данные, но хорош для использования, например в том же Docker.

SSHFS шифрует передаваемые данные, но не очень хорош в том же Docker.

VPN лучший и универсальный вариант, но что если нельзя?

Подключаем хранилище к VPS через SSHFS -- передаваемые данные шифруются. Далее на том же VPS подымаем контроллер ZeroTier и объединяем домашний сервер и VPS в одну сеть.

{{< embedPost url="tunnel-between-home-server-and-vps-via-zerotier" >}}

На домашнем сервере подключаем диск через NFS используя ZeroTier IP VPS, получая тот же NFS, но с шифрованием. Пробрасываем диск куда надо.

Если параметры подключения "правильные", то при зависание, отключение и тд. софт не упадет. Например качается файл с selfhosted файлообменника как вдруг упало хранилище -- софт не зависнет, но файл качатся перестанет и продолжит когда хранилище воскреснет, *наверное*.

Смысл в этой схеме как и написано в начале есть, но в очень редких случаях. Например если вы не можете или не хотите подключать хранилище к домашнему серверу напрямую, а с VPS можете. Или можно только через VPN (например WireGuard), но дома WG не работает -- поэтому между VPS и хранилищем VPN, а там уже домой. Или если вы хотите сделать единую точку для подключения к хранилищу. Ну там сами разберетесь зачем оно вам ¯\\\_(ツ)_/¯

Подключение как на первой схеме:

### VPS

```bash
apt install sshfs -y
```

```bash
nano /etc/fuse.conf
```

Раскоментить `user_allow_other`.

```bash
sshfs -o IdentityFile=/root/.ssh/key user@host:/path /mnt/storage/ \
  -o reconnect \
  -o ServerAliveInterval=15 \
  -o ServerAliveCountMax=3 \
  -o ConnectTimeout=10 \
  -o auto_cache \
  -o kernel_cache \
  -o compression=no \
  -o allow_other \
  -o default_permissions \
  -o _netdev
```

*Размонтировать можно так:*

```bash {linenos=false}
fusermount -u /mnt/storage
# ИЛИ
umount /mnt/storage
```

Для `nano /etc/fstab`:

```bash
user@host:/path /mnt/storage fuse.sshfs reconnect,_netdev,ServerAliveInterval=15,ServerAliveCountMax=3,allow_other,auto_cache,kernel_cache,compression=no,IdentityFile=/root/.ssh/key,default_permissions 0 0
```

Дополнить docker-compose ztnet (из гайда выше):

```yaml
  nfs:
    image: itsthenetwork/nfs-server-alpine:latest
    container_name: nfs
    # privileged: true
    volumes:
      - /mnt/storage:/exports
    environment:
      - SHARED_DIRECTORY=/exports
    network_mode: "service:zerotier"
    depends_on:
      - zerotier
```

Но в таком случае мы опять же столкнемся с проблемой использования хранилища напрямую через SSHFS, но на VPS. Поэтому на VPS лучше сделать то что описано во второй схеме. И в том же докер использовать уже примонтированный диск через NFS.

*Да, масло масленое, ну, а что вы хотели, это костыли дамы и господа.*

### Дом

```bash
apt install nfs-common -y
```

```bash
mount -t nfs <VPS_ZeroTier_IP>:/ /mnt/storage -o soft,timeo=30,retrans=5
```

*Размонтировать можно так:*

```bash {linenos=false}
umount /mnt/storage
# ИЛИ
umount -l /mnt/storage
# ИЛИ
fusermount -u /mnt/storage
```

Для `nano /etc/fstab`:

```bash
<VPS_ZeroTier_IP>:/ /mnt/storage nfs soft,timeo=30,retrans=5,_netdev 0 0
```

## Схема вторая

![](@img/home-server-localhost-nfs-sshfs-nas-scheme.avif)

Эта схема без кругов, подключаем хранилище напрямую к домашнему серверу по SSHFS, а затем по NFS с localhost так еще и через докер :D

Да, опять докер, но можно просто поднять NFS сервер и сделать тоже самое, но вероятно возникнут проблемы, потому что кажется nfs docker image содержит и делает больше чем просто вручную поднятый NFS сервер. *В будущем будет дополнено как это сделать.*

{{< imgs/img
notp=false
loading=""
caption=""
alt=""
width="100%"
src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXVkOG51YWhmNW5lMDNiODU2azByMTQ5ZHEwN2plYmkxanZ2dTUxMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CkYl1qlzkxPRbklfXx/giphy.gif" >}}

```bash
apt install sshfs nfs-common -y
```

```bash
nano /etc/fuse.conf
```

Раскоментить `user_allow_other`.

```bash
sshfs -o IdentityFile=/root/.ssh/key user@host:/path /mnt/sshfs/ \
  -o reconnect \
  -o ServerAliveInterval=15 \
  -o ServerAliveCountMax=3 \
  -o ConnectTimeout=10 \
  -o auto_cache \
  -o kernel_cache \
  -o compression=no \
  -o allow_other \
  -o default_permissions \
  -o _netdev
```

```yaml
services:
  nfs:
    image: itsthenetwork/nfs-server-alpine:latest
    container_name: nfs
    restart: unless-stopped
    privileged: true
    network_mode: "host"
    volumes:
      - /mnt/sshfs:/exports
    environment:
      - SHARED_DIRECTORY=/exports
```

```bash
mount -t nfs 127.0.0.1:/ /mnt/nfs -o soft,timeo=30,retrans=5
```

И чтобы все работало потом, не забудьте сделать чтобы оно само монтировалось, как это сделать написано выше.
