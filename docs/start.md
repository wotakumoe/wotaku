---
title: Start
description: Getting started
outline: [2-3]
---

# Getting started

## Local setup

### Requirement
1. :logos-visual-studio-code: [VS Code](https://code.visualstudio.com/)
2. :mdi-github: [GitHub Desktop](https://github.com/apps/desktop) <tooltip>It's optional. You can do the same thing using VS Code. Can be easier using it depending on ur skill level. The guide assumes you went for this one.</tooltip>
3. :logos-nodejs-icon-alt: [Node JS](https://nodejs.org/en) <tooltip>Only if you run wotaku locally in your browser. Otherwise ignore. Recommended to use LTSC version. You can try the latest too.</tooltip>
4. :logos-git-icon: [Git](https://git-scm.com/)

### Clonning

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
- Before pushing or editing your local repo, fetch the repo so that your local repo is updated and doesnt cause any conflict when pushing.
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
Wotaku fetches icons from [**Icones**](https://icones.js.org/). All the added iconpacks are [**here**](https://github.com/wotakumoe/wotaku/network/dependencies?page=1&q=iconify-json%2F).

### Writing Rules
- For in-line -> :package name-icon name:
- For inside button, page icon -> :i-package name-icon name:

Examples:
- `:ic-baseline-window:` -> :ic-baseline-window:
- `<Badge type="tip" icon="i-mdi-twitter" text="Twitter" link="https://x.com/animecorner_ac" />` ->  <Badge type="tip" icon="i-mdi-twitter" text="Twitter" link="https://x.com/animecorner_ac" />

![](/iconname.png)

::: info Twitter emoji
Twitter emoji is the default iconpack for wotaku. For twemoji, you dont have to mention twemoji. just icon name.
:::

### Commands

| Job | CMD |
|-|-|
| Adding iconpack | `pnpm add -D @iconify-json/<packname>` |
| Remove iconpack | `pnpm remove @iconify-json/<packname>` |

You have to add the iconpack manually in `docs\.vitepress\configs\emoji.ts`. Otherwise it wont work. Follow the already added ones as example.


<Badge type="tip" icon="i-simple-alamy" text="Twitter" link="https://x.com/animecorner_ac" />

### Sorting

| Description | Icon |
|-|-|
| Favourite | :glowing-star: |
| System | :mdi-android::ic-baseline-window::ic-baseline-apple::mingcute-linux-fill::mdi-firefox::mingcute-chrome-fill::mdi-earth: |
| Type | :material-symbols-cloud-download-outline-rounded::lucide-magnet::iconoir-floppy-disk: |
| Price | :material-symbols-add-shopping-cart-rounded::material-symbols-credit-card-outline: |
| Closed Source | :material-symbols-lock-outline: |
| Github | :mdi-github: |

**Rules**
1. There will be no space between icons
2. Icons will be after main URL
3. Then github/gitlab or similar source link button
4. Then related buttons like Guides, Proxies etc
5. Unlike icons, there will be space between buttons (so that it is easy to click).