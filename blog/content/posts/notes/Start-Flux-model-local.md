---
draft: false
title: "Запуск Flux моделей локально"
# url: ""
description: "You do not have CLIP state dict!"
summary: "You do not have CLIP state dict!"
date: 2024-09-14
lastmod: 2024-10-20
categories: ["Short Read", "AI"] # ["cat 1", "cat 2"]
tags: ["AI Image Gen"] # ['tag 1', 'tag 2']
author: ["𝙓"] # ['Me', 'You'] multiple authors
authorURL: [""]
# canonicalURL: "yourself"
# weight: 1
# robotsNoIndex: true

# showToc: true
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
# CanonicalLinkText: "Источник:"
# UseHugoToc: false
# hideAuthor: true
# byai: true
cover:
  image: "@img/start-flux-model-local-cover.webp" # image path/url
  width: "1500" # only for img from url; EX: 1920
  height: "1080" # only for img from url; EX: 1080
  alt: "Запуск Flux моделей локально - Cover" # alt text
  caption: "Cover-Image сгенерировано моделью - [flux1-dev-bnb-nf4-v2](https://huggingface.co/lllyasviel/flux1-dev-bnb-nf4?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: false # only hide on current single page
---

Вероятней всего вы получаете шум или пустоту, вместо красивой картинки, при попытки генерации используя Flux модель на том же [Stable Diffusion web UI by AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui?sl).

Или ошибку **You do not have CLIP state dict!** используя Flux модель на другой панели.

И видимо именно поэтому вы это читаете.

{{< callout/warn >}}
Это заметка о том как запустить **Flux** модель.<br> **А не о том как запустить локальную установку для генерации пикч.**
{{< /callout/warn >}}

{{< embedPost url="local-ai-image-generation-stability-matrix">}}

Если вы получаете шум или пустоту, значит панель не поддерживает Flux модели.

На момент написания этой заметки Flux работает в [WebUI Forge](https://github.com/lllyasviel/stable-diffusion-webui-forge?sl) и [ComfyUI](https://github.com/comfyanonymous/ComfyUI?sl), которые так же имеются в [Stability Matrix](https://github.com/LykosAI/StabilityMatrix?sl). И еще, на текущий момент с Flux идеально работают только видеокарты NVIDIA.

{{< callout/note >}}
**Оптимизированная версия** оригинальной модели Flux [отсюда](https://huggingface.co/lllyasviel/flux1-dev-bnb-nf4?sl), может работать сразу на WebUI Forge.

Так как все необходимые энкодеры и VAE уже [встроены](https://github.com/lllyasviel/stable-diffusion-webui-forge/discussions/981?sl) в панель.
{{< /callout/note >}}

{{% details/1 "Модели" %}}
Оригинальные модели можно скачать [отсюда](https://huggingface.co/black-forest-labs/FLUX.1-dev?sl) или [отсюда](https://huggingface.co/black-forest-labs/FLUX.1-schnell?sl).

**GGUF версии** можно скачать [отсюда](https://huggingface.co/lllyasviel/FLUX.1-dev-gguf?sl) или [отсюда](https://huggingface.co/lllyasviel/FLUX.1-schnell-gguf?sl).
{{% /details/1 %}}

При запуске Flux моделей (и соответственно других моделей на основе Flux), возникает ошибка:

```
You do not have CLIP state dict!
```

Она возникает из-за отсутствия **text encoder**, так же это называют **CLIP**, хотя это немного разные вещи.

Чтобы, все таки запустить Flux модель, нужно скачать энкодеры и VAE.

Качаем энкодеры, **clip-l\*** и **t5\*** [здесь](https://huggingface.co/comfyanonymous/flux_text_encoders/tree/main?sl).

{{< callout/note >}}
Что использовать **fp8** или **fp16** зависит от вашего железа.

Если у вас мало VRAM 4-8Gb и немного оперативной памяти 8-16Gb, используйте **fp8**.

Если у вас средне VRAM 11-12Gb, и много оперативной памяти 32Gb+, можно использовать **fp16**.

Если у вас всего много, особенно VRAM 20Gb+, то смело используйте **fp16**.
{{< /callout/note >}}

Качаем VAE, `vae/diffusion_pytorch_model.safetensors` и `ae.safetensors` [здесь](https://huggingface.co/black-forest-labs/FLUX.1-dev/tree/main?sl) или [здесь](https://huggingface.co/black-forest-labs/FLUX.1-schnell/tree/main?sl).

VAE помещаем в `models\VAE`, энкодеры в `models\text_encoder` или `models\CLIP` (если вы используете Stability Matrix).

Осталось только загрузить VAE и энкодеры в соответствующем списке.

![Меню загрузки VAE & Text Encoder](@img/001-start-flux-model-local-load-vae-text-encoder-clip.avif)

Загружать их можно в любом порядке.

---

Подробнее так же можно [почитать](https://github.com/lllyasviel/stable-diffusion-webui-forge/discussions/1050?sl) от разработчика WebUI Forge.
