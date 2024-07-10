---
title: Audio Glossary
customDescription: Audio terms that you need to know
outline: [1,2]
---

<GradientCard title="音声用語集" tag="Audio Glossary" description="Audio concepts that you need to know." theme="turquoise"/>

<br>

# Audio file

## Audio Signal

### Physical Audio Signal
Physical audio signals are produced by vibrating objects, such as vocal cords, musical instruments, or any resonant object. These vibrations travel through a medium (solid, liquid, or air) and form a continuous wave function.

### Analog Audio Signal
An analog audio signal is a continuous wave function, made out of pulsating voltage. Microphones or other receivers convert physical audio signals into analog signals. This continuous nature means the signal contains an infinite number of data points, making direct digital processing impractical.

### Digital Audio Signal
A digital audio signal is also a wave function but a discrete one, unlike an analog audio signal. This makes it easier to manage and manipulate in a computer.


## Pulse Code Modulation (PCM)
PCM (Pulse Code Modulation) is the most widely used audio encoding method. It involves sampling the audio signal at regular intervals and quantizing the amplitude of each sample into a discrete value. Music is generally recorded in PCM format before being converted to other codecs. Here are a few related terms for PCM:

- **Sample Rate**: The number of samples taken per second from the analog audio signal.
- **Bit Depth**: The number of levels used during quantization.
- **Channel**: The number of individual audio signals in the recording (e.g., mono, stereo).

## Quantization
Quantization involves sampling an analog audio signal and converting it into a digital format. This process includes taking periodic samples of the audio wave and recording the amplitude of the analog signal at each sample point.

Because the recorded amplitude values are approximations of the original, there are inherent errors. These errors manifest as a noise floor within the sound wave. A higher bit depth reduces the noise floor, making it less perceptible.

![](https://upload.wikimedia.org/wikipedia/commons/b/b8/Quantization_error.png)


## Sample Rate
During quantization, the amount of samples taken from the analog audio signal per cycle of the audio to make a digital audio signal is known as the sample rate. As it's a per-second measurement, the unit is kHz (Kilohertz), which means how many thousands of samples are taken per second during quantization.

A higher sample rate means more data points of the signal. However, it doesn't necessarily mean higher quality. A higher sample rate lets you have sound waves of higher frequency, but for the same frequency, there are no advantages.

For listeners, 44.1KHz is sufficient to represent all humanly audible frequencies. 44.1KHz is the standard sampling rate for CDs, and 48KHz is the standard sampling rate for DVDs and streaming services (originally brought forth to aid in timing with TV broadcasts). There is no functional difference between the two, beyond resampling issues that you may face. 

Higher sampling rates is often desirable by producers as it lets them modify the audio more flexibly without adding additional noise, but this is not relevant for playback. Higher sampling rates available on DACs are also generally for processing headroom (for e.g. low-pass filters), that might result in an audible difference.

::: details Nyquist–Shannon Sampling Theorem
All audio signal sampling is based on this theorem. The theorem basically says that the sample rate has to be at least 2x the highest frequency of the analog audio signal to avoid aliasing. So, if the analog audio is 5kHz, the sampling has to be at least 10kHz. 

Another condition is bandlimiting. During the conversion of signals, it adds higher frequencies than the Nyquist frequency. So we have to use a low pass filter to remove them from the result.

Aliasing happens when the signal contains frequencies higher than the Nyquist frequency. The folded wave interferes with the main wave and creates a new sound wave.

![](https://hedgedoc.envs.net/uploads/0253ab4c-13e4-4277-818f-596615c0365c.png)

To remove aliasing, a low pass filter (aka anti-aliasing filter) is added in ADC and DAC. Also, the software has filters to remove aliasing in digitally generated audio signals. It's not practically possible to remove higher frequencies at the exact Nyquist frequency, so a buffer space is kept between the required frequency and the Nyquist frequency. The needed buffer space depends on the hardware capability.

![](https://hedgedoc.envs.net/uploads/d8a7b3eb-cafa-4fb2-8b47-b1e7f09efe02.png)

>More details about the [Nyquist sampling theorem](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem).

:::

## Bit Depth

Bit depth indicates how many levels are used during quantization. Bit depth, also known as the number of levels, is **2<sup>bit depth</sup>**. 
- 8bit :mdi-arrow-right-thin: 256 levels
- 16bit :mdi-arrow-right-thin: 65,536 levels
- 24bit :mdi-arrow-right-thin: 16,777,216 levels

So, the increase of levels is exponential. So the higher the level number, the closer the amplitude match between analog and digital signal and the lower the noise level. But just increasing the bit depth blindly is counter-intuitive. At 16 to 24bit the differnce is barely audible but the file size increases a lot (since it carries more data point).

### Dynamic Range
This means the range of sound between the highest and lowest decibel levels. The range can be calulated using this formula,

::: center
**Signal-to-Quantization-Noise Ratio = 20log(2<sup>bit depth</sup>)dB + 1.76dB**
:::

Using this formula we get (without any dithering applied),
- 8bit :mdi-arrow-right-thin: 49.93dB
- 16bit :mdi-arrow-right-thin: 98.089dB
- 24bit :mdi-arrow-right-thin: 146.25dB


With 16-bit audio, the maximum possible undithered dynamic range is ~96 dB, and with noise-shaped dithering the perceived dynamic range can be increased to >=120dB. A typical quiet home room won't have a significantly lower noise floor than 30 - 40dB, therefore the minimum threshold at which a listener should experience the noise floor of the audio itself over the ambient noise is well beyond the point where one would go deaf. Any higher bit depth is far more relevant for audio processing, rather than playback.

For 24-bit audio, the dynamic range exceeds human hearing capabilities. However, the increased file size may not be justified for most people.



## Bit rate
Bit rate is the amount of data streamed per second. For an audio file, there are three types:

### Constant Bit Rate (CBR)
Here the bit rate remains constant throughout the entire file (including silences). Since the bit rate is constant, the file size is more predictable depending on the bit depth, frequency, and number of channels.

### Variable Bit Rate (VBR)
VBR adjusts the bit rate based on content complexity, which can lead to more efficient use of bits and smaller file sizes.

### Average Bit Rate (ABR)
ABR is the middle gound between CBR and VBR. Here you choose a bit rate and it tries to maintain an average bit rate over the entire audio file, allowing some variation in bit rate.


## Codec
A codec is a standard used to encode and decode a data stream. Using a codec, we store data in a container. Codec is one of the most important factors that determine the audio quality. There are several codecs used in the audio medium.

| Type | Codec |
|---|---|
| Uncompressed Lossless | WAV, AIFF |
| Compressed Lossless | FLAC, ALAC, APE, WavPack |
| Compressed Lossy | MP3, Vorbis, Opus, AAC |

### Uncompressed Lossless
Uncompressed lossless codecs such as WAV and AIFF are pretty old. They use CBR/Constant Bitrate. As a result, you technically don't lose any data, but the file size is very large. WAV is easier to encode and decode and is supported by almost every editing program. So, it's widely used in music studios. As a consumer, you may not want the bloat.

### Compressed Lossless
Compressed lossless codecs are more efficient in size than uncompressed ones. They generally use VBR/Variable Bitrate. So the file sizes are much smaller.

### Compressed Lossy
The main aim of lossy codecs is to make the file size much smaller than lossless ones, making the file more streamable and storage-friendly. Depending on the efficiency of the codec, audio file can provide better sound at lower bit rate. Beyond transparency level, everything will sound the same.

::: tip Transparency
Transparency means when the compression of the original file is accurate enough that listener can't distinguish between the compressed and original file. The level or threshold of transparency depends on listerns hearing ability, equipement(s) and of course the compression method. Since it's based on hearing ability, the topic gets very subjective. The efficient the codec is, the better it will sound **below perceptually transparent bitrate**. In general, it's Opus > Vorbis ≈ AAC > MP3. The bit rate at which lossy audio files become transparent is subjective but the rough estimates are

| Codec | Transparency Level |
|-------|---------------------|
| Opus  | 160-192 kbps        |
| Vorbis| 256 kbps            |
| AAC   | 256 kbps            |
| MP3 (CBR) | 320 kbps        |
| MP3 (VBR) | Between -V3 and -V0 |

:::

## Container

Container contains all the data. The data is stored in different parts:
- **Header:** This contains info about file format, size and signature.
- **Audio data:** This is the main part. It contains the encoded audio file.
- **Metadata:** Info about title, artist, album, genre etc. are added here.
- **Others:** There can be other parts too containing e.g. cue.

Audio files can also be embedded in non-audio specific containers, such as MKV and MP4, which include audio alongside video content.


## Direct Stream Digital (DSD)

Direct Stream Digital (DSD), a product developed by [Sony & Philips](https://www.sony.net/Products/DSD/), is known for its high-resolution audio quality. However, DSD files are relatively rare due to their low popularity. Several factors contribute to this, including their large file size, the difficulty in mastering and editing during production, and the greater efficiency of PCM files in various aspects.

DSD is an audio encoding method that uses 1-bit delta-sigma modulation. It samples the audio signal at a very high rate, representing changes in signal density rather than amplitude levels, and has only 1 bit of amplitude. The most popular DSD standard is .dsf, but there are other standards as well.

![Analog Signal, PCM & DSD](https://www.sony.net/Products/DSD/images/img_1_en.png)

DSD files can be classified based on their sampling rate:

| DSD Type   | Sampling Rate       | Relation to CD Audio (44.1 kHz) |
|------------|---------------------|---------------------------------|
| DSD64      | 2.8224 MHz          | 64 times                       |
| DSD128     | 5.6448 MHz          | 128 times                      |
| DSD256     | 11.2896 MHz         | 256 times                      |
| DSD512     | 22.5792 MHz         | 512 times                      |
| DSD1024    | 45.1584 MHz         | 1024 times                     |

This high sampling rate allows for a wide dynamic range, even with a 1-bit depth. Factors like noise shaping and dithering also contribute to the audio quality. Noise shaping moves noise to the ultrasonic range, though in DSD64, noise starts to increase significantly after 20kHz, requiring the DAC to filter it out, which can also filter out some high-frequency audio. Higher DSD rates experience less noise rise, pushing it further into the ultrasonic range and making noise shaping more linear, which eases the DAC's job.

![Noise in DSD64 & DSD128](https://audiophilestyle.com/uploads/monthly_2014_12/dsd64-128.jpg.b549f3da738f0349755c8778cfbbb22e.jpg)


## Audio Source

| Type | Source |
|---|---|
| Analog | Vinyl, tape |
| Digital | CD, DVD, Digital Store, Streaming |

- For **analog sources**, you have to use an [analog-to-digital converter](https://en.wikipedia.org/wiki/Analog-to-digital_converter) to get the digital file from the physical medium.
- For **digital sources**, audio files are already present in digital format. You have to use ripping software to rip from these.
- Among streaming services:
  - **Lossless**: Qobuz, Apple Music, Tidal, Amazon Music, Deezer
  - **Lossy**: Spotify, YouTube Music, SoundCloud

## Transcoding

Transcoding means converting/encoding audio files from one codec/format to another. Audio can't be legitimately transcoded to higher quality since you can't generate new details after compression has been applied. That's why you shouldn't transcode
 -  lossy into another lossy because you will lose more details during transcoding.
 -  lossy into lossless since it will be just a waste of space & no audio quality improvement.


## Other File types

### .log
Log file is auto generated during the ripping process. It contains all the necessary data to show the integrity of the files, errors, process etc. You should never modify the log file since it defeats the purpose. [**Example**](https://rentry.org/wlogx) of a log file.

### .cue 
It contains metadata about the tracks, including their start and end points, titles, and performers. It can also include additional details such as gaps between tracks and pre-gap data. Cue files are used by media players and burning software to accurately recreate the original CD's structure. This ensures the correct track order and gaps are maintained, enabling a faithful reproduction of the CD's layout when played back or burned to a new disc. cue files are used to make one singular audio file act like it has tracks, as opposed to applying to a list of files. [**Example**](https://rentry.org/wotacue) of a cue file.

### .m3u8
m3u8 files are used for playlists of audio. It contains a list of paths to your local audio files (like songs or podcasts) in order. The difference between m3u and m3u is that m3u uses ASCII (which only supports English characters) and m3u8 uses UTF-8 (which supports characters of other languages too).


```plaintext
#EXTM3U

# Song Title 1
# Duration: 123 seconds
#EXTINF:123,Song Title 1
C:\Music\song1.mp3

# Song Title 2
# Duration: 200 seconds
#EXTINF:200,Canción 2
C:\Music\canción2.mp3

# Song Title 3
# Duration: 180 seconds
#EXTINF:180,歌曲 3
C:\Music\歌曲3.mp3

```


<br>

# Hardware

<br>

::: center
`Coming Soon`
:::


<br>

# Culture

<br>

::: center
`Coming Soon`
:::
