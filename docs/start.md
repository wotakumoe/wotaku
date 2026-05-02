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

::: tip Deployment
If you want to learn how to deploy the website online, read the [**official vitepress docs**](https://vitepress.dev/guide/deploy).
:::

## Icon
Wotaku fetches icons using [**Iconfiy**](https://iconify.design/). To get the icon names, visit [**Iconify**](https://icon-sets.iconify.design/) or [**Icones**](https://icones.js.org/). All the added iconpacks are [**here**](https://github.com/wotakumoe/wotaku/blob/main/docs/.vitepress/configs/markdown/emoji.ts#L19).

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

![icon name section](/diagram/icon.svg)

::: info Twitter emoji
Twitter emoji is the default iconpack for wotaku. For twemoji, you don't have to mention twemoji. just icon name.
:::

### Commands

| Job | CMD |
|-|-|
| Adding iconpack | `pnpm add -D @iconify-json/<packname>` |
| Remove iconpack | `pnpm remove @iconify-json/<packname>` |

You have to add the iconpack manually in `docs\.vitepress\configs\emoji.ts`. Otherwise it wont work. Follow the already added ones as example.

![URL entry convention](/diagram/convo.svg)

### Rules
1. Follow the order of the tabs in [**sheet**](#sheet)
2. There will be no space between icons. Just at the beginning.
3. Icons will be after main URL
4. Then github/gitlab or similar source link button
5. Then related buttons like Extensions, Alts, Proxies etc
6. Unlike icons, there will be space between buttons (so that it is easy to click).
7. If there is an icon for that button (example: GitHub), use [icon](URL). Otherwise normal button.
8. Tooltip will always be at the end.

::: tip Adding tooltips
To learn, how to add tooltips, [click here](#tooltip).
:::


## Tooltip

Tooltip is used to give extra information. The information should be precise. No need of stating something obvious. Tooltip has two components. The key will be beside the URL in the markdown file and key data will be in  `docs\.vitepress\configs\markdown\index.ts`. The key is case-sensitive.


```ts
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

There is also ^[inline tooltips](just like this). For this, you don't have to put them in index file.

```md
^[inline tooltips](just like this)
```

## Front matter

::: tip Moved
Check the front matter description [**here**](https://rentry.org/wotakufm).
:::