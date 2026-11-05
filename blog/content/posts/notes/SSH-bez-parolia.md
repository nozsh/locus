---
draft: false
title: "SSH без пароля"
description: "Как создать SSH ключ."
summary: "Как создать SSH ключ."
date: 2022-11-27
lastmod: 2024-08-09
categories: ["Short Read", "System"] # ["cat 1", "cat 2"]
tags: ["Linux"] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
# canonicalURL: "yourself"
# weight: 1
# robotsNoIndex: true

# showToc: true
# TocOpen: true
# hidemeta: true
# comments: true
# disableHLJS: true
# disableShare: true
# hideSummary: true
# hideFooter: true
# searchHidden: true
# ShowCodeCopyButtons: false
# ShowReadingTime: false
# ShowWordCount: false
# ShowBreadCrumbs: false
# ShowPostNavLinks: fales
# ShowRssButtonInSectionTermList: false
# ShowCanonicalLink: true
# CanonicalLinkText: ""
# UseHugoToc: false
# hideAuthor: true
# byai: true
cover:
  image: "@img/ssh-bez-parolia-cover.webp" # image path/url
  width: "480" # only for img from url; EX: 1920
  height: "240" # only for img from url; EX: 1080
  alt: "SSH без пароля - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: false # only hide on current single page
---

{{< callout/note >}}
**Как это работает?**<br><br>
Приватный ключ хранится у вас (пользователя). А публичный ключ хранится на удаленной машине.<br><br>
То есть, чтобы подключиться к удаленной машине, на ней должен быть публичный ключ, а у вас соответствующий приватный ключ.<br><br>
Также вы можете использовать один и тот же публичный ключ на множестве машин, чтобы подключаться к ним, используя один и тот же приватный ключ.
{{< /callout/note >}}

Нужно создать ключ, командой на локальной машине:

```bash
ssh-keygen
```

Вас попросит ввести имя ключа.

Желательно генерировать ключ со стандартным именем, то есть не давать ему названия (обычно это **id_rsa**).

Далее нужно придумать кодовую фразу. Если ее не вводить, вход будет полностью без пароля (не рекомендую).

Вывод:

```bash {linenos=false}
Generating public/private rsa key pair.
...
Your identification has been saved in /.ssh/id_rsa
Your public key has been saved in /.ssh/id_rsa.pub
The key fingerprint is:
SHA256:*** ***@***
The key's randomart image is:
+---[RSA 3072]----+
| *************** |
+----[SHA256]-----+
```

Далее нужно скопировать ключ из `.pub` в **authorized_keys**, который находится на удаленной машине.

```bash
# На локальной машине
scp ~/.ssh/id_rsa.pub root@ip:/dir/to/.ssh      # Скопировать ключ на сервер через SCP

# На хосте
cat ~/.ssh/id_rsa_pub >> ~/.ssh/authorized_keys # Записать ключ в authorized_keys
```

Либо можете просто открыть `.pub` скопировать ключ, и вставить его в **authorized_keys**, через любой текстовый редактор, или просто через sftp.

## Что получается?

Локальная машина:

```bash
ls .ssh
id_rsa
id_rsa.pub
```

Удаленная машина:

```bash
ls .ssh
authorized_keys

cat .ssh/authorized_keys
ssh-rsa # много много букв
```

Если вы все сделали правильно, то при следующем подключение у вас либо спросит кодовую фразу, либо произойдет подключение, если вы не указывали кодовую фразу.

Так же публичный ключ (`.pub`) можно использовать и на другой машине, для этого его так же нужно будет скопировать в **authorized_keys**.

{{< 1wordfix >}}
