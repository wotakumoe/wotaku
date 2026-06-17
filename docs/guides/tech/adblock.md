---
title: Ad-blocking & Privacy
customDescription: Adblocking Solutions for every device & VPN listing
og:
    image: https://i.wotaku.wiki/f/guide.png
---

## Browser
| Based on | Browser | Platform |
|-|-|-|
| Chromium  | [Brave](https://brave.com/) [:src:](https://github.com/brave/brave-browser) | :and::ios::win::app::lin: |
| ^^        | [Cromite](https://github.com/uazo/cromite) | :and::win::lin: |
| ^^        | [Helium](https://helium.computer/) [:src:](https://github.com/imputnet/helium) | :win::app::lin: |
| Gecko     | [Firefox](https://www.firefox.com/) [:src:](https://searchfox.org/firefox-main/source) | :and::ios::win::app::lin: |
| ^^        | [Ironfox](https://ironfoxoss.org/) [:src:](https://gitlab.com/ironfox-oss/IronFox/) | :and: |
| ^^        | [LibreWolf](https://librewolf.net/) [:src:](https://codeberg.org/librewolf/source) | :win::app::lin: |

## General 
::: tabs

== Extension
- [uBlock Origin](https://github.com/gorhill/uBlock) [:s:](https://github.com/gorhill/uBlock)
- [uBO Lite](https://github.com/uBlockOrigin/uBOL-home)
- [AdGuard](https://adguard.com/en/adguard-browser-extension/overview.html)

== Filters
- [Actually Legitimate URL Shortener Tool](https://github.com/DandelionSprout/adfilt/blob/master/LegitimateURLShortener.txt)
- [FMHY Filterlist](https://github.com/fmhy/FMHYFilterlist)
- [Hagezi DNS Blocklists](https://github.com/hagezi/dns-blocklists) [:s:](https://github.com/hagezi/dns-blocklists)
- [Yokoffing Filterlists](https://github.com/yokoffing/filterlists)

== Apps
- [Adguard](https://adguard.com/en/welcome.html) :cs:
- [Adaway](https://adaway.org/) [:src:](https://github.com/AdAway/AdAway)
- [RethinkDNS](https://rethinkdns.com/) [:src:](https://github.com/celzero/rethink-app)

== Cloud DNS
- [NextDNS](https://nextdns.io/) :s:
- [Adguard](https://adguard-dns.io/en/welcome.html)
- [Control D](https://controld.com/)
- [dnswarden](https://dnswarden.com/index.html)
- [Mullvad](https://mullvad.net/en/help/dns-over-https-and-dns-over-tls)
- [RethinkDNS](https://rethinkdns.com/)

<collapsible title="Extra DNS info">

| Resolver | Based in | Adblock | Query Limit (Account) |
|-|-|-|-|
| [NextDNS](https://nextdns.io/) :s:  | :cus:  | :yes:    | 300k/mo   |
| [Adguard](https://adguard-dns.io/en/welcome.html) | :ccy: | :yes: | 300k/mo |
| [Control D](https://controld.com/) | :cca: | :yes: | :no: |
| [dnswarden](https://dnswarden.com/index.html) | :cswi: | :yes: | N/A  |
| [DNS.SB](https://dns.sb/) [:src:](https://github.com/dns-sb/) | :cge: | :no: | N/A |
| [Mullvad](https://mullvad.net/en/help/dns-over-https-and-dns-over-tls) | :cswe: | :yes: | N/A |
| [Quad9](https://quad9.net/) | :cswi: | :no: | N/A |

</collapsible>

== Self-Hosted DNS
- [Pi-hole](https://pi-hole.net/)
- [AdGuard Home](https://github.com/AdguardTeam/AdGuardHome)

:::


::: warning Before adding filters
Adding a lot of filters to your adblocker (that you don't specifically need) can impact the performance of your browser and cause slowdowns. It may also break the normal capabilities of UBO, so try to stick with the default filters.
:::

## Annoyances

| Topic  | Solutions | Platform |
|--------|-----------|-|
| **Captcha** | [Buster](https://github.com/dessant/buster) | :ff::cr: |  
| ^^     | [NopeCHA](https://nopecha.com/) | :ff::cr: |  
| **Paywall** | [Bypass All Shortlinks Debloated](https://codeberg.org/Amm0ni4/bypass-all-shortlinks-debloated/) :s: | :js: | 
| ^^     | [AdsBypasser](https://adsbypasser.github.io/) [:src:](https://github.com/adsbypasser/adsbypasser) | :js: |
| ^^     | [Bye Bye Paywall](https://byebyepaywall.com/en/) | :web: |  
| ^^     | [Bypass.city](https://bypass.city/how-to-install-userscript) | :js: |
| ^^     | [Bypass Paywalls Clean](https://gitflic.ru/user/magnolia1234) | :ff::cr::js: |  
| **Others** | [BehindTheOverlay](https://github.com/NicolaeNMV/BehindTheOverlay) | :ff::cr: |


## Site-specific

| Websites    | Solutions                                                                 | Platform                      |
|-------------|---------------------------------------------------------------------------|---------------------------|
| [Discord](https://discord.com/)    | [Disblock Origin](https://codeberg.org/AllPurposeMat/Disblock-Origin)      | :css:           |
| [Fandom](https://www.fandom.com/)   | [Fandom Fixed](https://github.com/squabbled/FandomFixed)                    | :js:                       |
| [Spotify](https://www.spotify.com/) | [Spicetify](https://spicetify.app/)                                         | :win::app::lin:            |
| ^^                                 | [SpotX](https://github.com/SpotX-Official/SpotX)                            | :win:                      |
| ^^                                 | [SpotX-Bash](https://github.com/SpotX-Official/SpotX-Bash)                 | :app::lin:                 |
| [Twitch](https://www.twitch.tv/)    | [TTV LOL PRO](https://github.com/younesaassila/ttv-lol-pro)                 | :ff::cr:                   |
| ^^                                 | [Purple Adblock](https://github.com/arthurbolsoni/Purple-adblock/)          | :ff::cr::js:               |
| ^^                                 | More [Twitch Ad Solutions](https://github.com/pixeltris/TwitchAdSolutions/blob/master/full-list.md) |        |
| [Twitter](https://x.com/)      | [Control Panel for Twitter](https://github.com/insin/control-panel-for-twitter/) | :ff::cr::js:             |
| ^^                                 | [OldTwitter](https://github.com/dimdenGD/OldTwitter)                        | :ff::cr:                   |
| [YouTube](https://www.youtube.com/) | [SponsorBlock](https://sponsor.ajay.app/)                                  | :ff::cr:                   |

## VPN

| Feature          | [AirVPN](https://airvpn.org/) | [IVPN](https://www.ivpn.net/en/) | [Mullvad](https://mullvad.net/en) | [Proton](https://protonvpn.com/) | [Windscribe](https://windscribe.com/) |
| ---------------- | ----------------------------- | -------------------------------- | --------------------------------- | -------------------------------- | ------------------------------------- |
| **2FA**          | :yes:                         | :yes:                            | :no:                              | :yes:                            | :yes:                                 |
| **Audits**       | :no:                          | :yes:                            | :yes:                             | :yes:                            | :yes:                                 |
| **Based in**     | :cit:                         | :cgib:                        | :cswe:                            | :cswi:                      | :cca:                                |
| **Crypto**       | :yes:                         | :yes:                            | :yes:                             | :yes:                            | :yes:                                 |
| **JP Server** | :yes:                         | :yes:                            | :yes:                             | :yes:                            | :yes:                                 |
| **Kill Switch**  | :yes:                         | :yes:                            | :yes:                             | :yes:                            | :yes:                                 |
| **Multi-hop**    | :no:                          | :yes:                            | :yes:                             | :yes:                            | :yes:                                 |
| **OpenVPN**      | :yes:                         | :yes:                            | :no:                              | :yes:                            | :yes:                                 |
| **Port Forward** | :yes:                         | :no:                             | :no:                              | :yes:                            | :yes:                                 |
| **RAM-only**     | :yes:                         | :no:                             | :yes:                             | :no:                             | :yes:                                 |
| **WireGuard**    | :yes:                         | :yes:                            | :yes:                             | :yes:                            | :yes:                                 |

::: tip Readme
This overview (**<u>not</u>** ranking) lists the paid features, the free tier (if a VPN has it) would be more limited. There are free vpns like [WARP](https://one.one.one.one/) and [Riseup vpn](https://riseup.net/en/vpn) but they weren't consisdered because of their reliability and lack of features. Go through [Techlore's VPN Finder](https://vpn.techlore.tech/) for more comparisons.
:::

::: danger Never use Cracked / Modded VPN {open}
You should never use cracked or modded VPN cause all of your traffic will go through that VPN. So using a compromised VPN is extremely risky.
:::
