---
draft: false
title: "Пиратим Nintendo Switch"
description: "У вас Denuvo - у нас эмулятор."
summary: "У вас Denuvo - у нас эмулятор."
date: 2024-01-26
lastmod: 2024-11-22
categories: ["Long Read", "Black Flag"] # ["cat 1", "cat 2"]
tags: [] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
# canonicalURL: "yourself"

showToc: true
TocOpen: true
hidemeta: false
comments: false
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
  image: "@img/piratim-nintendo-switch-cover.avif" # image path/url
  width: "1920" # only for img from url; EX: 1920
  height: "1080" # only for img from url; EX: 1080
  alt: "Пиратим Nintendo Switch (Prince of Persia: The Lost Crown) - Cover" # alt text
  caption: "Prince of Persia: The Lost Crown" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: false # only hide on current single page
---

{{< ahtung/1 >}}

{{< callout/note >}}
**Не обращайте внимание на название статьи, речь пойдет о эмуляции игр для Switch. Чтобы их эмулировать, у вас должна быть консоль и купленная игра ;)**
{{< /callout/note >}}

Покажу как эмулировать игры свичта на примере Prince of Persia: The Lost Crown. Речь идет о **Switch**, а не о **Wii U**, для второго лучше использовать эмулятор [Cemu](https://github.com/cemu-project/Cemu?sl).

То есть, когда вы покупаете игру (со 100% скидкой разумеется) обращайте внимание для чего она, Switch или Wii U - это две разные консоли.

{{< callout/note >}}
Нет необходимости писать статью на тему эмуляции Wii U, там все просто. Скачать эмулятор, установить игру, готово.
{{< /callout/note >}}

Эта статья для тех кто хочет сделать все своими руками, а не скачать уже готовый репак с эмулятором и прочим от жирной девочки.

Мы скачаем эмулятор, настроим эмулятор, скачаем/установим прошивку для свитча, скачаем prod.keys, конвертируем дамп игры в формат для эмулятора, установим DLC для игры и наконец запустим.

Для начала качаем эмулятор Yuzu (эмулятор [прикрыли](https://4pda.to/2024/03/05/425100/?sl)) или [Ryujinx](https://github.com/Ryujinx/Ryujinx?sl) (эмулятор [прикрыли](https://4pda.to/2024/10/02/433378/?sl)), какой значения не имеет. Попробуйте оба если хотите, какой больше понравится тот и используйте. Я буду использовать Ryujinx.

{{< callout/note >}}
**За эмулятором Ryujinx, пришли Nintendo, так же как и за Yuzu когда-то.**
{{< /callout/note >}}


## Первый запуск Ryujinx

<!-- ## Fist Start -->

Вы уже скачали эмулятор и распаковали его в нужную директорию.

Открываем ryujinx, видим это:

{{< imgs/img width="" caption="Ryujinx ошибка prod.keys" alt="Ryujinx ошибка prod.keys - RYU-0001 Keys not found" src="@img/001-ryujinx-oshibka-zapuska.avif" >}}

Не обращаем внимания, так и должно быть. Нажимаем **ОК**.

{{< imgs/img width="" caption="Интерфейс Ryujinx" alt="Интерфейс эмулятора Ryujinx" src="@img/002-interfeys-emulyatora-ryujinx.avif" >}}

Переходим в директорию где хранятся конфиг файлы Ryujinx:

{{< imgs/img width="" caption="File > Open Ryujinx Folder >> System" alt="Ryujinx - Предустановка ключей" src="@img/003-ryujinx-predustanovka-klyuchey.avif" >}}

Вы должны оказаться в:

```
%userprofile%\AppData\Roaming\Ryujinx\system
```

Отсюда не уходим. Закрываем эмулятор, для установки ключей его нужно было хотя бы раз запустить, чтобы тот создал свои файлы в AppData.

## Скачиваем прошивку и ключи

Переходим на [сайт](https://prodkeys.net/?nt) и качаем последнюю [прошивку](https://prodkeys.net/firmwares/?nt) и [ключи](https://prodkeys.net/prod-keys/?nt).

{{< callout/note >}}
От версии прошивки и ключей зависит кол-во поддерживаемых игр. Поэтому качайте последнюю версию, если нет специальной потребности в старой версии
{{< /callout/note >}}

Качать Ryujinx/Yuzu/Switch - значения не имеет, они все одинаковые.

Прошивка ясное дело это прошивка, думаю мы все знаем что это такое.

Ключи это буквально ключи, без них игры работать не будут. Ключи нужны для дешифровки, то есть ключи это своего рода DRM.

Игры требуют определенной прошивки, обратная совместимость как я понимаю есть. Если вы скачаете старую прошивку, новая игра может не работать. Ключи зависимы от прошивки, так как в оригинале ключи идут вместе с прошивкой, но мы пираты.

Это информация может быть не совсем верна, это просто мое наблюдение, у меня никогда не было консоли от Nintendo.

## Установка прошивки и ключей

Содержимое архива с ключами кидаем в открытые ранее файлы.

Должно быть так:

```{linenos=false}
- Ryujinx
| - system
| | - prod.keys
| | - Profiles.json
| | - title.keys
```

Запускаем Ryujinx, если снова появилась ошибка, значит стоит перечитать текст выше. Если же ошибки нет - ключи установлены, теперь прошивка.

Tools > Install Firmware > ...from XCI or ZIP >> Архив с прошивкой:

{{< imgs/img width="" caption="Ryujinx - Установка прошивки" alt="Ryujinx - Установка прошивки" src="@img/004-ryujinx-ustanovka-proshivki.avif" >}}

{{< callout/note >}}
Процесс установки прошивки можно посмотреть в консоли.
{{< /callout/note >}}

## Препарируем дамп игры

Где "покупать" игру решайте сами. Главное помните о Wii U и Switch (см. начало статьи).

Если дамп игры не в `.xci`, `.nsp`, `.pfs0`, `.nca`, `.nro`, `.nso` или не распакованный, то нужно распаковать или конвертировать его. Если же у вас уже есть распакованные файлы игры или дамп в формате выше - пропускайте этот шаг.

### Конвертируем дамп игры

Для конвертации будем использовать утилиту [nsz](https://github.com/nicoboss/nsz?sl), качаем и распаковываем ее. Открываем **nsz.exe** и видим это:

{{< imgs/img width="" caption="NSZ GUI - ERROR" alt="NSZ GUI - ERROR" src="@img/005-piratim-nintendo-switch-nsz-gui-error.avif" >}}

```{linenos=false}
...\nsz_v4.6.1_win64_portable\keys.txt or C:\Users\%username%\.switch\prod.keys not found!
Please dump your keys using https://github.com/shchmue/Lockpick_RCM/releases
Press Enter to exit...
```

Ошибка гласит что отсутствует **prod.keys**. Есть два варианта:

1. Создать `keys.txt` в корне утилиты, с ключами из `prod.keys`.
2. Создать папку `.switch` в папке юзера, и кинуть туда `prod.keys`.

Первый вариант будет чище, поэтому создаем текстовый файл в корне утилиты:

```{linenos=false}
- nsz_v4.6.1_win64_portable
| - keys.txt
```

Открываем скачанный `prod.keys` с помощью любого текстового редактора, копируем содержимое `prod.keys` в `keys.txt`. Запускаем снова и ошибки нет:

{{< imgs/img width="" caption="NSZ GUI" alt="NSZ GUI" src="@img/006-piratim-nintendo-switch-nsz-gui.avif" >}}

{{< callout/hint >}}
Открываем настройки **Settings [F1]** > Tools > Kivy always on top >> Off - перезапускаем утилиту. Таким образом вы выключили функцию "всегда поверх всех окон" - не благодарите ;)
{{< /callout/hint >}}

Следуя строке белого цвета жирного шрифта в центре окна, берем файл вашей игры (в моем случае .nsz) и перетаскиваем его в окно утилиты:

{{< imgs/img width="" caption="NSZ GUI & Prince of Persia: The Lost Crown" alt="NSZ GUI & Prince of Persia: The Lost Crown" src="@img/007-piratim-nintendo-switch-nsz-gui-prince-of-persia-the-lost-crown.avif" >}}

**Decompress NSZ/XCZ**. Ожидаем окончания, новый дамп будет лежать в той же директории что и оригинальный дамп.

**Extract**. Если вы хотите распаковать дамп соответственно.

В моем случае это "**Decompress NSZ/XCZ**" для конвертации .NSZ в .NSP.

Готово. Осталось самое простое, запустить.

## Запуск игр

Как я понял игры тут не устанавливаются, а просто запускаются из дампа или распакованных файлов.

{{< callout/note >}}
Это вопрос беспорядка. Вы можете запускать игру и "устанавливать" длс откуда угодно. Но если файлы игры или длс будут удалены, они будут удалены.
{{< /callout/note >}}

Поэтому в удобном месте создайте папку с играми. Внутри удобной папки с играми, создайте другую папку с конкретной игрой, туда поместите дамп\файлы игры. Если есть DLC - туда же. Вот как у меня:

```{linenos=false}
- ryujinx
| - games
| | - Prince of Persia the Lost Crown
| | | - .nsp
| | | - DLC
| | | | - .nsp
| | - Another Game
| - ryujinx-1.1.1117
```

Открываем Ryujinx > Load Application from File\Unpacked Game >> выбираем дамп\папку:

{{< imgs/img width="" caption="Ryujinx - Запуск игры" alt="Ryujinx - Запуск игры" src="@img/008-piratim-nintendo-switch-ryujinx-zapusk-igry.avif" >}}

{{< callout/note >}}
Если у вас распакованная игра то соответственно выбирайте **Load Unpacked Game**, у меня же это просто .NSP, поэтому я выбираю **Load Application from File**.
{{< /callout/note >}}

Как только вы загрузите игру, игра начнет (ого) загружаться и запустится.

Для подключения DLC у вас должен быть каталог игр (см. Настройка Ryujinx > [Каталог игр](#каталог-игр)), ПКМ по игре > **Manage DLC**:

{{< imgs/img width="" caption="Ryujinx - DLC" alt="Ryujinx - DLC" src="@img/009-piratim-nintendo-switch-ryujinx-dlc.avif" >}}

Нажимаем **Add** >> .NSP. И так выбираете каждое DLC, возможно можно выбрать сразу все. Проставляете галочки напротив каждого DLC, если те не проставлены.

{{< callout/note >}}
Если DLC не в .NSP - то [конвертируем](/blog/piratim-nintendo-switch/#конвертируем-дамп-игры) в .NSP.
{{< /callout/note >}}

На этом все, далее будет настройка эмулятора Ryujinx для наилучшего юзабилити. Можете почитать или полазить по настройкам сами.

## Настройка Ryujinx

Настройки находятся тут Options > Settings.

{{< imgs/img width="" caption="Ryujinx - Настройки" alt="Ryujinx - Настройки" src="@img/010-piratim-nintendo-switch-ryujinx-nastroiki.avif" >}}

### Каталог игр

Чтобы сделать удобный каталог игр, как у меня на скриншотах выше: General > Game Directories > Add >> Выбираете ту самую удобную папку с играми. НЕ папку с игрой, а папку В которой ДРУГИЕ папки с играми.

```{linenos=false}
- ryujinx
| - games <-- Выбираете это
| | - Prince of Persia the Lost Crown
| | | - .nsp
| | | - DLC
| | | | - .nsp
| | - Another Game
| - ryujinx-1.1.1117
```

### Управление

Вкладка Input. Тут вы увидите, таблицу?

Сверху галочки:

- Docked Mode - назовем это "геймпад мод"
- Keyboard Access - чтобы играть на клавиатуре
- Mouse Access - это мышь, аналогично.

Но по сути это пресеты для пресетов. Если у геймпада вы биндите только левый и правый стик, то на клавиатуре левый/правый стик - верх, низ, лево, право. Включите - посмотрите.

{{< imgs/img width="" caption="Ryujinx - Настройки ввода" alt="Ryujinx - Настройки ввода" src="@img/011-piratim-nintendo-switch-ryujinx-nastroiki-vvoda.avif" >}}

Настраиваем все профили если (уже) собираетесь играть 8-ром, если нет, то только **Player 1**.

Чтобы настроить геймпад возможно понадобится софт. Геймпад может работать из коробки, а может и нет. XBOX должен, так как это Microsoft, как и Windows - если у вас Windows.

С ноунейм китайскими геймпадами ничего не скажу.

Для геймпада DualShock 4\5 (PlayStation) можно использовать [DS4Windows](https://github.com/Ryochan7/DS4Windows?sl).

{{% details/1 "Проблемы с DS4Windows" %}}
Из за ситуации с драйвером ([vigembus](https://github.com/nefarius/ViGEmBus?sl)) который использует DS4Windows, второй прекратит обновления. Если вы читаете эту статью из будущего, то возможно придется искать другой софт.

Есть второй вариант - Steam. Стим может работать с геймпадами, но он насколько мне известно "конвертирует" все в клавиатуру. DS4Windows вроде как, "конвертирует" все в геймпад XBOX. В прочем, через стим я этого не проверял, ни просто, ни эмулятор, только слышал.
{{% /details/1 %}}

Чтобы забиндить кнопки нужно нажать Configure под профилем. Если открылась панель управления самолетом - вы на верном пути.

Не забудьте выбрать устройства в **Input Device**.

{{< imgs/img width="" caption="" alt="Ryujinx - Настройки ввода" src="@img/012-piratim-nintendo-switch.avif" >}}

Все что не кнопки, настраивайте по своему усмотрению. Чтобы забиндить кнопку нажимаем на **Unbound** > Нажимаем кнопку\клавишу на которую хотим сделать бинд:

{{< imgs/img width="" caption="" alt="Ryujinx - Настройки ввода" src="@img/013-piratim-nintendo-switch.avif" >}}

Биндите на что хотите, но желательно, чтобы бинд совпадал с функцией на которую вы биндите (если это геймпад), как на скриншоте выше.

С клавиатурой аналогично, только прибавится несколько доп. биндов (верх, низ, лево, право).

Не забудьте сохранить профиль нажав **Add** сверху справа.

### Графика

Мои настройки:

{{< imgs/img width="" caption="Ryujinx - Настройки графики" alt="Ryujinx - Настройки графики" src="@img/014-piratim-nintendo-switch-ryujinx-nastroiki-grafiki.avif" >}}

Для начала советую поставить что-то по типу этого:

{{< imgs/img width="" caption="Ryujinx - Настройки графики" alt="Ryujinx - Настройки графики" src="@img/015-piratim-nintendo-switch-ryujinx-nastroiki-grafiki.avif" >}}

Экспериментируйте с настройками. Сглаживание вероятней съедает больше всего производительности.

## Лагают игры

Если лагает, не спешите снижать настройки графики и расстраиваться. Лагает, потому что шейдеры компилируются на лету. То есть через сколько-то времени игры, когда все или большинство шейдеров будут скомпилированы, лагать перестанет.

Как вариант где-то скачать шейдеры и подгрузить их. Шейдеры не универсальны, для каждой игры свои шейдеры. Если вы не понимаете о чем речь, то погуглите.
