---
title: Disc Ripping
customDescription: Guide on how to rip DVD, Blu-ray, and UHD Discs conversions to MKV and ISO formats.
og:
    image: https://files.catbox.moe/l2g45x.png
---


<GradientCard title="Disc Ripping" description="Guide on how to rip DVD, Blu-ray, and UHD Discs" theme="turquoise" variant="thin"/>

<br>

This guide covers the essentials of converting DVDs, BDs, and UHDs into digital formats (MKVs and ISOs.) While setup may be a bit intricate, the workflow becomes straightforward once established.
<Authors page="discrip" />

## Software needed
You'll mainly need [**MakeMKV**](https://www.makemkv.com/). It's currently free and in public beta (although you'll need to get a key for it, which can be found on [**the forum**](https://forum.makemkv.com/forum/viewtopic.php?f=5&t=1053) and registered via `Help > Register`. There's also an [**auto-updater tool**](https://cable.ayra.ch/makemkv/)).

If you want to make ISOs (i.e. make a basically full copy of the disc), you have two options:
1. [**ImgBurn**](https://www.imgburn.com/)
    - Free software that we'll use to turn a folder created by MakeMKV into an ISO file.
2. [**Xreveal**](https://xreveal.com/)
    - Free software but has a paid version
    - Can remove various protections, such as region codes.
    - Has the added benefit of not dealing with two software and needing half the disk space. (Using ImgBurn will require you to store two copies temporarily)

<br>

::: warning Ripping UHDs / 4K
- You will need additional software and will need to patch your USB player to support LibreDrive
- Not all players are supported
- Skip ahead to [**this section**](#setting-up-uhd-rips)
:::

## Making MKVs
1. Get a USB player. [**Patch it**](#setting-up-uhd-rips) if you're doing UHD.
2. Open up MakeMKV and insert the disc. If you have AnyDVD enabled, disable it first before launching.
3. Press the **disc player icon** (the big one on the middle left).
> Alternatively, if you already ripped it to ISO, you can open the file by pressing the upper left icon. This method saves an enormous amount of time when ripping both formats, especially when using an SSD, as you don't have to rip directly from the disc.
4. Once it's done scanning, checkmark all the titles (videos) you want to rip.
    - General rule of thumb - the biggest file size is usually the full movie.
    - TV Shows also follow this mentality, as it's usually one long video instead of being separated.
5. Click the drive with a green arrow on it, under "Make MKV", to start ripping. This will take a while, depending on the file size and disk player speed.

After this is done, your MKV file is ready! You can convert it to an MP4 or other format if you want, or you can [**REMUX it**](https://rentry.org/bingremuxin).

## Making ISO

### MakeMKV + ImgBurn

1. Get a USB player, open up MakeMKV, and insert the disc. [**Patch**](#setting-up-uhd-rips) your USB player if you're doing UHD
2. Press the folder icon on the top left.

![Example showing the icon](https://i.ibb.co/T1Nsg50/makemkv-t-UAFDN2-C38.png)

3. Select "Decrypt video files" if it isn't already checked.
4. Select an output folder and press OK. Note the directory, you'll need it in ImgBurn.
5. Wait for it to finish ripping. Generally takes around an hour if you have a 6X BD read speed, USB 3.0, and an SSD.
6. Open ImgBurn and select "Create image file from files/folders"
7. Under Source, press the icon with a folder and magnifying glass, and select the output folder from earlier.
8. In destination, select a place for the ISO file.
9. Click the calculator icon. This will add all the necessary info needed. Hit "Yes" if any prompts come up.
10. Press the folder -> ISO button on the bottom left and wait.
11. (Optional) Remove MakeMKV's output folder from before to save space.

You now have a full digital copy of your disc. This allows you to do a variety of things, such as watch with disc menus on VLC or make a full backup onto a physical disc (essentially making an identical copy). As mentioned previously, you can also use this ISO file to get an MKV on MakeMKV.

### Xreveal

::: info Note
You are **not required** to use the Pro version. It offers extra protection removal and some extra features (like a dark theme) but it is not needed to use the software.
:::

1. [Download and configure Xreveal](https://xreveal.com/download.html) if you haven't already.
    - The main thing you want to configure is KeyDB, which allows you to rip offline. This isn’t essential, but it helps in the event that your internet goes out, or if the parent company mysteriously vanishes (*cough cough* RedFox *cough cough*.)
    - KeyDB can be downloaded here: http://fvonline-db.bplaced.net/ Scroll down until you see Downloads and click on English. (Unless you're doing a foreign release, in which case you may need a different one, but it's pretty rare since it should be in the English database anyways.) Just extract it and configure the location on Xreveal.
    - You may also want to configure the protection removals in settings, under BD & UHD.
2. Insert your disc.
    -  If you have it configured, it’ll ask you what region your disc is in. If you’re not sure you can look it up on [blu-ray.com](https://blu-ray.com)
3. Right click Xreveal's taskbar icon and select "Rip to ISO", configure some stuff if needed, and start ripping:

![Example of ISO rip](https://i.ibb.co/f8gDSPq/image.png)

If you want to verify the ISO's file, you can use Xreveal's ["Content Hash Verifier".](https://www.xreveal.com/content-hash-verifier.html) If you have the pro version, it's as simple as going into Xreveal's menu, going to Content Hash Verifier, and pressing "Verify ISO". However on the free version, it's a little more work since you need to use a CLI version. The benefit is that you don’t have to pay for it (and it's cross platform... despite Xreveal only being on Windows...) but the drawback is that it requires more steps.

1. Download the verifier
2. Open up terminal
3. Change the directory to where the verifier is downloaded
    - Usually just `cd ~/Downloads`
4. Mount the ISO file
    - Right click it in explorer and press Mount
5. Find the drive that it's mounted to
6. Run the following:
    - `./contenthashverifier.exe X:\`
    - Replace X: with what drive it's in.

The instructions are somewhat similar on Mac and Linux. (Plus if you're on Linux, it's expected that you know how to use a terminal.) It's also worth noting that, unless you get any read errors during ripping, you *should not need to verify* the disc's hash, especially right away.

## Setting up UHD rips

This is a non-exhaustive guide, mainly focusing on the LG Slim BU40N / Archgon UHD drive (which is the one I have, and at the time of writing, the cheapest). If you have a different player, there is a chance it may not be supported. Please visit this [**UHD drive flashing thread**](https://forum.makemkv.com/forum/viewtopic.php?f=16&t=19634) and the [**SDFtool Flasher thread**](https://forum.makemkv.com/forum/viewtopic.php?f=16&t=22896).

> It should also be noted that the first thread lists some sellers for pre-flashed drives, although I can not personally vouch for them.

1. Get a UHD USB player, if you don't have one already. If you want a different player than the one here (LG BU40N / Archgon), there's a list of recommended drives, also on the UHD flashing thread.
2. Find the model of your player and the firmware needed.
    - For LG BU40N / Archgon, you need BU40N 1.03MK, or `HL-DT-ST-BD-RE_BU40N-1.03-NM00000-211810241934.bin`
    - For any other model, see the flash thread.
3. Download the patched firmware from [this zip file](https://drive.google.com/file/d/1HRnbXiM8TkwcAcvqYFR31bbJsEZ0FCdM/view). Extract the one you need somewhere. There's 1 or 2 not included that is listed on the threads.
4. [**Download**](https://forum.makemkv.com/forum/viewtopic.php?f=16&t=22896) the latest version of SDFtool flasher.
5. If you have a disc inserted, eject it.
6. Open the program and select your drive from the top dropdown menu.
7. Select "**WRITE**" firmware and the firmware file in the bottom dropdown.
8. Hit "**START**" and pray.

If everything works, you should now be able to rip UHD discs, like any other disc. Try it on MakeMKV - it should say on the right that it's patched, under "LibreDrive information." If it doesn't, you can try the "**RECOVER**" option on SDFtool.

## Tips / Q&A
:::details How do you play an ISO file?
[VLC.](https://www.videolan.org/vlc/) You may need to [install Java](https://adoptium.net/) for menus.

[MPV also works](https://mpv.io/) but doesn't support DVD menus. [Kodi](https://kodi.tv/) *may* work, but from my own testing, UHDs don't work and the feature is quite buggy in general. Same with [PowerDVD.](https://www.cyberlink.com/products/powerdvd-ultra/features_en_US.html?r=1)

Also [MPC-HC](https://mpc-hc.org/) should work, but requires you to mount the ISO and it's no longer actively developed.
:::

:::details Why suggest Xreveal, a partially paid and uncracked software, for piracy?

As far as I know, it is the cheapest and currently the best software for disc ripping that also includes region code removal (on top of some other things.) For scene rules, [this is required for COMPLETE BLURAY releases,](https://scenerules.org/html/2014_BLURAY.html) under G3. It also greatly shortens the amount of time needed to rip ISOs while making the process more direct. 

Is it a bit pricey? Yes. Is it worth it? That depends on you, and if you're going to be doing continuous releases, then you might want to consider it.
:::

:::details What about DVDFab?

Some people swear by it, but simply put, ***it is way too expensive.*** You can find cracks of it online, but from my experience they don't work that well. Just save yourself the $250 and use MakeMKV. (Even Xreveal is $45 for lifetime, and AnyDVD was only about $80.)
:::

:::details What about Leawo?

Complete garbage. Simple as that.
:::

:::details What about CloneBD? EaseFab? etc.

If you like using a certain type of software, then feel free to use it. In fact I'm more than happy to list other software if it's better than what's on here. (This guide previously recommended AnyDVD before it became defunct.) These are just easiest ones to get into and, most importantly, are completely free (or relatively cheap in terms of Xreveal.)
:::

:::details On MakeMKV, it's failing a hash check! / On AnyDVD, it won't scan the disc!

Your disc is most likely dirty. Clean it with warm water and dry with microfiber towels. You may also want to clean your player.
:::

:::details It's still having problems after cleaning!

Clean and clean again. If that doesn't work, you'll probably want to return it. Unfortunately, this is the downside of doing full copies of discs, as without that bit of data that it can't read, you can't make a complete copy. Not to mention that some players (like the Archgon player in the UHD guide) have a feature that skips over any data it can't read, meaning you won't be able to do ddrescue (not that you can use it since retail discs are encrypted.)
:::

:::details What's the best place to get discs?

### Online Retailer
Amazon has basically everything, especially newer releases. [Blu-ray.com](https://www.blu-ray.com) is a great database for BD and UHD discs, and on each entry, there's an Amazon link. (It also has some DVDs but it's not as extensive). You can also try eBay, but obviously be wary of its condition.

### Physical Retailer
Walmart sells BDs (sometimes UHDs) and Barnes & Nobles has a few BDs. (Don't expect anything big from these.) There are plenty of other stores that sell them and you'll need to look at your local areas.

<br>

There are also the questionable sellers, such as craigslist, Facebook Marketplace, and the occasional yard sale. I obviously cannot recommend them, but they do exist. Ask the seller first if you can inspect the disc before buying (bonus points if they let you test it). And of course, for any of these stores / sellers, try to get a refund / return if the disc doesn't work.

<br>

You may also want to try rental services. If you're in the US (which good luck if you're doing releases!) the biggest service still around is redbox (which even has UHDs in some cities.) There's also this different service called ["3D BluRay Rental"](https://www.store-3d-blurayrental.com/default.asp) that specializes in 3D and UHDs. (And honestly, a service I haven't even heard about before researching for this guide). I can't personally vouch for either of these, but they're good if you just need to rip the disc, won't plan on keeping it, and are short on money.
:::

:::details I have another question not answered here.
You can try asking on [FMHY](https://rentry.co/fmhy-invite) or on [c/piracy](https://lemmy.dbzer0.com/c/piracy).
:::


