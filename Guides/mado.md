---
Label: Madokami
---

![](/static/thumb/mado.png)

# Madokami Joining Guide

[Madokami](https://manga.madokami.al/){target="_blank"} is a private website that hosts manga, novels and artbooks. They upload the same manga rips found on nyaa without compression. You can either download from their site (upto 3 parallel downloads) or directly read in tachiyomi using their extension. You sign up by joining their IRC channel and trying your luck at gacha rolls.

## Step 0
Install an IRC client, [!badge variant="dark" target="blank" icon="/static/icon/hex.svg" text="**HexChat**"](https://hexchat.github.io/){target="_blank"} if PC and [!badge variant="dark" target="blank" icon="/static/icon/rvl.png" text="**Revolution IRC**"](https://play.google.com/store/apps/details?id=io.mrarm.irc&hl=en&gl=US){target="_blank"} if Android. You can't use web IRC clients. You can find more clients [**here**](https://ircv3.net/software/clients){target="_blank"}.

## Step 1

Connect to **Rizon IRC network**.
1. Add nickname for your account
2. Select RIZON in the networks list
3. Click Connect
![](/static/ss/cnnctrzn.png)

## Step 2

!!!warning Readme
- Use a real e-mail address. Temporary and throw-away e-mail addresses are not acceptable.
- Check spam/junk folder too, if you don't see any reply in the inbox.
- Make sure that your password is longer than 5 characters
!!!

1. Register your current nickname by typing the following: `/msg NickServ REGISTER yourPassword your@email.address`
2. Now you should get a confirmation code like this
![](/static/ss/rzncnfrm.png)
3. Copy and paste the confirmation code into the following command: `/msg NickServ CONFIRM ConfirmationCodeFromEmail`

> If the confirmation code above was copied correctly and still gives you an error, just type it out by hand. Copying seems to break it in some cases.

Now, your nickname is registered, and you've automatically been identified. You are eligible to join Madokami.
Upon your next visit to Rizon IRC network, use the same nickname, and identify using the following command: `/msg NickServ IDENTIFY yourPassword`

You can also set up your client to do this automatically by adding it to the **Connect/Autorun commands** for the Rizon network.
- Hexchat: `HexChat (field in the upper left corner) > Network list > Rizon > Edit > Connect commands > Add`
- Revolution: `Long press on the network > Edit > Autorun command field > Paste > Save`

## Step 3

1. Type `/join #madokami` at the bottom command bar to join Madokami channel.
2. Now type `/msg sola REGISTER username password` in the Madokami channel. You shouldn't reuse the RIZON password here.

You will now see **Sola** at the left sidebar.
![](/static/ss/madohome.png)

- If your lucky, sola will say "**ok enjoy ur account**"
- If unlucky, sola will say "**you are not favored, try again later**"

Repeat this step until you get an account, the cooldown should be 4 hours.

## Tachiyomi

1. Go to extension list and search **Madokami**.
2. Install the extension and go to it's settings page.
3. Add your login credentials.

That should get the job done. The homepage doesn't have infinite scroll due to rate limit. You can search the manga you want and read it.

![](/static/ss/tachi.png)

## Batch Download

[!embed](https://www.youtube.com/embed/BR3GR8S_Oqo)