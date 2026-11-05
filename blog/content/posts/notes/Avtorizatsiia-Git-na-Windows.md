---
draft: false
title: "Авторизация Git на Windows"
description: "Как запушить этот код?"
summary: "Как запушить этот код?"
date: 2024-08-08
categories: ["Short Read", "Dev"] # ["cat 1", "cat 2"]
tags: ["Windows"] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
# canonicalURL: "yourself"
# weight: 1
# robotsNoIndex: true

showToc: true
TocOpen: true
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
byai: true
cover:
  image: "" # image path/url
  alt: "Cover" # alt text
  # caption: "Photo by [Sajad Nori](#) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: true # only hide on current single page
---

{{< callout/warn >}}
Git **НЕ равно** GitHub.

Авторизация будет описана на примере GitHub.

Для других платформ получение данных для авторизации может отличаться!
{{< /callout/warn >}}

## Git Bash

Для начала нужно установить Git. Для Windows нужно скачать [Git Bash.](https://git-scm.com/download/win?sl)

Проверить установлен ли git можно командой:

```bash
git --version
```

## Настройка конфигов

{{< callout/note >}}
Конфиги настраиваются независимо от вашего аккаунта на GitHub. То есть, вы можете настроить это даже не имея аккаунта на GitHub.
{{< /callout/note >}}

Для настройки конфигов вводим данные команды:

```bash
git config --global user.name "<username>"
```

```bash
git config --global user.email <email@example.com>
```

Имя и почту можно ввести любую, но я обычно использую username с GitHub, и для почты "GitHub почту" - `<...>@users.noreply.github.com`. Посмотреть ее можно в настройках, на [странице](https://github.com/settings/emails?sl) **Emails**.

Опция `--global` значит, что имя и почта будут использоваться для всех действий в Git.

Если не использовать `--global`, то вводимые данные будут применяться только к текущему репозиторию.

{{% details/1 "Зачем это?" %}}
Эти команды используются для настройки глобальных параметров пользователя в Git. Эти параметры определяют, как ваше имя и email будут ассоциироваться с вашими коммитами в репозиториях.

Зачем это нужно:

1. **Идентификация автора коммитов**:
   - Когда вы делаете коммит в Git, он сохраняет информацию о том, кто его создал. Это помогает другим участникам проекта понять, кто внес изменения и кто может ответить на вопросы, связанные с этими изменениями.
2. **Соответствие стандартам**:
   - Многие проекты требуют, чтобы коммиты были подписаны корректными данными автора. Это помогает поддерживать прозрачность и ответственность в развитии проекта.
3. **Автоматизация и интеграция**:
   - Некоторые инструменты и сервисы, такие как GitHub, GitLab и другие, используют информацию о пользователе для автоматической генерации статистики, уведомлений и других функций.

Проверить текущие настройки можно используя команду:

```bash
git config --global --list
```

{{% /details/1 %}}

## Генерация токена

В правом верхнем углу страницы нажмите на иконку вашего профиля и выберите "Settings" (Настройки). В левой панели навигации прокрутите вниз и выберите "Developer settings".

В разделе "Developer settings" выберите "Personal access tokens". Нажмите на кнопку "Generate new token" (Создать новый токен) и выберите "Generate new token (classic)".

![Авторизация Git на Windows // Генерация токенов](@img/001-avtorizatsiia-git-na-windows-generatsiia-tokenov.avif)

Введите описание токена (например, "Git Bash Windows"), выберите срок действия токена (можно выбрать "No expiration" для токена без истечения срока действия) и установите необходимые разрешения (scopes) для токена (например, `repo` для полного доступа к репозиториям).

![Авторизация Git на Windows // Генерация токенов - scopes](@img/002-avtorizatsiia-git-na-windows-generatsiia-tokenov-scopes.avif)

Прокрутите вниз и нажмите на кнопку "Generate token". После создания токена GitHub покажет вам токен. **Скопируйте его**, так как вы больше не сможете увидеть его в открытом виде.

{{< callout/note >}}
В случае чего, там же можно будет перегенерировать токен.
{{< /callout/note >}}

## Авторизация

Вводим команду:

```bash
git config --global credential.helper wincred
```

Эта команда настраивает Git для использования Windows Credential Manager, который является встроенным менеджером учетных данных в Windows. Credential Manager обеспечивает более безопасное хранение учетных данных, так как они шифруются и хранятся в защищенном хранилище.

Далее понадобится какой-нибудь репозиторий. В директории с репозиторием выполняем команду:

```bash
git push
```

Это нужно чтобы открылось окно ввода учетных данных. В этом окне нужно ввести ранее полученный токен.

Если все сделано правильно, либо вы запушите новые изменения в репозиторий, либо получите сообщение что все актуально (обновлять нечего).
