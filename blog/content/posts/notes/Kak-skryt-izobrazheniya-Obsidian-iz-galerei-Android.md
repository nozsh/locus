---
draft: false
url: "skryt-izobrazheniya-mediafayly-obsidian-galerei-android" # slug
title: "Как скрыть изображения Obsidian из галереи Android"
description: "Как убрать изображения Obsidian из галереи на Android."
summary: "Как убрать изображения Obsidian из галереи на Android."
date: 2024-11-30
# lastmod: 2001-01-29
categories: ["Short Read", "System"] # ["cat 1", "cat 2"]
tags: ["Android"] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
# authorURL: [""] # ['link author 1', 'link author 2'], ex. ['', 'https://example.com']
# canonicalURL: "yourself"
# CanonicalLinkText: "Источник:"
# weight: 1
# robotsNoIndex: true

showToc: false
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
  image: "@img/skryt-izobrazheniya-mediafayly-obsidian-galerei-android-cover.webp" # image path/url
  width: "1767" # only for img from url; EX: 1920
  height: "1325" # only for img from url; EX: 1080
  alt: "Как скрыть изображения Obsidian из галереи Android - Cover" # alt text
  caption: "Photo by [BP Miller](https://unsplash.com/@bp_miller?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: false # only hide on current single page
---

Вы начали использовать [Obsidian](https://obsidian.md/?sl) на Android, синхронизировали хранилище и вдруг поняли, что куча изображений из Obsidian разбросаны по всей галереи. Не круто.

Все просто, нужно создать файл `.nomedia` в корне вашего хранилища Obsidian.

{{< callout/note >}}
Файл `.nomedia` используется для указания операционной системе Android не выполнять поиск мультимедийных файлов в директориях, где он находится.
{{< /callout/note >}}

```
- .obsidian
- .space
- .trash
- ...
- .nomedia <== файл
```

{{< imgs/img
width=""
caption="[Total Commander](https://play.google.com/store/apps/details?id=com.ghisler.android.TotalCommander?sl)"
alt="Файл .nomedia - Total Commander"
src="@img/001-skryt-izobrazheniya-mediafayly-obsidian-galerei-android-total-commander.avif" >}}

Файл `.nomedia` можно создать как через USB, так и прямо на телефоне с помощью текстового редактора, например, «Editor» ([F-Droid](https://f-droid.org/packages/org.billthefarmer.editor/?sl) / [GitHub](https://github.com/billthefarmer/editor?sl)).

Скорее всего, вы не увидите файл `.nomedia` в "классическом проводнике", потому что такие файлы скрытые ([dotfiles](https://wikipedia.org/wiki/Hidden_file_and_hidden_directory)).

Но после создания файла `.nomedia` в корне хранилища Obsidian, все изображения должны исчезнуть из галереи.

{{< callout/hint >}}
То же самое произойдет в тех приложениях, которые умеют обрабатывать файл `.nomedia`.
{{< /callout/hint >}}

Если вдруг это не сработает, есть еще один вариант - создать файл `.nomedia` в каждой директории, где хранятся изображения. Но если у вас много таких директорий, то возможно оно того не стоит.
