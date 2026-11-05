---
draft: true
title: "Гайд на Git"
description: "Что я тут делаю? И зачем?"
summary: "Что я тут делаю? И зачем?"
date: 2001-01-29
# lastmod: 2001-01-29
categories: ["Long Read", "Dev"] # ["cat 1", "cat 2"]
tags: ["Git"] # ['tag 1', 'tag 2']
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
# CanonicalLinkText: "Источник:"
# UseHugoToc: false
# hideAuthor: true
# byai: true
cover:
  image: "@img/git-guide-cover.avif" # image path/url
  # image: "defav.jpg" # image path/url
  width: "1050" # only for img from url; EX: 1920
  height: "700" # only for img from url; EX: 1080
  alt: "Гайд на Git - Cover" # alt text
  caption: "Photo by [RealToughCandy](https://www.pexels.com/@realtoughcandy/?sl) / [Pexels](https://www.pexels.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  # hidden: true # only hide on current single page
---

## Введение

{{< callout/warn >}}
**Git не следует путать с [GitHub](https://ru.wikipedia.org/wiki/GitHub?sl), [GitLab](https://ru.wikipedia.org/wiki/GitLab?sl) и [Gitea](https://ru.wikipedia.org/wiki/Gitea?sl) - веб-сайтами для размещения git-репозиториев и совместной разработки проектов.**

_Да, это текст для чайников, а почему бы и нет._
{{< /callout/warn >}}

**Git** - это инструмент, который помогает разработчикам отслеживать изменения в коде. Git позволяет каждому участнику проекта иметь полную копию всех изменений, что упрощает совместную работу

**Git** не ограничивается работой только с GitHub, он также работает и с другими платформами (которые поддерживаются), такими как GitLab, Hugging Face, Bitbucket, Azure DevOps и др.

## Уровень 1: Умение клонировать
