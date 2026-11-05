---
draft: true
title: "Крякаем Sandboxie"
description: "Desc"
summary: "Desc"
date: 2024-04-06
categories: [""] # ["cat 1", "cat 2"]
tags: [""] # ['tag 1', 'tag 2']
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
  image: "" # image path/url
  alt: "Cover" # alt text
  # caption: "Photo by [Sajad Nori](#) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: true # only hide on current single page
---

{{< callout/note >}}
_**Проверено на версии Plus 1.13.4.**_
{{< /callout/note >}}



{{% details/1 "Sandboxie" %}}
Sandboxie - появился еще в 2004. Утилита, которая представляет собой средство для контроля за работой различных программ, а также повышения уровня безопасности, в том числе и при работе в Интернете. Программа предоставляет пользователям возможность запуска приложений в защищённой оболочке, иначе называемой «песочнице». [Википедия](https://ru.wikipedia.org/wiki/Sandboxie?sl).
{{% /details/1 %}}

Мы имеем опен сурс [репозиторий](https://github.com/sandboxie-plus/Sandboxie?sl) на GitHub, где собственно и можем скачать софт.

Но увы, это НЕ платная версия. И крутые платные фичи - недоступны.

***

## hosts

Если софт запущен, полностью закройте его.

Первым делом открываем файл <mark>hosts</mark>:

```{linenos=false}
%windir%\system32\drivers\etc\hosts
```

И вставляем туда следующее:

```{linenos=false}
127.0.0.1 sandboxie-plus.com
```

{{< callout/warn >}}
**Нужно обязательно запретить программе доступ в интернет!** Либо так, либо вы уже сами решайте как это сделать.
{{< /callout/warn >}}

## Сертификат

Далее [скачиваем сертификат](#) (ключ, Certificate.dat).

{{< callout/hint >}}
Пароль: `s5B%f5ufsKv:lZk8`
{{< /callout/hint >}}

Кидаем Certificate.dat в корень программы.
