---
draft: false
# url: "" # slug
title: "Локальная AI генерация изображений. Stability Matrix"
description: "Простой способ запустить локальную установку AI для генерации изображений."
summary: "Простой способ запустить локальную установку AI для генерации изображений."
date: 2024-10-22
# lastmod: 2001-01-29
categories: ["Long Read", "AI"] # ["cat 1", "cat 2"]
tags: ["AI Image Gen"] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
# authorURL: [""] # ['link author 1', 'link author 2'], ex. ['', 'https://example.com']
# canonicalURL: "yourself"
# CanonicalLinkText: "Источник:"
# weight: 1
# robotsNoIndex: true

showToc: true
# TocOpen: false
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
# hideAuthor: true
# ShowBreadCrumbs: false
# ShowPostNavLinks: fales
# ShowRssButtonInSectionTermList: false
# ShowCanonicalLink: true
# UseHugoToc: false
# byai: true
cover:
  image: "@img/local-ai-image-generation-stability-matrix-cover.webp" # image path/url
  width: "1920" # only for img from url; EX: 1920
  height: "1080" # only for img from url; EX: 1080
  alt: "Локальная AI генерация изображений. Stability Matrix - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: false # only hide on current single page
---

{{< callout/custom "🚀" "#000" "#FBAB7E" "linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%);" >}}
В этой статье вы узнаете, как легко запустить локальную установку для генерации изображений на вашем компьютере -- **без каких-либо технических знаний**.
{{< /callout/custom >}}

## ✨ Введение: О Stability Matrix

Мы будем использовать [**Stability Matrix**](https://github.com/LykosAI/StabilityMatrix?sl). Это многоплатформенный менеджер пакетов для Stable Diffusion, который работает на Windows, Linux и macOS. Кроме того, Stability Matrix поддерживает установку различных панелей для управления генерацией изображений, включая те, которые работают с Flux моделями.

Stability Matrix делает все за вас, и вам не нужно устанавливать множество зависимостей отдельно и вручную. Это удобно, потому что все необходимые зависимости будут в одном месте и не повлияют на вашу операционную систему.

Например, если у вас уже установлен Python определенной версии, Stability Matrix все равно установит нужную версию и будет использовать только ее, не меняя вашу. Если Python у вас нет, после установки панели через Stability Matrix он также не появится в системе - версия, которую установит Stability Matrix, будет использоваться только через Stability Matrix.

## 🖼️ Пикчи

{{< imgs/gallery >}}
@img/pic-001-flux1-dev-bnb-nf4-v2.avif | big
@img/pic-002-flux1-dev-bnb-nf4-v2.avif | big
@img/pic-003-flux1-dev-bnb-nf4-v2.avif | big
@img/pic-004-flux1-dev-bnb-nf4-v2.avif | big
@img/pic-005-flux1-dev-bnb-nf4-v2.avif | big
@img/pic-006-flux1-dev-bnb-nf4-v2.avif | big
@img/pic-007-flux1-dev-bnb-nf4-v2.avif | big
@img/pic-008-flux1-dev-bnb-nf4-v2.avif | big
{{< /imgs/gallery >}}

Изображения сгенерированы моделью [flux1-dev-bnb-nf4-v2](https://huggingface.co/lllyasviel/flux1-dev-bnb-nf4?sl).

## ⚙️ Установка Stability Matrix

Переходим на страницу GitHub [репозитория Stability Matrix](https://github.com/LykosAI/StabilityMatrix?sl), качаем либо со страницы [релизов](https://github.com/LykosAI/StabilityMatrix/releases?sl):

![Скачивание Stability Matrix с GitHub - releases](@img/001-local-ai-image-generation-stability-matrix-skachivaniye-s-github-releases.avif)

Либо ниже с кнопок в README:

![Скачивание Stability Matrix с GitHub - README](@img/002-local-ai-image-generation-stability-matrix-skachivaniye-s-github-readme.avif)

Stability Matrix можно установить или запустить без установки (portable). Я рекомендую второй вариант. Для этого нужно создать папку для Stability Matrix и запустить исполняемый файл из этой папки.

Разумеется, соглашаемся с лицензионным соглашением, даже не читая его:

{{< imgs/img
width=""
caption="Установка Stability Matrix"
alt="Установка Stability Matrix"
src="@img/003-local-ai-image-generation-stability-matrix-ustanovka.avif" >}}


Далее выбираем путь куда установить или используем **Portable Mode**:

{{< imgs/img alt="Установка Stability Matrix" width="100%" src="@img/004-local-ai-image-generation-stability-matrix-ustanovka.avif" >}}

{{% details/1 "О Portable Mode" %}}
В Portable Mode все данные и настройки будут храниться в той же директории, что и приложение. Вы сможете перенести приложение с папкой "Data" в другое место или на другой компьютер.
{{% /details/1 %}}

В конце установки Stability Matrix предложит сразу же установить какую-нибудь панель.

Если вы не знаете что вам нужно, нажимайте **Skip first-time setup**:

{{< imgs/img alt="Конец установка Stability Matrix" width="100%" src="@img/005-local-ai-image-generation-stability-matrix-ustanovka.avif" >}}

## 🚀 Установка и запуск первой панели

Панели устанавливаются на вкладке **Packages**:

![Stability Matrix - Установка панели (Packages)](@img/006-local-ai-image-generation-stability-matrix-packages.avif)

Нажимаем на **Add Package**:

![Stability Matrix - Установка панели (Packages)](@img/007-local-ai-image-generation-stability-matrix-packages.avif)

Здесь перечислен список панелей для скачивания и установки. У каждой панели указано с чем она может работать: CPU, NVIDIA, DirectML, AMD (Linux), macOS и др.

Если это ваш первый раз, рекомендую «Stable Diffusion WebUI» от AUTOMATIC1111 или «Stable Diffusion WebUI Forge» от lllyasviel.

В плане интерфейса «Stable Diffusion WebUI» и «Stable Diffusion WebUI Forge» очень похожи.

Но Forge версия, имеет больше фич и может работать не только с SD (Stable Diffusion) моделями, а еще и с Flux.

{{< embedPost url="start-flux-model-local">}}

Когда выбрали нужную панель, нажимаете **Install**:

{{< vids/vid
width=""
align=""
attr="controls"
controlslist=""
webm=""
mp4="@vid/local-ai-image-generation-stability-matrix-ustanovka-paneli.mp4"
preload="metadata"
poster="" >}}

Установка может занять приличное кол-во времени, в зависимости от панели.

После установки, нажимаем **🚀 Launch**, запуск панели тоже может занять некоторое время.

Если все запустилось и критических ошибок нет, то в выводе вы увидите что-то вроде этого:

```
local URL:  http://127.0.0.1:7860
```

![Запуск панели WebUI](@img/008-local-ai-image-generation-stability-matrix-zapusk-paneli.avif)

Если этот URL не открылся в браузере автоматически, перейдите по URL или скопируйте вручную.

{{< imgs/img
width=""
caption="WebUI by AUTOMATIC1111"
alt="Stable Diffusion WebUI by AUTOMATIC1111"
src="@img/009-local-ai-image-generation-stability-matrix-stable-diffusion-webui-automatic1111.avif" >}}

Узнать как пользоваться WebUI от AUTOMATIC1111 можно в статье про [Stable Diffusion](../stable-diffusion/#как-пользоваться-stable-diffusion-webui).

Или в видео на YouTube:

{{< iframes/yt nJlHJZo66UA "How to use Stable Diffusion. Automatic1111 Tutorial" "" >}}

{{< callout/hint >}}
WebUI и WebUI Forge похожи. Поэтому узнав одно вы узнаете другое.

За исключением некоторых фич, которые есть только в Forge.
{{< /callout/hint >}}

### Low VRAM Warning

```txt
[Low VRAM Warning] You just set Forge to use 100% GPU memory (**** MB) to load model weights.
[Low VRAM Warning] This means you will have 0% GPU memory (0.00 MB) to do matrix computation. Computations may fallback to CPU or go Out of Memory.
[Low VRAM Warning] In many cases, image generation will be 10x slower.
[Low VRAM Warning] To solve the problem, you can set the 'GPU Weights' (on the top of page) to a lower value.
[Low VRAM Warning] If you cannot find 'GPU Weights', you can click the 'all' option in the 'UI' area on the left-top corner of the webpage.
[Low VRAM Warning] Make sure that you know what you are testing.
```

В некоторых случаях вы можете получать предупреждение **Low VRAM Warning**.

Это предупреждение сообщает о том, что вы выделили слишком много видеопамяти для панели, и скорость генерации может ухудшаться с каждым разом.

**Решение**: уменьшите выделенную память на 500-1500 МБ. Например, если у вас 12 ГБ VRAM, выделите панели 11 ГБ VRAM.

Как это сделать зависит от панели, но вот как это делается в WebUI Forge:

![Low VRAM Warning - Fix WebUI Forge](@img/local-ai-image-generation-stability-matrix-low-vram-warning-fix-webui-forge.avif)

## 🔍 Обзор Stability Matrix

### Как устанавливать модели

Модели, LoRA, энкодеры, VAE и все остальное для **всех** панелей, находятся в `/Data/Models`, основное:

- `/StableDiffusion/` - модели (любые, не только SD)
- `/Lora/` - LoRA
- `/CLIP/` - экнодеры
- `/VAE/` - VAE.

### Packages

Вкладка **Packages**, как вы, наверное, уже поняли, существует исключительно для управления пакетами (панелями). Установка, обновление, удаление, запуск и пр.

Подвкладка **Inference** (в **Add Package**) предназначена для установки панелей, в первую очередь для обычного запуска моделей.

Подвкладка **Training** (в **Add Package**) нужна для установки панелей, ориентированных на обучение моделей.

### Inference

Inference - обновленный интерфейс для Stable Diffusion, встроенный в Stability Matrix.

{{% details/1 "Из репозитория Stability Matrix" %}}
Из [репозитория Stability Matrix](https://github.com/LykosAI/StabilityMatrix/blob/main/README.md#-inference---a-reimagined-interface-for-stable-diffusion-built-in-to-stability-matrix?sl):

- Мощное автозаполнение и подсветка синтаксиса с использованием формальной грамматики языка
- Рабочие области открываются во вкладках, которые сохраняются и загружаются из файлов проекта `.smproj`

![Stability Matrix Inference Preview](@img/local-ai-image-generation-stability-matrix-inference-preview.avif)

- Настраиваемые прикрепляемые и плавающие панели
- Генерируемые изображения содержат метаданные Inference Project, ComfyUI Nodes и A1111-совместимые метаданные
- Перетаскивание изображений галереи или файлов для загрузки состояний

![Stability Matrix Inference Animated Preview](@img/local-ai-image-generation-stability-matrix-inference-preview-animated.avif)
{{% /details/1 %}}

Возможно кому-то будет полезно, но лично я предпочитаю использовать стоковый интерфейс установленной панели.

### Checkpoint Manager

Если **Packages** это менеджер пакетами, то **Checkpoint Manager** это менеджер всех ваших установленных моделей, лора, экнодеров и тд.

### Model Browser

В **Model Browser** вы можете просматривать модели и сразу же скачивать их с Hugging Face.

Кроме того, вы можете привязать аккаунт Civitai (Settings - Accounts), чтобы просматривать и скачивать модели, Lora и другие ресурсы с сайта Civitai прямо из Stability Matrix.

### Output Browser

В **Output Browser** вы можете увидеть все сгенерированные изображения.

### Workflows

**Workflow** готовые процессы и сценарии, для упрощения выполнения некоторых задач.

## 📦 Где брать модели

Наверное самый лучший сайт где можно брать модели, это [Civitai](https://civitai.com/?sl).

Civitai предлагает не только огромный выбор моделей, но и возможность для авторов публиковать изображения. Пользователи также могут загружать изображения, сгенерированные с помощью этих моделей, что позволяет сразу увидеть, что вы получите.

Так же вы можете найти модели на [Hugging Face](https://huggingface.co/models?sl).

И конечно же вы можете найти модели на просторах интернета.

{{< callout/warn >}}
Будьте осторожны с запуском моделей в формате **ckpt**, особенно из непроверенных источников!

Запуск моделей в формате **ckpt** так же рискован, как запуск исполняемого файла.

Предпочтительнее использовать формат **safetensors**.

Подробнее о **safetensors** можно почитать [здесь](https://huggingface.co/docs/safetensors/index?sl).
{{< /callout/warn >}}
