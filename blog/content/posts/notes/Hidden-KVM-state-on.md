---
draft: true
# url: "" # slug
title: "Скрытие KVM"
description: "Desc"
summary: "Desc"
date: 2026-07-08
# lastmod: 2001-01-29
categories: [""] # ["cat 1", "cat 2"]
tags: [""] # ['tag 1', 'tag 2']
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
  # image: "image" # image url
  # width: "1920" # only for img from url; EX: 1920
  # height: "1080" # only for img from url; EX: 1080
  alt: "<Article_title> - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: true # only hide on current single page
---

Это заметка, не статья. Этот текст будет пополняться, эдакая живая инструкция по скрытию KVM. Но здесь не будет базового скрытия, про базовое скрытие смотрите:

{{< embedPost url="windows-but-on-linux-hardware-passthrough" >}}

## 🎱 🎲 🎰 ROI

**Влияние на детект**:

- 🟢 -- не самое важное, но нужно.
- 🟠 -- возможно благодаря этому заработает то, что не работало.
- 🔴 -- категорически надо сделать.

---

**Сложность**:

- 👺 -- сложно.

---

**Стоит ли того**:

- 👻 -- часто проверяется.
- 🪦 -- 50/50.
- 💀 -- очень редкий кейс.

## 🟢 👺 💀 ACPI-таблицы

```xml
<qemu:arg value="-acpitable"/>
<qemu:arg value="file=/path/to/your/patched_dsdt.aml"/>
```
