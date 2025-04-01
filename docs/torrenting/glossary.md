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
| Magnet URL | Magnet URL is a link that starts with `magnet:`. It contains basic information about the torrent and uses it to retrieve all metadata. Can contain info hash, display name, trackers etc. |
| Leech  | Can have two meanings: either a downloader in general or peers with a very low share ratio.  |
| Peer  | A client connected to the internet transferring data. Can be a downloader or seeder.   |
| P2P | Torrenting is a P2P (Peer-to-Peer) service. Instead of everyone downloading from a centralized server hosting a file (direct download), people downloading the torrent connect to each other and distribute the file(s) between each other automatically. Peers connect directly to your IP address, meaning that any peer connected to you can see your IP address and what you're downloading. |
| Ratio  | The relation between the amounts of uploaded and downloaded data. Trackers usually require you to have more upload than download, thus keeping it at a value above 1. |
| Seed   | A seed is a peer that has fully downloaded a torrent. Seeding is uploading that data to other peers. Partial seeds are also possible, but not encouraged by trackers, as they're bad for file retention. | 
| Swarm            | The collective term for all peers sharing a particular torrent.        |
| Torrent          | A torrent file contains the metadata of specific files/folders and enables their distribution.   |

## Tracker

| Term             | Definition  { class="compact" }     |
|------------------|----------------------|
| Cross-seeding | Cross-seeding means seeding the same files on multiple trackers. If you already have them from one source and they match exactly with a torrent on another tracker, you can simply recheck them and seed on both—without having to download them again. |
| Freeleech        | Downloading torrents with this tag won't impact your ratio.  |
| Hit-and-Run      | To download a torrent without following the tracker's minimum seeding requirement. Abbreviated HnR or H&R. |
| Private tracker | Torrent trackers that don't allow you to freely make an account, but require you to get an invitation from an existing member or pass an interview. Some PTs also have specific periods where they allow for open signups. It is important to note that you shouldn't use a VPN when signing up for a private tracker, as the site has to make sure you are a new unique member. Once joined, you should carefully read the rules and see what kind of VPN usage they allow on their site. On the other hand, using VPNs for torrenting is most often allowed, and encouraged. |
| Public tracker | In public tracker, you don't need an account to view and download the torrents. |
| Semi-private tracker | In semi-private tracker, you need account to view and download the torrents but to open an account you don't need any sort of invite or interview. You can open account any time. |
| Snatch           | To fully download a torrent.     |
| Trackers         | A special type of server/website that enables and keeps track of torrent transfers. |

## Client
| Term             | Definition  { class="compact" }     |
|------------------|----------------------|
| Announce | Announcing means that your torrent client is pinging the tracker to send your upload/download stats and receive an updated peerlist for the given torrent. |
| Availability | Availability indicates the health of the given torrent. Being equal or greater than 1 means that all files are available for download. If it's less than 1, you can't fully download the torrent. |
| Client           | A program that enables peer-to-peer file sharing via the BitTorrent protocol (qBit, Transmission, etc.) |
| DHT | Full form is Distributed Hash Table. It is a method of finding more peers without depending on a tracker. The client participates in the DHT network to discover peers with the same torrent. Torrent marked as private, do not get distributed here. |
| Info hash | Unique identifier for a torrent. |
| PEX | Full form is Peer Exchange. It does not depend on a tracker but requires at least one connected peer. Once connected, it gets a peer list from that peer to find more. Torrent marked as private, do not get distributed here. |
| Piece | In torrenting, files are divided into pieces/chunks for downloading. The piece number and size can vary depending on the total file size. By default, torrent clients download random pieces to balance the load. |
| Sequential Download  | Activating this option makes the client download the file pieces in sequential order, making it possible to already stream the files while the transfer is still going (provided you have a decent internet speed). |
| Super-seeding | Only used if you are the initial seeder and others are grabbing it from you. Every torrent piece send will be unique, so the peers among themselves exchange pieces they need. Otherwise it could happen that some pieces get sent out more often than others, thus making the initial seed take longer. |

## VPN

| Term             | Definition  { class="compact" }     |
|------------------|----------------------|
| Binding VPN | VPN binding is used so that your client only leeches and seeds through your desired VPN and isn't connecting to the internet otherwise. This method is preferred over kill switch for torrenting. |
| Kill switch | This automatically disconnects the device from the internet if the VPN disconnects unexpectedly, preventing the real IP from leaking. But it can leak your real IP, if there is a software lag or other issues. |
| Port | A port is a number from 0 to 65535, and it is meant to denote the type of service used. They are commonly written at the end of ip addresses (e.g. `10.0.0.0:12345`). VPN clients use protocols that are not expecting a specific port, so any port can be assigned to it. VPN client shouldn't be assigned a port that is being used by another service. Operating systems have a range of ports reserved for services that do not requires specific ports, and a random port from this range should be used. |
| Port Forwarding      | Port forwarding allows computers to become connectable, thus being able to interact with a larger number of peers and improving transfer speeds. [Video Explaining Port Forwarding](https://www.youtube.com/watch?v=2G1ueMDgwxw) or [Beginners Guide to Port Forwarding.](https://learn.g2.com/port-forwarding) |
| Proxy     | A proxy server acts as a gateway between you and the internet. They're commonly used to mask your true IP address or avoid geoblocks. |
| VPN (Virtual Private Network) | Services used to securely route all the traffic on your system through an encrypted connection to a remote server, thus giving you an additional layer of security and anonymity. This encrypted tunnel is what distinguishes them from simple proxies. |

## Others

| Term             | Definition  { class="compact" }     |
|------------------|----------------------|
| Seedbox          | A server built/rented for the specific purpose of transferring torrents. You can securely download the files to your computer afterwards.  |