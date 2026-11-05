---
draft: false
# url: "" # slug
title: "SSG на Android через Termux на примере hugo"
description: "Настраиваем Termux и компилируем hugo на Android."
summary: "Настраиваем Termux и компилируем hugo на Android."
date: 2025-12-15
# lastmod: 2001-01-29
categories: ["Short Read", "Dev"] # ["cat 1", "cat 2"]
tags: ["Android", "Termux"] # ['tag 1', 'tag 2']
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
# byai: true
cover:
  # image: "" # image url
  # width: "1920" # only for img from url; EX: 1920
  # height: "1080" # only for img from url; EX: 1080
  alt: "Article - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: true # only hide on current single page
---

{{< callout/note >}}
В самом начале уведомляю что root права **НЕ** требуются. 
{{< /callout/note >}}

И так, у меня есть блог, *как вы могли заметить*. И я подумал, было бы круто что-то писать/менять с телефона, смотреть превью и пушить изменения. А не как обычно я это делал через приложения для заметок в качестве черновика и без превью.

Что понадобится:

- Android
- Termux
- Markdown редактор или просто редактор текста

У меня Android 15. Termux скачан из [F-Droid](https://f-droid.org/packages/com.termux?sl). Markdown редактор нужен что умеет работать с файлами, то есть не только внутреннее хранилище приложения. А так же легкий и который не будет особо мусорить своими файлами, то есть не Obsidian, а например [Zettel Notes](https://play.google.com/store/apps/details?id=org.eu.thedoc.zettelnotes?nt).

## Termux

В Termux как и на любом linux для начала выполним:

```bash
pkg update && pkg upgrade -y
```

Чтобы все обновить. Далее:

```bash
termux-setup-storage
```

Это команда Termux, после выполнения, приложение запросит разрешение на доступ к файлам. И в `ls ~/storage/shared` должны будут появиться привычные вам директории, как в проводнике. А это значит что доступ к файлам есть.

{{< callout/note >}}
`pkg`, это команда Termux, обертка для apt которая делает дополнительные проверки. Поэтому в контексте установки пакетов лучше использовать pkg для лучшей совместимости. 
{{< /callout/note >}}

Дальше все завист от вашего "хочу". В случае моего "хочу" мне нужен go и hugo для генерации сайта (превью, live server) и git для клонирования/обновления репозитория сайта, поэтому именно этот сценарий я и опишу далее.

Установка git:

```bash
pkg install git -y
```

Установка ssh:

```bash
pkg install openssh -y
```

{{< callout/note >}}
SSH нужен для работы с вашим сервером через git (вы <-> сервер), то есть если вы не используете ничего типа GitHub. Если вы используете такой сервис и не используете ssh ключи для авторизации, устанавливать не обязательно.
{{< /callout/note >}}

**Авторизация git чтобы пушить изменения:**

```bash
git config --global user.name "<username>"
```

```bash
git config --global user.email <email@example.com>
```

```bash
git config --global credential.helper store
```

`store` -- не самый безопасный способ хранения, но в контексте Android ([sandbox](https://source.android.com/docs/security/app-sandbox?hl=ru?nt)) и ограничений Termux (отсутствие полноценной поддержки libsecret) пойдет.

<!-- {{< callout/note >}}
В случае с GitHub, если вы хотите чтобы имя в комитах было другим вы должны указать другой email, который не привязан к аккаунту, можно и выдумать что-нибудь, но учтите такие комиты не будут учитываться в вашей статистике.

Если в конфиге имя будет любым другим, но указан email который привязан к аккаунту GitHub, то GitHub подцепит имя и аватарку юзера для отображения в комитах, статистика работать будет, но имя будет как у вас на GitHub.

Email кто сделал комит можно посмотреть командой: `git log`.
{{< /callout/note >}} -->

**Установка go:**

```bash
pkg install golang
```

Проверка: `go version`. 

**Сборка hugo:**

Установка clang:

```bash
pkg install clang
```

И сборка hugo:

```bash
CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@latest
```

В момент установки зависимостей показалось что оно зависло, даже лог не шел, но оказалось что это не так. Когда завершится, выполнить команду:

```bash
ls ~/go/bin/
```

Там должен быть "hugo", если так, значит оно скомпилировалось.

Теперь добавим это в переменные среды, чтобы не писать путь до бинарника каждый раз:

```bash
touch ~/.bashrc
```

```bash
echo 'export PATH="$HOME/go/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
```

Проверка: `hugo version`.

А еще при запуске сервера например `hugo server -D`, нужно использоваться флаг `noBuildLock` из-за особенности файловой системы Android блокировки файлов.

То есть:

```bash
hugo server -D --noBuildLock
```

## Markdown редактор

Markdown редактор на ваш вкус, цвет и настроение. Можно и вовсе не markdown редактор, а какой-нибудь обычный текстовый редактор. Я выбрал Zettel Notes из-за легкости и кастомизации.

![Zettel Notes / Termux / Browser Preview](@img/zettel-notes-termux-browser-preview.avif)

## Послесловие

Я пробовал устанавливать go и hugo вручную как это делаю обычно (но arm64 версии, `uname -m` = "aarch" ).

Go работал, hugo просто не работал. Тогда я попытался собрать hugo по официальной [документации](https://gohugo.io/installation/linux/#build-from-source), но go сыпался при работе с сетью (скачивание зависимостей). Устанавливать hugo через пакетный менеджер не вариант, потому что старая + не extended версия.

Я попробовал установить go через `pkg`, go все так же работал, но исправился краш компилятора при скачивание зависимостей, тогда я попробовал снова собрать hugo, и о чудо.
