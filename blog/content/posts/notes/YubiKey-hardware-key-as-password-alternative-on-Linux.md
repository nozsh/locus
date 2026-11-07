---
draft: false
# url: "" # slug
title: "Замена пароля аппаратным ключом YubiKey на Linux"
# YubiKey hardware key as a password alternative on Linux
description: "Настройка YubiKey на openSUSE для sudo, а также входа в систему."
summary: "Настройка YubiKey на openSUSE для sudo, а также входа в систему."
date: 2026-07-24
lastmod: 2026-10-24
categories: ["Short Read", "System"] # ["cat 1", "cat 2"]
tags: ["Security", "YubiKey", "Linux"] # ['tag 1', 'tag 2']
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
# remoteCode: true
# byai: true
cover:
  image: "@img/cover.yubikey-hardware-key-as-password-alternative-on-linux.webp" # image url
  width: "1441" # only for img from url; EX: 1920
  height: "902" # only for img from url; EX: 1080
  alt: "Замена пароля аппаратным ключом YubiKey на openSUSE - Cover" # alt text
  caption: "Photo by [Andy Kennedy](https://unsplash.com/@packetdiscards?sl) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  # hidden: true # only hide on current single page
---

{{< callout/warn >}}
Будьте внимательны! Невнимательные действия могу привести к блокировки системы... и тогда придется серьезно запарится.
{{< /callout/warn >}}

У меня YubiKey, openSUSE, SDDM, DMS Quickshell, я покажу на этом примере.

Установка pam\_u2f:

```bash {linenos=false}
sudo zypper install pam_u2f
```

## Как работает файл с ключами

Все ключи хранятся в одном общем файле `/etc/Yubico/u2f_keys`. В формате одна строка на пользователя, а все ключи этого пользователя идут в той же строке через двоеточие *(упрощенно)*:

```
user:key1:key2:key3
root:key1:key2:key3
```

Регистрация не привязана к имени юзера, а указывается юзеру, поэтому отдельно регистрировать ключ для root не нужно.

А так же в `~/.config/Yubico/u2f_keys` -- только строка юзера. Его использует например DMS, KDE и тд., то что работает от вашего пользователя, а не от root.

То есть:

- `/etc/Yubico/u2f_keys` -- `sudo`, `su`, `su-l`, в общем система.
- `~/.config/Yubico/u2f_keys` -- кастомные юзерские сервисы, лок скрины, и тп.

## Добавляем ключи

{{% details/1 "Создаем скрипт и даем права на выполнение" %}}
```bash
sudo tee /usr/local/bin/u2f-add-key > /dev/null << 'EOF'
#!/bin/bash
set -euo pipefail

f=/etc/Yubico/u2f_keys
uf=$HOME/.config/Yubico/u2f_keys
me=$(id -un)

put() {
  local run=$1 file=$2 u=$3
  if $run awk -F: -v u="$u" -v add="$add" '$1 == u && index($0, add) { found = 1 } END { exit !found }' "$file"; then
    return
  fi
  $run awk -v u="$u" -v add="$add" '
    BEGIN { FS = OFS = ":" }
    $1 == u { $0 = $0 ":" add; found = 1 }
    { print }
    END { if (!found) print u ":" add }
  ' "$file" | $run tee "$file.new" > /dev/null
  $run mv "$file.new" "$file"
}

sudo mkdir -p "$(dirname "$f")"
sudo touch "$f"

echo "Make sure your key is plugged in, then touch it when it blinks (or when a bush catches fire)..."
reg=$(pamu2fcfg -u "$me")
add=${reg#*:}

if [ -z "$reg" ] || [ "$add" = "$reg" ]; then
  echo "Registration failed" >&2
  exit 1
fi

put sudo "$f" "$me"
if [ "$me" != root ]; then
  put sudo "$f" root
fi
sudo chown root:root "$f"
sudo chmod 600 "$f"

if [ "$me" != root ]; then
  mkdir -p "$(dirname "$uf")"
  touch "$uf"
  put command "$uf" "$me"
  chmod 600 "$uf"
fi

echo "Done. Keys per user in $f:"
sudo awk -F: '{ print "  " $1 ": " NF-1 }' "$f"
if [ "$me" != root ]; then
  echo "Keys in $uf:"
  awk -F: '{ print "  " $1 ": " NF-1 }' "$uf"
fi
EOF
sudo chmod +x /usr/local/bin/u2f-add-key
```
{{% /details/1 %}}

Запускаем от обычного пользователя (без `sudo`):

```bash {linenos=false}
u2f-add-key
```

и касаемся ключа.

Если нужны доп. ключи, то втыкаете следующий и снова запускаете скрипт.

Проверяем:

```bash {linenos=false}
sudo cat /etc/Yubico/u2f_keys && echo && cat ~/.config/Yubico/u2f_keys
```

Должно быть две строки (ваш юзер и root), а так же один ключ вашего юзера. Выходим из системы и заходим снова (необязательно, но желательно).

{{< callout/hint >}}
Если нужно убрать ключ, откройте файлы `/etc/Yubico/u2f_keys`/`~/.config/Yubico/u2f_keys` и удалите его фрагмент между двоеточиями в строке/обеих строках.

Чтобы убрать все ключи, просто удалите файлы:

```bash {linenos=false}
sudo rm -rf /etc/Yubico/u2f_keys ~/.config/Yubico/u2f_keys
```
{{< /callout/hint >}}

Далее настройка сервисов.

```bash {linenos=false}
sudo cp /usr/lib/pam.d/su /etc/pam.d/su
```

```bash {linenos=false}
sudo nano /etc/pam.d/su
```

Добавить:

```
auth      sufficient  pam_u2f.so        cue authfile=/etc/Yubico/u2f_keys
```

Выше `common-auth`, но ниже самого первого auth (если есть). Пара примеров:

``` {hl_lines=[2,5,9]}
auth  sufficient  pam_rootok.so
auth  sufficient  pam_u2f.so      cue authfile=/etc/Yubico/u2f_keys
auth  include     common-auth
# --- #
auth  sufficient  pam_u2f.so      cue authfile=/etc/Yubico/u2f_keys
auth  include     common-auth
# --- #
auth  requisite   pam_nologin.so
auth  sufficient  pam_u2f.so      cue authfile=/etc/Yubico/u2f_keys
auth  substack    common-auth
```

Нужно, чтобы аппаратный ключ был `sufficient` и стоял выше `common-auth`. Иначе оно будет требовать пароль + ключ.

{{< callout/hint >}}
Если вы хотите секьюрно -- пароль + ключ, то строка должна быть после `common-auth` и иметь `required`. Но в таком случае лучше иметь пару ключей, и оба их нужно добавить в систему, иначе если потеряете/сломаете, то все...
{{< /callout/hint >}}

Проверить:

```bash {linenos=false}
su
```

Если ключ подключен, то попросит коснуться ключа (подойдет любой из добавленных). Если же нет, то попросит ввести пароль: или-или.

Повторяете то же самое для:

- `su-l`
- `sudo`
- `sddm` (ваш Display Manager)

В случае чего вернуть назад можно, просто удалив файлы, что были скопированы:

```bash {linenos=false}
sudo sh -c 'cd /etc/pam.d && rm su su-l sudo sddm && ls'
```

Так же после обновления ОС оригинальные файлы могут поменяться (обычно очень **не** часто). Проверить:

```bash
ARGS=(/usr/lib/pam.d/su /etc/pam.d/su); command -v kompare > /dev/null && kompare "${ARGS[@]}" || { echo -e "\n- su"; diff "${ARGS[@]}"; }
ARGS=(/usr/lib/pam.d/su-l /etc/pam.d/su-l); command -v kompare > /dev/null && kompare "${ARGS[@]}" || { echo -e "\n- su-l"; diff "${ARGS[@]}"; }
ARGS=(/usr/lib/pam.d/sudo /etc/pam.d/sudo); command -v kompare > /dev/null && kompare "${ARGS[@]}" || { echo -e "\n- sudo"; diff "${ARGS[@]}"; }
ARGS=(/usr/lib/pam.d/sddm /etc/pam.d/sddm); command -v kompare > /dev/null && kompare "${ARGS[@]}" || { echo -e "\n- sddm"; diff "${ARGS[@]}"; }
```

{{< callout/note >}}
В SDDM, чтобы использовать ключ -- нужно нажать <kbd>Enter</kbd>.
{{< /callout/note >}}

После входа в систему по ключу вас может ожидать неприятность на некотором софте:

> Authentication required <br>
> \- The login keyring did not get unlocked when you logged into your computer

Два самых безопасных решения с точки зрения буквально **безопасности**:

- Вводить пароль, это все равно один раз после входа в систему
- Отключить аппаратный ключ для DM и вводить пароль как обычно, это все равно один раз на вход в систему

На `sudo` это никак не повлияет.

Другой вариант, это отключение шифрования keyring, *не делайте так*.

## DMS

В настройках Lock Screen включаем Enable security key authentication, откроется терминал с выбором аутентификации, выберите что-то, я предпочитаю sudo и ввести пароль (он же ключ если уже настроили). Подробнее [здесь](https://duxlabs.dev/docs/dms/lock-screen-authentication?sl) и [тут](https://duxlabs.dev/docs/dms-greeter/configuration#security-keys?sl).
