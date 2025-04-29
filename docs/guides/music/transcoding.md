---
title: Transcoding Audio
description: Basic guide for transcoding audio file
outline: [2,3]
og:
    image: https://files.catbox.moe/l2g45x.png
---

<GradientCard title="Transcoding Audio" description="Basic transcoding guide for audio file" theme="turquoise" variant="thin"/>

Transcoding means converting/encoding audio files from one format to another. In this guide, we will discuss the basics and procedures of transcoding audio files. For the transcoding, we will use [**foobar2000**](https://www.foobar2000.org/) and [**fre:ac**](https://www.freac.org/), but the process should be similar in other programs also.

::: tip Before starting
[**Read audio glossary**](/glossary/audio) before starting, if you don't have any idea what you are doing.

:::

## The Process

::: danger Read before transcoding {open}
- Audio can't be legitimately transcoded to higher quality since you can't generate new details after compression has been applied. That's why you shouldn't transcode
  -  lossy into another lossy because you will lose more details during transcoding
  -  lossy into lossless since it will be just a waste of space & no audio quality improvement.
:::

### fre:ac
1. Download and install [**fre:ac**](https://www.freac.org/)
2. Click :mdi-plus: **"Add Audio File(s) to the joblist"** button at the top right. If you wanna select a whole folder, you can click the :mdi-menu-down: right beside the Add button.
3. After selecting the audio files, click **"Open"**.
4. All the files will be in the joblist. You can click on **"Tags"**, right beside **"Joblist"**, if you want to change any tags.
5. Click :mdi-menu-down: in the **"Select Encoder"** based on your target Codec for the audio
6. Then click on the yellow :mdi-cog: button to configure the Encoder (CBR/VBR, Bitrate, Format etc.).
7. Click on the blue :mdi-filter: button, if you want to apply extra filters.
8. You can select your output folder at the bottom.
9. Now click the :mdi-play: button to start the encoding process.

![](/ss/freac.png)

### Foobar2000

1. Download and install [**Foobar2000**](https://www.foobar2000.org/) & [**encoder pack**](https://www.foobar2000.org/encoderpack).
   - (Optional) Add [**Georgia-ReBORN**](https://github.com/TT-ReBORN/Georgia-ReBORN) theme.
2. Add your music library in the foobar2000.
3. Now follow the video below

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/VjPCHhot_k8" frameborder="0" allowfullscreen></iframe></div>

::: tip Standard Quality for Common Codecs
| Codec | Quality |
|---|---|
| FLAC | Lvl 8 |
| MP3 (VBR) | Lvl 0 |
| MP3 (CBR) | 320kbps |
| Ogg Vorbis | q10 |
:::