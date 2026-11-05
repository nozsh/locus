---
draft: false
# url: "" # slug
title: "Fix VirtualBox slow running on Windows 10&11"
description: "How do you get that damn turtle out of here?"
summary: "How do you get that damn turtle out of here?"
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

{{< ahtung/badEn >}}

{{< callout/warn >}}
**Before you start do something, read the chapter "How to get it all back?"!**
{{< /callout/warn >}}

{{< callout/note >}}
This note is written assuming that you have already enabled virtualization in BIOS/UEFI and configured a virtual machine in VirtualBox.
{{< /callout/note >}}

{{< callout/hint >}}
If you have blocked updates, for example with software like “Windows Update Blocker” (WUP), then you need to unblock updates, otherwise something may go wrong.
{{< /callout/hint >}}

If you see this:

![VirtualBox - VM slow run icon](@img/virtual-box-turtle-indicator.avif)

It should be something like this:

![VirtualBox - VM normal run icon](@img/virtual-box-no-turtle-indicator.avif)

*Look at native API and VT-x/AMD-V is key*

So your virtual machine is running slow because it's not using hardware virtualization of your CPU.

Slow running virtual machine on VirtualBox, this is a Windows virtualization issue and specifically due to Device Guard and Credential Guard on Windows 11.

In the case of Windows 11, even with virtualization disabled everywhere else, it's not disabled unless Device Guard and Credential Guard are disabled, *and this is unfortunately about security*.

Windows kind of "takes over" virtualization, so other software can't use it.

## Windows 10 & 11

You need to disable anything related to virtualization, <kbd>WIN</kbd> + <kbd>R</kbd> --> "optionalfeatures":

- Hyper-V
- Virtual Machine Platform
- Windows Hypervision Platform
- WSL
- and others, if any

{{< callout/note >}}
Note that what is described in the “Windows 11” chapter may be applicable and necessary for Windows 10 as well, but only partially.
{{< /callout/note >}}

If you have Windows 10, apply and reboot, everything should work. If you have Windows 11, click reboot later, then continue.

## Windows 11

Settings --> Privacy & security --> Windows Security --> Device security --> Core Isolation, disable:

- Memory Integrity
- Kernel-mode Hardware-enforced Stack Protection

{{% details/1 "Screenshots" %}}
![Windows 11 Security Settings](@img/windows-11-windows-security-settings.avif)
![Windows 11 Device Security Settings](@img/windows-11-device-security-settings.avif)
![Windows 11 Core Isolation Settings](@img/windows-11-core-isolation-settings.avif)
{{% /details/1 %}}

Next, download [this](https://www.microsoft.com/en-us/download/details.aspx?id=53337?nt) utility from the official website. Open PowerShell as administrator:

```bash
cd <path_to_utility>
```

```ps
./DG_Readiness_Tool_vX.X.ps1 -Disable
```

*Note the X.X, the version you downloaded should be there.*

Reboot and follow the disabled instructions (it's simple).

## How to get it all back?

As above, but in reverse.

In the case of **only** Windows 11.

```ps
./DG_Readiness_Tool_vX.X.ps1 -Enable
```

And reboot.

{{< callout/warn >}}
Before you do the things described below, read in full!
{{< /callout/warn >}}

<kbd>WIN</kbd> + <kbd>R</kbd> --> "msinfo32", if "Secure Boot State" - "on" then scroll down to check. If "off", then move on.

Boot into BIOS/UEFI:

1. Disable Secure Boot if it says "Enabled"
2. If it says "Standard" change to "Custom"
3. Change "Custom" to "Standard" accepting Factory Defaults 
4. Enable Secure Boot 

Note that before you enable Secure Boot, you should disable CSM. Given the fact that you're reading this because you want to enable all back, and it won't work without Secure Boot, you probably already have CSM disabled, but check anyway.

Also, if you're on Windows 11 **Pro**, you can mess around with "gpedit.msc" if something didn't work: Computer Configuration --> Administrative Templates --> System --> Device Guard --> Turn On Virtualization Based Security.

### Check

How to check that everything is working. In "msinfo32" it will be “Secure Boot State” = on, "Virtualization-based security" (VBS) = Running.

```ps
./DG_Readiness_Tool_vX.X.ps1 -Ready
```

It'll show something like:

```{hl_lines=[2]}
Credential-Guard is not running.
HVCI is enabled and running.
Config-CI is enabled and running. (Enforced mode)
Not all services are running.
```

**Not**:

```{hl_lines=[2]}
Credential-Guard is not running.
HVCI is not running.
Config-CI is enabled and running. (Enforced mode)
Not all services are running.
```

"Credential-Guard is not running." depends on hardware and support and all that. If it doesn't work for you, it's no big deal. It's a cool thing, but alas, it's designed for enterprise.

You can also check it with the command:

```ps
Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard | Select-Object SecurityServicesRunning
```

{{% details/1 "More logs (by AI)" %}}
There's an explanation here by AI, just for general knowledge I thought I'd add it.

More info:

```ps
Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard | Format-List *
```

- AvailableSecurityProperties - list of features that the hardware supports
  - 1 - BaseVirtualizationSupport (CPU supports virtualization)
  - 2 - SecureBoot (UEFI supports Secure Boot)
  - 3 - DMAProtection (chipset supports IOMMU)
  - 4 - SecureMemoryOverwrite
  - ...
- RequiredSecurityProperties - mandatory VBS features
  - 1 - virtualization
  - 2 - Secure Boot
  - 3 - DMA Protection
- SecurityServicesConfigured - configured VBS services (configured doesn't mean running)
  - 1 - Credential Guard
  - 2 - HVCI
  - 3 - Secure Launch
  - 5 - Kernel Stack Protection
- SecurityServicesRunning - VBS services that are running
  - 1 - Credential Guard
  - 2 - HVCI (Hypervisor-enforced Code Integrity); Memory Integrity
  - 3 - System Guard Secure Launch; Firmware Protection
  - 4 - not used
  - 5 - Kernel-mode Hardware-enforced Stack Protection (KernelShadowStacks)
- VirtualizationBasedSecurityStatus - VBS status
  - 0 - VBS is disabled
  - 1 - VBS is enabled but not running
  - 2 - VBS is running and working

And a command for beautiful output (by AI):

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

## What if? (Windows 11)

What if you disabled everything, used your VM, enabled it all back, but then decided to use the VM again, and repeating this cycle, but:

![Windows 11 Core Isolation Settings is unavailable](@img/windows-11-core-isolation-unavailable-settings.avif)

You cannot change the settings. In this case, just skip the step with disabling the settings in Core Isolation and move on.

{{< references >}}
- [How to Disable Hyper-V in Windows 11 24H2](https://community.broadcom.com/vmware-cloud-foundation/discussion/how-to-disable-hyper-v-in-windows-11-24h2?nt) -- Broadcom
- [VM using native API instead of AMD-V](https://forums.virtualbox.org/viewtopic.php?t=113391?nt) -- VirtualBox Forum
- [Win11 build 22581 broke VB by enabling Credential Guard](https://forums.virtualbox.org/viewtopic.php?t=105596?nt) -- VirtualBox Forum
- [How to Remove Green Turtle icon in virtual box Windows 11 24h2](https://www.youtube.com/watch?v=T-VU_a1J_Gc?nt) -- YouTube
- [I always get the turtle](https://www.reddit.com/r/virtualbox/comments/14ygaim/i_always_get_the_turtle/?nt) -- Reddit
- [Secure boot enabled but not active for windows 11](https://www.reddit.com/r/gigabyte/comments/ql5z7x/secure_boot_enabled_but_not_active_for_windows_11/?nt) -- Reddit
{{< /references >}}
