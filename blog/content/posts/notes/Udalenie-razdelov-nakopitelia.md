---
draft: false
title: "Удаление разделов накопителя. Windows"
description: "Как удалить разделы флешки, диска, etc."
summary: "Как удалить разделы флешки, диска, etc."
date: 2021-11-20
categories: ["Short Read", "System"] # ["cat 1", "cat 2"]
tags: ["Windows"] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
# canonicalURL: "yourself"

showToc: false
TocOpen: false
hidemeta: false
disableHLJS: false
disableShare: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowWordCount: true
ShowPostNavLinks: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
cover:
  image: "@img/udalenie-razdelov-nakopitelia-cover.avif" # image path/url
  width: "2000" # only for img from url; EX: 1920
  height: "1170" # only for img from url; EX: 1080
  alt: "Удаление разделов накопителя - Cover" # alt text
  caption: "Photo by [Drew DeArcos](https://unsplash.com/@starvox?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: false # when using page bundles set this to true
  hidden: false # only hide on current single page
---

```batch
diskpart          # Запустить diskpart
lis dis           # list disk # Список дисков
sel dis $         # select disk # Выбираем накопитель ($ = цифра, счет начинается с 0)
det dis           # detail disk # Информация о диске. Убедиться что это тот самый диск.
clean             # Очищаем
cre par pri       # create partition primary # Создаём раздел
sel par 1         # select partition # Выбираем раздел (счет начинается с 1)
active            # Делаем раздел активным. Если выдаст ошибку, пропускаем и идем дальше.
format fs=$ quick # Форматируем в файловую систему например: fat32, ntfs, опционально label=«name» - имя накопителя. Quick - быстрое форматирование.
assign            # Назначаем букву, чтобы накопитель появился в проводнике.
exit              # Выход из diskpart
```

Подробнее об [активных](https://compfixer.info/partition-active/?sl) разделах.
