---
title: Madokami Guide
customDescription: The Joining guide for Madokami through IRC. Also how to download stuff from Madokami.
outline: [2,3]
---

<GradientCard title="Madokami Guide" description="Joining guide for Madokami through IRC" theme="turquoise" variant="thin"/>

<br>

# Madokami Guide


[Madokami](https://manga.madokami.al/) is a private website that hosts manga, novels and artbooks. They upload the same manga rips found on nyaa without compression. You can either download from their site (upto 3 parallel downloads) or directly read in tachiyomi using their extension. You sign up by joining their IRC channel and trying your luck at gacha rolls.
<br>

## Creating Account

:::info IRC Clients
Install an IRC client, [**HexChat**](https://hexchat.github.io/) if PC and [**Revolution IRC**](https://f-droid.org/packages/io.mrarm.irc/) if Android. You can't use web IRC clients. You can find more clients [**here**](https://ircv3.net/software/clients).
:::


### Step 1

Connect to **Rizon IRC network**.
1. Add nickname for your account
2. Select Rizon in the network list
3. Click Edit
4. Enable **Use SSL for all the servers  on this network**
5. Enable **Accept invalid SSL certificates**
6. Click Close
7. Click Connect

![](/ss/mado/cnnctrzn.png)

:::details For Revolution IRC

![](/ss/mado/rirc.png)

By default, Revolution IRC doesn't list any networks, so you will need to add Rizon manually by following these steps:
1. Tap the :mdi-plus-circle: button in the bottom right corner of the screen
2. Set network name as `Rizon`
3. Set server address as `irc.rizon.net`
4. The port used is `6697` by default, set it to `9999` in case of connection issues
5. **Enable** SSL/TLS
6. Set your desired nickname
7. Save the configuration
8. You will now see the Rizon network on the main screen. Click on it to start the joining process

:::


### Step 2

::: warning Important
- Use a real e-mail address. Temporary and throw-away e-mail addresses are not acceptable.
- Check spam/junk folder too, if you don't see any reply in the inbox.
- Make sure that your password is longer than 5 characters
:::

1. Register your current nickname by typing the following: `/msg NickServ REGISTER yourPassword your@email.address`
2. Now you should get a confirmation code like this

![](/ss/mado/rzncnfrm.png)

3. Copy and paste the confirmation code into the following command: `/msg NickServ CONFIRM ConfirmationCodeFromEmail`


Now, your nickname is registered, and you've automatically been identified. You are eligible to join Madokami.
Upon your next visit to Rizon IRC network, use the same nickname, and identify using the following command: `/msg NickServ IDENTIFY yourPassword`

### Step 3

1. Type `/join #madokami` at the bottom command bar to join Madokami channel.
2. Now type `/msg sola REGISTER username password` in the Madokami channel. You shouldn't reuse the RIZON password here.

![](/ss/mado/madohome.png)


If everything worked, you will now see a **sola** tab on the left (or at the top on Android). Clicking on it, you will find the bot's reply. If it says that you aren't favored, you can try again after about **4 hours**.


![](/ss/mado/gacha.gif)


::: warning Nickname Issue
In case you followed this guide perfectly, but still aren't getting a reply from sola in the side tab, try picking a different nick in the command. It could be that the current one was already registered by someone else, thereby causing a conflict.
:::


:::details Auto-join Madokami Channel
You can also set up your client to do this automatically by adding it to the **Connect/Autorun commands** for the Rizon network.
#### Hexchat
1. Press `Ctrl + S` to open Network List & select **Rizon** in the network list
2. Click **Edit**
3. In **Connection Command**, click on **Add**
4. Add `msg NickServ IDENTIFY yourPassword`
5. In **Autojoin Channels**, click on **Add**
6. Add `#madokami`
7. **Check** "Connect to this network automatically"
8. **Uncheck** "Use global user information"
9. In **Nick name** add your registered nickname
10. In **Second choice** add your registered nickname with "_" at the end

![](/ss/mado/autohex.png)

#### Revolution IRC
1. Long press on the rizon network
2. Click on **Edit**
3. Add `#madokami` in **Auto-join channels**
4. Add `/msg NickServ IDENTIFY yourPassword` in **Auto-run commands**

![](/ss/mado/autorev.png)
:::


## Downloading Files

### Free Manga Downloader 2

1. Download and install FMD2 from [**here**](https://github.com/dazedcat19/FMD2)
2. Update all the modules and restart FMD2 after the update is complete. You can check the update process in `Options > Websites > Modules`
3. Then go to `Options > Websites > Accounts` and add your Madokami credentials. After that select Madokami and click apply.
4. Now go to **Manga info** and paste the URL in **Input URL here** and click :right-arrow:
5. After it loads the chapters, select the chapters you want to download and click **Download**

<div class="video_wrapper"><iframe src="https://youtube.com/embed/BR3GR8S_Oqo" frameborder="0" allowfullscreen></iframe></div>

::: details More FMD2 Settings

#### Auto Scan

You can scan a Madokami folder automatically.
1. Go to **Manga info** and paste the URL in **Input URL here** and click :right-arrow:
2. Click **Add to favorites**. It will be added in the **Favorites** tab

![](/ss/mado/fav1.png)

3. Go to `Options > General` and check **Minimize on start**
4. Then go to `Options > Updates > Favorites` and check
    - Auto check for new chapter at startup
    - Auto check for new chapter in an interval. Default 60 should be good enough
    - Automatically download after finish checking

#### Save as

By default, FMD2 will save it as folder. Go to `Options > Save to > Save download chapter as` and choose your format.

:::

::: info FMD2 limitation
FMD2 can't download 3 files at a time. For that use **JDL2**.
:::


### JDownloader 2

1. Download and install JDL2 from [**here**](/guides/tech/jdl)
2. Go to `Settings > Basic Authentication` and click the **Add** button at the bottom
3. Now add the details
    - Server type: `http://`
    - Host/URL: `manga.madokami.al`
    - Username: [Your Madokami Username]
    - Password: [Your Madokami Password]
    - :warning: Enable **Always** checkmark (at the last column) to avoid errors while scraping files in **Link grabber**
4. Now go to **Link grabber** and paste the folder url. It will scrape the manga files. It may scrape non-cbz files with websites path in the name. Sort the files on name basis and ignore those. Move the cbz files to a new package.
5. Change the download settings to
   - Max. Chunks per Download: **1**
   - Max. simultaneous Downloads: **3**
6. Now select the cbz files and right click. Then press **Start Downloads**


<div class="video_wrapper"><iframe src="https://youtube.com/embed/Ar2ZMXjMRDQ" frameborder="0" allowfullscreen></iframe></div>


### Mihon forks

1. Add the [Keiyoushi repo](https://keiyoushi.github.io/docs/guides/getting-started#adding-the-extension-repo) in your Mihon forks.
2. Go to the extension list and search **Madokami**.
3. Install the extension and go to its settings page.
4. Add your login credentials.
5. Now go to the Source page and click on Madokami to read/download the available manga.