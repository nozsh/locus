---
draft: false
title: "Брутфорс архива WinRAR на Windows"
description: "Покажу как перебирать пароли от архива WinRAR, используя 7z и Batch."
summary: "Покажу как перебирать пароли от архива WinRAR, используя 7z и Batch."
date: 2024-05-15
categories: ["Long Read", "System"] # ["cat 1", "cat 2"]
tags: ["Windows", "Hacking"] # ['tag 1', 'tag 2']
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
  image: "@img/brutfors-arkhiva-winrar-cover.avif" # image path/url
  width: "1500" # only for img from url; EX: 1920
  height: "1080" # only for img from url; EX: 1080
  alt: "Брутфорс архива WinRAR - Cover" # alt text
  caption: "" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: false # only hide on current single page
---

{{< ahtung/1 >}}

Для начала, разберемся как работает распаковка через терминал и что мы будем использовать при написании скрипта.

```batch
"path\to\7-Zip\7z.exe" x -pPASSWORD "path\to\someWinRARArchive.rar" -o"path\to\output" -y
```

- `path\to\7-Zip\7z.exe` - это путь до **7z.exe**
- `x` - распаковать архив
- `-p` - использовать пароль при распаковки
- `path\to\someWinRARArchive.rar` - путь до WinRAR архива
- `-o` - указать куда будет распакован архив
- `path\to\output` - путь куда будет распакован архив
- `-y` - _Yes/Да_ подтвердить замену файлов, если они уже существуют.

{{< callout/note >}}
Указывать параметры после флагов `-p` и `-o` нужно без пробелов.
{{< /callout/note >}}

Итак, у нас есть архив с паролем: `qwerty`.

Если мы введем данную команду в терминал с неправильным паролем:

```batch
"path\to\7-Zip\7z.exe" x -p123 "path\to\someWinRARArchive.rar" -o"path\to\output" -y
```

То мы получим ошибку:

```batch
Can not open encrypted archive. Wrong password?

Can't open as archive: 1
Files: 0
Size:       0
Compressed: 0
```

После выполнения этой команды, мы можем использовать:

```batch
echo %errorlevel%
2
```

И в ответ мы получим `2`. Это означает что команда была выполнена с ошибкой. Если мы снова введем команду, но уже с верным паролем, а потом проверим **errorlevel**, то мы получим `0`.

```batch
"path\to\7-Zip\7z.exe" x -pqwerty "path\to\someWinRARArchive.rar" -o"path\to\output" -y

Everything is Ok

Folders: 1
Files: 1
Size:       12
Compressed: 334

echo %errorlevel%
0
```

Из этого следует, что мы можем использовать **errorlevel** в скрипте, для проверки был ли пароль верен, или же нет, и подбирать пароль дальше, пока **errorlevel** не будет равен **0**.

---

Создаем файл с расширением `.bat` или `.cmd`. Начинаем скрипт с:

```batch
@echo off
```

Чтобы скрыть лишний вывод.

Просим пользователя ввести путь до каталога с 7z:

```batch
echo - Path to 7z dir:
```

Записываем это в переменную `z7dir`:

```batch
set /p z7dir="#: "
```

Проверяем существует ли каталог 7z, если нет, то выводим ошибку:

```batch
if not exist "%z7dir%" (
  echo.
  echo ERROR!
  echo 7z dir - "%z7dir%"
  echo Not be found...
  pause
  exit
)
```

Аналогично делаем с архивом:

```batch
echo - Path to archive:
set /p archive="#: "

if not exist "%archive%" (
  echo.
  echo ERROR!
  echo Archive "%archive%"
  echo Not be found...
  pause
  exit
)
```

Спрашиваем пользователя куда распаковать архив:

```batch
echo - Path to output:
set /p output="#: "
```

И тоже самое со словарем, где находятся пароли:

```batch
echo - Path to wordlist.txt:
set /p wordlist="#: "

if not exist "%wordlist%" (
  echo.
  echo ERROR!
  echo Wordlist - "%wordlist%"
  echo Not be found...
  pause
  exit
)
```

Далее пишем цикл, который будет построчно записывать данные из `wordlist.txt` в переменную, каждую итерацию:

```batch
for /f "tokens=*" %%a in ('type "%wordlist%"') do (
  set pwd=%%a
  call :try
)
echo.
echo Oh-uh... Password not be found...
pause
exit
```

Шаманим с `"tokens=*"` и `'type "%wordlist%"'` для того, чтобы юзер мог использовать пути с пробелами.

И вызываем блок кода (подпрограмму) `call: :try`, который идет далее:

```batch
:try
"%z7dir%\7z.exe" x -p%pwd% "%archive%" -o"%output%" -y >nul 2>&1
echo Try: %pwd%

if /I %errorlevel% EQU 0 (
  echo.
  echo Archive was successfully unpacked!
  echo Password is: %pwd%
  pause
  exit
)
```

`"%z7dir%\7z.exe" x -p%pwd% "%archive%" -o"%output%" -y` - команда для распаковки архива, но с нашими переменными.

`>nul 2>&1` - «выводит вывод» в никуда, дабы не спамить логами 7z.

`echo Try: %pwd%` - выводит перебираемые пароли.

`if /I %errorlevel% EQU 0 ()` - если выпоенная команда распаковки архива, **errorlevel** = 0, значит команда выполнилась успешно.

Используя `call :try` мы вызываем подпрограмму (или же просто блок кода), который после выполнения возвращается обратно к тому месту в скрипте, где был сделан вызов, и продолжается выполнение следующих команд. В нашем случае:

```batch
echo.
echo Oh-uh... Password not be found...
pause
exit
```

Уведомление о том что пароль не был подобран. Но если условие оказывается верным, мы так же видим следующие уведомление:

```batch
echo.
echo Archive was successfully unpacked!
echo Password is: %pwd%
pause
exit
```

{{% details/1 "Полный код скрипта" %}}

```batch
@echo off

:: 7z
echo - Path to 7z dir:
set /p z7dir="#: "

if not exist "%z7dir%" (
  echo.
  echo ERROR!
  echo 7z dir - "%z7dir%"
  echo Not be found...
  pause
  exit
)
echo Path to 7z: %z7dir%
echo OK!

echo.

:: WinRAR Archive
echo - Path to archive:
set /p archive="#: "

if not exist "%archive%" (
  echo.
  echo ERROR!
  echo Archive "%archive%"
  echo Not be found...
  pause
  exit
)
echo Path to archive: %archive%
echo OK!

echo.

:: Output
echo - Path to output:
set /p output="#: "
echo Path to output: %output%

echo.

:: Wordlist
echo - Path to wordlist.txt:
set /p wordlist="#: "

if not exist "%wordlist%" (
  echo.
  echo ERROR!
  echo Wordlist - "%wordlist%"
  echo Not be found...
  pause
  exit
)
echo Wordlist: %wordlist%
echo OK!

echo.

echo Starting bruting...

echo.

:: Wordlist for
for /f "tokens=*" %%a in ('type "%wordlist%"') do (
  set pwd=%%a
  call :try
)
echo.
echo Oh-uh... Password not be found...
pause
exit

:try
"%z7dir%\7z.exe" x -p%pwd% "%archive%" -o"%output%" -y >nul 2>&1
echo Try: %pwd%

if /I %errorlevel% EQU 0 (
  echo.
  echo Archive was successfully unpacked!
  echo Password is: %pwd%
  pause
  exit
)
```

{{% /details/1 %}}

## Улучшения

Давайте улучшим наш скрипт, и сделаем так, чтобы он в первую очередь брал значения из условного `config.txt`. А если файла **config.txt** нет, или он не полный, то скрипт будет запрашивать значения у юзера.

Для этого придется самую малость переписать скрипт и создать **config.txt**:

```
z7dir=path\to\
archive=path\to\
output=path\to\
wordlist=path\to\
```

Добавляем это в самое начало скрипта:

```batch
if exist "config.txt" (
  for /f "tokens=1,* delims==" %%a in (config.txt) do (
    set %%a=%%b
  )
)
```

`if exist "config.txt"` проверяет существует ли файл **config.txt**, если он не существует, то соответственно код внутри блока не выполняется.

Далее цикл, который перебирает все строки в файле:

```batch
for /f "tokens=1,* delims==" %%a in (config.txt) do (
  set %%a=%%b
)
```

`tokens=1,*` указывает, что нужно разделить каждую строку на два токена: первый токен до знака `=` и второй токен - все, что после.

`delims==` устанавливает знак `=` в качестве разделителя.

Для каждой строки в файле **config.txt**, `%%a` = имя переменной, а `%%b` = значения переменной.

`set %%a=%%b` соответственно присваивает значения переменной `%%a` = `%%b`.

То есть выглядит это так:

|  `%%a`   |  =  |  `%%b`   |
| :------: | :-: | :------: |
|  z7dir   |  =  | значение |
| archive  |  =  | значение |
|  output  |  =  | значение |
| wordlist |  =  | значение |

И как можно догадаться, порядок строк в **config.txt** не имеет значения.

Теперь проверяем есть ли у переменной значение:

```batch
if not defined z7dir (
  echo - Path to 7z dir:
  set /p z7dir="#: "
)
```

Если переменная отсутствует в файле **config.txt**, или если нету самого **config.txt**, то значение у переменной соответственно нету, и скрипт запрашивает данные у юзера.

Если же все в порядке, то скрипт просто выполняется дальше.

Мы получаем, такой немного измененный код:

```batch
if not defined z7dir (
  echo - Path to 7z dir:
  set /p z7dir="#: "
)

if not exist "%z7dir%" (
  echo.
  echo ERROR!
  echo 7z dir - "%z7dir%"
  echo Not be found...
  pause
  exit
)
echo Path to 7z: %z7dir%
echo OK!
```

И тоже самое нужно сделать и с другими переменными.

И просто для галочки, сделаем чтобы юзеру нужно было подтвердить начало брута.

Но сделаем это сразу правильно, чтобы юзер вводя абракадабру, подтверждение выводилось повторно.

```batch
:yesornot

echo Start bruting? (y/n)
set /p yesornot="#: "

if /I "%yesornot%"=="y" (
  call :startbruting
) else if /I "%yesornot%"=="n" (
  echo OK!
  pause
  exit
) else (
  echo ERROR!
  echo.
  call :yesornot
)
```

А перед кодом, где начинается брут пишем: `:startbruting`.

{{% details/1 "Код" %}}

```batch
@echo off

:: config.txt
if exist "config.txt" (
  for /f "tokens=1,* delims==" %%a in (config.txt) do (
    set %%a=%%b
  )
)

:: 7z
if not defined z7dir (
  echo - Path to 7z dir:
  set /p z7dir="#: "
)

if not exist "%z7dir%" (
  echo.
  echo ERROR!
  echo 7z dir - "%z7dir%"
  echo Not be found...
  pause
  exit
)
echo Path to 7z: %z7dir%
echo OK!

echo.

:: WinRAR Archive
if not defined archive (
  echo - Path to archive:
  set /p archive="#: "
)

if not exist "%archive%" (
  echo.
  echo ERROR!
  echo Archive - "%archive%"
  echo Not be found...
  pause
  exit
)
echo Path to archive: %archive%
echo OK!

echo.

:: Output
if not defined output (
  echo - Path to output:
  set /p output="#: "
)
echo Path to output: %output%

echo.

:: Wordlist
if not defined wordlist (
  echo - Path to wordlist.txt:
  set /p wordlist="#: "
)

if not exist "%wordlist%" (
  echo.
  echo ERROR!
  echo Wordlist - "%wordlist%"
  echo Not be found...
  pause
  exit
)
echo Wordlist: %wordlist%
echo OK!

echo.

:: Yes OR Not?
:yesornot

echo Start bruting? (y/n)
set /p yesornot="#: "

if /I "%yesornot%"=="y" (
  call :startbruting
) else if /I "%yesornot%"=="n" (
  echo OK!
  pause
  exit
) else (
  echo ERROR!
  echo.
  call :yesornot
)

:startbruting

echo .

echo Starting bruting...

echo.

:: Wordlist for
for /f "tokens=*" %%a in ('type "%wordlist%"') do (
  set pwd=%%a
  call :try
)
echo.
echo Oh-uh... Password not be found...
pause
exit

:try
"%z7dir%\7z.exe" x -p%pwd% "%archive%" -o"%output%" -y >nul 2>&1
echo Try: %pwd%

if /I %errorlevel% EQU 0 (
  echo.
  echo Archive was successfully unpacked!
  echo Password is: %pwd%
  pause
  exit
)
```

{{% /details/1 %}}

---

{{< details/1 "Источник" >}}
{{< iframes/yt Il2CF15F6cg "WinRAR Password Cracker!" >}}
{{< /details/1 >}}
