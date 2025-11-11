---
title: Synced Lyrics in Foobar2000
description: View and add synced lyrics in Foobar2000
og:
    image: https://i.wotaku.wiki/f/guide.png
---

For this guide we will use OpenLyrics. You can also try [ESLyric](https://github.com/ESLyric/release).

## Adding OpenLyrics
:::steps
1. [**Download**](https://www.foobar2000.org/components/view/foo_openlyrics) the OpenLyrics component.
2. Open `Foobar > File > Preferences` or click **CTRL + P**.

    ![](/ss/foobar/fbs1.png)
3. Go to **Components** and click **Install**.

    ![](/ss/foobar/fbs2.png)
4. Select the downloaded OpenLyrics component file and open. Then click **Apply** to load it and **OK** to restart the app.

    ![](/ss/foobar/fbs3.png)
5. Then go to `Tools > OpenLyrics > Searching`. Click on Musixmatch in **Available sources**. Then **<<** to move it in the main section. Then select Musixmatch again and click **UP** to the top 3. Click **Apply**.

    ![](/ss/foobar/fbs4.png)
6. Go to `Tools > OpenLyrics > Searching > Musixmatch`. Click **?** and then **Yes**. Hit **Apply**.

    ![](/ss/foobar/fbs5.png)
7. Go to `Tools > OpenLyrics > Searching > Metadata tags`. Set **LYRICS** as value for both Unsynced and Synced lyrics

    ![](/ss/foobar/fb5_5.png)
8. Go to `Foobar > View > OpenLyrics Panel`

    ![](/ss/foobar/fbs6.png)
:::

Now play any song and the panel will show synced lyrics (if it's in the database)

![](/ss/foobar/fbs6.png)

details More Settings

## Saving synced lyrics as metadata
Go to `Tools > OpenLyrics > Saving` and set Save method as **Save to tag**

![](/ss/foobar/fbsavesub.png)

::: tip Tip
You can also select multiple song and set synced lyrics for all of them by going to `Right click > OpenLyrics > Search for Lyrics`
:::
