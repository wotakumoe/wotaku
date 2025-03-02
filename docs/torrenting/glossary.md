---
title: Torrent Glossary
customDescription: All the basic torrent related terms
og:
    image: https://files.catbox.moe/d3zs1e.png
---

<GradientCard title="Torrent Glossary" description="All the basic torrent related terms" theme="turquoise" variant="thin"/>

## Basic

| Term             | Definition  { class="compact" }     |
|------------------|----------------------|
| Leech / Leecher  | Can have two meanings: either a downloader in general or peers with a very low share ratio.  |
| Peer             | A client connected to the internet transferring data. Can be a downloader or seeder.   |
| p2p / Peer-to-Peer | A file sharing network in which every computer/client both uploads and downloads data.   |
| Ratio            | The relation between the amounts of uploaded and downloaded data. Trackers usually require you to have more upload than download, thus keeping it at a value above 1. |
| Seed / Seeding   | A seed is a peer that has fully downloaded a torrent. Seeding is uploading that data to other peers. Partial seeds are also possible, but not encouraged by trackers, as they're bad for file retention. | 
| Torrent          | A torrent file contains the metadata of specific files/folders and enables their distribution.   |
| Trackers         | A special type of server/website that enables and keeps track of torrent transfers. They can be public (meaning that anyone is free to access them) or private (requiring you to get an invite or pass an interview). |

## Torrenting

| Term             | Definition  { class="compact" }     |
|------------------|----------------------|
| Freeleech        | Downloading torrents with this tag won't impact your ratio.  |
| Hit-and-Run      | To download a torrent without following the tracker's minimum seeding requirement. Abbreviated HnR or H&R. |
| Seedbox          | A server built/rented for the specific purpose of transferring torrents. You can securely download the files to your computer afterwards.     |
| Sequential Download     | Activating this option makes the client download the file pieces in sequential order, making it possible to already stream the files while the transfer is still going (provided you have a decent internet speed). |
| Snatch           | To fully download a torrent.     |
| Swarm            | The collective term for all peers sharing a particular torrent.        |

## Client
| Term             | Definition  { class="compact" }     |
|------------------|----------------------|
| Availability | Availability indicates the health of the given torrent. Being equal or greater than 1 means that all files are available for download. If it's less than 1, you can't fully download the torrent. |
| Client           | A program that enables peer-to-peer file sharing via the BitTorrent protocol (qBit, Transmission, etc.) |

## VPN

| Term             | Definition  { class="compact" }     |
|------------------|----------------------|
| Binding | VPN binding is used so that your client only leeches and seeds through your desired VPN and isn't connecting to the internet otherwise. |
| Port Forwarding      | Port forwarding allows computers to become connectable, thus being able to interact with a larger number of peers and improving transfer speeds. [Video Explaining Port Forwarding](https://www.youtube.com/watch?v=2G1ueMDgwxw) or [Beginners Guide to Port Forwarding.](https://learn.g2.com/port-forwarding) |
| Proxy     | A proxy server acts as a gateway between you and the internet. They're commonly used to mask your true IP address or avoid geoblocks. |
| VPN (Virtual Private Network) | Services used to securely route all the traffic on your system through an encrypted connection to a remote server, thus giving you an additional layer of security and anonymity. This encrypted tunnel is what distinguishes them from simple proxies. |