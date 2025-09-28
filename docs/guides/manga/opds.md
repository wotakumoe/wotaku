---
title: OPDS to your e-ink reader
customDescription: Guide on how to self-host your library to your Kindle
og:
    image: https://i.wotaku.wiki/f/guide.png
---

<GradientCard title="OPDS to your e-ink reader" description="Guide on how to self-host your library to your Kindle/Kobo" theme="turquoise" variant="thin"/>

<br>

OPDS (Open Publication Distribution System) is a open standardized distribution system that allows you to deliver books, articles, mangas, etc. Think of it like RSS but for books and articles.

OPDS is widely supported by most self-hosted library management systems, like Calibre, [Kavita](https://wiki.kavitareader.com/guides/features/opds/), [Komga](https://komga.org/docs/guides/opds/) and [copyparty](https://github.com/9001/copyparty?tab=readme-ov-file#opds-feeds), and we'll dive on how to enable it on the three of them, but it's usually enabled by default.

This guide will explain how to server your library available in your computer/server to your Kindle/Kobo device. We will be using the OPDS protocol as the main way of downloading our content to our device.

## Enabling OPDS

### Calibre (desktop)

1. Connect/share -> Start Content server
![](/ss/opds/connect-share.png)

2. If you click Connect/share again, you'll see Stop Content server [..., port ... HTTP]. This is the IP and the port where the Calibre server is being hosted.
![](/ss/opds/connect-share-enabled.png)

3. If you add a /opds to the URL, you can get the OPDS catalog of your Calibre library

::: info Calibre-web
If you only have calibre-web it's already enabled by default.
:::

::: tip Komga, Kavita and copyparty
Links to their respective guides are on the top of this guide.
:::

## Adding the repo to KOReader

1. Go to the file explorer inside KOReader and open the upside menu. Then click on :ic-sharp-search: -> OPDS catalog
![](/ss/opds/koreader-opds-catalog.png)

2. Click on the top left + button
![](/ss/opds/koreader-inside-opds-catalog.png)

3. In the Catalog URL you need to type the OPDS url. The catalog name is up to your choice.
![](/ss/opds/koreader-adding-opds.png)

4. When clicking the catalog name, you'll get a menu where you can search through your content available on your library and download it.

## Optimizing files using KCC

If you prefer using Kindle/Kobo reader for reading manga rather than the KOReader one, you should optimize the files before transferring them to your device or adding it to your library. We'll use [**KCC**](https://github.com/ciromattia/kcc) for that.

1. Install KindleGen [as KCC stands depending on your OS](https://github.com/ciromattia/kcc?tab=readme-ov-file#kindlegen)
2. [Install KCC](https://github.com/ciromattia/kcc?tab=readme-ov-file#downloads)
3. Open KCC
4. Select your device model
5. Drag the files you want to convert
6. Click Convert and wait
7. That's it! Output files are stored in the same place as input ones unless you click on the Output Folder checkmark and select it on the folder icon of the right.
![](/ss/opds/kcc-ui.png)
