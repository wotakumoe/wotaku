---
title: Cubari guide
customDescription: Guide on how to proxy comic through Cubari.moe
og:
    image: https://files.catbox.moe/m3xqdl.png
---

<GradientCard title="Cubari guide" description="Guide on how to proxy comic through Cubari.moe" theme="turquoise" variant="thin"/>

<br>

This guide explains how to publish your comic using [**Cubari**](https://cubari.moe/). Cubari does not host any files directly; instead, it reads a JSON file containing image links and other metadata. To host the images, we’ll use [**Image Chest**](https://imgchest.com/), and to generate the JSON file, we’ll use the [**Kaguya script**](https://github.com/wotakumoe/kaguya).

::: warning Cubari ≠ Cubari Proxy
[**Cubari**](https://cubari.moe/) and [**Cubari Proxy**](https://proxy.cubari.moe/) serve different purposes. Cubari Proxy is a scraper, while Cubari acts as a proxy that displays images from your own hosted sources.
:::

## Files and metadata

::: tabs

== Files and folders

Your comic folder should follow this naming scheme:  
- Folder names should be formatted like `V# Ch# Title`. The volume number (`V#`) and chapter title are optional, but the chapter number (`Ch#`) is required.  
- Make sure the images inside each folder are sorted alphabetically.

```bash
Comic_Folder/
├── info.txt                    # Comic metadata                     
├── V01 Ch001 First Chapter/          
│   ├── page001.jpg
│   ├── page002.jpg
│   └── ...
└── V01 Ch002 Second Chapter/
    ├── page001.jpg
    └── ...
```

== Metadata

The given metadata will be displayed on the comic's homepage. Create an `info.txt` file inside your base comic folder and fill it out using the following format.  

**Note:** The script supports only one uploader/group. If there are multiple, you'll need to handle it manually.

```bash
title: Comic Title
description: Comic Description
artist: Artist Name
author: Author Name
cover: https://cover-url.com/image.jpg
groups: Uploader Name
```

:::

## Setup

::: tabs

== Python
Kaguya is a Python-based script, so you need to install Python first.

1. Download and install the latest Python release from [here](https://www.python.org/downloads/).
2. During installation, make sure to check the option **"Add Python X.XX to PATH"**.

**Note:** For this guide, I used [**PowerShell 7.5.1**](https://github.com/PowerShell/PowerShell).

== Imgchest
To host images, we are using [Image Chest](https://imgchest.com/). You can upload up to 20 images at a time, but more can be added later. The script uploads images in chunks, so you'll need an API key to automate this process.

1. Visit [Image Chest](https://imgchest.com/).
2. Register a [new account](https://imgchest.com/register).
3. After verifying your email, go to the [API section](https://imgchest.com/profile/api).
4. Create an API key and save it somewhere safe, you'll need it in a later step.

== GitHub
1. You need a GitHub account. An older account is less likely to be flagged by GitHub.
2. Open a new [public repo](https://github.com/new).
3. Generate a new [token](https://github.com/settings/tokens/new?scopes=public_repo&description=Kaguya).
4. Save the token to somewhere safe like ImgChest API token.

== Script
1. Visit [Kaguya repository](https://github.com/wotakumoe/kaguya).
2. Clone/download the repository.
3. Open powershell in the folder and run `pip install -r requirements.txt`
4. Put the Image chest API key in `api_key.txt`
5. Open the `github.txt`, fill out the user name, repository name and token.

```bash
Kaguya/
├── api_key.txt  
├── github.txt  
├── kaguya.py
├── readme.md                                 
└── requirements.txt
```

:::

## Kaguya

1. Open powershell in the script folder.
2. Run `python kaguya.py`
3. Enter comic folder path.
4. Choose options accordingly.
```bash
⬆️ Process Options:
1. Upload all folders
2. Upload only new folders (skip already uploaded)
3. Select specific folder(s) to upload/re-upload
4. Update GitHub only (uses existing manga.json for this manga)
5. Cancel
```
5. It will then start uploading in batch.
6. After it done uploading, it will ask whether you wanna upload the JSON in the GitHub repo.
7. When all the process is done, it will give summary.

::: info Manual JSON Upload
1. You need a GitHub account. An older account is less likely to be flagged by GitHub.
2. Open a new [public repo](https://github.com/new) and upload the JSON file there.
3. Go to [**Cubari**](https://cubari.moe/) and paste `https://raw.githubusercontent.com/user/repo/main/comic_title.json` there. It will load all your chapters along with their metadata.

The Cubari link generated on that page will be your comic’s final shareable link.
:::

### Generated files

After the run, the script will generate `comic_title.json`, `imgchest_upload_record.txt` and `cubari_urls.txt` in the comic's base folder.

| filename | Destination | Description |
|-|-|-|
| `comic_title.json` | Comic folder | Will contain all the chapter links and metadata for cubari. |
| `imgchest_upload_record.txt` | Comic folder | keeps track of all uploaded folders. If a folder fails to upload, it won’t be listed in this file. When you run the script again, the missing folder will be detected as new. |
| `cubari_urls.txt` | Kaguya folder | Keeps log of all the uploads using Kaguya | 


## Mihon

- You can find the Cubari extension in [these repositories](/guides/ext/mihon#manga). Follow the guide to install the extension.
- Then go to your phone: **Settings** -> **Apps** -> **All Apps** -> **Tachiyomi: Cubari** -> **Open by default** -> **Add link**.
- Check the links you want to associate. For this guide, you should enable `cubari.moe` and `*.cubari.moe`, then tap **Add**.

![](/ss/cubariss.png)

Your phone will now open selected Cubari URLs directly in Mihon using the extension.

::: warning README
Cubari behaves differently from typical extensions. It won’t display a catalog of manga inside Mihon. Instead, it will only show titles you’ve visited via this extension or those you've added to your library manually.
:::
