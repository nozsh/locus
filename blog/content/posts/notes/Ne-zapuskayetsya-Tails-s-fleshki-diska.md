---
draft: false
# url: "" # slug
title: "Не запускается Tails с флешки или диска"
description: "Что делать если не запускается Tails с USB-флешки или диска."
summary: "Что делать если не запускается Tails с USB-флешки или диска."
date: 2024-12-24
# lastmod: 2001-01-29
categories: ["Short Read", "System"] # ["cat 1", "cat 2"]
tags: ["Linux"] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
# authorURL: [""] # ['link author 1', 'link author 2'], ex. ['', 'https://example.com']
# canonicalURL: "yourself"
# CanonicalLinkText: "Источник:"
# weight: 1
# robotsNoIndex: true

# showToc: true
# TocOpen: false
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
# hideAuthor: true
# ShowBreadCrumbs: false
# ShowPostNavLinks: fales
# ShowRssButtonInSectionTermList: false
# ShowCanonicalLink: true
# UseHugoToc: false
# byai: true
cover:
  # image: "article/image" # image path/url
  # width: "1920" # only for img from url; EX: 1920
  # height: "1080" # only for img from url; EX: 1080
  alt: "Не запускается Tails с флешки или диска - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: true # only hide on current single page
---

У вас не запускается **[Tails](https://tails.net/?sl)** с флешки или например внешнего SSD диска, вы получаете что-то вроде:

```text
(initramfs) Unable to find a medium containing a live file system
```

Это из-за того, что вы используете **диск**, или "неправильную" флешку, которая "является" **диском**.

Tails требует, чтобы запуск был именно со **съемного накопителя**.

Некоторые USB-накопители (флешки) распознаются не как **съемные накопители**, а как **фиксированные диски**. А диски, соответственно это **диски**, а **не съемные накопители**, даже если они подключаются через USB.

Лучше не пытаться изменить такое поведение накопителя, так как это связано с особенностями производства.

Чаще всего такая проблема возникает с флешками SanDisk и с любыми дисками, в т.ч. «внешними».

## Решение

На экране выбора загрузки нажмите <kbd>TAB</kbd>, откроются параметры загрузки, удалите:

```text
live-media=removable
```

Нажмите <kbd>ENTER</kbd>, чтобы загрузиться.

Делать это нужно при каждом запуске Tails.
