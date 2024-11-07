---
title: Manga Image Editing
customDescription: Image Magick guide for Grayscaling, Leveling, and Optimizing
outline: [2,3]
---

<GradientCard title="Manga Image Editing" description="Image Magick guide for Grayscaling, Leveling, and Optimizing" theme="turquoise" variant="thin"/>



A simple to understand guide covering the most important page edits.
<Authors page="imagedit" />


## Simple Denoising

One can simple denoise pages using Waifu2x, which, contrary to its primary function, is not only used for upscaling. For Windows, you could use [**waifu2x-caffe**](https://github.com/lltcggie/waifu2x-caffe/releases), which has a GUI, but is limited to NVIDIA GPUs. Having a reasonably fast GPU is highly recommended (for reference: a GTX 1650 will perform well, while a GT 730 will struggle). Of course, you can denoise in CPU mode, but it will be much slower.

Using the `2-D Illust (CUnet Model)` on `Level 2 Denoise Only` and `Use TTA Mode` unchecked is generally "good enough" for denoising on low to mid-range machines.
Keep in mind that the denoise level depends on JPEG quality. There's no hard rule, but generally, for a q92 image, level 0 should be enough, whereas a q70 image would probably require level 2.

![generic denoising](/ss/waifu.jpg)

Under processing Speed Settings, it is recommended to leave the split size on default unless you are getting weird/incorrect outputs, in which case you might need to adjust it. You can increase the batch size if your GPU can handle more load to process the splits in parallel to speed up the denoising.

The `Use TTA Mode` will process each split piece multiple times, rotating around (8 rotations in total). This generally improves the denoising, but the total processing will take 8 times longer, so for simple, fast, good-enough denoising, you can leave it unchecked unless you have the time for it.

On a final note, it is recommended to set the output extension to PNG, as this is a lossless file format, unlike JPEG, which would reintroduce artifacts that you just took the effort to denoise.

And last but not least: if you have a reasonably fast AMD GPU, consider using other Waifu2x implementations like [**waifu2x-snowshell**](https://github.com/YukihoAA/waifu2x_snowshell), as Waifu2x-Caffe only supports NVIDIA.

<br>

:::info Tools Needed

The following tools will be used for any kind of grayscaling, leveling, and lossless optimizing:
- [ImageMagick](https://imagemagick.org/index.php)
- [Pingo](https://css-ig.net/pingo)
- [imgdanke](https://github.com/DrWhoCares/imgdanke) <tooltip>Optional for GUI but does not support Pingo version 1+ at the moment.</tooltip>
:::

## Grayscaling

The majority of the panels are black and white and can safely be grayscaled if they aren't already (e.g., 24-bit JPEGs or PNGs) to reduce the file size of those images.

The command (CLI) to use with ImageMagick to batch process all images inside the current folder (that your command prompt is in) would be:

```
magick mogrify -format png -dither None -colorspace Gray *.png
```

## Leveling

Leveling images is required when blacks aren't actually black, and after grayscaling, they may look a bit washed out. Before grayscaling, images can even have a hue or colored tint.

![leveling example](/ss/scaling.png)

### Stretching

A simple method without too much effort would be using the `-contrast-stretch` option from ImageMagick, which will try to stretch the closest blacks to #000 and the highest whites to #fff. However, this does not work properly if there are pixels closer to black than the intended targeted blacks, as the stretch finds the lowest/highest colors.

The command (CLI) to use with ImageMagick to batch process all images inside a folder would be:

```
magick mogrify -format png -dither None -colorspace Gray -contrast-stretch 0%x0% *.png
```

### Manual Leveling

With manual leveling, you need to find the minimum black point to have your targeted blacks be actual black (#000) and raise the gamma to compensate for the raised blacks to avoid over-leveling the image. This can be somewhat of a trial-and-error process until you get a satisfying result. As a starting point, you can use the following value for ImageMagick: `13,100%,1.3` (used in the example image shown above), where 13 is the raised black point and 1.3 is the gamma adjustment value.

The command (CLI) to use with ImageMagick to batch process all images inside a folder would be:

```
magick mogrify -format png -dither None -colorspace Gray -level 13,100%,1.3 *.png
```

## Optimizing

You can safely and losslessly optimize images to reduce file size even more using the following command (CLI) with Pingo version 1+:

```
pingo -lossless -s4 path-to-folder
```