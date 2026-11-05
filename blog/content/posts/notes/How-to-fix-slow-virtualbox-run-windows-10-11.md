---
draft: false
# url: "" # slug
title: "Исправление медленной работы VirtualBox на Windows 10&11"
description: "Как же убрать эту чертову черепаху?"
summary: "Как же убрать эту чертову черепаху?"
date: 2025-12-17
# lastmod: 2001-01-29
categories: ["Short Read", "System"] # ["cat 1", "cat 2"]
tags: ["Windows", "V12N", "VirtualBox"] # ['tag 1', 'tag 2']
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
# math: true
# byai: true
cover:
  # image: "image" # image url
  # width: "1920" # only for img from url; EX: 1920
  # height: "1080" # only for img from url; EX: 1080
  alt: "Article - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: true # only hide on current single page
---

{{< callout/warn >}}
**Прежде чем что-то делать, прочтите главу "Как вернуть все обратно?"!**
{{< /callout/warn >}}

{{< callout/note >}}
Заметка написана с расчетом того что вы уже включили в BIOS/UEFI виртуализацию и настроили виртуальную машину в VirtualBox.
{{< /callout/note >}}

{{< callout/hint >}}
Если у вас заблокированы обновления, например софтом по типу «Windows Update Blocker» (WUP), то нужно разблокировать обновления, иначе что-то может не сработать.
{{< /callout/hint >}}

Если вы видите это:

![VirtualBox - значок медленной работы VM](@img/virtual-box-turtle-indicator.avif)

А должно быть что-то типо такого:

![VirtualBox - значок нормальной работы VM](@img/virtual-box-no-turtle-indicator.avif)

Значит ваша виртуальная машина работает медленно, потому что не использует аппаратную виртуализацию вашего процессора.

Медленная работа виртуальной машины на VirtualBox, это проблема виртуализации Windows и конкретно из-за Device Guard and Credential Guard на Windows 11.

В случае Windows 11, даже при отключенной виртуализации везде, где только можно, оно не отключается, пока не отключено Device Guard and Credential Guard, *а это к сожалению про безопасность*.

Windows как бы "отнимает" виртуализацию, и поэтому ее не может использовать другой софт.

## Windows 10 & 11

Нужно отключить все что связано с виртуализацией, <kbd>WIN</kbd> + <kbd>R</kbd> --> "optionalfeatures":

- Hyper-V
- Virtual Machine Platform
- Windows Hypervision Platform
- WSL
- и др. если есть

{{< callout/note >}}
Обратите внимание, что описанное в главе "Windows 11", может быть применимо и необходимо и для Windows 10, но не в полной мере, а лишь частично.
{{< /callout/note >}}

В случае если у вас Windows 10, применяете и перезагружаетесь, должно все работать. Если же Windows 11, нажимаете перезагрузиться потом и продолжаем.

## Windows 11

Параметры --> Приватность и безопасность (Privacy & security) --> Безопасность Windows (Windows Security) --> Безопасность устройства (Device security) --> Изоляция ядра (Core Isolation), отключить:

- Memory Integrity
- Kernel-mode Hardware-enforced Stack Protection

{{% details/1 "Скрины" %}}
![Windows 11 Security Settings](@img/windows-11-windows-security-settings.avif)
![Windows 11 Device Security Settings](@img/windows-11-device-security-settings.avif)
![Windows 11 Core Isolation Settings](@img/windows-11-core-isolation-settings.avif)
{{% /details/1 %}}

Далее, скачать [эту](https://www.microsoft.com/en-us/download/details.aspx?id=53337?nt) утилиту с официального сайта. Открыть PowerShell от имени администратора:

```bash
cd <путь_до_утилиты>
```

```ps
./DG_Readiness_Tool_vX.X.ps1 -Disable
```

*Обратите внимания на X.X, там должна быть версия, которую вы скачали.*

Перезагружаемся и следуем инструкции по отключению (там все просто).

## Как вернуть все обратно?

Как написано выше, только наоборот.

В случае **только** Windows 11.

```ps
./DG_Readiness_Tool_vX.X.ps1 -Enable
```

И перезагрузиться.

{{< callout/warn >}}
Прежде чем делать описанное ниже, прочитайте полностью!
{{< /callout/warn >}}

<kbd>WIN</kbd> + <kbd>R</kbd> --> "msinfo32", если "Secure Boot State" - "on" то промотайте вниз до проверки. Если "off", то идем дальше.

Заходим в BIOS/UEFI:

1. Выключить Secure Boot если он включен
2. Если стоит "Standard" то поменять на "Custom"
3. Поменять с "Custom" на "Standard" и согласится с заводскими настройками
4. Включить Secure Boot

Обратите внимание, что прежде чем включать Secure Boot, вы должны отключить CSM. Учитывая тот факт что вы это читаете, потому что хотите включить это обратно, а это не работает без Secure Boot, вероятно у вас уже отключен CSM, но все равно проверьте.

И еще если у вас Windows 11 **Pro** можно "gpedit.msc" поковырять, если что-то не заработало: Computer Configuration --> Administrative Templates --> System --> Device Guard --> Turn On Virtualization Based Security.

### Проверка

Как проверить что все работает. В "msinfo32" будет "Secure Boot State" = on, "Virtualization-based security" (VBS) = Running.

```ps
./DG_Readiness_Tool_vX.X.ps1 -Ready
```

Покажет что-то вроде:

```{hl_lines=[2]}
Credential-Guard is not running.
HVCI is enabled and running.
Config-CI is enabled and running. (Enforced mode)
Not all services are running.
```

А **не**:

```{hl_lines=[2]}
Credential-Guard is not running.
HVCI is not running.
Config-CI is enabled and running. (Enforced mode)
Not all services are running.
```

"Credential-Guard is not running." зависит от железа, поддержки и все такое. Если оно у вас не работает, то ничего такого. Штука крутая, но увы, заточена под enterprise.

Еще проверить можно командой:

```ps
Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard | Select-Object SecurityServicesRunning
```

{{% details/1 "Больше логов (by AI)" %}}
Тут объяснения от ИИ, для общего развития решил добавить.

Более подробно:

```ps
Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard | Format-List *
```

- AvailableSecurityProperties - список функций, которые железо поддерживает
  - 1 - BaseVirtualizationSupport (процессор поддерживает виртуализацию)
  - 2 - SecureBoot (UEFI поддерживает Secure Boot)
  - 3 - DMAProtection (чипсет поддерживает IOMMU)
  - 4 - SecureMemoryOverwrite
  - ...
- RequiredSecurityProperties - обязательные функции VBS
  - 1 - виртуализация
  - 2 - Secure Boot
  - 3 - DMA Protection
- SecurityServicesConfigured - настроенные VBS-службы (настроенные не значит запущенные)
  - 1 - Credential Guard
  - 2 - HVCI
  - 3 - Secure Launch
  - 5 - Kernel Stack Protection
- SecurityServicesRunning - VBS-службы которые работают
  - 1 - Credential Guard
  - 2 - HVCI (Hypervisor-enforced Code Integrity); Memory Integrity
  - 3 - System Guard Secure Launch; Firmware Protection
  - 4 - не используется
  - 5 - Kernel-mode Hardware-enforced Stack Protection (KernelShadowStacks)
- VirtualizationBasedSecurityStatus - статус VBS
  - 0 - VBS выключен
  - 1 - VBS включен, но не запущен
  - 2 - VBS запущен и работает

И команда для красивого вывода (by AI):

```ps
$dg = Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard
$props = $dg.RequiredSecurityProperties

Write-Host "`n=== Security ===" -ForegroundColor Cyan
Write-Host "VBS Running: " -NoNewline; if($dg.VirtualizationBasedSecurityStatus -eq 2){"✅"}else{"❌"}
Write-Host "Secure Boot: " -NoNewline; if($props -contains 2){"✅"}else{"❌"}
Write-Host "DMA Protection: " -NoNewline; if($props -contains 3){"✅"}else{"❌"}
Write-Host "Memory Integrity (HVCI): " -NoNewline; if($dg.SecurityServicesRunning -contains 2){"✅"}else{"❌"}
Write-Host "Kernel Stack Protection: " -NoNewline; if($dg.SecurityServicesRunning -contains 5){"✅"}else{"❌"}
Write-Host "Firmware Protection: " -NoNewline; if($dg.SecurityServicesRunning -contains 3){"✅"}else{"❌"}
Write-Host "Credential Guard: " -NoNewline; if($dg.SecurityServicesRunning -contains 1){"✅"}else{"❌"}
```
{{% /details/1 %}}

## Что если? (Windows 11)

Что если вы все отключили, попользовались виртуальной машиной, включили все обратно, но решили снова попользоваться виртуальной машиной, и так по кругу, но:

![Windows 11 Core Isolation Settings is unavailable](@img/windows-11-core-isolation-unavailable-settings.avif)

Вы не можете изменить настройки. В таком случае просто пропускаете шаг с отключением параметров в изоляции ядра (Core Isolation) и идете дальше.

{{< references >}}
- [How to Disable Hyper-V in Windows 11 24H2](https://community.broadcom.com/vmware-cloud-foundation/discussion/how-to-disable-hyper-v-in-windows-11-24h2?nt) -- Broadcom
- [VM using native API instead of AMD-V](https://forums.virtualbox.org/viewtopic.php?t=113391?nt) -- VirtualBox Forum
- [Win11 build 22581 broke VB by enabling Credential Guard](https://forums.virtualbox.org/viewtopic.php?t=105596?nt) -- VirtualBox Forum
- [How to Remove Green Turtle icon in virtual box Windows 11 24h2](https://www.youtube.com/watch?v=T-VU_a1J_Gc?nt) -- YouTube
- [I always get the turtle](https://www.reddit.com/r/virtualbox/comments/14ygaim/i_always_get_the_turtle/?nt) -- Reddit
- [Secure boot enabled but not active for windows 11](https://www.reddit.com/r/gigabyte/comments/ql5z7x/secure_boot_enabled_but_not_active_for_windows_11/?nt) -- Reddit
{{< /references >}}
