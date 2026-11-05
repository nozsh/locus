---
draft: false
title: "Делаем свою сборку Windows"
description: "Всегда хотелось сделать сборку как у васи 777? Я покажу как."
summary: "Всегда хотелось сделать сборку как у васи 777? Я покажу как."
date: 2022-09-05
categories: ["Long Read", "System"] # ["cat 1", "cat 2"]
tags: ["Windows"] # ['tag 1', 'tag 2']
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
  image: "@img/delaem-svoiu-sborku-windows-cover.avif" # image path/url
  width: "1920" # only for img from url; EX: 1920
  height: "1080" # only for img from url; EX: 1080
  alt: "Делаем свою сборку Windows - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  # hidden: true # only hide on current single page
---

## WIM и ESD

ESD это зашифрованный и сжатый формат данных, его нельзя монтировать, изменять и тп. В отличии от WIM.

То есть если вы собираетесь модить старую ось, вам понадобится утилита для конвертации esd > wim. Так как старые версии Windows не в wim, а в esd.

WIM так же удобен если вы модифицируете и поддерживаете свою сборку.

Система может аналогично esd установится и из wim. Образ будет занимать больше места, но это удобнее.

В файле install.wim\esd по сути находится система. Все настройки, которые мы видим и которые скрыты, находятся в реестре системы. А файлы реестра находятся в файлах системы.

Это означает что все внесенные в систему изменения, после упаковки системы в install.wim останутся.

И кншн же про варез офиса не забудем, весь софт установленный на системный диск в тч. с кастомными директориями (путями) - войдет в сборку.

## Где делать сборку?

Для создания сборки вам понадобится виртуальная машина или просто машина. Можно использовать любую программу для создания виртуальных машин.

{{% details/1 "Возможно не стоит использовать Hyper-V" %}}
Но, возможно не стоит использовать Hyper-V, тот что встроен в Windows. Hyper-V так идеально работает на системах Windows с установленной системой Windows, потому что обращается к железкам через мейн систему избегая установки драйверов на виртуалку.

Это сугубо мое мнение, я это не проверял и не тестировал. Но есть вероятность, что сборка сделанная на Hyper-V будет "неполноценной". Вероятность этого такая же, как и вероятность того что сборка сделанная на Hyper-V будет лучше.
{{% /details/1 %}}

Я советую использовать [Oracle VirtualBox](https://www.virtualbox.org/?sl), тк там система будет тянуть минимум не нужного хлама для сборки. Этот "хлам" очень нужен для наилучшего экспириенса _пользователей виртуалки_, а не для юзеров что _пользуются сборкой сделанной на виртуалке_. Таким образом система которую вы будите паковать будет максимально чистая, насколько это возможно.

Но вам никто не запрещает делать сборку где вы хотите, например на [VMware Workstation](https://en.wikipedia.org/wiki/VMware_Workstation?sl).

Так же какую бы вы программу не выбрали, не устанавливайте доп. ПО для виртуалки. Речь идет о разных расширениях, которые позволяют использовать общий буфер обмена и с легкостью передавать файлы между хостом и гостем.

Вместо этого, передавайте файлы используя флешку или внешний диск. Почему? Это все устанавливается в систему, и мусорит ее. Опять же, для юзеров виртуалки - круто, для юзеров сборки - не круто.

## Необходимое ПО

Так же понадобится:

- **[7-Zip](https://www.7-zip.org/download.html?sl)** - чтобы распаковать образ.
- **[Dism++](https://github.com/Chuyu-Team/Dism-Multi-language/releases?sl)** - чтобы создать файл install.wim.
- **[WinAIO Maker Professional](/kb/software/windows/system/winaio-maker-professional/)** - чтобы создать загрузочный образ (iso).

## Препарируем образ (Хост)

У вас должен быть [образ Windows](/kb/os/windows/). Распаковываем iso файл с помощью 7z. Распакованные файлы пока что не трогаем.

Далее создаем виртуальную машину и устанавливаем на нее Windows, как обычно.

{{< iframes/yt j1FAZ0bUEvs "VirtualBox: Установка и настройка (для новичков). Создание виртуальной машины" >}}

{{< callout/note >}}
Пользователь созданный при установки Windows сохранится. Поэтому стоит делать пользователя без пароля.
{{< /callout/note >}}

## Создание install.wim (Гость)

Вот вы все настроили, все установили. Ваша сборка готова.

Запускаем Dism++ > "Файл" > "Сохранить образ как". Сохраните его например на рабочий стол. После того как он создастся, кидаем его на флешку.

{{< imgs/img width="" caption="Подготовка к созданию install.wim" alt="" src="@img/001-kak-sdelat-sborku-windows-dism-podgotovka.avif" >}}

{{< imgs/img width="" caption="Процесс создания install.wim" alt="" src="@img/002-kak-sdelat-sborku-windows-dism-process.avif" >}}

## Создание образа (Хост)

Вы скопировали install.wim на флешку. Кидаем install.wim в папку с распакованными файлами образа > `/sources/`. Соглашаемся на замену.

Открываем WinAIO Maker. Выбираем "Select WIMs". Далее выбираем модифицированный install.wim из папки sources.

{{< imgs/img width="" caption="" alt="" src="@img/003-kak-sdelat-sborku-windows-winaio-maker-professional-1.avif" >}}

Нажимаем "Save all into ISO". В "Label" вводим что-то, в "Destination" - указываем путь куда сохранить. И жмем "Make ISO".

{{< imgs/img width="" caption="" alt="" src="@img/004-kak-sdelat-sborku-windows-winaio-maker-professional-2.avif" >}}

Ожидаем создания образа, обычно это недолго.

---

Все готово, чтобы проверить как работает, можно создать новую виртуальную машину с образом вашей сборки.
