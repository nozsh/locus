---
draft: false
title: "📝 Typo"
# url: ""
description: "Как правильно писать."
summary: "Как правильно писать."
# date: 2001-01-29
# lastmod: 2001-01-29
categories: [""] # ["cat 1", "cat 2"]
tags: [""] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
authorURL: [""] # ['link author 1', 'link author 2'], ex. ['', 'https://example.com']
# canonicalURL: "yourself"
# weight: 1
robotsNoIndex: true

showToc: true
# TocOpen: false
# hidemeta: true
comments: false
# disableHLJS: true
# disableShare: true
# hideSummary: true
# hideFooter: true
searchHidden: true
# ShowCodeCopyButtons: false
ShowReadingTime: false
ShowWordCount: false
ShowBreadCrumbs: false
# ShowPostNavLinks: fales
# ShowRssButtonInSectionTermList: false
# ShowCanonicalLink: true
# CanonicalLinkText: "Источник:"
# UseHugoToc: false
math: true
remoteCode: true
hideAuthor: true
# byai: true
cover:
  image: "@img/typo-cover.avif" # image path/url
  # width: "" # only for img from url; EX: 1920
  # height: "" # only for img from url; EX: 1080
  alt: "Typo Cover" # alt text
  caption: "Photo by [camilo jimenez](https://unsplash.com/@camstejim?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  # hidden: true # only hide on current single page
---

## Каллауты

{{< callout/note >}}
Это **заметка**.
{{< /callout/note >}}

```md
{{</* callout/note */>}}
Это **заметка**.
{{</* /callout/note */>}}
```

<br>

{{< callout/hint >}}
Это **подсказка**.
{{< /callout/hint >}}

```md
{{</* callout/hint */>}}
Это **подсказка**.
{{</* /callout/hint */>}}
```

<br>

{{< callout/warn >}}
Это **предупреждение**.
{{< /callout/warn >}}

```md
{{</* callout/warn */>}}
Это **предупреждение**.
{{</* /callout/warn */>}}
```

<br>

{{< callout/custom "☕" "#000" "#8BC6EC" "linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)" >}}
Это **кастомный**.
{{< /callout/custom >}}

```md
{{</* callout/custom "☕" "#000" "#8BC6EC" "linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)" */>}}
Это **кастомный**.
{{</* /callout/custom */>}}
```

```md
{{</* callout/custom "" "" "" "" */>}}
Это **кастомный**.
{{</* /callout/custom */>}}
```

```
"" - Emoji
"" - color: inherit;
"" - background-color: transparent;
"" - background-image: none;
```

<br>

**Inline callout**

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam duo dolores et ea rebum. {{< callout/inline hyphens >}}Lorem Ipsum is simply dummy text of the printing and typesetting industry.{{< /callout/inline >}} Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

```md {hl_lines=[3,4]}
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
At vero eos et accusam duo dolores et ea rebum. {{</* callout/inline hyphens */>}}Lorem
Ipsum is simply dummy text of the printing and typesetting industry.{{</* /callout/inline */>}}
Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
```

```md
{{%/* callout/inline hyphens */%}}**Inline**{{%/* /callout/inline */%}}
```

```md
{{</* callout/inline hyphens */>}}<strong>Inline</strong>{{</* /callout/inline */>}}
```

Наличие "hyphens" включает переносы.

## Ахтунг

{{< ahtung/1 >}}

```md
{{</* ahtung/1 */>}}
```

---

{{< ahtung/2 >}}

```md
{{</* ahtung/2 */>}}
```

---

{{< ahtung/badEn >}}

```md
{{</* ahtung/badEn */>}}
```

## Спойлер

### Markdown

{{% details/1 "Заголовок" open %}}
**Контент**
{{% /details/1 %}}

```md
{{%/* details/1 "Заголовок" open */%}}
**Контент**
{{%/* /details/1 */%}}
```

### html

{{< details/1 "Заголовок" open >}}
<strong>Контент</strong>
{{< /details/1 >}}

```md
{{</* details/1 "Заголовок" open */>}}
<strong>Контент</strong>
{{</* /details/1 */>}}
```

## Встраивание YouTube видео

{{< iframes/yt rFZHOHl-L8A "lofi hip hop radio 📚 - beats to relax/study to" >}}

```md
{{</* iframes/yt rFZHOHl-L8A "title" "params" */>}}
```

Примеры `params`:

- `start=30` - начать с 30 секунд
- `end=35` - закончить на 35 секундах
- `controls=0` - убрать элементы управления

Параметры объединяются через `&`, например:

```text
start=30&end=35&controls=0
```

## Ссылка на пост

{{< embedPost url="typo" >}}

```md
{{</* embedPost url="typo" */>}}
```

<br>

{{< embedPost url="https://example.com?sl" title="Example Title" desc="Some description" cover="@img/typo-cover.avif" author="Author" site="Website" >}}

```md
{{</* embedPost url="https://example.com" title="Example Title" desc="Some description" cover="typo-cover.jpg" author="Author" site="Website" */>}}
```

<br>

{{< embedPost source=true url="https://example.com" title="Example Title" desc="Some description" cover="@img/typo-cover.avif" author="Author" site="Website" >}}

```md
{{</* embedPost source=true ... */>}}
```

## Список источников

В markdown.

{{< references >}}

- Источник [Источник](#)
- Источник [Источник](#)
- Источник [Источник](#)
  {{< /references >}}

```md
{{</* references */>}}

- Источник [Источник](#)
- Источник [Источник](#)
- Источник [Источник](#)
  {{</* /references */>}}
```

## Заголовки

Следующие элементы HTML `h2` - `h6` представляют пять уровней заголовков разделов. `h2` это самый высокий уровень, а `h6` самый низкий.

Заголовок `h1` это заголовок (название) записи, поэтому он не используется.

```md
## H2 <-- Учитывается в содержании

### H3 <-- Учитывается в содержании

#### H4 <-- Учитывается в содержании

##### H5 <-- Учитывается в содержании

###### H6 <-- Учитывается в содержании
```

## Разметка

| Стиль                                    |                Markdown |
| :--------------------------------------- | ----------------------: |
| **Жирный**                               | `**text**` / `__text__` |
| _Курсив_                                 |     `*text*` / `_text_` |
| ~~Перечеркнутый~~                        |              `~~text~~` |
| <u>Подчеркнутый</u>                      |           `<u>text</u>` |
| Sub<sub>Текст</sub>                      |       `<sub>text</sub>` |
| Sup<sup>Текст</sup>                      |       `<sup>text</sup>` |
| [Ссылка](typo)                           |             `[text](#)` |
| [Белая ссылка](https://example.com/?sl)  |          `[text](#?sl)` |
| [Черная ссылка](https://example.com/?nt) |          `[text](#?nt)` |
| `inline code`                            |            `` `text` `` |
| <mark>Выделение</mark>                   |     `<mark>text</mark>` |
| <kbd>Клавиша</kbd>                       |       `<kbd>text</kbd>` |

### О ссылках

Белая ссылка, ссылка на доверенный сайт, открывается в текущей вкладке.

Черная ссылка, ссылка на **не** доверенный сайт (`nofollow`), открывается в новой вкладке + используется маскировка рефера через анонимайзер ссылок.

Белая и черная ссылка, имеют атрибуты для безопасности `noreferrer noopener`.

Если ссылка введет не на этот сайт, то вместо обычной ссылки лучше использовать белую или черную.

## Списки

### Обычный список

- Раз
- Два
- Три
- Это
  - Обычный
    - Список

```md
- Раз
- Два
- Три
- Это
  - Обычный
    - Список

* Раз
* Два
* Три
* Это
  - Обычный
    - Список
```

### Нумерованный список

1. Раз
2. Два
3. Три
4. Это
   1. Нумерованный
      1. Список

```md
1. Раз
2. Два
3. Три
4. Это
   1. Нумерованный
      1. Список
```

### Чекбоксы

- [ ] Пустой
- [ ] Еще пустой
  - [ ] Пустой, но вложенный
- [x] Не пустой
  - [x] Не пустой и вложенный

```md
- [ ] Пустой
- [ ] Еще пустой
  - [ ] Пустой, но вложенный
- [x] Не пустой
  - [x] Не пустой и вложенный

* [ ] Пустой
* [ ] Еще пустой
  - [ ] Пустой, но вложенный
* [x] Не пустой
  - [x] Не пустой и вложенный
```

## Цитаты

> Цитата

> «Когда у тебя ничего нет, нечего и терять.»
>
> --- Джек Доусон

```md
> Цитата

> «Когда у тебя ничего нет, нечего и терять.»
>
> --- Джек Доусон
```

## Сноски

Сноска[^Сноска]

[^Сноска]: Это сноска.

Сноска[^Сноска2]

[^Сноска2]: Это сноска 2.

```md
Сноска[^1]

[^1]: Это сноска.
```

## Изображения

![Type - Cover](@img/typo-cover.avif)

```md
![alt](typo-cover.jpg)
```

### С параметрами

{{< imgs/img
notp=false
loading=""
caption="Это подпись"
alt="Это alt"
width="50%"
src="@img/typo-cover.avif" >}}

```md
{{</* imgs/img
notp=false
loading=""
caption="Это подпись"
alt="Это alt"
width="50%"
src="typo-cover.jpg" */>}}
```

- notp - true - не оборачивать в тег &lt;p&gt;, обычно нужно если используется внутри другого шорткода. Работает только если caption пустой
- loading - lazy/eager, по умолчанию lazy
- caption - подпись

### Галерея

{{< imgs/gallery >}}
https://images.unsplash.com/photo-1721332149267-ef9b10eaacd9?q=80&w=1936 | tall
https://images.unsplash.com/photo-1719937206158-cad5e6775044?q=80&w=1740 | wide
https://images.unsplash.com/photo-1721333091029-c66bbb278a54?q=80&w=1935 | tall
https://images.unsplash.com/photo-1721333089517-7cab0cfa07b7?q=80&w=1674 | big
https://images.unsplash.com/photo-1720048169586-6750c7863d8c?q=80&w=1740 |
https://images.unsplash.com/photo-1720048170016-751876b1dba0?q=80&w=1740 |
{{< /imgs/gallery >}}

<sup>**Photo by [Samsung Memory](https://unsplash.com/@samsungmemory?sl) / [Unsplash](https://unsplash.com/?sl)**</sup>

```md
{{</* imgs/gallery */>}}
src | tall
src | wide
src | big
src |
{{</* /imgs/gallery */>}}
```

## Видео

{{< vids/vid
width="100%"
align="center"
attr="controls loop muted"
controlslist="nodownload nofullscreen noremoteplayback"
webm="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
mp4="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
preload="metadata"
poster="@img/typo-cover.avif"
caption="Flowers" >}}

```md
{{</* vids/vid
width="100%"
align="center"
attr="controls loop muted"
controlslist="nodownload nofullscreen noremoteplayback"
webm="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
mp4="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
preload="metadata"
poster="typo-cover.jpg"
caption="Flowers" */>}}
```

```md
{{</* vids/vid
width=""
align=""
attr="controls"
controlslist=""
webm=""
mp4=""
preload="metadata"
poster=""
caption="" */>}}
```

Параметры:

`width` - Ширина видео.

`align` - Выравнивание видео на странице: `left`, `center`. По умолчанию _без значения_ видео выравнивается по левому краю - `left`.

`attr` - Атрибуты видео.

`controlslist` - Если он указан, помогает браузеру выбрать, какие элементы управления будут отображаться для видео всякий раз, когда браузер показывает свой собственный набор элементов управления (т. е. когда указан атрибут `controls`).

- `nodownload` - Убирает кнопку загрузки видео. Пользователи не смогут скачать видеофайл на свои устройства с помощью элементов управления.
- `nofullscreen` - Убирает возможность перехода в полноэкранный режим. Пользователи не смогут развернуть видео на весь экран.
- `noremoteplayback` - Запрещает пользователям отправлять видео на удалённые устройства (например, на телевизоры через Chromecast или другие медиаплееры).

`webm` - Ссылка на видео в формате webm.

`mp4` - Ссылка на видео в формате mp4.

`preload` - Этот атрибут предназначен для того, чтобы предоставить браузеру подсказку о том, что, по мнению автора, приведет к наилучшему пользовательскому опыту в отношении того, какой контент загружается перед воспроизведением видео. Он может иметь одно из следующих значений:

- `none`: Указывает, что видео не должно быть предварительно загружено.
- `metadata`: Указывает, что загружаются только метаданные видео (например, длина).
- `auto`: Указывает, что видеофайл может быть загружен целиком, даже если пользователь не должен его использовать.
- _пустая строка_: синоним значения `auto`.

Значение по умолчанию отличается для каждого браузера. В спецификации рекомендуется установить значение `metadata`.

`poster` - URL-адрес изображения, которое будет отображаться во время загрузки видео. Если этот атрибут не указан, ничего не отображается до тех пор, пока не станет доступен первый кадр, а затем первый кадр отображается как кадр постера.

#### Атрибуты

Атрибуты указываются в `attr`.

`autoplay` - Булев атрибут; Если указано, видео автоматически начнет воспроизводиться, как только сможет, без остановки для завершения загрузки данных.

{{< callout/note >}}
Современные браузеры блокируют автовоспроизведение аудио (или видео с включенной звуковой дорожкой), так как сайты, которые автоматически воспроизводят аудио, могут доставлять неприятные ощущения пользователям.
{{< /callout/note >}}

`controls` - Если этот атрибут присутствует, браузер предложит элементы управления, позволяющие пользователю управлять воспроизведением видео, включая громкость, поиск и паузу/возобновление воспроизведения.

`disablepictureinpicture` - В некоторых случаях запрещает браузеру предлагать контекстное меню «Картинка в картинке» или автоматически запрашивать «Картинка в картинке».

`loop` - Булев атрибут; Если указано, браузер автоматически вернется к началу по достижении конца видео.

`muted` - Логический атрибут, указывающий настройку отключения звука по умолчанию, содержащуюся в видео. Если этот параметр установлен, звук будет изначально отключен от звука. Его значением по умолчанию является `false`, что означает, что звук будет воспроизводиться при воспроизведении видео.

`playsinline` - Логический атрибут, указывающий на то, что видео должно воспроизводиться «в строке», то есть в пределах области воспроизведения элемента. Обратите внимание, что отсутствие этого атрибута не означает, что видео всегда будет воспроизводиться в полноэкранном режиме.

{{< callout/note >}}

<ul style="margin-bottom: 0;">
<li>
Атрибут <code>autoplay</code> имеет приоритет над <code>preload</code>. Если указано <code>autoplay</code>, то браузеру, очевидно, потребуется начать загрузку видео для воспроизведения.
</li>
<li>
Спецификация не заставляет браузер следовать значению этого атрибута; Это всего лишь намек.
</li>
</ul>
{{< /callout/note >}}

## Таблицы

| Заголовок #1 | Заголовок #2 | Заголовок #3 | Заголовок #4 | etc. |
| ------------ | ------------ | ------------ | ------------ | ---- |
| Текст        | Текст        | Текст        | Текст        | etc. |
| Текст        | Текст        | Текст        | Текст        | etc. |
| Текст        | Текст        | Текст        | Текст        | etc. |

```md
| Заголовок #1 | Заголовок #2 | Заголовок #3 | Заголовок #4 | etc. |
| ------------ | ------------ | ------------ | ------------ | ---- |
| Текст        | Текст        | Текст        | Текст        | etc. |
| Текст        | Текст        | Текст        | Текст        | etc. |
| Текст        | Текст        | Текст        | Текст        | etc. |
```

Отступы соблюдать не обязательно.

Выравнивание текста работает через: `:--`, `:-:`, `--:`.

| Лево  | Центр | Право |
| :---- | :---: | ----: |
| Текст | Текст | Текст |

```md
| Лево  | Центр | Право |
| :---- | :---: | ----: |
| Текст | Текст | Текст |
```

## Блоки кода

```
llinks_safe = document
  .querySelectorAll("a[href*='?sl']")
  .forEach((llinks_safe) => {
    llinks_safe.setAttribute("rel", "noreferrer nofollow noopener");

    let llinks_safe_href = llinks_safe.href.toString().slice(0, -3);
    llinks_safe.setAttribute("href", "https://href.li/?" + llinks_safe_href);
  });
```

Для блоков кода используются три обратные кавычки `` ` ``, в начале и в конце.

Подсветка синтаксиса указывается после первых трех обратных кавычек:

````md
```js
llinks_safe = document
  .querySelectorAll("a[href*='?sl']")
  .forEach((llinks_safe) => {
    llinks_safe.setAttribute("rel", "noreferrer nofollow noopener");

    let llinks_safe_href = llinks_safe.href.toString().slice(0, -3);
    llinks_safe.setAttribute("href", "https://href.li/?" + llinks_safe_href);
  });
```
````

Убрать нумерацию строк `{linenos=false}`:

````{linenos=false}
```js {linenos=false}
llinks_safe = document
  .querySelectorAll("a[href*='?sl']")
  .forEach((llinks_safe) => {
    llinks_safe.setAttribute("rel", "noreferrer nofollow noopener");

    let llinks_safe_href = llinks_safe.href.toString().slice(0, -3);
    llinks_safe.setAttribute("href", "https://href.li/?" + llinks_safe_href);
  });
```
````

Выделить строку или строки `{hl_lines=[1,2,3]}`:

````{hl_lines=[2,5]}
```js {hl_lines=[2,5]}
llinks_safe = document
  .querySelectorAll("a[href*='?sl']")
  .forEach((llinks_safe) => {
    llinks_safe.setAttribute("rel", "noreferrer nofollow noopener");

    let llinks_safe_href = llinks_safe.href.toString().slice(0, -3);
    llinks_safe.setAttribute("href", "https://href.li/?" + llinks_safe_href);
  });
```
````

Мультистрочное выделение `{hl_lines=[1,2,"5-20"]}`

Можно объединять `{linenos=false,hl_lines=[1,2,3]}`.

## Remote Code

{{< remote-code "https://github.com/nozsh/zeta-paste/blob/main/tsconfig.json" >}}

```yaml {linenos=false}
---
remoteCode: true
---
```

```md {linenos=false}
{{</* remote-code "link" */>}}
```

```md {linenos=false}
{{</* remote-code "link" "lang" */>}}
```

{{< remote-code url="https://github.com/nozsh/zeta-paste/blob/main/tsconfig.json" lang="" title="title" open=true >}}

```md {linenos=false}
{{</* remote-code url="link" lang="lang" title="title" open=true */>}}
```

Параметры:

- `url` - 0 / именной
- `lang` - 1 / именной; если не указан определяется автоматически
- `title` - только именной
- `open` - true/false; только именной

## Математика

```yaml {linenos=false}
---
math: true
---
```

Инлайн $E = mc^2$ формула:

```md {linenos=false}
Инлайн $E = mc^2$ формула
```

<br>

Блок с формулой:

$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

```md {linenos=false}
$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

Шпаргалки: [Katex](https://katex.org/docs/supported.html?nt), [Detexify](https://detexify.kirelabs.org/).
