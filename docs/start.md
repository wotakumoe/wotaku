---
title: Start
description: Getting started
outline: [2-3]
---

# Getting started

## Local setup

### Requirement
1. :logos-visual-studio-code: [VS Code](https://code.visualstudio.com/)
2. :gh: [GitHub Desktop](https://github.com/apps/desktop)<tooltip>It's optional. You can do the same thing using VS Code. Can be easier using it depending on ur skill level. The guide assumes you went for this one.</tooltip>
3. :logos-nodejs-icon-alt: [Node JS](https://nodejs.org/en)<tooltip>Only if you run wotaku locally in your browser. Otherwise ignore. Recommended to use LTSC version. You can try the latest too.</tooltip>
4. :logos-git-icon: [Git](https://git-scm.com/)

### Cloning

1. Download and install the first two tools as instructed.  
2. Open GitHub Desktop and log in using your GitHub account credentials.
3. **Clone the Wotaku Repository**  
   - Open Github Desktop and press `Ctrl + Shift + o`
   - Go to URL tab and paste `https://github.com/wotakumoe/wotaku`. Also set the location.
   - GitHub Desktop will clone the repository to your specified location.

### Changing

1. **Open the Project in Visual Studio Code**  
   - Once the repository is cloned, you'll see options in GitHub Desktop's home screen.  
   - Select **Open in VS Code** to open the project in Visual Studio Code.
2. **Make Changes and Save**  
   - Edit the files as needed.  
   - Save your changes.
     - Modified files will be highlighted in yellow
     - New files will be in green
     - Removed files will be in red in Github Desktop
3. **Commit Changes Locally**  
   - Return to GitHub Desktop. The modified files will be listed on the left.  
   - Add a descriptive summary for your changes in the **Summary** tab.  
   - Click **Commit to Main** to stage and commit your changes locally.  

::: tip README
- Before pushing or editing your local repo, fetch the repo so that your local repo is updated and doesn't cause any conflict when pushing.
- If you have multiple changes to commit, repeat this process for each set of changes before pushing them.
:::

4. After all your changes are committed, click **Push to Origin** to upload your changes to the GitHub repository.
5. Done!



### Running Localhost
- Open wotaku in :logos-visual-studio-code: VS code
- Then open **terminal** in :logos-visual-studio-code: VS code
- Run `npm i -g pnpm`. This will install :logos-pnpm: **pnpm** using :logos-npm-icon: **npm**.
- After that, run `pnpm i`. It will download and update all the required shit
- After everything is done, run `pnpm run docs:dev`. It will run local host after processing the files and building it. after a short while it will give a localhost url. example `http://localhost:5173/`
- Open the localhost url in browser by clicking on it. and done.


## Icon conventions
Wotaku fetches icons from [**Icones**](https://icones.js.org/). All the added iconpacks are [**here**](https://github.com/wotakumoe/wotaku/blob/main/docs/.vitepress/configs/emoji.ts#L20).

### Writing Rules
- In-line -> :package name-icon name:
- Inside button, page icon -> :i-package name-icon name:


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


### Rules
1. Follow the order of the tabs in [**sheet**](#sheet)
2. There will be no space between icons. Just at the beginning.
3. Icons will be after main URL
4. Then github/gitlab or similar source link button
5. Then related buttons like Extensions, Alts, Proxies etc
6. Unlike icons, there will be space between buttons (so that it is easy to click).
7. If there is an icon for that button (example: GitHub), use [icon](URL). Otherwise normal button.
8. Tooltip will always be at the end. Also with a space before it.

**Example**: [Anisong Database](https://anisongdb.com/) :win::app::web: [:gh:](https://github.com/xSardine/AMQ-Artists-DB) <Badge type="info" text="Alt" link="https://43d.github.io/player/#/" /><tooltip>icons here are just for example. don't put them in main wiki</tooltip>

Sample code [**here**](https://rentry.org/ty7iihnf)

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
| :tf: | `:tf:` | Apple TestFlight |
| :js: | `:js:` | JavaScript |
| :css: | `:css:` | CSS |
| :more: | `:more:` | Related resources |
| :yes: | `:yes:` | Supported |
| :no: | `:no:` | Not supported |

:::

