---
title: Self-Hosting & Home Automation
description: Build your own local media stack
customDescription: Guides and tools for self-hosting anime, manga, music and more with media servers, download automation, dashboards and privacy tools.
outline: [1,2]
og:
  image: https://i.wotaku.wiki/f/tools.png
---

::: info
This page covers tools for running your own local media server and automating downloads. Most tools here run as Docker containers or standalone services on a home server, NAS, or mini PC.
:::

## Media Servers

::: tabs
== Video
| Software | Platform | FOSS |
| :--- | :--- | :--- |
| [Jellyfin](https://jellyfin.org/) [:src:](https://github.com/jellyfin/jellyfin) :s: | :win::app::lin: | :yes: |
| [Plex](https://www.plex.tv/) | :win::app::lin: | :no: |
| [Emby](https://emby.media/) | :win::app::lin: | :no: |
| [Stremio](https://www.stremio.com/) [:src:](https://github.com/Stremio/stremio-core) | :win::app::lin: | :yes: |
| [Kodi](https://kodi.tv/) [:src:](https://github.com/xbmc/xbmc) | :win::app::lin: | :yes: |

== Manga / Books
| Software | Description |
| :--- | :--- |
| [Komga](https://komga.org/) [:src:](https://github.com/gotson/komga) :s: | Manga, comics & webtoons server |
| [Kavita](https://www.kavitareader.com/) [:src:](https://github.com/Kareadita/Kavita) | Manga, novels & comics server |
| [Calibre-Web](https://github.com/janeczku/calibre-web) | Light novels & ebooks via Calibre |
| [Mango](https://github.com/getmango/Mango) | Manga server with built-in reader |

== Music
| Software | Description |
| :--- | :--- |
| [Navidrome](https://www.navidrome.org/) [:src:](https://github.com/navidrome/navidrome) :s: | Self-hosted Subsonic-compatible music server |
| [Airsonic-Advanced](https://github.com/airsonic-advanced/airsonic-advanced) | Fork of Airsonic, Subsonic-compatible |
| [Beets](https://beets.io/) [:src:](https://github.com/beetbox/beets) | Music library organiser & auto-tagger |
| [MusicBrainz Picard](https://picard.musicbrainz.org/) [:src:](https://github.com/musicbrainz/picard) | Tag music files using MusicBrainz |
:::

### Jellyfin Clients

| Client | Platform |
| :--- | :--- |
| [Jellyfin MPV Shim](https://github.com/jellyfin/jellyfin-mpv-shim) | :win::app::lin: |
| [Findroid](https://github.com/jarnedemeulemeester/findroid) | :and: |
| [Swiftfin](https://github.com/jellyfin/Swiftfin) | :ios: |
| [Infuse](https://firecore.com/infuse) :cs: | :ios: |

### Metadata Tools

| Software | For |
| :--- | :--- |
| [Komf](https://github.com/Snd-R/komf) | Komga & Kavita metadata fetcher |
| [Shoko Server](https://shokoanime.com/) [:src:](https://github.com/ShokoAnime/ShokoServer) | Anime-specific media manager via AniDB |
| [Kometa (Plex Meta Manager)](https://kometa.wiki/) [:src:](https://github.com/Kometa-Team/Kometa) | Plex collections & overlays via metadata |
| [TubeArchivist](https://www.tubearchivist.com/) [:src:](https://github.com/tubearchivist/tubearchivist) | Self-hosted YouTube archive |

---

## Download Automation

::: tip
See the [arr tab in Tools](/tools#arr) for the main arr stack (Sonarr, Radarr, Lidarr, Prowlarr, Bazarr etc.).
:::

### Anime-specific

| Software | Description |
| :--- | :--- |
| [Sonarr](https://sonarr.tv/) [:src:](https://github.com/Sonarr/Sonarr) | TV & anime episode automation |
| [Ani-RSS](https://github.com/Natsusora-no-Perseus/ani-rss) | RSS-based seasonal anime auto-downloader |
| [Shoko Relay](https://github.com/natyusha/ShokoRelay.bundle) | Shoko Server plugin for Plex/Jellyfin scrobbling |

### Books & Novels

| Software | Description |
| :--- | :--- |
| [Readarr](https://readarr.com/) [:src:](https://github.com/Readarr/Readarr) | Books & light novels automation |
| [Mylar3](https://github.com/mylar3/mylar3) | Comic book downloader & manager |
| [LazyLibrarian](https://lazylibrarian.gitlab.io/) [:src:](https://gitlab.com/LazyLibrarian/LazyLibrarian) | Books & audiobooks downloader |
| [Kapowarr](https://casvt.github.io/Kapowarr/) [:src:](https://github.com/Casvt/Kapowarr) | Comics & manga download automation |

### Music

| Software | Description |
| :--- | :--- |
| [Lidarr](https://lidarr.audio/) [:src:](https://github.com/Lidarr/Lidarr) | Music automation via arr stack |
| [Headphones](https://github.com/rembo10/headphones) | Automated music downloader (NZB & torrent) |

---

## Request & Notification

| Software | Description |
| :--- | :--- |
| [Jellyseerr](https://docs.jellyseerr.dev/) [:src:](https://github.com/fallenbagel/jellyseerr) :s: | Media request manager for Jellyfin/Plex |
| [Overseerr](https://overseerr.dev/) [:src:](https://github.com/sct/overseerr) | Media request manager for Plex |
| [Notifiarr](https://notifiarr.com/) [:src:](https://github.com/Notifiarr/notifiarr) | Centralised notification routing for arr stack |
| [Apprise](https://github.com/caronc/apprise) | Send notifications to almost any platform |

---

## Dashboard & Management

| Software | Description |
| :--- | :--- |
| [Homarr](https://homarr.dev/) [:src:](https://github.com/ajnart/homarr) :s: | Dashboard with arr stack integrations |
| [Homepage](https://gethomepage.dev/) [:src:](https://github.com/gethomepage/homepage) | Fast, highly customisable dashboard |
| [Heimdall](https://heimdall.site/) [:src:](https://github.com/linuxserver/Heimdall) | App dashboard & launcher |
| [Flame](https://github.com/pawelmalak/flame) | Minimal self-hosted startpage |
| [Portainer](https://www.portainer.io/) [:src:](https://github.com/portainer/portainer) | Docker/Kubernetes GUI management |
| [Dockge](https://dockge.kuma.pet/) [:src:](https://github.com/louislam/dockge) | Compose-stack focused Docker manager |
| [Uptime Kuma](https://uptime.kuma.pet/) [:src:](https://github.com/louislam/uptime-kuma) | Self-hosted uptime & status monitoring |

---

## Reverse Proxy & Remote Access

| Software | Description |
| :--- | :--- |
| [Nginx Proxy Manager](https://nginxproxymanager.com/) [:src:](https://github.com/NginxProxyManager/nginx-proxy-manager) :s: | GUI-based reverse proxy for home servers |
| [Caddy](https://caddyserver.com/) [:src:](https://github.com/caddyserver/caddy) | Auto-HTTPS reverse proxy |
| [Traefik](https://traefik.io/traefik/) [:src:](https://github.com/traefik/traefik) | Cloud-native reverse proxy & load balancer |
| [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) | Expose local services without port forwarding |
| [Tailscale](https://tailscale.com/) [:src:](https://github.com/tailscale/tailscale) | WireGuard-based mesh VPN for secure remote access |

---

## Privacy & VPN Routing

| Software | Description |
| :--- | :--- |
| [Gluetun](https://github.com/qdm12/gluetun) | VPN Docker container to route torrent client traffic |
| [Pi-hole](https://pi-hole.net/) [:src:](https://github.com/pi-hole/pi-hole) | DNS-level network-wide adblocking |
| [AdGuard Home](https://adguard.com/en/adguard-home/overview.html) [:src:](https://github.com/AdguardTeam/AdGuardHome) | DNS adblocking with DoH/DoT/HTTPS support |
| [WireGuard](https://www.wireguard.com/) | Fast, modern self-hosted VPN protocol |

::: warning VPN and torrenting
If your ISP or country monitors torrent traffic, route your torrent client through a VPN container like Gluetun. See [r/VPNTorrents](https://old.reddit.com/r/VPNTorrents/) for setup guides.
:::

---

## Anime Tracking Automation

| Software | Platform | Description |
| :--- | :--- | :--- |
| [Taiga](https://taiga.moe/) [:src:](https://github.com/erengy/taiga) | :win: | Auto-detects playing anime & scrobbles to MAL/AniList/Kitsu |
| [Trackma](https://z411.github.io/trackma/) [:src:](https://github.com/z411/trackma) | :lin: | Multi-service anime tracker for Linux |
| [MAL-Sync](https://malsync.moe/) [:src:](https://github.com/MALSync/MALSync) :s: | :cr::ff: | Syncs progress across all streaming sites |
| [Shoko Relay](https://github.com/natyusha/ShokoRelay.bundle) | :win::lin: | AniDB-based scrobbling via Shoko for Plex/Jellyfin |
| [Syncplay](https://syncplay.pl/) [:src:](https://github.com/Syncplay/syncplay) | :win::app::lin: | Watch-together sync for local files with mpv/MPC/VLC |

---

## Hardware & OS

### Recommended Hardware

| Type | Options |
| :--- | :--- |
| **NAS** | Synology DS series, TrueNAS Scale (DIY), UGREEN NAS |
| **Mini PC** | Beelink Mini S12, Minisforum UM series, Intel NUC |
| **SBC** | Raspberry Pi 5, Orange Pi 5, Radxa Rock 5 |
| **Full Server** | Used Dell/HP Optiplex/Prodesk small form factor PCs |

### Operating Systems

| OS | Description |
| :--- | :--- |
| [TrueNAS Scale](https://www.truenas.com/truenas-scale/) | NAS-focused Linux with built-in app store |
| [Unraid](https://unraid.net/) :cs: | Flexible NAS/server OS with Docker & VM support |
| [Proxmox VE](https://www.proxmox.com/en/proxmox-virtual-environment/overview) | Bare-metal hypervisor for running VMs & containers |
| [CasaOS](https://casaos.zimaspace.com/) [:src:](https://github.com/IceWhaleTech/CasaOS) | Simple home cloud OS with app store |
| [YunoHost](https://yunohost.org/) [:src:](https://github.com/YunoHost/yunohost) | Self-hosting OS aimed at non-technical users |

---

## Resources

| Resource | Description |
| :--- | :--- |
| [TRaSH Guides](https://trash-guides.info/) :s: | Quality profiles, naming schemes & arr setup |
| [Servarr Wiki](https://wiki.servarr.com/) :s: | Official docs for the arr stack |
| [r/selfhosted](https://old.reddit.com/r/selfhosted/) | General self-hosting community |
| [r/HomeServer](https://old.reddit.com/r/HomeServer/) | Home server hardware & software |
| [r/DataHoarder](https://old.reddit.com/r/DataHoarder/) | Storage & archiving community |
| [Jellyfin Discord](https://discord.com/invite/zHBxVSXdBV) | Official Jellyfin support server |
| [Servarr Discord](https://discord.com/invite/M6BvZn5) | arr stack support server |
| [Usenet Guide](https://docs.google.com/document/d/1TwUrRj982WlWUhrxvMadq6gdH0mPW0CGtHsTOFWprCo/mobilebasic) | Full Usenet + automation setup guide |
