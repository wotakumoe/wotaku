---
title: Madokami
---
# Madokami Joining Guide
[Madokami](https://manga.madokami.al/) is a private website that hosts manga, novels and artbooks. They upload the same manga rips found on nyaa without compression. You can either download from their site (upto 3 parallel downloads) or directly read in tachiyomi using their extension. You sign up by joining their IRC channel and trying your luck at gacha rolls.
<br>

:::info IRC Clients
Install an IRC client, [**HexChat**](https://hexchat.github.io/) if PC and [**Revolution IRC**](https://play.google.com/store/apps/details?id=io.mrarm.irc&hl=en&gl=US) if Android. You can't use web IRC clients. You can find more clients [**here**](https://ircv3.net/software/clients).
:::


## Step 1

Connect to **Rizon IRC network**.
1. Add nickname for your account
2. Select RIZON in the networks list
3. Click Connect

![](/ss/mado/cnnctrzn.png)

## Step 2

:::warning Readme
- Use a real e-mail address. Temporary and throw-away e-mail addresses are not acceptable.
- Check spam/junk folder too, if you don't see any reply in the inbox.
- Make sure that your password is longer than 5 characters
:::

1. Register your current nickname by typing the following: `/msg NickServ REGISTER yourPassword your@email.address`
2. Now you should get a confirmation code like this
![](/ss/mado/rzncnfrm.png)
3. Copy and paste the confirmation code into the following command: `/msg NickServ CONFIRM ConfirmationCodeFromEmail`

>If the confirmation code above was copied correctly and still gives you an error, just type it out by hand. Copying seems to break it in some cases.

Now, your nickname is registered, and you've automatically been identified. You are eligible to join Madokami.
Upon your next visit to Rizon IRC network, use the same nickname, and identify using the following command: `/msg NickServ IDENTIFY yourPassword`

You can also set up your client to do this automatically by adding it to the **Connect/Autorun commands** for the Rizon network.
- Hexchat: `HexChat (field in the upper left corner) > Network list > Rizon > Edit > Connect commands > Add`
- Revolution: `Long press on the network > Edit > Autorun command field > Paste > Save`

## Step 3

1. Type `/join #madokami` at the bottom command bar to join Madokami channel.
2. Now type `/msg sola REGISTER username password` in the Madokami channel. You shouldn't reuse the RIZON password here.

You will now see **Sola** at the left sidebar.
![](/ss/mado/madohome.png)

- If your lucky, sola will say "**ok enjoy ur account**"
- If unlucky, sola will say "**you are not favored, try again later**"

Repeat this step until you get an account, the cooldown should be 4 hours.

## Tachiyomi

1. Go to extension list and search **Madokami**.
2. Install the extension and go to it's settings page.
3. Add your login credentials.

That should get the job done. The homepage doesn't have infinite scroll due to rate limit. You can search the manga you want and read it.

![](/ss/mado/tachi.png)


## Batch Download

### FMD2

1. Download and install FMD2 from [**here**](https://github.com/dazedcat19/FMD2)
2. Update all the modules and restart FMD2 after the update is complete. You can check the update process in `Options > Websites > Modules`
3. Then go to `Options > Websites > Accounts` andd add your Madokami credentials. After that select Madokami and click apply.
4. Now go to **Manga info** and paste the URL in **Input URL here** and click :arrow_right:
5. After it loads the chapters, select the chapters you want to download and click **Download**

<div class="video_wrapper"><iframe src="https://youtube.com/embed/BR3GR8S_Oqo" frameborder="0" allowfullscreen></iframe></div>

::: details More settings

#### Auto Scan

You can scan a Madokami folder automatically.
1. Go to **Manga info** and paste the URL in **Input URL here** and click :arrow_right:
2. Click **Add to favorites**. It will be added in the **Favorites** tab
![](/ss/mado/fav1.png)
3. Go to `Options > General` and check **Minimize on start**
4. Then go to `Options > Updates > Favorites` and check
    - Auto check for new chapter at startup
    - Auto check for new chapter in an interval. Default 60 should be good enough
    - Automatically diwbkiad after finish checking

#### Save as

By default, FMD2 will save it as folder. Go to `Options > Save to > Save download chapter as` and choose your format.

:::

>FMD2 can't download 3 files at a time. For that use **JDL2**.

### JDL2

1. Download and install JDL2 from [**here**](https://rentry.org/jdownloader2)
2. Go to `Settings > Basic Authetication` and click the **Add** button at the bottom
3. Now add the details
    - Server type: `http://`
    - Host/URL: `manga.madokami.al`
    - Username: [Your Madokami Username]
    - Password: [Your Madokmai Password]
    - :warning: Enable **Always** checkmark (at the last column) to avoid errors while scraping files in **Link grabber**
4. Now go to **Link grabber** and paste the folder url. It will scrape the manga files.
    - It may scrape corrupted/unavailable cbz files with websites path in the name. Sort the files on name basis and ignore those.
5. Now select the cbz files and right click. Then press **Start Downloads**

>You can also use **Tachiyomi** to download files from Madokami.
