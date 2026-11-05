---
draft: false
title: "Маскировка ссылок на сайте через href.li"
description: "Заметка о том как можно маскировать ссылки на сайте."
summary: "Заметка о том как можно маскировать ссылки на сайте."
date: 2024-05-14
categories: ["Short Read", "Dev"] # ["cat 1", "cat 2"]
tags: ["Web"] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
# canonicalURL: "yourself"

showToc: false
TocOpen: false
hidemeta: false
disableShare: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowWordCount: true
ShowPostNavLinks: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
cover:
  image: "" # image path/url
  alt: "Cover" # alt text
  caption: "Cover" # display caption under cover
  relative: false # when using page bundles set this to true
  hidden: true # only hide on current single page
---

В этой короткой заметки я расскажу как маскировать ссылки на вашем сайте, и не важно это статика или CMS.

Все что нужно, это подключить **js** скрипт туда где он будет загружаться самым последним.

```js
llinks_moredetail = document
  .querySelectorAll("a[href*='?nt']")
  .forEach((llinks_moredetail) => {
    llinks_moredetail.setAttribute("target", "moredetail");
    llinks_moredetail.setAttribute("rel", "noreferrer nofollow noopener");

    let llinks_moredetail_href = llinks_moredetail.href.toString().slice(0, -3);
    llinks_moredetail.setAttribute(
      "href",
      "https://href.li/?" + llinks_moredetail_href
    );
  });
```

---

## Атрибуты

Разберемся с атрибутами ссылки - rel: `noreferrer`, `nofollow`, `noopener`.

**noreferrer** - делает так, чтобы сайт на который вы ссылаетесь, не знал о вашем сайте.

**nofollow** - нужен для того чтобы поисковые роботы, игнорировали эту ссылку.

**noopener** - этот атрибут нужен для безопасности. Предотвращает вмешательство в страницу с которой была открыта ссылка.

## Пример использования

Я написал этот простой скрипт, чтобы контролировать каждую ссылку, которая должна открываться в новой вкладке.

Пример:

Я пишу ссылку так: `https://example.com/?nt`, а получается это:

```html
<a href="https://example.com/?nt">ссылка</a>

==>>

<a
  href="https://href.li/?https://example.com/"
  target="moredetail"
  rel="noreferrer nofollow noopener"
>
  ссылка
</a>
```

То есть я пишу `?nt` в конце ссылки, если хочу чтобы она открывалась в новой вкладке. Так как я предпочитаю, чтобы в новой вкладке открывались в основном только внешние ссылки, я так же добавил атрибуты.

Вы можете использовать скрипт как есть или немного поменять его:

```js
llinks_moredetail = document
  .querySelectorAll("a")
  .forEach((llinks_moredetail) => {
    llinks_moredetail.setAttribute("target", "moredetail");
    llinks_moredetail.setAttribute("rel", "noreferrer nofollow noopener");

    let llinks_moredetail_href = llinks_moredetail.href;
    llinks_moredetail.setAttribute(
      "href",
      "https://href.li/?" + llinks_moredetail_href
    );
  });
```

Данный скрипт, берет все ссылки и добавляет href.li с атрибутами.

## Пояснение скрипта

```js
document.querySelectorAll("a[href*='?nt']");
```

Выбирает все ссылки которые содержат `?nt`.

```js
llinks_moredetail.setAttribute;
```

Назначает атрибуты.

```js
llinks_moredetail.href;
```

Берет атрибут href (то есть саму ссылку).

```js
toString().slice(0, -3);
```

Обрезает ссылку с конца на 3 символа. Так как предполагается что `?nt` будет в конце.

```js
llinks_moredetail.setAttribute(
  "href",
  "https://href.li/?" + llinks_moredetail_href
);
```

Меняет атрибут href, подставляет `https://href.li/?` перед ссылкой.

---

На месте `moredetail` может быть `_blank` или `abrakadabra` - оно в любом случае откроет ссылку в новой вкладке. Я не использую `_blank` так как есть проблемы с производительностью и безопасностью. [Подробнее](https://www.searchenginejournal.com/blank-link-attribute/435883/?nt).

Так же вы можете редактировать атрибуты и использовать любого другого провайдера, а не href.li.

Плюсы использования скрипта, а не редактирования ссылок вручную в том, что фактически ссылки остаются чистыми.

Вы можете быстро поменять атрибуты у всех ссылок, или если href.li сломается - вы сможете быстро все исправить, отредактировав скрипт.
