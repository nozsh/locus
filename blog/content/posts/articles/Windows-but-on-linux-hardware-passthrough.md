---
draft: false
# url: "" # slug
title: "Windows, но... в Linux: Hardware Passthrough"
description: "Зачем выбирать между Windows и Linux? Когда можно и то и другое."
summary: "Зачем выбирать между Windows и Linux? Когда можно и то и другое."
date: 2026-07-14
lastmod: 2026-11-01
categories: ["Long Read", "System"] # ["cat 1", "cat 2"]
tags: ["Linux", "V12N", "KVM"] # ['tag 1', 'tag 2']
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
math: true
remoteCode: true
byai: true
cover:
  image: "@img/cover.windows-but-on-linux-hardware-passthrough.webp" # image url
  width: "1850" # only for img from url; EX: 1920
  height: "1110" # only for img from url; EX: 1080
  alt: "Windows, но... в Linux: Hardware Passthrough - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  # hidden: true # only hide on current single page
---

{{% details/1 "📜 Изменения" %}}
- 01 нояб. 2026:
  - Добавлено:
    - [Больше бенчмарков](#итоги--бенчмарки)

{{% details/1 "2026 Октябрь" %}}
- 28 окт. 2026
  - Обновлено:
    - Доп. информация про [Зависание при выключение/перезагрузки VM и 100% CPU](#зависание-при-выключениеперезагрузки-vm-и-100-cpu)
  - Добавлено:
    - [Проблема X в Windows из-за Y](#проблема-x-в-windows-из-за-y)
- 15 окт. 2026
  - Обновлено:
    - [Периферия -- Звук](#периферия--звук)
{{% /details/1 %}}

{{% details/1 "2026 Июль-Август" %}}
- 21 авг. 2026
  - Добавлено:
    - [Проброс дополнительных устройств в VM](#проброс-дополнительных-устройств-в-vm)
- 20 июл. 2026
  - Обновлено:
    - Доп. информация про [TPM](#создание-виртуальной-машины)
  - Добавлено:
    - [Как обновлять QEMU/KVM](#как-обновлять-qemukvm)
    - [udev симлинки (объединение устройств в одно)](#udev-симлинки-объединение-устройств-в-одно)
{{% /details/1 %}}
{{% /details/1 %}}

{{% details/1 "📝 Дисклеймеры / Информация" %}}
{{< callout/custom "🧠" "#fff" "#8BC6EC" "linear-gradient(90deg, #00416A 0%, #0F383D 100%)" >}}
**Про ИИ.**

Да, я использовал ИИ, и нет, ИИ не писал этот текст.

Текст написан от и до --- мной.

ИИ использовался для поиска и проверки информации, а также написания скриптов. Но с одним ключевым нюансом -- я понимаю что я делаю (ну, почти), а не бездумно копирую и вставляю.

Это **НЕ** компиляция информации, это ровно то, что я сделал у себя.
{{< /callout/custom >}}

{{< callout/custom "👀" "#fff" "#000851" "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)" >}}
Это довольно сложная тема, и сделать так, чтобы работало у всех... я не знаю, как.

То, что вы тут прочитаете это одна конкретная тропинка, _одна_, но я их прошел _десятки_, перепробовал **ОЧЕНЬ** много всего. Поэтому вам нужны хотя бы базовые знания.

Это длинный текст, тут полно команд и скриптов. Я все это делал и одновременно писал и описывал это, и далеко не один день.

Если вы найдете тут ошибку, у вас что-то не будет работать хотя **ТОЧНО** должно работать -- [свяжитесь](/contact) со мной.

Если у вас возникнут проблемы с XML, то вот [мой полный XML файл](https://github.com/nozsh/vfio/blob/main/qemu-xml/full.xml?sl).

<small>_Другое железо (не описанное здесь), другой дистрибутив, другое окружение/WM, что-то еще другое --- не повод писать. Хотя... я возможно посмотрю._</small>
{{< /callout/custom >}}
{{% /details/1 %}}

## Предисловие

Если вы тут оказались, то:

1. Вас сюда послали *(не завидую вам)*
2. Вы знаете, о чем речь

Но если вдруг ни то ни другое, для тех, кто не знает, что такое VFIO, поясню.

[VFIO (Virtual Function I/O)](https://docs.kernel.org/driver-api/vfio.html?sl) --- это фреймворк/драйвер ядра Linux, обеспечивающий безопасный прямой доступ к аппаратному обеспечению из пространства пользователя. Если простыми словами, это способ передать деталь ПК напрямую внутрь виртуальной машины, то есть PCI-passthrough. *Ну что такое PCI-то объяснять не надо, так?*

И о чем же речь? Скажем, вот у вас Windows, на Windows вы например играете в игры. Windows использует ваше железо, пусть будет видеокарта. И использует хорошо, потому что работает с видеокартой напрямую. Но что если вы **не** хотите использовать Windows, а хотите Linux, и по какой-то причине, не хотите запускать игры на Linux или хотите запускать игры на Windows; или вам нужен Adobe, CAD и др.

Очевидное решение dual-boot! *Штоб его черт побрал.* Это не круто, это не интересно, это медленно.

Другое очевидное решение -- виртуализация. Установить виртуальную машину с Windows в Linux. Но тогда проблема, виртуализация:

```{linenos=false}
HOST (Linux) [железка]
        ↓
гипервизор/паравиртуализация (VirtIO)
        ↓
GUEST (Windows) [вирт. железка]
```

Это такой них\*евый слой жира между железкой и ОС (с VirtIO слой потоньше), I/O (Input/Output) в дерьме, мы в дерьме, все лагает. *Не хорошо.*

Для этого и существует VFIO, но оно мутировало из какой-то там технологии в уже категорию/топик, что может затрагивать не только сам по себе VFIO по определению, а нечто большее, о чем и будет тут речь. Вот и получается:

```{linenos=false}
HOST (Linux) [железка (была тут)]
        ↓
GUEST (Windows) [железка (стала тут)]
```

*Круто, да?*

---

В этом тексте я покажу, как я настроил KVM на Linux openSUSE Tumbleweed от и до + доп. фичи (Quality-of-Life). Из главного это разумеется проброс и/или эффективное использование:

- SSD
- GPU
- CPU
- RAM

В самом начале, имейте в виду, у меня есть iGPU и dGPU и текст писался именно под такой сценарий. Если у вас нет двух GPU, iGPU + dGPU или dGPU + dGPU, вам этот текст не подойдет. И читать его стоит в таком случае, разве что ради общего развития и скриптов.

Ну и важно упомянуть, если вы это читаете с четким намерением и хотением сделать это, то вероятно вы морально готовы к этому, и у вас есть железо. Разумеется слабое железо будет не очень, но чисто технически чтобы сделать, конкретно в данном случае, решает не мощь, а количество -- много ОЗУ, ядер и в идеале отдельный диск.

НЕ наличие второй GPU в данном тексте не обсуждается, там совершенно другой подход, потому что с ОДНОЙ GPU вы "используете" ЛИБО хост, ЛИБО гость, а в данном тексте расчет на и то, и другое, одновременно.

{{< callout/warn >}}
В тексте описывается AMD CPU + NVIDIA GPU, если у вас процессор Intel -- проблем не возникнет, там мало отличий и я их указал. Но если у вас AMD GPU, то вам придется думать, думать и гуглить, потому что у меня нету AMD GPU чтобы проверить, что и как, чтобы сказать точно, как надо.
{{< /callout/warn >}}

Итак. Я выбрал openSUSE Tumbleweed + KDE Plasma. _Почему?_ Нам нужны самые новые релизы всего и вся -- rolling-release схема, чтобы сделать этот трюк с виртуалкой с производительностью 1:1 к голому железу. Debian и прочие LTS дистрибутивы _не очень_ подходят.

Очевидный вариант -- это Arch.{{% callout/inline hyphens %}}![I use Arch btw](@loose/img/memes/i-use-arch-btw-1.cropped.avif){{% /callout/inline %}} Разработчик выкатил апдейт софта -- вы его установили, то что надо. Но из-за этого Arch часто ломается, и приходится мониторить [новостную ленту](https://archlinux.org/news/?sl) обновлений на предмет "а не сломается ли моя система после апдейта и что я должен сделать руками", *не круто*.

Есть Void, это как Arch, только обновления автоматически тестируются, вероятность, что система ляжет после обновления сильно меньше. Но Void использует runit вместо systemd, для кого-то это плюс, но systemd мегапопулярен, все делается под него, вам оно надо учитывая сложность темы? Ну и еще я слышал там в основном старье/скудные репозитории, все новое нужно собирать ручками.

И третий вариант --- openSUSE Tumbleweed,{{% callout/inline hyphens %}}![Arch for fun, openSUSE for work](@loose/img/memes/animated.feel-me-think-about-it-1.avif){{% /callout/inline %}} это как Void, но с systemd и новейшим софтом, а также встроенным GUI приложением YaST через которое можно настроить систему и установить KVM буквально в один клик.

Ну, а KDE Plasma, потому что она самая навороченная и простая. На первое время + тестов -- самое оно. *На момент написания этого текста только в KDE Plasma нормально работает 4K HDR 320 Hz, или типа того, возможно кому-то это важно.*

И **все-все** будет описано, сказано и показано **в контексте Tumbleweed и KDE Plasma**. Потому если у вас другие distro/DE/WM и вы вообще не шарите за Linux и ни разу с этим чудом не еб\*лись -- не делайте этого, по крайней мере на своей рабочей ОС.

Если же вы шарите, и у вас **НЕ** KDE Plasma **ИЛИ** вас интересует исключительно холодный проброс dGPU -- прочтите [это](#мигает-экран-и-не-запускается-vm-после-обновления-ос-kde-plasma).

## Введение

{{% details/1 "Про мониторы" %}}
Подумайте о том, как будете смотреть на Windows. Есть конечно Looking Glass, и я даже покажу, как его настроить, но для игр, особенно экшен игр, это ужасно + оверхед dGPU. В моем случае 2 монитора (оба FULLHD):

Хост:

- Основной -- HDMI 1.4
- Второй -- DP

Гость:

- Основной -- DP
- Второй -- HDMI 1.4

То есть перекрестное подключение, а такое оно из-за недостатка входов как на мониторах так и на материнки, будь моя воля, я бы все втыкнул в DP.

Версию HDMI я написал не просто так, у меня 1.4, а это максимум 120 Hz (хоть и программно), в то время как у моего основного монитора 144 Hz.

Логика #1, максимально проста и логична: Делаем основной монитор хоста в DP, в работе я увижу все 144 Hz, а вот то, что в играх будет 144 FPS, я очень сомневаюсь, и поэтому для гостя HDMI на 120 Hz.

Именно так я изначально и сделал, забыв, что NVIDIA не работает с FreeSync, G-Sync и прочими Sync с HDMI <2.1 и то криво, насколько мне известно.

Поэтому, Логика #2: Наоборот, хост не такой гладкий, да, но разница 120 vs 144 не особо заметна, как например 60 vs 75, но при этом все Sync работают с NVIDIA через DP.
{{% /details/1 %}}

---

В BIOS, он же UEFI Firmware нужно, разумеется, включить аппаратную виртуализацию вашего процессора и IOMMU. Как это сделать [гуглите](https://www.google.com/search?q=how+to+enable+cpu+virtualization+and+iommu+in+bios?nt) для своего процессора и для своего производителя мат. платы, тут у каждого по-своему.

Также включение IOMMU в ОС (**не** заменяет настройки BIOS):

YaST --> System --> Boot Loader в конец добавить: `amd_iommu=force_isolation iommu=pt`. Если у вас Intel, то вместо `amd_iommu=force_isolation` --> `intel_iommu=on`.

Перезагрузиться.

Проверить параметры и включен ли IOMMU:

```bash {linenos=false}
sudo sh -c 'dmesg | grep -i iommu && echo && dmesg | grep -E "Intel-IOMMU|AMD-Vi"'
```

Узнать, выиграли ли вы в лотерею, можно:

```bash {linenos=false}
sh -c 'for g in $(find /sys/kernel/iommu_groups/* -maxdepth 0 -type d | sort -V); do echo "IOMMU Group ${g##*/}:"; for d in $(ls -1 $g/devices); do lspci -nns $d; done; echo; done'
```

Если каждая железка, ну или только те железки, что вам нужны для проброса в отдельной IOMMU группе -- вам повезло. А именно, это нужный SSD и нужная GPU, ну и другое по желанию, что вам нужно. Если нет, то придется применить ACS patch _(я опишу это, когда у меня будет достаточно информации)_.

Про SSD может быть такое, что у вас скажем 3 слота SSD, но 2 из них в одной группе, а 1 в отдельной, _уже знаете, что делать, ведь так?_

## Виртуализация

YaST --> Virtualization --> Install Hypervisor and Tools - KVM server и KVM tools.

Если при установке YaST предложит создать мост, соглашайтесь, если ошибка -- значения не имеет.

После установки проверьте:

```bash {linenos=false}
sudo systemctl status virtqemud
```

А также добавляемся в группы:

```bash {linenos=false}
sudo usermod -aG libvirt,kvm $(whoami)
```

Это нужно, чтобы потом иметь возможность пробросить PCI устройства, а также запинить ядра процессора, сделать hugepages, ну и другое.

Перезагружаемся, проверить, что вы в группе, можно:

```bash {linenos=false}
groups && grep -E 'libvirt|kvm' /etc/group
```

А также для W11:

```bash {linenos=false}
ls /usr/share/qemu/ovmf*
```

Должен быть `/usr/share/qemu/ovmf-x86_64-smm-ms-code.bin`, это SMM + Secure Boot.

## Создание виртуальной машины

Открываем Virtual Machine Manager и создаем новую виртуалку, Local install media (ISO), да, у вас должен быть образ Windows. RAM/CPU что угодно, сейчас неважно. Storage - тут важно, убрать галочку с Enable storage for this VM. И ВАЖНО поставить галочку Customize configuration before install.

Если "Virtual Network is not active" -- `sudo virsh net-autostart default` и нажмите "Yes".

Overview:

- Chipset: Q35
- Firmware: `/usr/share/qemu/ovmf-x86_64-smm-ms-code.bin`

CPU:

- Copy host CPU configuration (host-passthrough)

Add Hardware --> TPM. Вот тут **притормозим**. У вас есть два варианта, либо passthrough, либо нет. Есть ли какие-то минусы-плюсы пробрасывать TPM? Ну, в жизни обычного человека -- нету.

Passthrough это синоним эксклюзивного доступа, а TPM один. Из-за чего могут появляться ошибки, ну например, запускаете виртуалку, все работает, выключаете виртуалку, запускаете снова, и тут как повезет:

- Запустится
- `'/dev/fdset/0' is not a TPM device` -- лечится перезагрузкой хоста, _не круто_

Проверить используется ли TPM хостом можно так:

```bash {linenos=false}
sudo journalctl -k -b 0 | grep -i "ima\|tpm"
```

Если наблюдаете _некоторую активность_ (больше пары строк после загрузки ОС и некоторой работы), то оно используется хостом.

Если вы хотите пойти на риск или TPM не используется хостом, то почему бы и нет:

- Type: Passthrough
- Model: CRB (только 2.0) / TIS
- Version: CRB - 2.0 / TIS - 2.0/1.2

Если же нет, то лучше эмулировать:

- Type: Emulated
- Model: если есть поддержка TPM 2.0 - CRB, иначе - TIS
- Version: CRB - 2.0 / TIS - 2.0/1.2

_Если у вас два TPM в списке, удалите тот, что вы не создавали._

## Проброс диска

Есть два способа пробросить диск. Универсальный и если вам повезло с IOMMU группами -- VFIO.

Проверьте IOMMU группы:

```bash {linenos=false}
sh -c 'for g in $(find /sys/kernel/iommu_groups/* -maxdepth 0 -type d | sort -V); do echo "IOMMU Group ${g##*/}:"; for d in $(ls -1 $g/devices); do lspci -nns $d; done; echo; done'
```

Если видите что-то такое:

```
IOMMU Group 24:
04:08.0 PCI bridge [0604]: Advanced Micro Devices, Inc. [AMD] 600 Series Chipset PCIe Switch Downstream Port [1022:43f5] (rev 01)
0d:00.0 Non-Volatile memory controller [0108]: Kingston Technology Company, Inc. KC3000/FURY Renegade NVMe SSD [E18] [2646:5013] (rev 01)
```

Или такое:

```
IOMMU Group 27:
10:00.0 Non-Volatile memory controller [0108]: Samsung Electronics Co Ltd NVMe SSD Controller SM981/PM981/PM983 [144d:a808]
```

И все, если в этой группе больше НИЧЕГО нету, вам очень повезло, вы можете пробросить диск самым прямым способом.

В первом случае в группе вместе с диском находится и его мост, такое можно смело пробрасывать, но если там скажем парочка USB, еще один диск, сетевая карта или еще что, то нет, не надо так делать.

Универсальный это через VirtIO драйвер, он не плохой, но задержки больше, потеряете около 3-5% линейной скорости (запись/перемещение файлов), и чуть больше потерь на рандомной записи/чтения (видеомонтаж, рендер, игры и тп.) в сравнении с голым железом.

Также вы можете попробовать сначала одно, потом другое, без пересоздания виртуалки и переустановки Windows, все будет работать.

Делаем:

```bash {linenos=false}
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,MODEL
```

Вывод:

```bash
NAME              SIZE TYPE MOUNTPOINT MODEL
nvme1n1           1.9T disk            KINGSTON SKC3000D2048G
├─nvme1n1p1        16M part
└─nvme1n1p2       1.9T part
...
```

Проверяем наличие нужного диска и отсутствие точек монтирования.

Далее:

```bash {linenos=false}
ls -la /dev/disk/by-id/ | grep nvme1n1
```

Нам нужно типа такого `nvme-KINGSTON_SKC3000D2048G_xxxx`, без `_x` или `-x`. Записываем это.

Так мы узнали серийник диска, он нужен, чтобы привязать диск по серийнику (VirtIO), а не по имени. В Linux какой первый диск инициализируется, тот первым и будет. Это значит, то, что вы укажите в настройках виртуалки, после перезагрузки хоста может поменяться, [по серийнику не поменяется](https://www.reddit.com/r/VFIO/comments/1mus1j0/i_have_nuked_my_host_os_in_most_cursed_way/?nt).

### VirtIO (универсально)

Качаем virtio-win [драйвер](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/stable-virtio/virtio-win.iso). Он нужен, чтобы Windows могла увидеть этот ваш диск.

Тыкаем Add Hardware --> Storage:

- Select or create custom storage
- Device type: Disk device
- Bus type: VirtIO
- Manage --> `/dev/disk/by-id/nvme-KINGSTON_SKC3000D2048G_xxxx` (см. выше)
- Advanced options:
  - Cache mode: none
  - Discard mode: unmap

Снова Add Hardware --> Storage:

- Device type: CDROM
- virtio-win.iso

### VFIO

Если вы еще не устанавливали Windows, то пропускаем этот шаг, если уже установили, но хотите VFIO, то загружайтесь в Windows, открываете терминал от имени админа:

```bash {linenos=false}
bcdedit /set {current} safeboot minimal
```

Выключаете виртуалку и удаляете текущий VirtIO диск.

---

Add Hardware --> PCI Host Device, тут надо найти нужный SSD, да это будет чуточку проблематично, но как найдете, тыкаете на него и Finish. Отныне он будет отображаться не как диск, а как "PCI ID" в левой панели, не теряйте.

{{< callout/warn >}}
**ВНИМАНИЕ!** Это **НЕ ID диска**, **НЕ** его серийник, это ID слота PCI.

Если вы переставите диск в другой слот, то нужно будет снова его добавлять.

Но что более **ВАЖНО**, если вы на его место поставите другой диск, он автоматически пробросится (если не делали изоляцию -- _то автоматически не пробросится,_ только при запуске виртуалки). То есть, если вы поменяете его местами, скажем, с системным диском хоста, будет грустно.

**Перед такими делами удалите диск из виртуалки, а потом добавьте снова!**
{{< /callout/warn >}}

Идем в Boot Options и там выбираем тот самый "PCI ID". Все. Было просто, да?

Windows должна загрузиться в безопасный режим,{{% callout/inline hyphens %}}В безопасный режим желательно входить, когда меняется системный диск, диск тот же, но для Windows был Red Hat, стал не Red Hat -- смена диска.{{% /callout/inline %}} выходим из безопасного режима:

```bash {linenos=false}
bcdedit /deletevalue {current} safeboot
```

Теперь в диспетчере задач в Performance вы увидите не Red Hat че-то там, а прям свой диск.

Так как изоляцию мы не делали, проброс динамический, когда виртуалка выключена -- хост видит диск, когда включена -- хост не видит диск. Делать изоляцию смысла особо нету, это ничего не прибавит. Но если вдруг система решит что-то сделать с диском в момент запуска виртуалки, то в худшем случае будет kernel panic :D

Но это не так важно, ничего не сломается. Самое главное, чтобы диск не был примонтирован во время запуска виртуалки, иначе ФС может быть разрушена :\)

Когда диск УЖЕ будет в виртуалке, хост ничего с ним не сделает (только если вы не балуйтесь вкл/выкл виртуалкой как светом в комнате). Если вы все-таки хотите его изолировать, то см. [Про проброс VFIO](#про-проброс-vfio).

Вот небольшое сравнение скоростей:

- Голый метал: 6500/6300
- VirtIO: 6300/6100
- VFIO: 6420/6330

## Установка Windows

Если вы делали VirtIO диск, то на этапе установки Windows, конкретно выбора диска, вас постигнет ужас, но вы не бойтесь, тыкайте на Load Driver --> "virtio-win\viostor\w11\amd64" и установите это. Ну, а дальше как обычно.

{{< callout/note >}}
Во время установки, когда снова будет просить белым по черному что-то нажать -- ничего не нажимайте, а то снова уйдете в установщик Windows.
{{< /callout/note >}}

После установки ОС, VirtIO & Windows ISO можно удалить из девайсов, они больше не нужны.

А еще небольшой спойлер, хоть это и не по теме, все равно проверьте [Проблема X в Windows из-за Y](#проблема-x-в-windows-из-за-y)!

## Периферия -- Клавиатура и мышь

Рано или поздно это нужно было бы решить, и по-уму -- evdev passthrough.

Ищем нужные устройства (нужны `mouse` и `kbd`):

```bash {linenos=false}
ls /dev/input/by-id/ | grep event
```

В моем случае `usb-COMPANY_USB_Device-if01-event-mouse` и `usb-I-CHIP_MMD_KM40_Receiver_1234-event-kbd`.

Проверить что устройство нужное можно так:

```bash {linenos=false}
sudo evtest /dev/input/by-id/usb-COMPANY_USB_Device-if01-event-mouse
```

И так же для клавиатуры. По нажимать кнопки/клавиши/поводить мышью, если видите тонну лога то это оно.

Добавляем устройства в cgroup_device_acl (придется поискать и изменить, или просто добавить свое -- обычно оно все закомментировано по умолчанию):

```bash {linenos=false}
sudo nano /etc/libvirt/qemu.conf
```

```bash
cgroup_device_acl = [
  "/dev/null", "/dev/full", "/dev/zero",
  "/dev/random", "/dev/urandom", "/dev/ptmx",
  "/dev/kvm", "/dev/rtc", "/dev/hpet",
  "/dev/input/by-id/usb-COMPANY_USB_Device-if01-event-mouse",
  "/dev/input/by-id/usb-I-CHIP_MMD_KM40_Receiver_1234-event-kbd"
]
```

```bash {linenos=false}
sudo sh -c 'systemctl restart virtqemud && systemctl status virtqemud'
```

В Virtual Machine Manager --> Edit --> Preferences: Enable XML editing.

Открываем настройки виртуалки, в Overview переходим на XML, в конце ищем `</devices>` и внутрь тега добавляем:

```bash
<input type='evdev'>
  <source dev='/dev/input/by-id/usb-COMPANY_USB_Device-if01-event-mouse'/>
</input>
<input type='evdev'>
  <source dev='/dev/input/by-id/usb-I-CHIP_MMD_KM40_Receiver_1234-event-kbd' grab='all' repeat='on'/>
</input>
```

Применяем, текст "пропадет", но он не пропал, он просто переместился повыше. При запуске виртуалки ввод с хоста сразу же пропадет и уйдет в виртуалку. Переключение <kbd>LCtrl</kbd> + <kbd>RCtrl</kbd> .

{{< callout/note >}}
Медиа клавиши в госте работать не будут, чтобы они работали их тоже надо добавить, например у меня они `if01`, но я **не рекомендую** этого делать, потому что далее по настройке звука мы сделаем красиво.

Так же обратите внимание, что донгл и USB провод разные вещи, если вы добавите только что-то одно, то при другом работать не будет (зависит от поведения девайса).

На примере клавиатуры, вы добавили только донгл:

- Включен только донгл -- работает
- Включен донгл и провод, но клавиатура принципиально начинает работать через провод -- не работает
- Включен донгл и провод, но клавиатура просто заряжается, но работает через донгл -- работает

Если решите добавить и то, и то -- работать не будет, если что-то из этого отключено -- виртуалка откажется запускаться. Решается через симлинки udev, _про что -- ниже._
{{< /callout/note >}}

### udev симлинки (объединение устройств в одно)

Покажу на примере клавиатуры. Подключаем клавиатуру всеми способами, что нужно объединить, или если при использование одного способа -- другой "отлетает" и наоборот, то просто делайте описанное ниже по очереди.

Снова проверяем список устройств:

```bash {linenos=false}
ls /dev/input/by-id/ | grep event
```

{{< callout/note >}}
Если вы не уверены в устройстве, то проверьте его:

```bash {linenos=false}
sudo evtest /dev/input/by-id/usb-SmartCloud_MMD_KM40-event-kbd
```

При нажатие на обычные клавиши у меня ничего не пишет в лог, а:

```bash {linenos=false}
sudo evtest /dev/input/by-id/usb-SmartCloud_MMD_KM40-if02-event-kbd
```

Пишет. Значит, нужное устройство -- `usb-SmartCloud_MMD_KM40-if02-event-kbd`.
{{< /callout/note >}}

В моем случае получается:

- `usb-I-CHIP_MMD_KM40_Receiver_1234-event-kbd` -- донгл
- `usb-SmartCloud_MMD_KM40-if02-event-kbd` -- провод

Далее делаем с ними такое:

```bash {linenos=false}
DEV=/dev/input/by-id/usb-I-CHIP_MMD_KM40_Receiver_1234-event-kbd && echo "- Properties:" && udevadm info -q property -n "$DEV" | grep -E "ID_VENDOR_ID|ID_MODEL_ID|ID_SERIAL|ID_USB_INTERFACE_NUM|ID_INPUT" && echo "- Name:" && udevadm info -a -n "$DEV" | grep -m1 'ATTRS{name}'
```

```bash {linenos=false}
DEV=/dev/input/by-id/usb-SmartCloud_MMD_KM40-if02-event-kbd && echo "- Properties:" && udevadm info -q property -n "$DEV" | grep -E "ID_VENDOR_ID|ID_MODEL_ID|ID_SERIAL|ID_USB_INTERFACE_NUM|ID_INPUT" && echo "- Name:" && udevadm info -a -n "$DEV" | grep -m1 'ATTRS{name}'
```

Подставляем свои значения в `DEV`, разумеется.

Нас интересуют:

- `ID_VENDOR_ID`
- `ID_MODEL_ID`
- `ID_USB_INTERFACE_NUM`
- `ATTRS{name}` -- нужно во избежание коллизий

Далее:

```bash {linenos=false}
sudo nano /etc/udev/rules.d/99-vm-keyboard.rules
```

```bash
# /dev/input/by-id/usb-I-CHIP_MMD_KM40_Receiver_1234-event-kbd
SUBSYSTEM=="input", KERNEL=="event*", ENV{ID_VENDOR_ID}=="<ID_VENDOR_ID>", ENV{ID_MODEL_ID}=="<ID_MODEL_ID>", ENV{ID_USB_INTERFACE_NUM}=="<ID_USB_INTERFACE_NUM>", ATTRS{name}=="<NAME>", OPTIONS+="link_priority=-10", SYMLINK+="input/by-id/vm-keyboard-event-kbd"

# /dev/input/by-id/usb-SmartCloud_MMD_KM40-if02-event-kbd
SUBSYSTEM=="input", KERNEL=="event*", ENV{ID_VENDOR_ID}=="<ID_VENDOR_ID>", ENV{ID_MODEL_ID}=="<ID_MODEL_ID>", ENV{ID_USB_INTERFACE_NUM}=="<ID_USB_INTERFACE_NUM>", ATTRS{name}=="<NAME>", OPTIONS+="link_priority=10", SYMLINK+="input/by-id/vm-keyboard-event-kbd"
```

Данные в `<...>` меняем на свои. _Советую так же сделать комментарии аналогичные, чтобы не путаться и знать что есть что._

{{< callout/note >}}
Обратите внимание на `link_priority`, это приоритет. Когда я подключаю клавиатуру для зарядки, я разумеется донгл не вытыкаю из USB.

Но клавиатура у меня не дура и начинает работать по проводу, а не по донглу, но в системе по прежнему донгл то имеется.

Как итог, udev использует донгл, который... не работает, потому что подключен провод. Потому у донгла приоритет ниже, а у провода выше.
{{< /callout/note >}}

Применяем правила:

```bash {linenos=false}
sudo sh -c 'udevadm control --reload-rules && udevadm trigger'
```

Проверяем:

```bash {linenos=false}
ls -l /dev/input/by-id/vm-keyboard-event-kbd
```

И так же:

```bash {linenos=false}
sudo evtest /dev/input/by-id/vm-keyboard-event-kbd
```

И по нажимайте клавиши, попробуйте только донгл, только провод, и то и то, все должно работать.

Далее везде добавляем/заменяем клавиатуру на `/dev/input/by-id/vm-keyboard-event-kbd` как было показано в начале раздела.

{{< callout/warn >}}
К сожалению, на момент написания этого текста, оно не работает на горячую. То есть если после запуска виртуалки вы "переключите" устройства, провод втыкнете или вытокните, то QEMU потеряет устройство и нужно будет перезагрузить виртуалку. _Это не баг, это поведение системы._
{{< /callout/warn >}}

## Pinning CPU ядер & HugePages

Самое интересное и простое. Но для начала предисловие.{{% callout/inline hyphens %}}![Emaa Skye Write](@loose/img/memes/animated.ema-skye-write-1.avif){{% /callout/inline %}}

У дох\*я ядерников Intel не совсем дох\*я ядер. Есть P-ядра -- производительные, и E-ядра -- энергоэффективные, производительные мощные, энергоэффективные так "на подсосе". Ну скажем легенда i5-14600K, у него 14 ядер, верно? Но...

6 P-ядер и 8 E-ядер, то есть 6 реально крутых ядер, и 8 таких себе ядер. Но (еще раз), в разгоне энергоэффективные ядра бустятся с 2.6 ГГц до 4.0 ГГц, не то чтобы сильно много, но уже не на подсосе. Производительные же с 3.5 ГГц до 5.3 ГГц. Независимо от того в разгоне у вас или нет, кидайте мощные ядра + их потоки в виртуалку, а хосту оставляйте все энергоэффективные. Вот и все.

С AMD все проще, у них нету понятия энергоэффективные ядра. Не придется детектить P и E ядра, нужно будет только связать ядра с потоками, но с AMD особенно с Zen 4 (AM5 сокет) понять какой поток к какому ядру как два пальца. Но (снова), есть исключения, у дох\*я ядерников AMD, 12-16 ядер типа R 9, там ядра разделены на два чиплета, и ну... вот лучше не надо в виртуалку кидать кучку ядер с одного чиплета и кучку с другого, лучше только с одного.

```bash {linenos=false}
lscpu -e=CORE,CPU,CLUSTER,SOCKET,MINMHZ,MAXMHZ,MHZ
```

- CORE -- ядро
- CPU -- поток
- CLUSTER -- чиплет

У меня не R 9, поэтому точнее показать и сказать, как делать не смогу, у меня просто Ryzen на AM5:

```bash {hl_lines=[2,10]}
CORE CPU CLUSTER SOCKET   MINMHZ    MAXMHZ       MHZ
   0   0       -      0 422.3340 5392.8721 3021.3081
   1   1       -      0 422.3340 5392.8721 4339.9531
   2   2       -      0 422.3340 5392.8721 3021.3081
   3   3       -      0 422.3340 5392.8721 4341.2192
   4   4       -      0 422.3340 5392.8721 3470.1899
   5   5       -      0 422.3340 5392.8721 3021.3081
   6   6       -      0 422.3340 5392.8721 4333.1089
   7   7       -      0 422.3340 5392.8721 3021.3081
   0   8       -      0 422.3340 5392.8721 3021.3081
   1   9       -      0 422.3340 5392.8721 4339.2979
   2  10       -      0 422.3340 5392.8721 3021.3081
   3  11       -      0 422.3340 5392.8721 3021.3081
   4  12       -      0 422.3340 5392.8721 3021.3081
   5  13       -      0 422.3340 5392.8721 3021.3081
   6  14       -      0 422.3340 5392.8721 3021.3081
   7  15       -      0 422.3340 5392.8721 4001.2991
```

_От 0 до 7, у меня 8 ядер, но как обычно оно бывает в таких делах -- счет идет не с 1, а с нуля, то есть 0-7 = 1-8 ядер = 8 ядер._

Нужно найти совпадения, ну например CORE 0, мы видим, что в правой колонке напротив 0 есть 0 и 8, это близнецы, то есть это одно целое ядро с двумя потоками (потому что SMT/HT). Далее второе ядро (которое помечено как 1), имеет 1 и 9. То есть вот я нашел 2 ядра и их 2 потока, что суммарно 4 потока, которые я отдам хосту:

- 0,8
- 1,9

Остальные (12 штук) уйдут виртуалке:

- 2,10
- 3,11
- 4,12
- 5,13
- 6,14
- 7,15

_Видите? С AMD с одним чиплетом все просто!_

**Боже, благослови QEMU диспетчер.**

Создаем диспетчер, очень удобная и универсальная штука, так же может пригодиться потом для хуков других виртуалок:

```bash {linenos=false}
sudo nano /etc/libvirt/hooks/qemu
```
{{< remote-code url="https://github.com/nozsh/vfio/blob/main/qemu-hooks/dispatcher.sh" open=true >}}

Создаем директории с хуками:

```bash {linenos=false}
VM="win11"; sudo mkdir -p /etc/libvirt/hooks/qemu.d/"$VM"/prepare/begin/ /etc/libvirt/hooks/qemu.d/"$VM"/release/end/
```

Где `win11` название вашей виртуальной машины, узнать можно `sudo virsh list --all`.

Хук при старте виртуалки:

```bash {linenos=false}
sudo nano /etc/libvirt/hooks/qemu.d/win11/prepare/begin/50-cpu-pinning-and-hugepages.sh
```

{{< remote-code "https://github.com/nozsh/vfio/blob/main/qemu-hooks/start/50-cpu-pinning-and-hugepages.sh" >}}

Хук при выключении виртуалки:

```bash {linenos=false}
sudo nano /etc/libvirt/hooks/qemu.d/win11/release/end/50-cpu-pinning-and-hugepages.sh
```

{{< remote-code "https://github.com/nozsh/vfio/blob/main/qemu-hooks/stop/50-cpu-pinning-and-hugepages.sh" >}}

Не забудьте в скриптах поменять потоки ядер и настроить hugepages сколько вам надо. Про hugepages так же будет доп. информация далее, и так же таблица с примерами.

Даем права на исполнение:

```bash {linenos=false}
sudo chmod +x /etc/libvirt/hooks/qemu
```

И для хуков:

```bash {linenos=false}
VM="win11"; sudo find /etc/libvirt/hooks/qemu.d/"$VM" -type f -name '*.sh' \( -path '*/prepare/begin/*' -o -path '*/prepare/end/*' -o -path '*/release/begin/*' -o -path '*/release/end/*' \) -exec chmod +x {} +
```

Перезапускаем сервис, чтобы обновить хуки:

```bash {linenos=false}
sudo sh -c 'systemctl restart virtqemud && systemctl status virtqemud'
```

В моем случае 6 ядер с SMT, то есть 12 потоков. В настройках виртуалки --> CPUs, Cores ставим кол-во ядер (в моем случае 6), а в Threads кол-во потоков на ядро (в моем случае 2) и применяем. Sockets это кол-во процессоров, ставьте 1.

В настройках виртуалки Overview - XML ищем `<vcpu placement="static">X</vcpu>`, где X какое-то общее кол-во потоков. Вписываем нужное значение:

```xml
<vcpu placement="static">12</vcpu>
<cputune>
  <vcpupin vcpu="0"  cpuset="2"/>
  <vcpupin vcpu="1"  cpuset="10"/>

  <vcpupin vcpu="2"  cpuset="3"/>
  <vcpupin vcpu="3"  cpuset="11"/>

  <vcpupin vcpu="4"  cpuset="4"/>
  <vcpupin vcpu="5"  cpuset="12"/>

  <vcpupin vcpu="6"  cpuset="5"/>
  <vcpupin vcpu="7"  cpuset="13"/>

  <vcpupin vcpu="8"  cpuset="6"/>
  <vcpupin vcpu="9"  cpuset="14"/>

  <vcpupin vcpu="10" cpuset="7"/>
  <vcpupin vcpu="11" cpuset="15"/>

  <emulatorpin cpuset="0-1,8-9"/>
</cputune>
```

Здесь `cpuset` это ядро вашего процессора, а `vcpu` это поток внутри VM, 12 виртуальных потоков это от 0 до 11, справа я назначаю им РЕАЛЬНЫЕ потоки с хоста. Нужно назначить виртуальной паре -- реальную пару (см. выше).

`emulatorpin` говорит хосту использовать для "поддержания" жизни KVM вот **эти** ядра, то есть в моем случае указаны ядра, что я оставил хосту -- первые 2 ядра (4 потока), то есть чтобы виртуалка не лезла на ядра, что выделены гостю.

Если вы пробрасывали диск через VirtIO, а **не** VFIO, то после `<emulatorpin/>` добавьте:

```xml
  <iothreadpin iothread="1" cpuset="0-1,8-9"/>
```

<!--
Перезапускаем сервис:

```bash {linenos=false}
sudo sh -c 'systemctl restart virtqemud && systemctl status virtqemud'
```
-->

**HugePages** в XML нужно добавить сразу после тега `<currentMemory>`:

```bash
<memoryBacking>
  <hugepages>
    <page size="2" unit="M"/>
  </hugepages>
</memoryBacking>
```

А также изменить:

```bash
<memory unit="KiB">X</memory>
<currentMemory unit="KiB">X</currentMemory>
```

Где X -- GB \* 1048576 , например 42 GB * 1048576 = 44040192 KiB. Указывать это надо очень точно.

Примеры:

| GB  | TARGET (хук) | KiB (XML) |
| --- | ------------ | --------- |
| 8   | 4096         | 8388608   |
| 16  | 8192         | 16777216  |
| 24  | 12288        | 25165824  |
| 32  | 16384        | 33554432  |
| 42  | 21504        | 44040192  |
| 48  | 24576        | 50331648  |

Про `memoryBacking` (`size="2"`) и `hugepages-2048kB`, размер страницы решает, самый такой крутой вариант это `1024` и `hugepages-1048576kB` --- 1gb, но это как фрагментация диска. Хосту будет (вероятно очень) проблематично найти нужный объем памяти по 1 **непрерывному** гигабайту, потому что ОЗУ нелинейна. Но задержки станут еще меньше. 2mb это компромисс. Важно, меньше нельзя, больше нельзя, работает **только** 4kb (дефолт системы), 2mb, 1024mb (1gb) и все.

Также проверить, что hugepages выделены (после запуска VM) можно так:

```bash {linenos=false}
cat /proc/meminfo | grep Huge
```

## Проброс dGPU

Варианта два. Топорный, но 100%, требует перезагрузки для "переключения режима". И изящный, но может не сработать. Изящный вариант, это переключение на горячую, запустили виртуалку -- dGPU улетела в виртуалку, выключили виртуалку -- dGPU вернулась хосту, ах\*ено шо пизд\*ц. Но это сложно. Может работать сейчас, но перестать потом. Если изящный способ перестанет работать у меня, я обязательно обновлю текст, если у вас... ну тут как бы, я не вы, я не знаю, что у вас.

В начале ПЕРВЫМ делом! Включите ssh сервер, если что-то пойдет не так, пропадет изображение, или еще что -- вы могли зайти с [телефона](https://www.google.com/search?q=Termius?nt) и исправить проблему:

```bash {linenos=false}
sudo sh -c 'systemctl enable --now sshd && firewall-cmd --permanent --add-service=ssh && firewall-cmd --reload && systemctl status sshd'
```

Когда закончите все делать, ssh сервер можно (и лучше, если не нужен он вам) отключить:

```bash {linenos=false}
sudo sh -c 'systemctl disable --now sshd && firewall-cmd --permanent --remove-service=ssh && firewall-cmd --reload && systemctl status sshd'
```

Разлогиньтесь и на экране входа выберите Wayland.

Теперь заставим Wayland работать с iGPU, иначе после проброса dGPU может пропасть изображение.

{{< callout/note >}}
Описанное ниже нужно делать, если вы не делали этого, и у вас уже пропало изображение; поэтому делаем это заранее, считайте это "превентивным фиксом".
{{< /callout/note >}}

Узнаем PCI iGPU в десятичной системе (hex to decimal):

```bash {linenos=false}
lspci -D | grep -E "VGA|3D|Display" | grep -v "NVIDIA" | awk -F'[:. ]' '{printf "\n%s:%s:%s.%s (hex) => PCI:%d:%d:%d (decimal)\n\n", $1, $2, $3, $4, strtonum("0x"$2), strtonum("0x"$3), strtonum("0x"$4)}'
```

Вывод:

```text {linenos=false}
0000:11:00.0 (hex) => PCI:17:0:0 (decimal)
```

**Для AMD:**

```bash
sudo tee /etc/X11/xorg.conf << 'EOF'
Section "Device"
    Identifier "iGPU"
    Driver "amdgpu"
    BusID "PCI:17:0:0"
EndSection
EOF
```

```bash {linenos=false}
sudo zypper install xf86-video-amdgpu
```

**Для Intel:**

```bash
sudo tee /etc/X11/xorg.conf << 'EOF'
Section "Device"
    Identifier "iGPU"
    Driver "modesetting" # или intel
    BusID "PCI:17:0:0"
EndSection
EOF
```

Если Driver "modesetting" не сработал, и вы используете "intel", то:

```bash {linenos=false}
sudo zypper install xf86-video-intel
```

Учтите, что "xf86-video-intel" не обновляется и так себе работает на intel >=11 поколения, и в любом случае -- в приоритете использовать Driver "modesetting" для Intel.

Если забыли PCI:

```bash {linenos=false}
lspci | grep -E "VGA|3D|Display"
```

Вывод:

```bash {linenos=false}
01:00.0 VGA compatible controller: NVIDIA Corporation AD104 [GeForce RTX 4070] (rev a1)
11:00.0 VGA compatible controller: Advanced Micro Devices, Inc. [AMD/ATI] Raphael (rev c5)
```

На этот раз нужно просто `11:00.0`. Далее находим DRM устройство по PCI:

```bash {linenos=false}
ls -la /dev/dri/by-path/ | grep "11:00.0"
```

Вывод:

```bash {linenos=false}
lrwxrwxrwx. 1 root root   8 Jun 15 13:11 pci-0000:11:00.0-card -> ../card0
lrwxrwxrwx. 1 root root  13 Jun 15 13:11 pci-0000:11:00.0-render -> ../renderD128
```

Передаем устройство в KWin -- `pci-0000:11:00.0-card `:

```bash {linenos=false}
mkdir -p ~/.config/systemd/user/plasma-kwin_wayland.service.d
```

```bash
tee ~/.config/systemd/user/plasma-kwin_wayland.service.d/override.conf << 'EOF'
[Service]
ExecStartPre=/bin/sh -c 'systemctl --user set-environment KWIN_DRM_DEVICES=$(readlink -f /dev/dri/by-path/pci-0000:11:00.0-card)'
EOF
```

```bash {linenos=false}
sudo nano /etc/environment
```

```
KWIN_DRM_DEVICES="/dev/dri/by-path/pci-0000\:11\:00.0-card"
```

Обратите внимание на `\`, это экранирование `:`, так надо.

```bash {linenos=false}
systemctl --user daemon-reload
```

Если вы собираетесь делать горячий проброс -- рекомендую прочитать про холодный проброс, знание поможет вам.

### NVIDIA (Холодный проброс; VFIO со старта)

```bash {linenos=false}
sudo nano /etc/modprobe.d/vfio.conf
```

Там:

```bash {linenos=false}
install vfio-pci /sbin/vfio-pci-override.sh
```

Далее:

```bash {linenos=false}
lspci -nnk | grep -A3 -i nvidia
```

```bash
01:00.0 VGA compatible controller [0300]: NVIDIA Corporation AD104 [GeForce RTX 4070] [10de:2786] (rev a1)
        Subsystem: Micro-Star International Co., Ltd. [MSI] Device [1462:5137]
        Kernel driver in use: nvidia
        Kernel modules: nouveau, nvidia_drm, nvidia
01:00.1 Audio device [0403]: NVIDIA Corporation AD104 High Definition Audio Controller [10de:22bc] (rev a1)
        Subsystem: Micro-Star International Co., Ltd. [MSI] Device [1462:5137]
        Kernel driver in use: snd_hda_intel
        Kernel modules: snd_hda_intel
```

Записываем `01:00.0` и `01:00.1`.

```bash {linenos=false}
sudo nano /sbin/vfio-pci-override.sh
```

```bash
#!/bin/sh

DEVS="0000:01:00.0 0000:01:00.1"

for DEV in $DEVS; do
    echo "vfio-pci" > /sys/bus/pci/devices/$DEV/driver_override
done

modprobe -i vfio-pci
```

К тому, что записали ранее, добавляем `0000:` -- `0000:<ваше_значение>` (как в скрипте). Делаем скрипт исполняемым:

```bash {linenos=false}
sudo chmod +x /sbin/vfio-pci-override.sh
```

Далее:

```bash {linenos=false}
sudo nano /etc/dracut.conf.d/vfio.conf
```

```bash
force_drivers+=" vfio vfio_pci vfio_iommu_type1 "
install_items+=" /sbin/vfio-pci-override.sh "
```

Пересобираем initramfs:

```bash {linenos=false}
sudo sdbootutil --no-reuse-initrd add-all-kernels
```

YaST --> System --> Boot Loader --> Kernel Parameters в конце:

```bash
rd.driver.pre=vfio-pci
```

Перезагружаемся. Проверяем:

```bash {linenos=false}
lspci -nnk | grep -A3 -i nvidia
```

Должно быть `Kernel driver in use: vfio-pci`:

```bash
01:00.0 VGA compatible controller [0300]: NVIDIA Corporation AD104 [GeForce RTX 4070] [10de:2786] (rev a1)
        Subsystem: Micro-Star International Co., Ltd. [MSI] Device [1462:5137]
        Kernel driver in use: vfio-pci
        Kernel modules: nouveau, nvidia_drm, nvidia
01:00.1 Audio device [0403]: NVIDIA Corporation AD104 High Definition Audio Controller [10de:22bc] (rev a1)
        Subsystem: Micro-Star International Co., Ltd. [MSI] Device [1462:5137]
        Kernel driver in use: vfio-pci
        Kernel modules: snd_hda_intel
```

---

В настройках виртуалки добавляем новое PCI Host Device устройство (dGPU и ее Audio) (как с VFIO диском), и там же удаляем Display Spice и затем Video \<X\> (например Video Virtio или Video QXL).

Иначе "этот" дисплей определится Windows и будет как второй/третий... дисплей, ну вы поняли, мешаться будет крч.

### NVIDIA (Горячий проброс)

Я делал это с проприетарным драйвером NVIDIA, для НЕ проприетарного драйвера нужно немного поменять скрипты. Как по мне видеокарта NVIDIA без проприетарных драйверов -- бесполезна. _Поэтому вот так._

Заставляем KWin работать с iGPU, чтобы в будущем отпустил dGPU.

```bash {linenos=false}
mkdir -p ~/.config/environment.d
```

Указываем PCI iGPU (`lspci | grep -E "VGA|3D|Display"`):

```bash
tee ~/.config/environment.d/kwin-gpu.conf << 'EOF'
KWIN_DRM_DEVICES="/dev/dri/by-path/pci-0000:11:00.0-card"
__EGL_VENDOR_LIBRARY_FILENAMES=/usr/share/glvnd/egl_vendor.d/50_mesa.json
EOF
```

```bash {linenos=false}
systemctl --user daemon-reload
```

Перезагружаемся.

Проверить можно командой с PCI iGPU:

```bash {linenos=false}
sudo lsof /dev/dri/by-path/pci-0000:11:00.0-card | grep kwin
```

Что-то будет. И с PCI dGPU:

```bash {linenos=false}
sudo lsof /dev/dri/by-path/pci-0000:01:00.0-card | grep kwin
```

Должно быть пусто. WARNING'и не в счет.

Так же доп. проверка если у вас NVIDIA:

```bash {linenos=false}
sudo lsof /dev/nvidia* /dev/dri/by-path/pci-0000:01:00.0*
```

Вот тут вообще должно быть пусто. Но если там что-то есть, и это не что-то системное типа KWin, то нестрашно, хук или ваши руки просто могут убить процесс и все. А вот если это KWin, то так не получится.

Структуру хуков и диспетчер мы настраивали выше в [Pinning CPU ядер & HugePages](#pinning-cpu-ядер--hugepages), если вы это пропустили, метнитесь туда, сделайте и вернитесь сюда.

Не забудьте в скриптах поменять PCI на свои.

```bash {linenos=false}
sudo nano /etc/libvirt/hooks/qemu.d/win11/prepare/begin/10-dgpu-nvidia-detach.sh
```

{{< remote-code "https://github.com/nozsh/vfio/blob/main/qemu-hooks/dgpu/nvidia/detach.sh" >}}

```bash {linenos=false}
sudo nano /etc/libvirt/hooks/qemu.d/win11/release/end/90-dgpu-nvidia-attach.sh
```

{{< remote-code "https://github.com/nozsh/vfio/blob/main/qemu-hooks/dgpu/nvidia/attach.sh" >}}

Сделать хуки исполняемыми:

```bash {linenos=false}
VM="win11"; sudo find /etc/libvirt/hooks/qemu.d/"$VM" -type f -name '*.sh' \( -path '*/prepare/begin/*' -o -path '*/prepare/end/*' -o -path '*/release/begin/*' -o -path '*/release/end/*' \) -exec chmod +x {} +
```

Где `win11` имя вашей VM.

{{< callout/note >}}
Если у вас **НЕ** KDE Plasma, но при этом KDE Plasma в системе имеется -- закомментируйте строки с `(KDE)`, в случае если у вас нету KDE просто ничего не будет. Если KDE есть, но вы не используете KDE то, что-то будет, что-то, что вам вероятно не нужно.
{{< /callout/note >}}

Перезапускаем сервис, чтобы обновить хуки:

```bash {linenos=false}
sudo sh -c 'systemctl restart virtqemud && systemctl status virtqemud'
```

Тут есть неочевидная проблемка. Если вырубят свет или вы решите пнуть кнопку выключения ПК, пока виртуалка запущена, скрипт на выключение не выполнится. А повторный запуск виртуалки не увенчается успехом, потому что выгружать будет нечего. В таком случае нужно будет выполнить скрипт "при выключении" вручную, ничего особенного.

Последний шаг -- посмотреть самый конец [главы выше](#nvidia-холодный-проброс-vfio-со-старта) (про добавление PCI dGPU и удаление других устройств).

## Периферия -- Звук

Все работает, а звука нет, ща исправим. _Это также будет работать и с микрофоном._

Будет на примере "PulseAudio (on PipeWire 1.6.7)" -- это означает, что реально PipeWire, PulseAudio для совместимости. Узнать что у вас можно `pactl info`.

```bash {linenos=false}
sudo zypper in -y qemu-audio-pa qemu-audio-pipewire
```

Проверить можно:

```bash {linenos=false}
qemu-system-x86_64 -audiodev help
```

Должны были появиться `pa` и `pipewire`.

Если все ок, перезапускаем сервис:

```bash {linenos=false}
sudo sh -c 'systemctl restart virtqemud && systemctl status virtqemud'
```

Создаем конфигурацию:

```bash {linenos=false}
mkdir -p ~/.config/pipewire/pipewire-pulse.conf.d
```

```bash
cat > ~/.config/pipewire/pipewire-pulse.conf.d/10-tcp.conf << 'EOF'
pulse.properties = {
    server.address = [
        "unix:native"
        "tcp:4713"
    ]
}
EOF
```

Рестартим pipewire сервис:

```bash {linenos=false}
systemctl --user restart pipewire-pulse
```

Проверка:

```bash {linenos=false}
ss -tlnp | grep 4713 && pactl --server=127.0.0.1:4713 info
```

Должно быть так:

```bash
LISTEN 0      32                0.0.0.0:4713       0.0.0.0:*    users:(("pipewire-pulse",pid=2735,fd=17))
LISTEN 0      32                   [::]:4713          [::]:*    users:(("pipewire-pulse",pid=2735,fd=18))
Server String: 127.0.0.1:4713
```

В настройках виртуалки удаляем существующий "Sound X" и создаем новый - ICH9. Далее Overview и там в XML внутри `<devices>`:

```bash
<audio id="1" type="pulseaudio" serverName="127.0.0.1:4713"/>
```

И добавить `<audio id="1"/>` внутрь тега `<sound>`.

До запуска виртуалки проверить можно командой:

```bash {linenos=false}
sudo virsh dumpxml win11 | grep -A3 audio
```

Это микширование звука, настройте под себя звук внутри VM, а также в микшере хоста. И если помните, я советовал не пробрасывать медиа клавиши клавиатуры, благодаря этому если выровнять звук гостя под хост, чтобы они были примерно одинаковыми, то находясь в госте с захватом клавиш и тыкая на медиа клавиши -- вы будете менять сразу и гостя и хост, прям как на "просто одной системе".

{{< callout/hint >}}
Выровнять звук довольно просто, в госте на 100%, в микшере хоста тоже, а общую громкость хоста уже настраиваете как обычно.
{{< /callout/hint >}}

{{< callout/warn >}}
При старте VM сразу после старта системы может выбить ошибку:

```bash {linenos=false}
pulseaudio: Wrong context state Reason: Connection refused
```

это нормально. Оно так потому что сервис еще не запустился и соответственно сокет не работает.

Запустится либо со второго раза, либо дайте звук перед запуском VM. Альтернатива:

```bash {linenos=false}
systemctl --user enable pipewire-pulse.service
```
{{< /callout/warn >}}

## Скрытие и ускорение виртуалки

Это базовое скрытие, полное KVM скрытие -- это целая наука и конечно же патчинг QEMU и ядра Linux, что уже труднее и описано здесь не будет, но возможно когда-нибудь я про это напишу. А ускорение это так называемое "Hyper-V Enlightenments" (что тесно связано с базовым, но современным скрытием), чтобы для каких-то вещей не происходил тяжелый VM Exit в хост, а инструкции шли как для Hyper-V (родная среда виртуализации Windows).

Да, казалось бы небольшое противоречие, скрыть факт виртуализации, но при этом прямо сказать системе, что она виртуалка, кажется таким себе решением, но это типа окей.

Все делается в XML, я думаю, вы к этому времени там уже много раз побывали.

В `<cpu>` у вас уже должно быть типа такого:

```xml
<cpu mode="host-passthrough" check="none" migratable="on">
  <topology sockets="1" dies="1" cores="6" threads="2"/>
</cpu>
```

Туда же внутрь `<cpu>` нужно добавить:

```xml
  <cache mode="passthrough"/>
  <feature policy="require" name="invtsc"/>
```

А также заменить `migratable="on"` на `migratable="off"`.

Если у вас AMD (с SMT, а я надеюсь, что с SMT) то также добавить `<feature policy="require" name="topoext"/>`.

Блок `<features>` должен выглядеть так:

{{< remote-code url="https://github.com/nozsh/vfio/blob/main/qemu-xml/features.xml" lang="xml" >}}

А блок `<clock>` должен выглядеть так:

{{< remote-code url="https://github.com/nozsh/vfio/blob/main/qemu-xml/clock.xml" lang="xml" >}}

Найдите в самом верху тег "uuid" и скопируйте значение, также выполните:

```bash {linenos=false}
sudo dmidecode -s baseboard-serial-number
```

И скопируйте полученное значение тоже, даже если там "Default string" :D

Вставьте в XML после `</cputune>`:

{{< remote-code url="https://github.com/nozsh/vfio/blob/main/qemu-xml/sysinfo.xml" lang="xml" >}}

Не забудьте поменять серийник и UUID.

Найдите `<os>` и добавьте внутрь:

```xml
  <smbios mode="sysinfo"/>
```

Также ищем `<interface type="network">`, там меняем MAC адрес на `00:15:5D:xx:xx:xx`, где X'ы [любое значение](https://it-tools.tech/mac-address-generator?nt), но не `00` и `FF`. После в госте проверить можно `ipconfig /all`. `00:15:5D` это MAC hyper-v, а `52:54:00` -- qemu.

И уберите из `<devices>`:

```xml
<input type="tablet" bus="usb">
  <address type="usb" bus="0" port="1"/>
</input>
```

Также в самом конце найдите `memballoon`, и сделайте так (выключите):

```xml
<memballoon model="virtio">
  <address type="pci" domain="0x0000" bus="0x05" slot="0x00" function="0x0"/>
</memballoon>
    ↓
<memballoon model="none"/>
```

memballoon по сути не используется, но существует и делает вызовы, зачем ему делать вызовы и потенциально вызывать фризы, если он не работает, правильно? Также в Windows если заметили процесс "blnsvr.exe" в диспетчере, можно отключить BallonService в сервисах, иначе он так же будет работать вхолостую.

В диспетчере задач "Virtual Machine: Yes", никуда не пропадет, цель сделать современно и не потерять в производительности, а значит не прям скрыть-скрыть факт виртуализации, а сделать вид, что это "легальная" виртуализация. В терминале -- `systeminfo`, если в самом низу "A hypervisor has been detected. Features required for Hyper-V will not be displayed." -- значит все работает.

Этот статус появляется, если вы включаете в системе Core Isolation или WSL, то бишь это абсолютно легальные функции которые тригерят этот статус. А производительность лучше, потому что Windows не эмулирует вызовы, а использует быстрые "родные" Hyper-V.

Благодаря этим манипуляциям мой средний FPS в бенчмарке Cyberpunk 2077 стал 140 --> 162, в то время как на голом железе он 163. Уровень погрешности. Удивительно, неправда ли?

## Настройка сети

Просто небольшая правка, чтобы закрепить IP адрес за виртуалкой (чтобы он не менялся).

В настройках виртуалки --> NIC и там скопируйте MAC адрес.

Далее в главном окне со списком виртуалок --> тык на виртуалку --> Edit --> Connection Details --> Virtual Networks --> XML, в блок dhcp добавить:

```xml
      <host mac="MAC" ip='192.168.122.5'/>
```

Применить, и в том же окне нажать на кнопку Stop Network, затем Start Network.

Проверить можно введя `ipconfig` в терминале Windows.

## Гостевые дополнения

В Windows можно в любом случае или нет установить "гостевые дополнения", вы можете сделать это сразу, или не делать если оно вам не нужно.

Этот раздел в основном нужен, чтобы ссылаться на него, когда это нужно установить, поэтому в любом случае если это будет нужно, вы об этом узнаете.

Перейти на `https://www.spice-space.org/download.html` и в разделе "Windows binaries" скачать и установить "spice-guest-tools".

А также переходим на `https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/stable-virtio/` качаем и устанавливаем "virtio-win-guest-tools.exe".

Перезагружаем Windows, разумеется.

## Общий буфер обмена и общие папки (Samba)

Самое удобное удобство. Если вкратце, что мы сделаем:

- Общий буфер обмена включая текст и пикчи (только если MIME тип изображения -- скриншоты).
- Шара Samba.
- Скрипт для удобного "копирования" файлов на шару без траты TBW (ну чтоб наверняка).

### Буфер обмена

Мини предисловие. Я пробовал нативно, много пробовал. Конкретно через полу-spice, как spice только не spice, без графики. Но Wayland не дает читать буфер обмена пока окно не в фокусе, то есть:

копировать --> ткнуть окно spice --> вставить. Неудобно, но конечно же есть костыль с `GDK_BACKEND=x11`.

Но это не все мины подводные, `text/plain` работает в обе стороны, но без русского текста. `text/plain\;charset=utf=8` работает только из гостя в хост, из хоста в гостя см. воркфлоу выше. Ну и конечно же постоянно ломающееся окружение (полностью нерабочая панель задач и "пуск") из-за `GDK_BACKEND=x11`. И еще пара десятков проблем, а потому...

#### ClipCascade

[ClipCascade](https://github.com/Sathvik-Rao/ClipCascade?sl) это такая софтина для (барабанная дробь) шеринга буфером обмена по сети, и все, только для этого. Прям то что надо. С этим способом будет небольшая задержка передачи данных буфера обмена между системами, но пока вы переключаете ввод, чтобы вставить оно уже передаст. _Без докера будет тяжко._

```bash {linenos=false}
sudo zypper in docker-compose docker-compose-switch wl-clipboard
```

```bash {linenos=false}
sudo systemctl enable --now docker
```

```bash {linenos=false}
sudo usermod -G docker -a $USER
```

```bash {linenos=false}
newgrp docker
```

```bash {linenos=false}
sudo systemctl restart docker
```

```bash {linenos=false}
mkdir -p ClipCascade && cd ClipCascade && nano docker-compose.yaml
```

```yaml
services:
  clipcascade:
    image: sathvikrao/clipcascade:latest
    container_name: clipcascade
    # user: "1000:1000"
    ports:
      - "127.0.0.1:8080:8080"
      - "192.168.122.1:8080:8080"
    # restart: always # Обратите внимание, выключено т.к. далее создадим юнит
    volumes:
      - ./cc_users:/database:z
    environment:
      - CC_MAX_MESSAGE_SIZE_IN_MiB=10
      - CC_P2P_ENABLED=false
      # - CC_SIGNUP_ENABLED=true
```

```bash {linenos=false}
mkdir cc_users
```

```bash {linenos=false}
docker compose up -d && docker compose logs -f
```

Далее клиент, качаем архив с репозитория [GitHub](https://github.com/Sathvik-Rao/ClipCascade/releases?sl) и распаковываем куда удобно.

```bash {linenos=false}
python3 -m venv venv
```

```bash {linenos=false}
source venv/bin/activate
```

```bash {linenos=false}
pip install -r requirements.txt
```

```bash {linenos=false}
python main.py --gui false --xmode false
```

`--xmode false` -- это для Wayland.

Попросит войти, логин:пароль -- `admin:admin123` , остальное тыкайте Enter (или сначала прочитайте текст ниже).

На Windows качаем .exe (portable) или .msi (установщик) отсюда `https://github.com/Sathvik-Rao/ClipCascade/releases`, если .exe то создаем папку и кидаем туда .exe. Авторизация по тем же данным, но Server URL: `http://192.168.122.1:8080`.

{{< callout/note >}}
Крутейшие данные для авторизации в этом случае менять не обязательно (**ТОЛЬКО В ЭТОМ СЛУЧАЕ**), потому что мы гоняем данные по сети хоста, ничего за пределы вашего ПК не уходит.

Соответственно шифрование тоже можно не использовать, будет работать быстрее и стабильнее.

А также в доп. настройках можно сделать, чтобы пароль сохранялся в файл, тогда не придется каждый раз авторизоваться после перезапуска докер контейнера (а это значит после перезагрузки хоста).
{{< /callout/note >}}

Если все работает то круто. Надо только это **автоматизировать**, ClipCascade создает DATA файл, там уже все есть, нужно просто запускать приложения в фоне.

Для начала докер, формально уже все есть, но докер стартует раньше libvirt, как итог -- он не стартует, потому что нет сети. Варианта два, глобальный для ВСЕХ контейнеров и разовый юнит, предлагаю юнит:

```bash {linenos=false}
sudo nano /etc/systemd/system/clipcascade-server-docker.service
```

```bash {hl_lines=[3,4]}
[Unit]
Description=ClipCascade Docker Compose
After=docker.service virtnetworkd.service
Requires=docker.service virtnetworkd.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/<USERNAME>/Software/InDocker/ClipCascade
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down

[Install]
WantedBy=multi-user.target

```

Не забудьте указать свои пути.

```bash {linenos=false}
sudo systemctl daemon-reload
```

```bash {linenos=false}
sudo sh -c 'systemctl enable --now clipcascade-server-docker.service && systemctl status clipcascade-server-docker.service'
```

Далее демон клиента ClipCascade:

```bash {linenos=false}
nano ~/.config/systemd/user/clipcascade.service
```

```bash
[Unit]
Description=ClipCascade Client
After=graphical-session.target

[Service]
Type=simple
WorkingDirectory=%h/Software/ClipCascade/
ExecStart=/usr/bin/bash -c "tail -f /dev/null | %h/Software/ClipCascade/venv/bin/python3 -u main.py --gui false --xmode false"
Restart=always
RestartSec=3

[Install]
WantedBy=graphical-session.target
```

`%h/` = `/home/username/` (работает только в юзерских сервисах).

```bash {linenos=false}
systemctl --user daemon-reload
```

```bash {linenos=false}
systemctl --user enable --now clipcascade.service && systemctl --user status clipcascade.service
```

Логи можно так поглядеть:

```bash {linenos=false}
journalctl --user -u clipcascade.service -f
```

Далее Windows.

**Если portable:**

Просто сделайте ярлык с <kbd>ALT</kbd> и киньте его в <kbd>WIN</kbd> + <kbd>R</kbd> --> `shell:startup`.

**Если установщик:**

Ничего не делать.

**Общее:**

В параметрах в поиске Firewall --> Windows Defender Firewall --> Allow an app or feature... --> сюда добавить ClipCascade.exe. _Чисто на всякий случай._

~~<kbd>WIN</kbd> + <kbd>R</kbd> --> `intl.cpl` --> Administrative --> Change system locale -- Use Unicode UTF-8..., и перезагрузить, иначе без этого возможно не сможете копировать и вставлять **не** английский текст.~~ -- не делайте это по умолчанию, некоторое ПО может с этим конфликтовать. Делайте только если это нужно/что-то не работает.

**Другая автоматизация**:

Если вас не устраивает постоянная работа ClipCascade в фоне на хосте, все-таки это Java которая отжирает в среднем 400-900мб ОЗУ просто потому что это **<span style="font-size:larger;">Java</span>**, можно запуск и выключение запихнуть в хуки.

Далее нужно переключить docker на тот же бэкенд, который использует libvirt в вашей системе, в случае openSUSE это nftables.

{{< callout/warn >}}
Далее где `virbr0` -- ваш бридж KVM, по дефолту (сеть "default") это именно "virbr0". Если запускать докер до VM/при старте ОС, а потом саму VM, то все будет окей. Но если запускать сначала VM, а потом докер, [то ломается сеть KVM](https://bbs.archlinux.org/viewtopic.php?id=233727?sl) ([1](https://wiki.archlinux.org/title/Docker#Starting_Docker_breaks_KVM_bridged_networking?sl), [2](https://forums.docker.com/t/docker-install-breaks-virtual-network-bridge/85705)). Это из-за конфликта с другими "владельцами" правил сети.

То что описано ниже это экспериментальная фича в новом docker (>=29) (на момент написания этого текста), и с ней работает не все фичи docker, если у вас домашний ПК, а не сервер где нужен SLA 100% и вы не используете Swarm -- то почему бы и нет.
{{< /callout/warn >}}

Меняем бэкенд:

```bash {linenos=false}
sudo nano /etc/docker/daemon.json
```

Туда добавляем `"firewall-backend": "nftables"`.

Включаем ip forwarding вручную, потому что это так-то делает сам docker, но в моем случае с nftables -- не делает, поэтому:

```bash {linenos=false}
echo "net.ipv4.ip_forward = 1" | sudo tee /etc/sysctl.d/99-ip-forward.conf && sudo sysctl --system
```

```bash {linenos=false}
sudo systemctl restart docker &&  docker ps && systemctl --user restart clipcascade.service && systemctl --user status clipcascade.service
```

Проверяем, что оно сменилось:

```bash {linenos=false}
sudo nft list tables
```

Там должно быть `ip docker-bridges`/`ip6 docker-bridges`.

Далее выключаем сервис/клиент и их автозапуск (если вы это включали ранее):

```bash {linenos=false}
sudo systemctl disable --now clipcascade-server-docker.service && systemctl --user disable --now clipcascade.service
```

И делаем хуки:

```bash {linenos=false}
sudo nano /etc/libvirt/hooks/qemu.d/win11/prepare/begin/95-clipcascade.sh
```

{{< remote-code url="https://github.com/nozsh/vfio/blob/main/qemu-hooks/start/95-clipcascade.sh" >}}

```bash {linenos=false}
sudo nano /etc/libvirt/hooks/qemu.d/win11/release/end/95-clipcascade.sh
```

{{< remote-code url="https://github.com/nozsh/vfio/blob/main/qemu-hooks/stop/95-clipcascade.sh" >}}

Сделать хуки исполняемыми:

```bash {linenos=false}
VM="win11"; sudo find /etc/libvirt/hooks/qemu.d/"$VM" -type f -name '*.sh' \( -path '*/prepare/begin/*' -o -path '*/prepare/end/*' -o -path '*/release/begin/*' -o -path '*/release/end/*' \) -exec chmod +x {} +
```

Где `win11` имя вашей VM.

Перезагружаем хост, чтоб прям наверняка все проверить, запускаем виртуалку, проверяем буфер обмена, затем выключаем виртуалку.

```bash {linenos=false}
docker ps && echo && systemctl --user status clipcascade.service
```

#### Альтернативы

Если вдруг вам не нравится ClipCascade, то можно попробовать [UniClipboard](https://github.com/UniClipboard/UniClipboard?sl) или вовсе KDE Connect, но возможно там не будет работать буфер изображений, только текста (насчет UniClipboard -- не уверен, насчет KDE Connect -- вероятно не будет).

### Общие папки

Разумеется Samba, как же иначе?

Создайте или морально выберите "shared" папку, в моем случае `~/Public/KVM`. У папки должны быть права 755 а.к.а `drwxr-xr-x`, именно с такими правами вы по умолчанию создаете папки от своего имени юзера (не root).

Открываем YaST --> Network Services --> Samba Server. _Да можно было и руками, но YaST все сделает за вас, почему бы и нет._

WORKGROUP оставьте WORKGROUP, это неважно.

Start-Up:
- After writing configuration: Start
- After reboot: Start on boot

Shares:
- Add... --> Добавьте свою папку
  - Share Name: Что-нибудь связанное с темой (у меня одноименно с названием папки), это вам еще понадобится
  - Share Description: Если надо
  - Share Type:
    - Directory, а не Printer
    - Share Path: выберите свою папку что создали ранее
    - Read-Only: ❌
    - Inherit ACLs: ❌
    - Expose Snapshots: ❌
    - Utilize Btrfs Features: ❌ (это про снапшоты, вроде как)
- Allow Users to Share Their Directories: ❌

Identity, Trusted Domain и LDAP Settings трогать не надо. Жмите ОК.

Далее чутка изменим конфиг:

```bash {linenos=false}
sudo nano /etc/samba/smb.conf
```

В `[global]`:

```conf {linenos=false}
        unix extensions = no
```

И там же `smb3 directory leases = Yes` заменить на `No`.

Далее найти `[kvm]` (ваш Share Name) и туда в блок добавить:

```conf
        force user = username
        force group = username
        create mask = 0664
        directory mask = 0775
        follow symlinks = yes
        wide links = yes
```

Где `username` ваш юзернейм. Это чтобы Windows делала файлы с правильными правами и вы могли свободно с ними работать на хосте.

`testparm` если все ok, то все ок.

Перезапускаем сервис:

```bash {linenos=false}
sudo sh -c 'systemctl restart smb nmb && systemctl status smb nmb'
```

Установить пароль для юзера samba:

```bash {linenos=false}
sudo smbpasswd -a username
```

Где `username` опять же ваш юзернейм.

Это нужно потому что иначе Windows вас за\*ебет, если есть желание покопаться в реестре и групповых политиках, то можете не ставить пароль, но тогда еще придется включить Guest mode для вашей папки в samba (можно сделать в YaST).

Проверка:

```bash {linenos=false}
smbclient -L 127.0.0.1 -N && smbclient -L 192.168.122.1 -N
```

Должно быть что-то типа:

```bash
        Sharename       Type      Comment
        ---------       ----      -------
        profiles        Disk      Network Profiles Service
        users           Disk      All users
        print$          Disk      Printer Drivers
        KVM             Disk      For KVM
        IPC$            IPC       IPC Service (Samba 4.24.3-git.475.629de6765b9SUSE-oS16.9-x86_64)
        nobody          Disk      Home Directories
SMB1 disabled -- no workgroup available
```

На обе команды. И контрольная проверка:

```bash {linenos=false}
smbclient //192.168.122.1/KVM -N
```

Где `KVM` это ваш Share Name.

Правила фаервола, просто на всякий случай:

```bash {linenos=false}
sudo sh -c 'firewall-cmd --zone=libvirt --add-service=samba --permanent && firewall-cmd --reload && firewall-cmd --zone=libvirt --list-services'
```

И если выполните:

```bash {linenos=false}
sudo ss -tlnp | grep 445
```

То увидите, что samba слушает все адреса, то есть доступна для других ПК в локальной сети, или в интернете (если у вас белый IP и не закрыты порты на роутере). Если вам samba не нужна для других сценариев использования, то лучше сделать так, чтобы она слушала только localhost и сеть KVM соответственно:

```bash {linenos=false}
sudo nano /etc/samba/smb.conf
```

В `[global]`:

```bash
        interfaces = lo virbr0
        bind interfaces only = yes
```

- `lo` -- localhost
- `virbr0` -- дефолтная (буквально "default") сеть KVM

```bash {linenos=false}
testparm
```

```bash {linenos=false}
sudo sh -c 'systemctl restart smb nmb && systemctl status smb && systemctl status nmb && sudo ss -tlnp | grep 445'
```

{{% details/1 "Если вы сделали `interfaces = lo virbr0`" %}}
При настройке общего буфера обмена мы делали так если он должен был запускаться вместе с системой.

Нужно поменять сервисы samba чутка:

```bash {linenos=false}
sudo systemctl edit smb.service
```

```bash {linenos=false}
sudo systemctl edit nmb.service
```

В оба сервиса добавить:

```conf {hl_lines=["4-6"]}
...
### Anything between here and the comment below will become the contents of the drop-in file

[Unit]
After=virtnetworkd.service
Requires=virtnetworkd.service

### Edits below this comment will be discarded

...
```

Это нужно чтобы samba стартовала строго после kvm сети, иначе она упадет потому что сети еще не будет.

Для справки, в чем прикол, если сделать это только для сервиса буфера обмена и запускать его вместе с системой, он будет тригерить запуск kvm сети, из-за чего samba будет работать с `interfaces = lo virbr0`, но если не запускать сервис буфера обмена вместе с системой то samba не будет работать без этих правок. Но так или иначе лучше это добавить в любом случае если вы используете `interfaces = lo virbr0`, независимо от того как вы запускаете сервис буфера обмена, так банально надежнее.
{{% /details/1 %}}

В Windows, ПКМ по This PC --> Map network drive --> Folder -- `\\192.168.122.1\KVM`. Connect using different credentials, там ваш username и пароль, и галочка на Remember my credentials. И не забудьте про галочку "Reconnect at sign-in", чтобы он автоматом подключался.

И проверьте, что все работает, посоздавайте файлы, и проверьте права на хосте `ls -l`.

Скрипт для симлинков (если надо).

{{< remote-code "https://github.com/nozsh/vfio/blob/main/scripts/host/rl.sh" >}}

```bash {linenos=false}
nano ~/Scripts/rl.sh
```

```bash {linenos=false}
chmod +x ~/Scripts/rl.sh
```

```bash {linenos=false}
ln -s ~/Scripts/rl.sh ~/.local/bin/rl
```

В начале скрипта укажите пути до папок/симлинков на шаре.

Чтобы использовать просто введите `rl` это help.

- `rl file` -- сделать симлинк на файл
- `rl dir/` -- сделать симлинк на директорию
- `rl file1 file2 dir1 dir2` -- сделать 4 симлинка.

Скрипт сам детектит диск, если вы делаете симлинк на файл/директорию которые находятся на "Disk 1", то и симлинк он кинет в "Disk 1" на шаре, аналогично с "Disk 2" и тд. и тп.

Про симлинки на директории, Windows удаляет папки рекурсивно, поэтому при удалении симлинков директорий на Windows, Windows заходит внутрь (так как не знает что это симлинк) и удаляет содержимое. У Windows такого страшного дела сделать не получается и папка не удаляется. Короче говоря, симлинки на папки можно удалять только с хоста.

---

Если шарите второй диск (для системного диска так лучше не делать!), а он просто не работает (DENIED) и у вас SELinux (на момент написания текста у openSUSE по дефолту SELinux), не забудьте про:

```bash {linenos=false}
sudo semanage fcontext -a -t samba_share_t "/mnt/second(/.*)?"
```

```bash {linenos=false}
sudo restorecon -R -v /mnt/second
```

Проверить можно так:

```bash {linenos=false}
sudo semanage fcontext -l | grep second
```

Где `second` ваша точка монтирования. Должно вывести `samba_share_t`.

## Дополнительно

### Аппаратные штуки

По умолчанию аппаратные фичи отключены по юридическим причинам. Так то темы виртуализации это особо не касается, а скорее про настройку ОС. Но может быть такое, что виртуалка не сможет использовать эти фичи, если их нету на хосте, поэтому я это и добавил, а оно так потому что `host-passthrough` -- дает виртуалки юзать аппаратные фичи процессора.

Аппаратные фичи можно проверить:

```bash {linenos=false}
grep -E "aes|sha" /proc/cpuinfo
```

Будет полотно текста, ищите наличие aes и sha. А также:

```bash {linenos=false}
sudo zypper in libva-utils
```

```bash {linenos=false}
vainfo
```

Если в списке отсутствует H.264 и H.265, то они отключены и их бы включить.

```bash {linenos=false}
sudo zypper in opi
```

```bash {linenos=false}
opi codecs
```

И со всем соглашайтесь в процессе. Если в процессе все встало и вы видите 403 ошибку, расчехляйте ВПН друзья и попробуйте снова (то что уже установило оно устанавливать не будет).

На будущее, при обновлении системы `zypper dup`, если будут ошибки с пакетами, так как в openSUSE могли их обновить, а в packman еще нет, выбирайте вариант в стиле "оставить старые версии" и просто попробуйте еще раз через пару дней, иначе лишитесь кодеков.

Снова проверяем:

```bash {linenos=false}
vainfo
```

И наблюдаем новые кодеки.

Проверить в Windows это тоже можно.

Для CPU:

Проверить можно через CPU-Z, а конкретно "Instructions".

Для dGPU (NVIDIA):

```batch {linenos=false}
nvidia-smi
```

Должно вывести таблицу. В диспетчере задач в Performance --> GPU должны быть Video Encode и Decode.

### Looking Glass (альтернатива переключению на мониторе)

LookingGlass -- альтернатива физическому переключению видеовыхода на мониторе, дает больше задержек, и сильнее нагружает систему, но удобно для работы или легких игр типа Kenshi или Sims. Ну, точнее, вам ничего не мешает использовать LG для чего угодно, но нативная картинка прямиком из GPU всегда будет лучше.

Очевидный плюс это окошко, что существует в хосте, а значит вам по-прежнему будут доступны монитор(ы) хоста и при этом вы сможете свободно крутить, вертеть, перемещать, "сворачивать Windows", удобно.

> _Все же однажды мечтали "свернуть" Windows?_

Looking Glass также умеет пробрасывать клавиатуру, мышь, буфер обмена и звук, что довольно удобно. Но работать это будет через spice, что довольно неудобно, ну на Wayland. Поэтому учитывая что я показывал как все это настроить по отдельности -- мы настроим LG чтобы только на Windows глазами глядеть, не более.

Для гостя нужны virtio драйвера см. [здесь](#гостевые-дополнения).

Нужно установить пакеты, но из-за того, что один из пакетов -- это kmp, в идеале сначала обновить всю систему `sudo zypper dup` и перезагрузить ПК. Иначе оно может в качестве зависимости обновить ядро Linux без обновления всего остального, что не есть хорошо.

Пакеты:

```bash {linenos=false}
sudo zypper install looking-glass-client looking-glass-kvmfr-kmp-default
```

Looking Glass **не умеет** в больше 1-го монитора, и Looking Glass захватит тот, что в госте ОСНОВНОЙ. То есть, размер надо рассчитывать исходя из монитора который будет захватываться.

Математика такая:{{% callout/inline hyphens %}}![Ema Skye Write](@loose/img/memes/animated.meonly-1.avif){{% /callout/inline %}}

$$ ((width \times height) \times (pixel\\_size \times 2) \div 1024 \div 1024) + 10 $$

Это размер кадра в МиБ + оверхед в 10 МиБ для служебных данных, это нужно округлить до ближайшей степени двойки.

У SDR (32-бит) pixel_size = 4, у HDR (64-бит) = 8.

Ну например FULLHD SDR:

$$
((1920 \times 1080) \times (4 \times 2) \div 1024 \div 1024) + 10 = 25.8 \approx 32 \ МиБ
$$

{{% details/1 "По порядку" %}}

1. &nbsp;$\ 1920 \times 1080 = 2073600$
2. &nbsp;$\ 2073600 \times 8 = 16588800$
3. &nbsp;$\ 16588800 \div 1024 = 16200$
4. &nbsp;$\ 16200 \div 1024 = 15.8203125$
5. &nbsp;$\ 15.8203125 + 10 = 25.8203125$
6. &nbsp;$\ 25.8203125 \to 2^{\lceil \log_2 25.8203125 \rceil} = 32$
   {{% /details/1 %}}

Примеры:

| Разрешение            | Кадр     | + 10 МиБ | Округление до степени 2 |
| --------------------- | -------- | -------- | ----------------------- |
| 1920×1080             | 15.8 МиБ | 25.8 МиБ | **32 МиБ**              |
| 2560×1440             | 28.1 МиБ | 38.1 МиБ | **64 МиБ**              |
| 3440×1440 (ultrawide) | 37.8 МиБ | 47.8 МиБ | **64 МиБ**              |
| 3840×2160 (4K)        | 63.3 МиБ | 73.3 МиБ | **128 МиБ**             |

Если вы **не** минималист, у вас **не** супер-дупер 32к телевизор и вы **не** хотите париться -- просто делайте 256 МиБ.

Настройка модуля:

```bash {linenos=false}
echo "options kvmfr static_size_mb=32" | sudo tee /etc/modprobe.d/kvmfr.conf
```

Где 32 -- тот самый размер в МиБ.

```bash {linenos=false}
echo kvmfr | sudo tee /etc/modules-load.d/kvmfr.conf
```

```bash {linenos=false}
sudo modprobe kvmfr
```

Проверка:

```bash {linenos=false}
ls -la /dev/kvmfr0
```

udev (права доступа):

```bash {linenos=false}
sudo nano /etc/udev/rules.d/71-kvmfr.rules
```

```bash {linenos=false}
SUBSYSTEM=="kvmfr", GROUP="kvm", MODE="0660"
```

```bash {linenos=false}
sudo sh -c 'udevadm control --reload-rules && udevadm trigger'
```

В `/etc/libvirt/qemu.conf` добавить `"/dev/kvmfr0"` в `cgroup_device_acl`.

Перезапустить сервис:

```bash {linenos=false}
sudo sh -c 'systemctl restart virtqemud && systemctl status virtqemud'
```

Далее:

```bash {linenos=false}
sudo EDITOR=nano virsh edit <имя_вашей_vm>
```

Там в самом начале:

```xml
<domain type='kvm'>
        🡓
<domain type='kvm' xmlns:qemu='http://libvirt.org/schemas/domain/qemu/1.0'>
```

И в самом конце, после закрывающегося `</devices>`, но до закрывающегося `</domain>` добавить:

```xml
<qemu:commandline>
  <qemu:arg value="-device"/>
  <qemu:arg value='{"driver":"ivshmem-plain","id":"shmem0","memdev":"looking-glass"}'/>
  <qemu:arg value="-object"/>
  <qemu:arg value='{"qom-type":"memory-backend-file","id":"looking-glass","mem-path":"/dev/kvmfr0","size":33554432,"share":true}'/>
</qemu:commandline>
```

`33554432` -- это 32 МиБ, но в байтах, $32 \times 1024 \times 1024$ .

Проверка:

```bash {linenos=false}
sudo virsh dumpxml <имя_вашей_vm> | grep -A6 "qemu:commandline"
```

{{< callout/note >}}
Поясняю "а че так". Virtual Machine Manager (GUI) просто не дает отредачить/добавить эти параметры, они просто удалятся при сохранении.

Но, если добавить через virsh edit, а потом менять какой-то XML через Virtual Machine Manager -- оно уже не будет удаляться.
{{< /callout/note >}}

Далее конфиг:

```bash {linenos=false}
mkdir -p ~/.config/looking-glass && nano ~/.config/looking-glass/client.ini
```

```ini
[app]
shmFile=/dev/kvmfr0

[spice]
enable=no
```

Также рекомендую:

```ini
[input]
hideCursor=no
escapeKey=KEY_ESC
```

Самое главное, это escapeKey, курсор по желанию. У вас есть клавиша Scroll Lock? А вы о ней хоть раз слышали? Ну вот в LG эта клавиша модификатор по умолчанию, настройка выше ее меняет, зажимаете и видите меню + можете еще [тут](https://looking-glass.io/docs/B7/usage/#default-key-bindings?sl) глянуть.

Если щас запустите LG то получите ошибку о том что Host приложение (на госте) не работает, если так, то хорошо.

На Windows качаем Windows Host Binary вот тут `https://looking-glass.io/downloads` и устанавливаем.

{{% details/1 "Permission denied" %}}
Если при запуске виртуалки получаете `...can't open backing store /dev/kvmfr0 for guest RAM: Permission denied`, то вероятно это SELinux, так как он включен по умолчанию на openSUSE.

Отключать я это не рекомендую, но чтоб наверняка:

```bash {linenos=false}
sudo getenforce
```

Или глобально проверить параметр `grep '^SELINUX=' /etc/selinux/config`.

Если Enforcing -- значит включено. Выполните:

```bash {linenos=false}
sudo setenforce 0
```

Это переключит в permissive, попробуйте снова запустить виртуалку. Если сработало это из-за SELinux.

Если так. Для начала переключаем обратно:

```bash {linenos=false}
sudo setenforce 1
```

Далее:

```bash {linenos=false}
sudo sh -c 'semanage fcontext -a -t svirt_image_t '/dev/kvmfr0' &&  restorecon -v /dev/kvmfr0'
```

Проверка:

```bash {linenos=false}
ls -Z /dev/kvmfr0
```

Должно быть `svirt_image_t`.

А также:

```bash {linenos=false}
sudo nano /etc/udev/rules.d/71-kvmfr.rules
```

Туда в конец добавить:

```bash {linenos=false}
...MODE="0660", RUN+="/usr/sbin/restorecon %E{DEVNAME}"
```

```bash {linenos=false}
sudo sh -c 'udevadm control --reload-rules && sudo rmmod kvmfr && sudo modprobe kvmfr && ls -Z /dev/kvmfr0'
```

{{% /details/1 %}}

{{< callout/note >}}
Сходу в Looking Glass у вас вероятно будет мыло, чтобы его не было окно LG надо открыть fullscreen, прям вот полный-полный экран, как игры например обычно открываются.

Либо же, если вы хотите ощутить нереальный дзен на WM, ну например Niri, выполняете `niri msg windows`, ищите там размер окна LG, и через NVIDIA, AMD, Intel создаете кастомное разрешение монитора. Уф! Как же это стильно выглядит :D
{{< /callout/note >}}

### Скрипт переключения VFIO (Холодный проброс)

Положите куда-нибудь скрипт и конфиги, ну например:

```bash {linenos=false}
mkdir -p /home/$USER/Scripts/vfiopt
```

Создайте скрипт и конфиги с нужным содержимым (см. Проброс dGPU):

```bash {linenos=false}
touch /home/$USER/Scripts/vfiopt/vfiopt.sh /home/$USER/Scripts/vfiopt/modprobe-vfio.conf /home/$USER/Scripts/vfiopt/dracut-vfio.conf /home/$USER/Scripts/vfiopt/vfiopt.conf
```

```bash {linenos=false}
(echo; head -n -0 /etc/{modprobe,dracut.conf}.d/vfio.conf; echo)
```

Так же в `nano /home/$USER/Scripts/vfiopt/vfiopt.conf` укажите PCI адрес dGPU и ее аудио:

```bash
# PCI dGPU & Audio (0000:XX:XX.X)
DGPU_DEVS="0000:01:00.0 0000:01:00.1"
```

Сам скрипт:

```bash {linenos=false}
sudo nano /home/$USER/Scripts/vfiopt/vfiopt.sh
```

{{< remote-code "https://github.com/nozsh/vfio/blob/main/scripts/host/vfiopt.sh" >}}

```bash {linenos=false}
sudo chmod 755 /home/$USER/Scripts/vfiopt/vfiopt.sh
```

Сделайте симлинк:

```bash {linenos=false}
sudo ln -s /home/$USER/Scripts/vfiopt/vfiopt.sh /usr/local/bin/vfiopt
```

Перезапустите терминал. И запускать скрипт из любого места:

```bash {linenos=false}
vfiopt
```

### Про проброс VFIO

Как вы могли заметить в `/sbin/vfio-pci-override.sh`:

```bash
DEVS="0000:01:00.0 0000:01:00.1"
```

Есть такая запись, в нее можно добавить не только видеокарту, а что угодно, типа:

```bash
DEVS="0000:01:00.0 0000:01:00.1 0000:X 0000:X 0000:X"
```

И все это будет проброшено vfio.

### Проброс температур GPU с гостя на хост

Для гостя нужны virtio драйвера см. [здесь](#гостевые-дополнения).

Вам это может вовсе и не нужно, но кому нужно покажу, так же учтите, что главный сценарий проброса температур нужен, если у вас горячий проброс, если у вас холодный проброс, то данный мной python скрипт можно сильно упростить.

Лично мне не хватает встроенного «Smart Fan» в биосе, потому я предпочитаю контролировать кулера процессора и корпуса, ориентируясь на температуру процессора и видеокарты по "MAX". То есть, если греется проц, то такая кривая, если карта, то такая кривая.

Соответственно, когда карта проброшена в гостя ее температуры в хосте не доступны, а гость не имеет доступа к корпусным кулерам. Также после, я покажу свой пример, как с [CoolerControl](https://gitlab.com/coolercontrol/coolercontrol?sl).

{{< callout/warn >}}
Текст ниже ИСКЛЮЧИТЕЛЬНО для NVIDIA GPU.

Обязательно нужны проприетарные драйвера NVIDIA как на хосте так и госте, так как мы будем использовать nvidia-smi --> NVML.

nvidia-smi это оф. утилита обертка для NVML, которая входит в проприетарный драйвер NVIDIA, и мы будем использовать NVML напрямую.
{{< /callout/warn >}}

Итак, начнем.

В настройках виртуалки Add hardware --> Channel:

- Name: org.local.gpu-temp
- Device Type: UNIX socket (unix)
- Auto socket: ✅

Запустите виртуалку. На хосте:

```bash {linenos=false}
sudo virsh dumpxml win11 | grep -B2 -A2 "org.local.gpu-temp"
```

Где `win11` имя вашей виртуалки. Вывод:

```xml
<channel type='unix'>
  <source mode='bind' path='/run/libvirt/qemu/channel/2-win11/org.local.gpu-temp'/>
  <target type='virtio' name='org.local.gpu-temp' state='disconnected'/>
  <alias name='channel0'/>
  <address type='virtio-serial' controller='0' bus='0' port='1'/>
```

Тут нужен `path` -- `/run/libvirt/qemu/channel/2-win11/org.local.gpu-temp` -- запомните путь, может понадобиться в Python скрипте. Теперь виртуалку можно выключить для дальнейших тестов.

Добавляемся в группу `sudo usermod -aG qemu $USER` (на всякий случай) и перезагружаемся.

Создаем python скрипт:

```bash {linenos=false}
sudo mkdir -p /usr/local/sbin/gpu-temp-bridge
```

```bash {linenos=false}
sudo nano /usr/local/sbin/gpu-temp-bridge/gpu-temp-bridge.py
```

{{< remote-code "https://github.com/nozsh/vfio/blob/main/scripts/host/gpu-temp-bridge.py" >}}

Не забудьте поменять имя виртуалки, путь сокета (если отличается) и PCI dGPU на свои.

{{< callout/note >}}
В будущем (вероятно **очень** далеком), файл библиотеки "libnvidia-ml.so" (название) может поменяться мажорная версия `.so-1` --> `.so-2`, имейте это в виду.
{{< /callout/note >}}

Python скрипт берет температуру с хоста, но если датчик недоступен, то берет температуру из сокета гостя. В случае чего если ничего недоступно ставится температура из `FALLBACK_TEMP`,{{% callout/inline hyphens %}}Это не так важно -- 50 это ни много ни мало, но лучше конечно поставить индивидуальное значение -- ваша температура карты в простое.{{% /callout/inline %}} но это может показаться небезопасно. И оно так и есть, но не совсем.

{{< callout/note >}}
Про небезопасно, небезопасно для GPU **только** если вы хотите контролить кулера GPU. Но если вы хотите контролить кулера GPU, то пробрасывать температуру на хост **не нужно**, хост уже имеет полный доступ к dGPU, когда виртуалка **не** запущена.

Ровно так же, как и гость имеет полный доступ к dGPU, когда виртуалка запущена. То есть контролить кулера GPU следует на той ОС, где карта сейчас используется. Это же все чисто ради того, чтобы контролить любые другие кулера, опираясь на температуру GPU.

_Иными словами, и хост, и гость могут контролировать кулера GPU, когда GPU используется ими, но все остальные кулера может контролировать только хост._
{{< /callout/note >}}

Быстрая проверка, просто запустите скрипт

```bash {linenos=false}
python3 /usr/local/sbin/gpu-temp-bridge/gpu-temp-bridge.py
```

И в соседнем терминале:

```bash {linenos=false}
watch -n 1 cat /dev/shm/gpu-temp
```

Вы должны увидеть температуру. Нагрузите как-нибудь видеокарту, ну например:

```bash {linenos=false}
sudo zypper in glmark2
```

Это такой легчайший бенчмарк, далее запустите его через dGPU:

```bash {linenos=false}
__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia glmark2
```

Температура меняется? Если да, то круто.

Далее стартуем виртуалку.

{{< callout/hint >}}
При запуске виртуалки будет ошибка/упадет скрипт (его убьет хук), это нормально, просто запустите его снова. Далее в автоматизации мы сделаем, чтобы было все четко.
{{< /callout/hint >}}

В Windows запустите powershell от имени админа:

```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

И согласитесь (Y). Это чтобы можно было запускать скрипты от имени админа.

Далее создаем скрипт "gpu-temp-bridge.ps1":

{{< remote-code url="https://github.com/nozsh/vfio/blob/main/scripts/guest/windows/gpu-temp-bridge.ps1" lang="powershell" >}}

Запускаем, и с гостя чем-нибудь нагружаем видеокарту, если в хосте циферки побежали, то все работает, температура проброшена.

_`gpu-temp-bridge.ps1` лучше положить куда-нибудь, а не просто на "рабочем столе" оставить, так как далее мы сделаем задачу автозапуска._

Выключаем виртуалку и автоматизируем, сделаем демона и автозапуск.

Создаем демона:

```bash {linenos=false}
sudo nano /etc/systemd/system/gpu-temp-bridge.service
```

```bash
[Unit]
Description=GPU temperature bridge (host NVML / guest virtio-serial -> /dev/shm)
After=virtqemud.service

[Service]
Type=simple
ExecStart=/usr/bin/python3 /usr/local/sbin/gpu-temp-bridge/gpu-temp-bridge.py

Restart=on-failure
RestartSec=5

User=root

[Install]
WantedBy=multi-user.target
```

```bash {linenos=false}
sudo rm -rf /dev/shm/gpu-temp
```

```bash {linenos=false}
sudo systemctl daemon-reload
```

```bash {linenos=false}
sudo sh -c 'systemctl enable --now gpu-temp-bridge.service && systemctl status gpu-temp-bridge.service'
```

Посмотреть логи:

```bash {linenos=false}
sudo journalctl -u gpu-temp-bridge.service -f
```

Далее создаем хуки, до выдергивания dGPU и после:

```bash {linenos=false}
sudo nano /etc/libvirt/hooks/qemu.d/win11/prepare/begin/09-dgpu-bridge-stop.sh
```

{{< remote-code "https://github.com/nozsh/vfio/blob/main/qemu-hooks/start/09-dgpu-bridge-stop.sh" >}}

```bash {linenos=false}
sudo nano /etc/libvirt/hooks/qemu.d/win11/prepare/begin/11-dgpu-bridge-start.sh
```

{{< remote-code "https://github.com/nozsh/vfio/blob/main/qemu-hooks/start/11-dgpu-bridge-start.sh" >}}

И на всякий случай (чтобы наверняка):

```bash {linenos=false}
sudo nano /etc/libvirt/hooks/qemu.d/win11/release/end/11-dgpu-bridge-restart.sh
```

{{< remote-code "https://github.com/nozsh/vfio/blob/main/qemu-hooks/stop/91-dgpu-bridge-restart.sh" >}}

Проверяйте, запускайте виртуалку, далее автоматизируем powershell.

Создайте временный .ps1 скрипт (он создаст задачу):

```powershell
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File C:\Scripts\gpu-temp-bridge.ps1"

$trigger = New-ScheduledTaskTrigger -AtStartup

$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RestartCount 999 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -ExecutionTimeLimit ([TimeSpan]::Zero)

Register-ScheduledTask -TaskName "GpuTempBridge" -Action $action -Trigger $trigger `
    -Principal $principal -Settings $settings -Force
```

`C:\Scripts\gpu-temp-bridge.ps1` -- не забудьте указать свой путь до мейн скрипта.

Запускаем powershell от имени админа и стартует этот скрипт, выключаем все, включаем все, если все работает без ваших рук, поздравляю, _вы извращенец_.

---

Итак, **CoolerControl**. Если нажать на "+" и там "Custom Sensor" в открывшемся окне можно выбрать Sensor Type: File, и просто указать путь до `/dev/shm/gpu-temp`. И еще надо отключить обычные сенсоры dGPU там же.

Но CoolerControl все равно дох\*я принципиальный и все равно будет использовать dGPU, из-за чего трагически погибнет от рук хука. Можно, конечно и его демона в хук засунуть, но это уже будет неэлегантным решением, а костылем, _да это другое_.

```bash {linenos=false}
sudo systemctl edit coolercontrold
```

Там добавить:

```conf {hl_lines=["4-10"]}
### Editing /etc/systemd/system/coolercontrold.service.d/override.conf
### Anything between here and the comment below will become the contents of the drop-in file

[Service]
Environment="CUDA_VISIBLE_DEVICES="
DevicePolicy=closed
DeviceDeny=/dev/nvidiactl
DeviceDeny=/dev/nvidia0
DeviceDeny=/dev/nvidia-uvm
DeviceDeny=/dev/nvidia-modeset

### Edits below this comment will be discarded


### /usr/lib/systemd/system/coolercontrold.service
# [Unit]
# Description=CoolerControl Daemon
...
```

Далее:

```bash {linenos=false}
sudo sh -c 'sudo systemctl daemon-reload && systemctl restart coolercontrold.service'
```

Также в CoolerControl надо отключить сенсоры dGPU и запускать сам GUI на iGPU (читать ниже -- FATAL: Module X is in use).

Далее нужно заставить появиться кулера, если их нет.

```bash {linenos=false}
sudo sensors-detect
```

Везде Enter кроме последнего "Lastly, we can probe the I2C/SMBus adapters for connected hardware...".

И если в конце вы получили:

```
Sorry, no sensors were detected.
Either your system has no sensors, or they are not supported, or
they are connected to an I2C or SMBus adapter that is not
supported. If you find out what chips are on your board, check
https://hwmon.wiki.kernel.org/device_support_status for driver status.
```

Всему виной gigabyte. Так как у меня именно gigabyte я покажу, как это исправить. Если у вас не gigabyte -- смотрите [это](https://docs.coolercontrol.org/hardware-support.html#motherboard-fans?sl).

```bash {linenos=false}
git clone https://github.com/frankcrawford/it87 && cd it87/
```

```bash {linenos=false}
sudo zypper in dkms
```

```bash {linenos=false}
sudo ./dkms-install.sh
```

Дальше либо все ок, либо:

```
...
Running depmod... done.
modprobe: ERROR: could not insert 'it87': Key was rejected by service
make: *** [Makefile:110: dkms] Error 1
Finished running dkms install steps.
```

Это из-за Secure Boot:

```bash {linenos=false}
sudo mokutil --import /var/lib/dkms/mok.pub
```

Придумайте какой-нибудь простой пароль, и перезагрузитесь. На этапе загрузки будет MOK экран, где нужно enroll key и ввести придуманный пароль. Аналогично у вас было с драйверами NVIDIA и вероятно root паролем, если у вас Secure Boot.

Проверяем, загрузились ли драйвера:

```bash {linenos=false}
lsmod | grep it87
```

Если нет, то делаем все описанное ниже

```bash {linenos=false}
sudo modprobe it87
```

Если не сработало, то:

```bash {linenos=false}
sudo modprobe it87 ignore_resource_conflict=1
```

И добавить модуль в автозагрузку:

```bash {linenos=false}
echo "it87" | sudo tee /etc/modules-load.d/it87.conf
```

И это если на предыдущем шаге не сработало без `ignore_resource_conflict=1`:

```bash {linenos=false}
echo "options it87 ignore_resource_conflict=1" | sudo tee /etc/modprobe.d/it87.conf
```

**Проверяем**:

```bash {linenos=false}
sensors
```

Видите это?

```
fan1:         858 RPM  (min =    0 RPM)
fan2:         764 RPM  (min =    0 RPM)
fan3:         732 RPM  (min =    0 RPM)
fan4:           0 RPM  (min =    0 RPM)
fan5:         855 RPM  (min =    0 RPM)
pwm1:             25%  (freq = 23437 Hz)
pwm2:             20%  (freq = 23437 Hz)
pwm3:             24%  (freq = 23437 Hz)
pwm4:             25%  (freq = 23437 Hz)
pwm5:             25%  (freq = 23437 Hz)
...
```

Значит все круто.

И обязательно прочтите [readme](https://github.com/frankcrawford/it87/?sl) чтобы знать, как обновлять, это важно.

Если кулера не управляются вручную или через CoolerControl и прочие, то нужно зайти в биос и там в Smart Fan, чтобы "сбросить" кривые, а конкретно сделать **ОДНУ** точку, потому что Smart Fan как бы переопределяет это. То есть сделать типа такого:

|         | 1   | 2   | 3   | 4   | 5   | 6   | 7   |
| ------- | --- | --- | --- | --- | --- | --- | --- |
| PWM(%)  | 25  | 25  | 25  | 25  | 25  | 25  | 100 |
| Temp(C) | 0   | 80  | 80  | 80  | 80  | 80  | 80  |

Где 25 минимальная скорость, которую вы хотите (разумно, не надо делать 0) на случай отвала CoolerControl, чтобы не было перегрева. Где 100, просто 100. Где Temp первое всегда 0, остальные макс. возможное, у меня это 80. Например, если я поставлю 90, перезагружусь снова в биос, то оно сбросится на 80.

{{< callout/warn >}}
После обновления ОС (в основном ядра) кулера могут пропасть, а могут работать в "read-only", фиксится переустановкой (в моем случае) it87:

```bash
$ sudo dkms status | grep it87
it87/v1.0-232-g20f2f2f.20260416, 7.1.2-1-default, x86_64: installed (Original modules exist)

$ sudo dkms remove it87/v1.0-232-g20f2f2f.20260416 --all
Module it87/v1.0-232-g20f2f2f.20260416 for kernel 7.1.2-1-default (x86_64):
Before uninstall, this module version was ACTIVE on this kernel.
Deleting /lib/modules/7.1.2-1-default/updates/it87.ko.zst
Restoring archived original module /lib/modules/7.1.2-1-default/kernel/drivers/hwmon/it87.ko.zst
Running depmod... done.

$ sudo modprobe -r it87

$ sudo ./dkms-install.sh
About to run dkms install steps...
Creating symlink /var/lib/dkms/it87/v1.0-232-g20f2f2f.20260416/source -> /usr/src/it87-v1.0-232-g20f2f2f.20260416
Sign command: /lib/modules/7.1.3-1-default/build/scripts/sign-file
Signing key: /var/lib/dkms/mok.key
Public certificate (MOK): /var/lib/dkms/mok.pub

Building module(s)... done.
Signing module /var/lib/dkms/it87/v1.0-232-g20f2f2f.20260416/build/it87.ko
Found pre-existing /lib/modules/7.1.3-1-default/kernel/drivers/hwmon/it87.ko.zst, archiving for uninstallation
Installing /lib/modules/7.1.3-1-default/updates/it87.ko.zst
Running depmod... done.
Finished running dkms install steps.

$ sudo systemctl restart coolercontrold.service

$ sudo mokutil --import /var/lib/dkms/mok.pub # на всякий случай проверить
```
{{< /callout/warn >}}

### Проброс дополнительных устройств в VM

Два главных способа:

1. пробросить само устройство и только его
2. пробросить целиком USB "порт" (контроллер), то есть это VFIO

Первый максимально простой, универсальный и сработает в любом случае (вопрос только как хорошо).

Но второй только при крутых IOMMU группах и есть нюанс -- обычно USB порты на одном контроллере, вероятность того что получится пробросить только 1 порт, а не всю пачку, крайне мала, я бы даже сказал невозможно, потому что порт не пробрасывается -- пробрасывается контроллер. Ну например отдельная PCI USB карта, с ней этого нюанса не будет.

Очевидный плюс такого проброса это производительность, это как проброс dGPU, тоже самое, полностью отдаем гостю. В первом же способе оно все равно идет через хост, что вызывает задержки, и может вызвать приличные "нюансы" на USB флешках/дисках, веб-камерах и тп. С устройствами ввода -- геймпады, мыши, клавиатуры, "нюансы" не заметны хоть и есть если вы киберкотлета.

_Я буду показывать на примере китайского геймпада GameSir с подключением через донгл._

#### Проброс конкретного устройства

Тут все очень просто. Подключаем устройство. В моем случае оно определяется как DualShock 4 (китайцы любят эмулировать DualShock/XBOX геймпады для совместимости).

Далее в параметрах виртуалки, Add Hardware --> USB Host Device, и ваше устройство, все. Готово.

Но, я рекомендую еще поменять Startup Policy на Optional, это нужно чтобы если устройство не подключено физически, виртуалка **запустилась**, а не кинула ошибку.

Отвечаю на очевидные вопросы:

> Надо ли **подключать** устройство ДО запуска виртуалки или можно после? Нужно ДО, иначе не пробросится, _но, смотрите след. вопрос, не суть важно._

> Что если во время работы виртуалки, устройство отключится по какой-то причине, нужно будет перезапускать виртуалку? Да, но на самом деле не обязательно, можно просто удалить устройство и добавить его снова пока виртуалка работает.

#### Проброс USB порта (контроллера; VFIO)

Нативный натив. И разумеется у вас должны быть четкие IOMMU группы, чтобы пробрасываемый PCI был в отдельной группе, об этом уже было в гайде.

Подключаем устройство, далее:

```bash {linenos=false}
lsusb
```

В моем случае `Bus 001 Device 008: ID 054c:09cc Sony Corp. DualShock 4 [CUH-ZCT2x]` (почему DualShock если GameSir -- смотреть выше).

Что мы видим, "Bus 001" и "Dev (Device) 008", далее:

```bash {linenos=false}
lsusb -t
```

Смотрим на "Bus 001", в моем случае это вся нах\*й задняя панель материнской платы. То есть для меня это не вариант.

Но... у меня есть type-c на передней панели и на задней панели материнской платы, и вот для них типично находится на отдельных контроллерах, потому что требуют огромных скоростей. Втыкаем туда что-нибудь, и проверяем:

```bash
lsusb
Bus 003 Device 015: ID 214b:7000 Huasheng Electronics 4-port hub [Maxxter ACT-HUB2-4P, HS8836, iSoul ultra-slim]
Bus 003 Device 018: ID 054c:09cc Sony Corp. DualShock 4 [CUH-ZCT2x]

lsusb -t
/:  Bus 003.Port 001: Dev 001, Class=root_hub, Driver=xhci_hcd/2p, 480M
    |__ Port 001: Dev 015, If 0, Class=Hub, Driver=hub/4p, 480M
        |__ Port 004: Dev 018, If 0, Class=Human Interface Device, Driver=usbhid, 12M
```

_Huasheng это USB хаб, а в него втыкнут донгл геймпада._

И все, под Bus 003 больше ничего нету, и точно такая же ситуация с type-c на задней панели. И вот с этим уже можно работать, а остальное дело техники, переходники, хабы и все такое, как у меня уже сделано :D

Узнаем PCI:

```bash {linenos=false}
readlink -f /sys/bus/usb/devices/usb3
```

Bus 003 = usb3 соответственно. Получаем что-то вроде:

```
/sys/devices/pci0000:00/0000:00:08.1/0000:11:00.3/usb3
```

Нужен `0000:11:00.3`.

Далее, если вы используете Virtual Machine Manager, а не запускаете виртуалку напрямую через QEMU из терминала (а в этом гайде про это ничего не говорилось, так что расчет на то что вы запускаете через Virtual Machine Manager), libvirt будет делать всю магию под капотом, так как драйвера USB не такие наглые как драйвера GPU, оно само отвяжет устройство от хоста при запуске виртуалки.

То есть, Add Hardware --> PCI Host Device --> этот самый PCI, прям как добавляли PCI dGPU. Готово.

Та-да --- подключаемые устройства работают нативно и абсолютно минуют хост систему, когда включена виртуалка, что еще и безопасно (для всяких проверок).

## Проблемы

### FATAL: Module X is in use

```bash {linenos=false}
sudo lsof /dev/nvidia* /dev/dri/by-path/pci-0000:01:00.0*
```

Тут разумеется ваш dGPU PCI -- `lspci | grep -E "VGA|3D|Display"`.

Проверьте, что использует карту, ну например в моем случае частенько такая штука:

```bash
COMMAND  PID   USER FD   TYPE  DEVICE SIZE/OFF NODE NAME
code    5485   user 28u   CHR 195,255      0t0 1348 /dev/nvidiactl
code    5485   user 29u   CHR 226,129      0t0 1325 /dev/dri/by-path/../renderD129
```

`code` это VSCode, который слегка прих\*ел использовать dGPU, нужно просто закрыть/убить процесс и все. Если там что-то системное, то смотреть ниже про KDE Plasma.

Что если вы не хотите, чтобы приложение убивалось, можно сразу запускать его на iGPU. Но в случае VS Code это не сработает, так как там то, что вы запускаете это обертка, запустив ее с нужными параметрами, сам VSCode не запустится на iGPU, а изменив обертку -- обновление VS Code, в случае VS Code проще отключить аппаратное ускорение.

Для остальных приложений, для `.desktop`:

```bash
Exec=env __EGL_VENDOR_LIBRARY_FILENAMES=/usr/share/glvnd/egl_vendor.d/50_mesa.json VK_ICD_FILENAMES=/usr/share/vulkan/icd.d/radeon_icd.x86_64.json /path/to/bin
```

Для терминала просто:

```bash
__EGL_VENDOR_LIBRARY_FILENAMES=/usr/share/glvnd/egl_vendor.d/50_mesa.json VK_ICD_FILENAMES=/usr/share/vulkan/icd.d/radeon_icd.x86_64.json /path/to/bin
```

Обратите внимание `__EGL_VENDOR_LIBRARY_FILENAMES` и `VK_ICD_FILENAMES` отличаются в зависимости от вендора Intel/AMD/NVIDIA/что-то другое? Китайцы?

### Мигает экран и не запускается VM после обновления ОС (KDE Plasma)

Проверьте PCI dGPU:

```bash {linenos=false}
sudo lsof /dev/nvidia* /dev/dri/by-path/pci-0000:01:00.0*
```

Тут разумеется ваш dGPU PCI -- `lspci | grep -E "VGA|3D|Display"`.

Там наверняка будет куча всего, куча всего, что юзает вашу dGPU, а не должно, и вероятно это что-то, что отвечает за окружение, вероятно это KWin. А использует он не прям вашу карту (cardX), а только рендеринг EGL/OpenGL, хотя фактически саму карту он не использует (не выводит через нее картинку на экран), из-за чего кажется, что все как бы окей.

Как следствие хук убивает KWin чтоб отвязать карту, а заодно и сам себя (KVM). Из-за трагичной смерти, KWin экстренно возрождается, потому-то экран и мигает.

Поздравляю, дообновлялись :D

Это KWin, познакомьтесь. Вероятно он время от времени будет ломаться из-за обновлений, которые меняют его поведение (логику инициализации GPU), и решение (возможно) искать вам, к слову во время написания текста (до первой публикации), я обновил систему, и в первый раз с этим столкнулся, решением было (что уже описано в главе проброса dGPU) `__EGL_VENDOR_LIBRARY_FILENAMES`.

{{< imgs/img
notp=false
loading=""
caption="Welcome to the «VFIO» club buddy, как говори-ца!"
alt="Simpsons: Ned Flanders - Welcome to the Club"
width="100%"
src="@loose/img/memes/animated.simpsons-ned-flanders-welcome-to-the-club-1.avif" >}}

Как сделать так, чтобы не ломалось? Просто сделать нельзя, можно мониторить и отслеживать changelog. Или более радикальный способ -- не использовать KWin, то есть не использовать KDE Plasma. Ну или не пробрасывать на горячую, только холодный проброс, _но если вы зачем-то хотите именно на горячую, то и смысла на холодную нету._

Да я понимаю тут явное противоречие, я говорил вот это будем использовать, а сейчас наоборот. Но для первого раза, с учетом того, что текст рассчитан на аудиторию, что "шарит, но как бы и не очень, но опыт есть", _мое мнение_, и правда лучше использовать rich-GUI штуку для наглядности, если так можно выразиться.

Большинство описанных тут вещей и так сработают без KDE Plasma, просто игнорируете все, где фигурирует KWin (возможно еще X11, зависит от вас) и KDE Plasma соответственно, но придется найти альтернативу для вашей DE/WM -- "пересадить" все на iGPU, это почти все, что надо, и не исключено, что "там" в этом плане, будет даже проще (так например на Niri -- очень просто).

Я же со своей стороны, _даже если буду использовать другую DE/WM_, постараюсь быть в курсе и применять фиксы. Но добавлять я их буду бесшовно, то есть как будто бы так надо было с самого начала, но лог обновления оставлю.

### Зависание при выключение/перезагрузки VM и 100% CPU

Это баг NVIDIA/AMD связанный с FLR. Для NVIDIA фикса нет. А у меня нету AMD, но для AMD возможно поможет [это](https://github.com/gnif/vendor-reset?sl).

Просто делайте "двойной" shutdown через Virtual Machine Manager. Если это не force off, а именно shutdown, то это безопасно. Либо выключайте из Windows + Shutdown из Virtual Machine Manager, либо два раза shutdown из Virtual Machine Manager.

Или типа такая автоматизация:

```bash
#!/bin/bash

if [[ $EUID -ne 0 ]]; then
    exec sudo "$0" "$@"
fi

VM="$1"

virsh shutdown "$VM"
sleep 16
virsh shutdown "$VM"
```

Разумеется это костыль.

А так же виной может быть X софтина, с ядерным драйвером. Проверить это просто, выключите Windows из Windows смотря на Windows через монитор напрямую, а не через LG, если там BSOD с ошибкой типа "VIDEO_DXGKRNL_FATAL_ERROR" -- то это ваш случай. _Для справки: LG не показывает BSOD экран._

Например в моем случае это MSI Afterburner. Даже если его закрыть перед выключением, его драйвер остается загруженным. После того как я убрал его из автозагрузки и запустил VM, она начала выключаться абсолютно нормально.

2 способа это исправить:

1. Не использовать MSI Afterburner вообще
2. Выгрузить драйвер / Не загружать драйвер

Не загружать драйвер: General --> Enable low-level IO driver - выкл. _Применится только после перезагрузки VM._

В чем минусы отключения этого драйвера? В основном датчики. Андервольт/оверклокинг работает через драйвер NVIDIA (это просто удобный интерфейс, не более), так что там все будет работать. А для датчиков есть HWiNFO, GPU-Z, Aida64, что угодно.

### Проблема X в Windows из-за Y

В этом тексте разбирался VirtIO/VFIO диск, в обоих случаях Windows физически устанавливается на диске, без вирт. дисков. Если что-то не обноляется, что-то конкретно сломалось, еще какой-то п\*здец мировых масштабов -- вы всегда можете просто "дуалбутнутся" в Windows.

Два момента, **СЛЕДИТЕ** за BitLocker. Я не знаю почему, но после одной такой загрузки Windows, эта дура решила самолично врубить шифрование диска спустя месяцев работы в VM, и хорошо что я это заметил.

Если шифрование включиться, то ключа у вас не будет как и вменяемого способа разблокировки если вы не вошли в свой Microsoft аккаунт ранее. И при разницы в TPM, а она будет если вы его эмулировали или еще какой-нибудь еб\*нины в стиле Windows -- диск заблокируется, и потребует пароль, которого вы физически знать не можете.

Проверить статус BitLocker можно так (powershell от имени админа):

```ps {linenos=false}
manage-bde -status
```

Отключить можно так:

```ps {linenos=false}
manage-bde -off
```

После отключения, вводите первую команду на проверку время от времени и ждете пока не будет Fully Decrypted (проценты будут уменьшаться), и только потом перезагружайтесь в Linux (если вы были на Windows на голом железе).

А еще **ВЫКЛЮЧАЙТЕ** Fast Startup и гибернацию, если они будут включены, и вы будите прыгать между KVM и дуалбутом -- файловая система скажет «кря». Для отключения в терминале от имени админа:

```batch {linenos=false}
powercfg /h off
```

Проверить включено ли оно:

```batch {linenos=false}
powercfg /a
```

Так же мой совет, отключайте обновления Windows, и включайте только когда вам это нужно. Отключить можно как угодно, главное железно и при этом не навсегда (с возможностью включить обратно).

## Как обновлять QEMU/KVM

На время **всех** этих действий, виртуалка, разумеется, должна быть выключена.

Помимо само разумеющегося `zypper dup` -- обновление всей системы, в XML есть такое:

```xml
<os firmware="efi">
  <type arch="x86_64" machine="pc-q35-10.2">hvm</type>
...
```

`pc-q35-10.2` <-- тоже надо обновлять. После обновления QEMU, выполняете:

```bash {linenos=false}
qemu-system-x86_64 -machine help | grep q35
```

Это покажет все версии. Берете самую новую и вручную меняете в XML.

Но сначала рекомендую сделать бэкап. Бэкап XML:

```bash {linenos=false}
sudo virsh dumpxml win11 > ~/win11.xml
```

Бэкап NVRAM файла (если `<os firmware="efi">`):

```bash {linenos=false}
sudo virsh dumpxml win11 | grep nvram
```

В выводе:

```xml
<nvram template='/usr/share/qemu/ovmf-x86_64-smm-ms-vars.bin' templateFormat='raw' format='raw'>/var/lib/libvirt/qemu/nvram/win11_VARS.fd</nvram>
```

Нужен `/var/lib/libvirt/qemu/nvram/win11_VARS.fd`:

```bash {linenos=false}
sudo cp /var/lib/libvirt/qemu/nvram/win11_VARS.fd ~/
```

---

Восстановить бэкап:

```bash {linenos=false}
sudo virsh define ~/win11.xml
```

Проверить:

```bash {linenos=false}
sudo virsh dumpxml win11 | diff - ~/win11.xml
```

И NVRAM:

```bash {linenos=false}
sudo cp ~/win11_VARS.fd /var/lib/libvirt/qemu/nvram/win11_VARS.fd
```

## Итоги & Бенчмарки

_Я за\*бался._ ~~Мне лень качать бенчмарки и прогонять тесты, поэтому~~ вот вам скриншоты из бенчмарков Cyberpunk 2077 и Forza Horizon 6, ~~других игр со встроенным бенчмарком у меня нету, а~~ эти я все равно переносил.

{{< imgs/img
notp=false
loading=""
caption="CP2077 & Forza Horizon 6; Bare 158 / 111, KVM 160 / 111"
alt="Benchmark CP2077 & Forza Horizon 6 (158 / 111; 160 / 111)"
src="@img/benchmark-cp2077-forza-horizon-6.avif" >}}

---

Итак, 4 месяца спустя {{% callout/inline hyphens %}}01.11.2026{{% /callout/inline %}} использования Linux хоста и Windows в KVM. Куча обновлений хоста, чуть поменьше гостя, разный софт и игры. Все работает ах\*ено, всем советую.

Я сделал новые и более полные бенчмарки, на этот раз на поюзанной, а не чистой Windows, и с кучей софта, в том же Cyberpunk 2077, а также в [Black Myth: Wukong Benchmark Tool](https://store.steampowered.com/app/3132990/Black_Myth_Wukong_Benchmark_Tool/?sl), [Bright Memory: Infinite Ray Tracing Benchmark](https://store.steampowered.com/app/1409670/Bright_Memory_Infinite_Ray_Tracing_Benchmark/?sl) и [3DMark](https://store.steampowered.com/app/223850/3DMark/?sl) ([Time Spy](https://store.steampowered.com/app/496100/3DMark_Time_Spy_benchmark/?sl), [Steel Nomad](https://store.steampowered.com/app/2695340/3DMark_Steel_Nomad/?sl), [CPU Profile](https://store.steampowered.com/app/1654370/3DMark_CPU_Profile_benchmarks/?sl)).

Кратко поясню:

- Cyberpunk 2077, Black Myth: Wukong -- generic бенчмарк, с RTX и без.
- Bright Memory: Infinite -- RTX бенчмарк.
- Time Spy -- бенчмарк GPU + CPU
- Steel Nomad -- non-RTX, но тяжелый бенчмарк GPU-only.
- CPU Profile -- CPU-only, бенчмарк многопоточности.

Как и в прошлых двух тестах (CP2077 & Forza Horizon), _хоть я про это не писал,_ было 3 прохода каждого бенчмарка, и вы видите средние значения.

_Бенчмарки на Windows VM были без стрима LG, а напрямую в монитор._

Также любезно напоминаю, что на голом железе 8 ядер 16 потоков, а в VM 6 ядер 12 потоков ($\text{потеря} \ 25\\% \to \ \approx 23\\%:\ \downarrow N \Rightarrow \downarrow \text{TDP}$), это важная информация для понимания разницы в Time Spy и CPU Profile бенчмарках, а также немного в Cyberpunk 2077 тестах (потому что упор в CPU).

$\Delta = \left|\frac{\text{Bare Metal} - \text{KVM}}{\text{Bare Metal}}\right| \times 100$

| 3DMark                        |  KVM  | Bare Metal | $\|\Delta\|$ |
| :---------------------------- | :---: | :--------: | :----------: |
| <u>**Time Spy Extreme**</u>   | 7 418 |   7 842    |    5.41%     |
| GPU                           | 8 224 |   8 192    |    0.39%     |
| CPU                           | 4 771 |   6 317    |    24.47%    |
| <u>**Steel Nomad (DX12)**</u> | 3 865 |   3 853    |    0.31%     |
| <u>**CPU Profile**</u>        | 6 550 |   8 439    |    22.38%    |
| 16 threads                    | 6 375 |   8 422    |    24.31%    |
| 8 threads                     | 5 540 |   6 706    |    17.39%    |
| 4 threads                     | 3 919 |   3 931    |    0.31%     |
| 2 threads                     | 2 009 |   2 043    |    1.66%     |
| 1 thread                      | 1 017 |   1 023    |    0.59%     |

_Знакомые цифры потерь в CPU тестах? Это 1:1. Потери контролируемые из-за < кол-ва ядер, а не просто потому что "это виртуализация"._

| Games                 | CP2077 | CP2077 _(RTX+DLSS+FG)_ | Wukong _(Very High)_ | Wukong _(Cinematic+RTX)_ | Bright Memory _(NO DLSS)_ |
| :-------------------- | :----: | :--------------------: | :------------------: | :----------------------: | :-----------------------: |
| <u>**KVM**</u>        |  125   |          157           |          56          |            32            |            62             |
|                       |   95   |          139           |          46          |            26            |            ---            |
|                       |  163   |          175           |          65          |            40            |            ---            |
| <u>**Bare Metal**</u> |  128   |          162           |          56          |            33            |            62             |
|                       |  105   |          144           |          45          |            26            |            ---            |
|                       |  165   |          181           |          65          |            40            |            ---            |

_Картинки большие, поэтому открывайте в браузере/качайте и зумьте._

{{< imgs/img
notp=false
loading=""
caption="CP2077 / Black Myth: Wukong / Bright Memory: Infinite"
alt="CP2077 / Black Myth: Wukong / Bright Memory: Infinite"
src="@img/benchmark-cp2077-wukong-brightmemory-1.avif" >}}

{{< imgs/img
notp=false
loading=""
caption="3DMark: Time Spy / Steel Nomad / CPU Profile"
alt="3DMark: Time Spy / Steel Nomad / CPU Profile"
src="@img/benchmark-3dmark-timespy-steelnomad-cpuprofile-1.avif" >}}

{{< references >}}
- [My notes/tutorial to achieve KVM with passthrough on OpenSUSE and Ryzen/Threadripper system](https://forum.level1techs.com/t/my-notes-tutorial-to-achieve-kvm-with-passthrough-on-opensuse-and-ryzen-threadripper-system/156585?sl) -- Level1Techs
- [Fedora 33: Ultimiate VFIO Guide for 2020/2021 [WIP]](https://forum.level1techs.com/t/fedora-33-ultimiate-vfio-guide-for-2020-2021-wip/163814?sl) -- Level1Techs
- [openSUSE - Docker](https://en.opensuse.org/Docker?sl) -- openSUSE
- [libvirt/QEMU Installation](https://looking-glass.io/docs/B7/install_libvirt/?sl) -- Looking Glass Docs
- [Много-много рандомного интернета и ИИ](https://www.google.com/search?q=breathing+exercise?nt)
{{< /references >}}
