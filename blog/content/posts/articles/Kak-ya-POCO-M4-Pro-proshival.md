---
draft: false
url: "how-flash-poco-m4-pro-fleur" # slug
title: "Как я POCO M4 Pro прошивал"
description: "Расскажу как я разблокировал загрузчик HyperOS и MIUI, устанавливал TWRP и прошивал кастомный ROM на POCO M4 Pro a.k.a Fleur."
summary: "Расскажу как я разблокировал загрузчик HyperOS и MIUI, устанавливал TWRP и прошивал кастомный ROM на POCO M4 Pro a.k.a Fleur."
date: 2025-06-04
lastmod: 2025-09-24
categories: ["Long Read", "System"] # ["cat 1", "cat 2"]
tags: ["Android"] # ['tag 1', 'tag 2']
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
  image: "@img/how-flash-poco-m4-pro-fleur-cover.webp" # image path/url
  width: "1580" # only for img from url; EX: 1920
  height: "961" # only for img from url; EX: 1080
  alt: "Как я POCO M4 Pro прошивал - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: false # only hide on current single page
---

{{< details/1 "Дисклеймер/Ахтунг" open >}}
{{< ahtung/1 >}}
{{< ahtung/2 >}}
{{< /details/1 >}}

> Лэй Цзюнь - отс*си 🖕

<!-- --- -->

## Вступление

Что мы имеем:

POCO M4 Pro 4G на A13 и HyperOS 1.0.8.0, не китайский.

Китайскую версию прошивки говорят прошить нельзя, так как невозможно разблокировать загрузчик, но есть какие-то платные способы, но я в этом не разбирался.

Мой путь начался в этом прекрасном [треде](https://xdaforums.com/t/updated-custom-rom-list-for-redmi-note-11s-4g-poco-m4-pro-4g-fleur.4658349/?sl) со списком прошивок на xda, перетек [сюда](https://xdaforums.com/t/guide-install-custom-rom-on-fleur-device.4606709/?sl), далее [сюда](https://xdaforums.com/t/mtk-unlock-bootloader-without-waiting-a-week.4523431/?sl). А так же я побывал [здесь](https://xdaforums.com/t/root-poco-m4-pro-4g-fleur-using-magisk.4449193/#post-86965237?sl), [тут](https://xdaforums.com/t/unlock-bootloader-redmi-note-11s.4431675/), [там](https://github.com/bkerler/mtkclient?sl) и вот [здесь вот](https://github.com/MlgmXyysd/Xiaomi-HyperOS-BootLoader-Bypass?sl), а закончился мой путь в этом [треде](https://xdaforums.com/t/hypersploit-bypass-hyperos-bootloader-unlocking-restrictions.4668775/?sl).

Вкратце, не берите *первые попавшиеся* Xiaomi/POCO в надежде что прошьете. А если берете, то сначала посмотрите есть ли актуальные ROM на вашу модель, и если есть и вы взяли, НЕ обновляйте телефон, так шансов провернуть этот финт будет выше.

{{< callout/note >}}
Если вы оказались тут не по причине разблокировки и прошивки этого телефона, а еще в процессе решения, еще ничего не приобрели и думаете что взять -- настоятельно рекомендую ознакомиться с [этим](https://github.com/melontini/bootloader-unlock-wall-of-shame?sl).

В этом списке указаны бренды телефонов у которых сложно разблокировать загрузчик, невозможно, и рекомендуемые бренды у которых это сделать можно и просто.
{{< /callout/note >}}

## История

Чтобы прошить, нужно разблокировать загрузчик, история стара как мир.

Чтобы разблокировать загрузчик, мне понадобилось:

- Эл. почта
- Номер телефона
- Xiaomi аккаунт
- Рабочая сим-карта с рабочим моб. интернетом
- Слить все эти данные китайцам
- 7 дней терпения

Аккаунт должен быть зарегистрирован минимум 30 дней, чтобы появилась возможность "запросить" разблокировку загрузчика.

7 дней нужно ждать после запроса на разблокировку.

Немного забегая вперед, мне повезло, у меня уже был Xiaomi аккаунт, поэтому в моем случае ждать надо было только 7 дней.

К аккаунту не было привязано номера телефона, так как на многих этапах просило привязать, пришлось привязывать, но мне не приходил код подтверждения.

Спустя часа попыток код пришел, я радостный пошел в настройки разработчика разблокировать загрузчик. Но появилась ошибка и меня послали ~~нах\*й~~ в приложение Xiaomi Community.

Скачал, залогинился. К слову, единственный способ залогинится в приложение, только дав разрешение на управление вызовами (звонилкой), это разрешение нужно чтобы приложение подхватило ваш Xiaomi аккаунт, по-другому никак :)

В приложение, где-то нужно было нажать на "Unlock bootloader", но разумеется такой опции не было. Чтобы она появилась нужно [сменить регион](https://www.reddit.com/r/PocoPhones/comments/1d3kwcq/unlock_bootloader_option_not_showing_in_mi/?sl) на Global в приложение, благо это делается за пару тыков.

Нажал на разблокировку, и... Меня ~~снова~~ послали ~~нах\*й~~ на сайт для скачивания [Mi Unlock Tool](https://en.miui.com/unlock/index.html?nt) (официально от Xiaomi, только Windows).

Скачал эту утилиту, в которой после перезапуска нужно каждый раз входить в аккаунт. Появилось сообщение на англ. яз. но с китайскими корнями:

![Mi Unlock Tool](@img/mi-unlock-tool.avif)

Сообщение вероятно пыталось уведомить о том что вышла новая версия. Я решил обновить, может быть исправился бы кривой user experience. Китайские корни вероятно означали "Да". Я нажал и попал на:

{{< imgs/img
width=""
caption="Смешно? <i>Утилиту я так и не обновил.</i>"
alt="Access Denied download Mi Unlock Update"
src="@img/access-denied-download-mi-unlock-update.avif" >}}

В этом прекрасном приложении я пытался создать Xiaomi аккаунт (до того как обнаружил что он у меня уже есть) и привязать номер телефона.

Аккаунт создать не получилось, не работала капча. Создал на сайте, после входа в утилиту спросило номер телефона, но кривой интерфейс не дал мне выбрать код страны. Окно растянуть нельзя, там где код страны выбирать не скролится, поиск не кликался, чтобы в поиске страну ввести.

Какой-то список с `pointer-events: none;` подумал я и решил привяжу на сайте, но не приходил код, думал такая проблема только на сайте (нет).

Пришлось входить в аккаунт и привязывать номер телефона на мобиле, тогда то я и обнаружил что аккаунт у меня уже был, и нужно было только номер привязать, об этом было выше.

Вошел в аккаунт в Mi Unlock Tool через qr code (справа сверху), разрешил разблокировку загрузчика, вернулся в Xiaomi Community и ~~меня послали нах\*й~~  показали ошибку, так как квота кончилась.

Вот беда, есть квота... Квота на запросы разблокировки загрузчика, ~~ах\*еть~~ прекрасное решение.

На форумах почитал, что это почти нереально, люди пробовали в 00:00 по пекинскому времени отправлять запрос и все равно получали сообщения о квоте.

Квота на запрос на разблокировку не только для *меня*, она для всех. Что-то по типу X человек в день по пекинскому времени, а человек много, да и X это сколько никто не знал. Но кто-то предположил что X = 1, 1 человек в день, похоже на правду.

Видел шутку, что все это скам, чтобы слить кучу данных китайцам, а потом сидеть с вечной ошибкой и угрюмой физиономией.

Пришлось "абузить", так как у меня HyperOS, а не MIUI, отлично сработал [HyperSploit](https://github.com/TheAirBlow/HyperSploit/?sl) ([xda](https://xdaforums.com/t/hypersploit-bypass-hyperos-bootloader-unlocking-restrictions.4668775/?sl)). Запрос был как-будто бы отправлен, осталось ждать.

7 дней спустя...

![Mi Unlock Tool Success unlock bootloader](@img/mi-unlock-tool-success-unlock-bootloader.avif)

После нажатия на кнопку "Reboot", мобила очень долго стартовала сначала на POCO logo, потом на HyperOS logo, поэтому не бойтесь, вероятно так и должно быть.

Казалось как бы все, можно шить на кастомный ROM, но я решил не рисковать и сначала [прошить **стоковый рекомендуемый** ROM](https://xdaforums.com/t/go-back-to-miui-2-methods.4594535/?sl), как это и было указано в листе с прошивками.

Прошить на MIUI было просто, я использовал [2й метод](https://xdaforums.com/t/go-back-to-miui-2-methods.4594535/?sl) с использованием MiFlash, после прошивки загрузчик заблокировался. Но это не проблема, это MIUI и я [разблокировал](https://xdaforums.com/t/mtk-unlock-bootloader-without-waiting-a-week.4523431/?sl) его буквально за 5 секунд.

Ну, а остальное за малым, [установить recovery](https://xdaforums.com/t/list-of-custom-recoveries-for-fleur.4593591/?sl) (если нужно) и прошивку - готово.

Установить [TWRP](https://twrp.me/xiaomi/xiaomi_pocom4pro_redminote11s.html?sl) тоже было просто. Осталось прошить.

Я хотел использовать OTG флешку, но она оказалась micro-usb, я пробовал переходник usb - type-c, с новой и старой флешкой (2.0 & 3.0), не сработало.

Пришлось расчехлять SD карту, переходник для SD карты и кард ридер. Оно так потому что я захотел перекинуть ROM на SD карту с ПК через USB. У вас два пути, сделать как я или вставить SD карту туда куда ее можно вставить.

Сделал wipe, прошил, все абсолютно без проблем.

К сожалению вы наверняка в любом случае увидите не красивое POCO/Mi Logo, но после небольшого ожидания вас встретит красивое лого вашей кастомной прошивки.

## Краткий гайд

{{< callout/note >}}
Этот гайд краток, потому что рассчитан на людей которые знают что делают + вся информация есть по ссылкам и в архиве (зачем ее дублировать?), здесь не будет мелких деталей и подробностей.
{{< /callout/note >}}

### Что нужно / Что понадобится

- [USB Android driver](https://developer.android.com/studio/run/win-usb?nt)
- [Platform tools (ADB & Fastboot)](https://developer.android.com/tools/releases/platform-tools?nt)
  - Можно добавить в переменные среды или использовать на месте.
- Разблокированный загрузчик
- SD карта/[Настоящая OTG флешка](https://www.google.com/search?q=otg+usb+stick?nt)
  - Переходники вероятно не сработают.
- [ROM](https://xdaforums.com/t/updated-custom-rom-list-for-redmi-note-11s-4g-poco-m4-pro-4g-fleur.4658349/?sl)
- [Recovery](https://xdaforums.com/t/list-of-custom-recoveries-for-fleur.4593591/?sl)
  - Советую TWRP.
- [Прошивка MIUI с возможностью прошивки](https://xdaforums.com/t/go-back-to-miui-2-methods.4594535/?sl)
  - См. требования у нужной вам прошивки.

Возможно понадобится:

- Аккаунт Xiaomi
  - Эл. почта на доверенном домене (например gmail)
  - Номер телефона
- Рабочая сим-карта с рабочим моб. интернетом
- [MiFlash](https://xdaforums.com/t/go-back-to-miui-2-methods.4594535/?sl)
- [Mi Unlock Tool](https://en.miui.com/unlock/index.html?nt)

> *Нехило, да?*

Все утилиты, текстовые гайды, включая этот, вы можете скачать [здесь](https://disk.yandex.ru/d/hhYldHI3ppqJuQ?nt).

{{< callout/note >}}
Не качайте архив без уважительной причины. Если что-то удалено, ссылка не работает, вы не можете найти это в другом надежном месте, у вас какая-то другая причина или очень хочется, качайте.

В остальных случаях, это просто не нужно, все есть по ссылкам.
{{< /callout/note >}}

### Разблокировка загрузчика

#### MIUI

Качаем "BootloaderUnlock" [здесь](https://xdaforums.com/t/mtk-unlock-bootloader-without-waiting-a-week.4523431/?sl).

- Установить UsbDk_1.0.22_x64.msi или x86 (это драйвер)
- Запустить "UnlockBootloader.bat"
- Выключить телефон
- Зажать Громкость+ и -
- Подключить телефон к ПК.
- Подождать

Когда терминал закроется, значит процесс завершился, и загрузчик должен быть разблокирован.

Да, это работает без какого-либо ожидания и аккаунтов.

#### HyperOS

Метод для MIUI, формально работает, ошибок нет, но фактически загрузчик не разблокируется.

Нужен Xiaomi аккаунт зарегистрированный мин. 30дн, с подтвержденным номером телефона и рабочая сим-карта с моб. интернетом.

Если все условия выполнены запускаем [утилиту](https://github.com/TheAirBlow/HyperSploit/?sl) ([xda](https://xdaforums.com/t/hypersploit-bypass-hyperos-bootloader-unlocking-restrictions.4668775/?sl)) и следуем инструкции в терминале.

Если это не сработает, скачайте Xiaomi Community, смените регион на Global, запросите разблокировку загрузчика и повторите. Если запросить не получилось, попробуйте через Mi Unlock Tool.

После использования утилиты и следованию инструкции в терминале, "запрос будет запрошен" в обход квоты.

Как сообщает автор, после этих действий, лучше пользоваться телефоном как обычно, не вынимать сим-карту, не выходить и не входить в Xiaomi аккаунт и не пытаться прошить чтобы не сбить время.

##### Как проверить сколько еще ждать

Отсчет в 7 дней работает не в телефоне, а привязан к аккаунту к конкретному телефону. Если вы зайдете в "этот" Xiaomi аккаунт на **другом устройстве** (телефон, планшет, мб еще что-то), вероятно отсчет сбросится.

Можно снова запустить Mi Unlock Tool, зайти в аккаунт (это ничего не сбросит) и нажать "Unlock", у вас либо будет ошибка и указано кол-во оставшихся часов, либо если 168 часов прошло, вы разблокируете загрузчик с удалением всех данных **без подтверждения**, имейте это ввиду.

### Прошивка (TWRP)

Прошивка прошивается либо через adb, либо recovery.

Я [прошивал MIUI](https://xdaforums.com/t/go-back-to-miui-2-methods.4594535/?sl) используя MiFlash, использовал platform-tools для TWRP, и TWRP для установки самой прошивки. Подробный [гайд](https://xdaforums.com/t/guide-install-custom-rom-on-fleur-device.4606709/?sl).

Очень кратко:

``` {linenos=false}
adb reboot bootloader
```

- В режиме fastboot (bootloader):

``` {linenos=false}
fastboot flash boot twrp.img
```

``` {linenos=false}
fastboot reboot
``` 

- В TWRP:
	- WIPE => Format data
	- Install => прошивка
	- Reboot => System

После прошивки (на ваше усмотрение) можно очистить dalvik, обычно это рекомендуется делать при установки *другой* прошивки или обновление.

Так же можно сделать Advanced => Flash current TWRP, чтобы TWRP остался на телефоне. Это нужно делать каждый раз после wipe => format data.

{{< callout/hint >}}
Если вы каждый раз загружаетесь в TWRP, смените "Slot".
{{< /callout/hint >}}
