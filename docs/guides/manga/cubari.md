---
title: Cubari guide
customDescription: Guide on how to proxy comic through Cubari
og:
    image: https://files.catbox.moe/m3xqdl.png
---

<GradientCard title="Cubari guide" description="Guide on how to proxy comic through Cubari." theme="turquoise" variant="thin"/>

<br>

This guide is on how to publish your comic through [**Cubari**](https://cubari.moe/). Cubari doesn't host any files itself, but instead reads a JSON file with all the image file links (alongside other metadata). To host the images we will use [**Image Chest**](https://imgchest.com/) and to generate JSON file, we will use Kaguya script.

::: warning Cubari ≠ Cubari Proxy
[Cubari](https://cubari.moe/) and [Cubari Proxy](https://proxy.cubari.moe/) are functionally different. Cubari Proxy is a scraper, meanwhile Cubari is more to proxy images from your hosted source. 
:::

## Files and metadata

::: tabs

== Files and folders

Your comic folder should follow this scheme. The folders name should be like `V# Ch# Title`. You can skip volume number and chapter title, but the chapter number is a must. The images inside should be alphabetically sorted.

```bash
Comic_Folder/
├── info.txt                    # For metadata                     
├── V01 Ch001 First Chapter/          
│   ├── page001.jpg
│   ├── page002.jpg
│   └── ...
└── V01 Ch002 Second Chapter/
    ├── page001.jpg
    └── ...

```

== Metadata

The given metadata will be shown in the comic homepage. You have to create a `info.txt` file inside your base comic folder, then fill out the text file following this scheme. The script expects only one uploader/group, so if there are multiple, you have to do it manually.

```bash
title: Comic Title
description: Comic Description
artist: Artist Name
author: Author Name
cover: https://cover-url.com/image.jpg
groups: Uploader Name
```

:::

## Kaguya

::: tabs

== Python
Kaguya is a python based script, so you have to download and install Python its dependencies.

1. Download and install the latest Python binary from [here](https://www.python.org/downloads/).
2. When installing, you will see `Add Python X.XX to PATH`. You have to check that.
3. Open PowerShell and run `pip install requests`. For this guide, I have used [PowerShell 7.5.1](https://github.com/PowerShell/PowerShell).

== Imgchest
To host images, we are using [Image chest](https://imgchest.com/). Here we can post images up to 20 at a time, but later we can add more. The script will add images in chunks. To upload the images we need API key.
1. Visit [Image chest](https://imgchest.com/).
2. Register [new account](https://imgchest.com/register).
3. After verifying your email, go to [API section](https://imgchest.com/profile/api).
4. Create an API key and keep it somewhere saved. We will need it later step.

== Script setup
1. Visit Kaguya repository.
2. Download `kaguya.py` from the repository.
3. Place it in a folder.
4. Create `api_key.txt` in the same folder.
5. Put the Image chest API key in the text file.

```bash
Cubari
├── api_key.txt                                   
└── kaguya.py

```

== Run
1. Open powershell in the script folder.
2. Run `python kaguya.py`
3. Enter comic folder path.
4. Choose options accordingly.
5. It will then start uploading in batch
6. After it done uploading, it will give summary

After the run, the script will generate `Comic_Name.json` and `imgchest_upload_record.txt` in the comic's base folder.

```bash
Comic_Folder/
├── info.txt                           # Manga metadata
├── imgchest_upload_record.txt         # Upload history (auto-created)
├── Your_Manga_Title.json              # Manga database (auto-created)
├── V01 Ch001 First Chapter/           # Chapter folder
│   ├── page001.jpg
│   ├── page002.jpg
│   └── ...
└── V01 Ch002 Second Chapter/
    ├── page001.jpg
    └── ...
```

`imgchest_upload_record.txt` will contain all the folders uploaded. If any folder upload fails, it will be missing in the text file. When you run the script, it will be tagged as new. Select `2. Upload only new folders (skip already uploaded)` to retry. After successful upload, they will be added in the JSON file. Although the new uploads will be at bottom, it won't impact Cubari serial.

:::

## Cubari
1. You need to have a GitHub account. Older account is better, so that GitHub doesn't randomly flag your account.
2. Go to [GitHub Gist](https://gist.github.com/) and upload the JSON file there. It can be secret or public gist.
3. Click the **RAW** button after uploading and copy the link.
4. Go to [Cubari](https://cubari.moe/) and enter the link there. It will load all the chapters with the metadata.

The cubari link of that page will be the comic link.