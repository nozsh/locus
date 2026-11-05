---
draft: false
# url: "" # slug
title: "Local AI image generation. Stability Matrix"
description: "An easy way to run local AI installation to generate images."
summary: "An easy way to run local AI installation to generate images."
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
  alt: "Local AI image generation. Stability Matrix - Cover" # alt text
  # caption: "Photo by [Sajad Nori](#) / [Unsplash](https://unsplash.com/?sl)" # display caption under cover
  relative: true # when using page bundles set this to true
  hidden: false # only hide on current single page
---

{{< ahtung/badEn >}}

{{< callout/custom "🚀" "#000" "#FBAB7E" "linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%);" >}}
In this article, you'll know how to easily set up a local installation for generating images on your computer -- **without any technical knowledge**.
{{< /callout/custom >}}

## ✨ Introduction: About Stability Matrix

We'll be using [**Stability Matrix**](https://github.com/LykosAI/StabilityMatrix?sl), a cross-platform package manager for Stable Diffusion that works on Windows, Linux, and macOS. Additionally, Stability Matrix supports installing various panels for managing image generation, including those that work with Flux models.

Stability Matrix handles everything for you, so you don't need to install multiple dependencies separately and manually. This is nice because all necessary dependencies are kept in one place and won't interfere with your operating system.

For example, if you already have a specific version of Python installed, Stability Matrix will install the required version anyway and use only that one without modifying yours. If you don't have Python installed, it won't appear in your system after installing a panel via Stability Matrix -- the version installed by Stability Matrix will be used exclusively within it.

## 🖼️ Pictures

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

Images generated using [flux1-dev-bnb-nf4-v2](https://huggingface.co/lllyasviel/flux1-dev-bnb-nf4?sl) model.

## ⚙️ Installing Stability Matrix

Go to GitHub page of [Stability Matrix repository](https://github.com/LykosAI/StabilityMatrix?sl) and download it from [Releases page](https://github.com/LykosAI/StabilityMatrix/releases?sl):

![Downloading Stability Matrix from GitHub - Releases](@img/001-local-ai-image-generation-stability-matrix-skachivaniye-s-github-releases.avif)

Or from the buttons in the README:

![Downloading Stability Matrix from GitHub - README](@img/002-local-ai-image-generation-stability-matrix-skachivaniye-s-github-readme.avif)

You can install Stability Matrix or run it without installation (portable). I recommend portable. To do this, simply create a folder for Stability Matrix and run the executable file from that folder.

Of course, agree the license agreement -- without even reading it:

{{< imgs/img
width=""
caption="Installing Stability Matrix"
alt="Installing Stability Matrix"
src="@img/003-local-ai-image-generation-stability-matrix-ustanovka.avif" >}}

Next, choose the installation path or use **Portable Mode**:

{{< imgs/img alt="Installing Stability Matrix" width="100%" src="@img/004-local-ai-image-generation-stability-matrix-ustanovka.avif" >}}

At the end of installation, Stability Matrix will suggest you install panel right away.

If you're not sure what you need, click **Skip first-time setup**:

{{< imgs/img alt="Installation Complete - Stability Matrix" width="100%" src="@img/005-local-ai-image-generation-stability-matrix-ustanovka.avif" >}}

## 🚀 Installing and Launching first panel

Panels can be installed from the **Packages** tab:

![Stability Matrix - Installing a panel (Packages)](@img/006-local-ai-image-generation-stability-matrix-packages.avif)

Click **Add Package**:

![Stability Matrix - Installing a panel (Packages)](@img/007-local-ai-image-generation-stability-matrix-packages.avif)

Here, you'll find a list of panels available for installation. Each panel specifies its compatibility: CPU, NVIDIA, DirectML, AMD (Linux), macOS, etc.

If this is your first time, I recommend "Stable Diffusion WebUI" by AUTOMATIC1111 or "Stable Diffusion WebUI Forge" by lllyasviel.

Both panels, "Stable Diffusion WebUI" and "Stable Diffusion WebUI Forge" are very similar.

However, Forge version offers more features and supports not only SD (Stable Diffusion) models, also Flux.

{{< embedPost url="start-flux-model-local">}}

When you've chose the panel you need, click **Install**:

{{< vids/vid
width=""
align=""
attr="controls"
controlslist=""
webm=""
mp4="@vid/local-ai-image-generation-stability-matrix-ustanovka-paneli.mp4"
preload="metadata"
poster="" >}}

Installation may take a lot of time, depending of the panel.

When installation is complete, click **🚀 Launch**. The panel startup may also take some time.

If everything runs good and there are no critical errors, output should look something like:

```
...
local URL:  http://127.0.0.1:7860
...
```

![Launching WebUI panel](@img/008-local-ai-image-generation-stability-matrix-zapusk-paneli.avif)

If this URL does not open automatically in your browser, click manually or copy and paste into your browser.

{{< imgs/img
width=""
caption="WebUI by AUTOMATIC1111"
alt="Stable Diffusion WebUI by AUTOMATIC1111"
src="@img/009-local-ai-image-generation-stability-matrix-stable-diffusion-webui-automatic1111.avif" >}}

~You can learn how to use WebUI by AUTOMATIC1111 in the article about. [Stable Diffusion](../../stable-diffusion/#как-пользоваться-stable-diffusion-webui)~ (Text in Russian)

Or watch video on YouTube:

{{< iframes/yt nJlHJZo66UA "How to use Stable Diffusion. Automatic1111 Tutorial" "" >}}

{{< callout/hint >}}
WebUI and WebUI Forge very similar. Know one means you'll understand the other as well.  

Except for some features which are only support in Forge.
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

In some cases, you may get **Low VRAM Warning**.

This warning indicates that you have allocated too much video memory to the panel, which may cause the generation speed degrade over time.

**Solution**: Reduce allocated memory by 500-1500 MB. For example, if you have 12 GB of VRAM, allocate 11 GB for panel.

How to do this depends of the panel, but here's how it's make in WebUI Forge:

![Low VRAM Warning - Fix WebUI Forge](@img/local-ai-image-generation-stability-matrix-low-vram-warning-fix-webui-forge.avif)

## 🔍 Stability Matrix Overview

### How to install models

Models, LoRAs, encoders, VAEs, and everything else for **all** panels are located in `/Data/Models`. The main directories are:

- `/StableDiffusion/` - Models (any, not only SD)  
- `/Lora/` - LoRAs  
- `/CLIP/` - Encoders  
- `/VAE/` - VAEs  

### Packages

The **Packages** tab, as you've probably guessed, here only for managing packages (panels). This includes installation, updates, removal, launching, etc.

The **Inference** sub-tab (inside **Add Package**) is used for installing panels primarily designed for running models.

The **Training** sub-tab (inside **Add Package**) is for installing panels designed for training models.

### Inference

Inference is a redesigned interface for Stable Diffusion, built into Stability Matrix.

{{% details/1 "From the Stability Matrix Repository" %}}  
From the [Stability Matrix repository](https://github.com/LykosAI/StabilityMatrix/blob/main/README.md#-inference---a-reimagined-interface-for-stable-diffusion-built-in-to-stability-matrix?sl):

- Powerful auto-completion and syntax highlighting using a formal language grammar
- Workspaces open in tabs that save and load from `.smproj` project files

![Stability Matrix Inference Preview](@img/local-ai-image-generation-stability-matrix-inference-preview.avif)  

- Customizable dockable and float panels
- Generated images contain Inference Project, ComfyUI Nodes, and A1111-compatible metadata
- Drag and drop gallery images or files to load states

![Stability Matrix Inference Animated Preview](@img/local-ai-image-generation-stability-matrix-inference-preview-animated.avif)  
{{% /details/1 %}}  

Some might find it useful, but self, I prefer using the stock interface of the installed panel.

### Checkpoint Manager

If **Packages** is a package (panels) manager, then **Checkpoint Manager** is a manager for all your installed models, LoRAs, encoders, etc.

### Model Browser

In **Model Browser**, you can browse models and download them from Hugging Face.

Additionally, you can link your Civitai account (Settings - Accounts) to browse and download models, LoRAs, and other resources from Civitai from Stability Matrix.

### Output Browser

In **Output Browser**, you can view all generated images.

### Workflows

**Workflow** ready-made processes and scenarios to simplify making of some tasks.

## 📦 Where to find models

Probably the best website for finding models is [Civitai](https://civitai.com/?sl).

Civitai not only offers a big pick of models but also allows creators to publish images. Users can also upload images generated with these models, making it easy to see what you can got.

You can also find models on [Hugging Face](https://huggingface.co/models?sl).

And of course, you can find models in the internet.

{{< callout/warn >}}  
Be careful running **ckpt** models, especially from untrusted sources!

Running **ckpt** models is risky as running an executable file.

It's safer to use the **safetensors** instead.

You can read more about **safetensors** [here](https://huggingface.co/docs/safetensors/index?sl).
{{< /callout/warn >}}
