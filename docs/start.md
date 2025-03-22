---
title: Start
description: Getting started
---

# Getting started

## Local

:::tabs

== Step 1

### Installing prerequisites
1. :logos-git-icon: [Git](https://git-scm.com/)
2. :logos-nodejs-icon-alt: [Node JS](https://nodejs.org/en)
3. :logos-pnpm: [pnpm](https://pnpm.io/)

Open powershell and run this:

```bash
# Download and install Chocolatey:
powershell -c "irm https://community.chocolatey.org/install.ps1|iex"

# Download and install Git:
choco install git

# Verify Git version:
git -v

# Download and install Node.js:
choco install nodejs

# Verify the Node.js version:
node -v

# Download and install pnpm:
corepack enable pnpm

# Verify pnpm version:
pnpm -v

```
== Step 2

### Cloning

To clone the repository, open PowerShell in your desired folder and run:

```bash
git clone https://github.com/wotakumoe/wotaku.git
cd wotaku
```

Alternatively, you can specify a directory without opening PowerShell in that location:

```bash
git clone https://github.com/wotakumoe/wotaku.git "C:\your\directory"
cd "C:\your\directory\wotaku"
```

To clone the repository without its commit history (shallow clone):

```bash
git clone --depth 1 https://github.com/wotakumoe/wotaku.git
cd wotaku
```

== Step 3

### Installing dependencies

```bash
pnpm install

```

### Running in dev mode

```bash
pnpm docs:dev

```
:::

## Icon
Wotaku fetches icons using [**Iconfiy**](https://iconify.design/). To get the icon names, visit [**Iconify**](https://icon-sets.iconify.design/) or [**Icones**](https://icones.js.org/). All the added iconpacks are [**here**](https://github.com/wotakumoe/wotaku/blob/main/docs/.vitepress/configs/emoji.ts#L20).

### Writing Rules

| Section | Style |
|-|-|
| In-line | `:package name-icon name:` |
| Button | `:i-package name-icon name:` |
| Typescript | `<span class="i-package-name:icon-name"></span>` |
| Index.md | SVG Code |


::: tip Using Alias
Most used icons have been shortened using Alias. You can find them in [sheet](#sheet). They work in-line, not inside button. You have to use the traditional method.
:::

![](/iconname.png)

::: info Twitter emoji
Twitter emoji is the default iconpack for wotaku. For twemoji, you don't have to mention twemoji. just icon name.
:::

### Commands

| Job | CMD |
|-|-|
| Adding iconpack | `pnpm add -D @iconify-json/<packname>` |
| Remove iconpack | `pnpm remove @iconify-json/<packname>` |

You have to add the iconpack manually in `docs\.vitepress\configs\emoji.ts`. Otherwise it wont work. Follow the already added ones as example.

![URL entry convention](/conv.svg)

### Rules
1. Follow the order of the tabs in [**sheet**](#sheet)
2. There will be no space between icons. Just at the beginning.
3. Icons will be after main URL
4. Then github/gitlab or similar source link button
5. Then related buttons like Extensions, Alts, Proxies etc
6. Unlike icons, there will be space between buttons (so that it is easy to click).
7. If there is an icon for that button (example: GitHub), use [icon](URL). Otherwise normal button.
8. Tooltip will always be at the end.

**Example**: [Anisong Database](https://anisongdb.com/) :win::app::web: [:gh:](https://github.com/xSardine/AMQ-Artists-DB) <Badge type="info" text="Alt" link="https://43d.github.io/player/#/" />==demo==

::: tip Adding tooltips
To learn, how to add tooltips, [click here](#tooltip).
:::

### Sheet

::: tabs

== System

| Icon | Code | Desc |
|-|-|-|
| :win: | `:win:` | Windows |
| :and: | `:and:` | Android |
| :app: | `:app:` | iOS / iPadOS / macOS |
| :lin: | `:lin:` | Linux |
| :bsd: | `:bsd:` | FreeBSD |
| :cmd: | `:cmd:` | CLI / TUI |
| :ff: | `:ff:` | Firefox |
| :cr: | `:cr:` | Chromium |
| :web: | `:web:` | Web |

== Type

| Icon | Code | Desc |
|-|-|-|
| :strm: | `:strm:` | Stream |
| :ddl: | `:ddl:` | Online / DDL |
| :mag: | `:mag:` | Torrent / p2p |
| :lcl: | `:lcl:` | Local File |
| :batch: | `:bach:` | Batch Download |

== Price

| Icon | Code | Desc |
|-|-|-|
| :paid: | `:paid:` | Paid |
| :fm: | `:fm:` | Freemium |

== Source

| Icon | Code | Desc |
|-|-|-|
| :gh: | `:gh:` | GitHub |
| :gl: | `:gl:` | GitLab |
| :cb: | `:cb:` | Codeberg |
| :kde: | `:kde:` | KDE |
| :gn: | `:gn:` | GNOME |
| :gt: | `:gt:` | Gitea |
| :cs: | `:cs:` | Closed Source |

== Platform

| Icon | Code | Desc |
|-|-|-|
| :d: | `:d:` | Discord |
| :f: | `:f:` | 4chan |
| :x: | `:x:` | Twitter |
| :tg: | `:tg:` | Telegram |
| :mal: | `:mal:` | MyAnimeList |
| :al: | `:al:` | AniList |
| :k: | `:k:` | Kitsu |
| :simkl: | `:simkl:` | SIMKL |

== Storage

| Icon | Code | Desc |
|-|-|-|
| :sgd: | `:sgd:` | Google Drive |
| :sm: | `:sm:` | Mega |
| :smf: | `:smf:` | Mediafire |
| :host: | `:host:` | Host websites (specifically with speed paywall) |

== Flag

| Icon | Code | Desc |
|-|-|-|
| :fjp: | `:fjp:` | Japan |
| :fkr: | `:fkr:` | South Korea |
| :fcn: | `:fcn:` | China |

== Others

| Icon | Code | Desc |
|-|-|-|
| :s: | `:s:` | Favorite |
| :e: | `:e:` | Extension(s) |
| :ero: | `:ero:` | Focuses on NSFW content |
| :acc: | `:acc:` | Needs Account |
| :rss: | `:rss:` | RSS Feed |
| :prx: | `:prx:` | Proxies |
| :tf: | `:tf:` | Apple TestFlight |
| :js: | `:js:` | JavaScript |
| :css: | `:css:` | CSS |
| :more: | `:more:` | Related resources |
| :yes: | `:yes:` | Supported |
| :no: | `:no:` | Not supported |
| :global: | `:global:` | Multilingual |

:::


## Tooltip

Tooltip is used to give extra information. The information should be precise. No need of stating something obvious. Tooltip has two components. The key will be beside the URL in the markdown file and key data will be in  `docs\.vitepress\configs\markdown\index.ts`. The key is case-sensitive.


```
// Single line

key: { content: "markdown" }

// Single line with other variables

key2: {
   title: "key2",
   icon: "i-material-symbols-info-i",
   content: "content"
   }

// Multi line with other variables

multiline: {
   title: "multiline",
   icon: "i-material-symbols-info-i",
   content: `This is **markdown** with
 - A bullet point
 - Another bullet point`
   }

```

## Frontmatter

For every markdown page, you have to add frontmatter. Otherwise, the build will fail.

```
title: Non-English
description: Otaku resources for other regions
customDescription: Discover anime, manga, and other related content for all the languages.
outline: 2
og:
    image: https://files.catbox.moe/9wi4ma.png
```

| Variables         | Description |
|-------------------|-------------|
| `title`           | Sets the title of the homepage and is also used for Open Graph (OG) embeds when sharing links. |
| `description`     | Defines the OG description, though it is currently unused. It also works as a description for link embeds unless `customDescription` is specified. |
| `customDescription` | Overrides the default OG description, providing a custom description for link embeds. |
| `outline`        | Determines the header levels shown in the outline. The default is `2`, but you can specify a range, e.g., `[2,3]`, to include multiple levels. |
| `og`             | Specifies a custom image for the OG link embed. By default, it uses the image set in `docs\.vitepress\configs\hooks\opengraph.ts`. If a custom OG image is needed for a specific page, it should be added in the front matter. The required resolution is `1800x900`. |
