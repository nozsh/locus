---
draft: false
title: "Symlink - Windows и Linux"
description: "О том как сделать символическую ссылку в Windows и Linux"
summary: "О том как сделать символическую ссылку в Windows и Linux"
date: 2024-07-13
categories: ["Short Read", "System"] # ["cat 1", "cat 2"]
tags: ["Windows", "Linux"] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
# canonicalURL: "yourself"
# weight: 1
# robotsNoIndex: true

showToc: true
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
  image: "" # image path/url
  alt: "Cover" # alt text
  # caption: "Photo by [Sajad Nori](#) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: true # only hide on current single page
---

## Windows

### Директория

```batch
mklink /J "C:\CustomDir" "D:\SomeDir"
```

Где `"C:\CustomDir"` путь до символической ссылки. Где `"D:\SomeDir"` путь где находится существующая директория, к которой делается символическая ссылка.

Это точно будет работать на одном диске. Создание символической ссылки **МЕЖДУ** дисками (как в примере) будет работать только если оба диска в одной файловой системе.

Если диски в разных файловых системах, то в таком случае следует использовать параметр `/D` вместо `/J`.

```batch
mklink /D "C:\CustomDir" "D:\SomeDir"
```


### Файл

Все так же как и для директории, но без параметров:

```batch
mklink "C:\CustomDir\myfile.txt" "D:\SomeDir\somefile.txt"
```

## Linux

Тут все просто, для файлов и директорий:

```bash
ln -s /opt/foo /opt/bar
```

Где `/opt/foo` целевая директория, то есть директория которая существует. Где `/opt/bar`, символическая ссылка с именем **bar**.

То есть если перейти в `/opt/bar` вы фактически окажетесь в `/opt/foo`.
