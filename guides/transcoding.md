---
title: Transcoding Audio
description: Basic guide for transcoding audio file using foobar2000
customDescription: Basic guide for transcoding audio file using foobar2000
---

# Transcoding Audio

<br>

Transcoding means converting/encoding audio files from one format to another. In this guide, we will discuss the basics and procedures of transcoding audio files. For the transcoding, we will use [**foobar200**](https://www.foobar2000.org/) but the process should be similar in other programs also.

## Audio Source

| Type | Source |
|---|---|
| Analog | Vinyl, tape |
| Digital | CD, DVD, Digital Store, Streaming |

- For **analog source**, you have to use [analog to digital converter](https://en.wikipedia.org/wiki/Analog-to-digital_converter) to get the digital file from the physical medium.
- For **digital source**, audio files are already present in digital format. You have to use ripping software to rip form these.
- Among streaming services,
  - **Lossless**: Qobuz, Apple Music, Tidal, Amazon Music & Deezer
  - **Lossy**: Spotify & Youtube Music

## Audio Format / Container

| Type | Container |
|---|---|
| Uncompressed Lossless | WAV, AIFF |
| Compressed Lossless | FLAC, ALAC, APE, WavPack |
| Compressed Lossy | MP3, Ogg Vorbis, Opus, AAC, WMA |

- **Open source**: FLAC, APE, WavPack, Ogg Vorbis, Opus.
- Uncompressed Lossless is usually used for studio mastering and editing. huge in size since everything is recorded with same bitrate (including silences).
- Compressed Lossless efficiently compresses the audio and reduces the file size by a good margin.
- Lossy formats remove the audio ranges that humans can't hear.
- Ogg & m4a can contain both lossy & lossless.


## MP3 Bitrate Types

### CBR
- Constant Bitrate
- CBR gives every sound the same bitrate, including silences (like Uncompressed Lossless), resulting in larger file sizes than with other bitrate types
- you can only choose one bitrate, all the sounds will then be that exact bitrate

### VBR
- Variable Bitrate
- VBR dynamically changes the bitrate based on the sound resulting in smaller file size
- you can select the bitrate quality level and the encoder then decides the bitrate for every sound based on that

### ABR
- Average Bitrate
- ABR is a mix of CBR & VBR. The audio bitrate will vary (like VBR) & the average bitrate will be the user given one (like CBR)


## The Process

::: danger Read before transcoding {open}
- Audio can't be legitimately transcoded to higher quality since you can't generate new details after compression has been applied. That's why you shouldn't transcode
  -  lossy into another lossy because you will lose more details during transcoding
  -  lossy into lossless since it will be just a waste of space & no audio quality improvement.
:::

<br>

1. Download and install [**Foobar2000**](https://www.foobar2000.org/) & [**encoder pack**](https://www.foobar2000.org/encoderpack).
2. (Optional) Add [**Georgia-ReBORN**](https://github.com/TT-ReBORN/Georgia-ReBORN) theme.
3. Add your music library in the foobar2000.
4. Now follow the video below

<br>

<div class="video_wrapper"><iframe src="https://www.youtube.com/embed/VjPCHhot_k8" frameborder="0" allowfullscreen></iframe></div>

### Standard Quality for Common Containers

| Container | Quality |
|---|---|
| FLAC | Lvl 8 |
| MP3 (VBR) | Lvl 0 |
| MP3 (CBR) | 320kbps |
| Ogg Vorbis | q10 |