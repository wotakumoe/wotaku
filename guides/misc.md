---
title: Miscellaneous guides
customDescription: Collections of small guides
---

# Miscellaneous guides

<br>

Collections of small guides.

## Foobar2000 Synced Lyrics

For this guide we will use OpenLyrics. You can also try [ESLyric](https://github.com/ESLyric/release).

### Step 1
[**Download**](https://www.foobar2000.org/components/view/foo_openlyrics) the OpenLyrics component.

### Step 2
Open `Foobar > File > Preferences` or click **CTRL + P**.

::: details Image Preview
![](/ss/foobar/fbs1.png)
:::


### Step 3
Go to **Components** and click **Install**.

::: details Image Preview
![](/ss/foobar/fbs2.png)
:::

### Step 4
Select the downloaded OpenLyrics component file and open. Then click **Apply** to load it and **OK** to restart the app.

::: details Image Preview
![](/ss/foobar/fbs3.png)
:::

### Step 5
Then go to `Tools > OpenLyrics > Searching`. Click on Musixmatch in **Available sources**. Then **<<** to move it in the main section. Then select Musixmatch again and click **UP** to the top 3. Click **Apply**.

::: details Image Preview
![](/ss/foobar/fbs4.png)
:::

### Step 6
Go to `Tools > OpenLyrics > Searching > Musixmatch`. Click **?** and then **Yes**. Hit **Apply**.

::: details Image Preview
![](/ss/foobar/fbs5.png)
:::

### Step 7
Go to `Tools > OpenLyrics > Searching > Metadata tags`. Set **LYRICS** as value for both Unsynced and Synced lyrics

::: details Image Preview
![](/ss/foobar/fb5_5.png)
:::

### Step 8
Go to `Foobar > View > OpenLyrics Panel`

::: details Image Preview
![](/ss/foobar/fbs6.png)
:::

Now play any song and the panel will show synced lyrics (if it's in the database)

::: details Image Preview
![](/ss/foobar/fbs7.png)
:::

:::details More Settings
### Saving synced lyrics as metadata
Go to `Tools > OpenLyrics > Saving` and set Save method as **Save to tag**

![](/ss/foobar/fbsavesub.png)

> 💡 You can also select multiple song and set synced lyrics for all of them by going to `Right click > OpenLyrics > Search for Lyrics`

:::


## JDownloader AD Removal

JDownloader is a free download manager, but it comes with banner ads and other annoyances. In this guide you will learn how to remove them.

![](/ss/jd.png)

- First download and install [**JDownloader 2**](https://jdownloader.org/jdownloader2).
- Run JDownloader and open settings by pressing **Ctrl + P**.
- Now go to **Advanced settings** (at the bottom of the left sidebar). Here we will modify the values of several keys to remove ads / annoyances. Click **Ok** in the confirmation pop-up.
- Now search the mentioned and change the values:
  - `banner` :mdi-arrow-right-thin: uncheck the value.
  - `donate` :mdi-arrow-right-thin: set the value `Hidden (Automode)`
  - `premium alert` :mdi-arrow-right-thin: uncheck all of the values
  - `special deal` :mdi-arrow-right-thin: uncheck all of the values

