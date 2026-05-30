---
title: JXL Manga Readers
description: Manga readers with JPEG XL / JXL support for Android, iOS & PC
customDescription: Manga readers with JPEG XL / JXL support for Android, iOS & PC
outline: [2,3]
og:
    image: https://i.wotaku.wiki/f/guide.png
---

## Readers

### Android
- [Mihon](https://mihon.app/) :s: [:src:](https://github.com/mihonapp/mihon)
- :prev: [Yokai](https://mihon.app/forks/Yokai/) [:src:](https://github.com/null2264/yokai) [:n:](https://github.com/null2264/yokai-nightly)
- :prev: [Komikku](https://komikku-app.github.io/) [:src:](https://github.com/komikku-app/komikku)
- [Komelia](https://github.com/Snd-R/Komelia) ||Komga||
- [Kuro Reader +](https://kurotoshiro.dev/) :fm::cs:

### iOS
- [YACReader](https://apps.apple.com/app/id635717885) :s::paid::cs: [:tf:](https://testflight.apple.com/join/5zhB7sRP)
- [Panels](https://apps.apple.com/app/panels-comic-reader/id1236567663) :fm::sub::cs:

### PC
| Type | Reader | Platform |
| :--- | :--- | :--- |
| Dedicated | [OpenComic](https://opencomic.app/) :s: [:src:](https://github.com/ollm/OpenComic) | :win::app::lin: |
| ^^ | [NeeView](https://neelabo.github.io/NeeView/en-us/) [:src:](https://github.com/neelabo/NeeView) | :win: |
| ^^ | [YACReader](https://www.yacreader.com/) :warning: [:src:](https://github.com/YACReader/yacreader) <tooltip>For some lossy original images it won't work. Kinda random.</tooltip> | :win::app::lin: |
| ^^ | [Komelia](https://github.com/Snd-R/Komelia) | :win::lin: |
| Photo Viewer | [XnView MP](https://www.xnview.com/en/xnviewmp/) :cs: | :win::app::lin:|
| ^^ | [Picview](https://picview.org/) [:src:](https://github.com/Ruben2776/PicView/) | :win: |
| ^^ | [Bandiview](https://en.bandisoft.com/bandiview/) :cs::paid: | :win: |

## Guide

### Neeview

:::steps
1. Install [**jxl-winthumb**](https://github.com/saschanaz/jxl-winthumb).
2. Open Neeview -> Option -> Settings -> File Types.
3. Click **Add** in Image file extensions and add `.jxl`. Done.
:::

### YACReader

:::steps
1. Download `plugin_for_qt6_x_x.zip` from [**here**](https://github.com/novomesk/qt-jpegxl-image-plugin) & unzip it. `qjpegxl6.dll` will be inside it.
2. Go to `C:\Program Files\YACReader\imageformats\` and put `qjpegxl6.dll` there. Done.
:::