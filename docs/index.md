---
title: Home
layout: home

hero:
  name: "Wotaku"
  text: "The Otaku Index"
  announcement:
    title: Mihon & Aniyomi Extensions
    link: /guides/tech/repo
  image:
    src: /plushies/webp/kronii.webp
    alt: Wotaku
  actions:
    - theme: brand
      text: Browse
      link: /qs.md
    - theme: alt
      text: GitHub
      link: https://github.com/wotakumoe/Wotaku
    - theme: alt
      text: Discord
      link: https://discord.gg/vShRGx8ZBC

aside: left

customDescription: A wiki that covers everything weeb-related!

features:
  - title: Websites
    details: Websites for anime, manga, novels & tokusatsu
    icon:
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g
      fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
      stroke-width="2"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2
      2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0
      1-2-2v-1a2 2 0 0 0-2-2H2.05"/><circle cx="12" cy="12" r="10"/></g></svg>
    link: /websites.md
  - title: Software
    details: Software for every Operating System
    icon:
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g
      fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
      stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0
      0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7l8.7 5l8.7-5M12
      22V12"/></g></svg>
    link: /software.md
  - title: Everything Japan
    details: All about the Japanese language and culture
    icon:
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path
      fill="currentColor" d="M20.472 11.997a4.865 4.865 0 0 0-4-2.204a5.592 5.592 0 0 0-.131-1.024a1
      1 0 1 0-1.945.462a3.553 3.553 0 0 1 .082.601a13.577 13.577 0 0
      0-3.257.822c.023-1.204.077-2.407.197-3.607l.038-.382A33.435 33.435 0 0 0 14.938 6l.12-.03a1 1
      0 1 0-.48-1.94l-.122.03c-.922.23-1.856.404-2.794.55l.151-1.51a1 1 0 0 0-1.99-.2l-.196
      1.96c-.934.083-1.87.14-2.809.14a1 1 0 0 0 0 2c.87 0 1.74-.046 2.607-.114a46.66 46.66 0 0
      0-.203 4.698c-.134.073-.27.142-.403.22a16.407 16.407 0 0 0-1.949 1.31l-.022.018a13.74 13.74 0
      0 0-2.649 2.7a3.004 3.004 0 0 0 2.947 4.72a9.74 9.74 0 0 0 2.837-1.014a.996.996 0 0 0
      1.822-.703c-.025-.145-.036-.291-.058-.437a13.838 13.838 0 0 0 1.314-1.155a13.167 13.167 0 0 0
      2.101-2.73c.023-.039.042-.078.065-.118c.118-.21.23-.422.332-.635c.053-.111.102-.222.151-.333a10.4
      10.4 0 0 0 .329-.838c.032-.096.06-.191.09-.287c.05-.169.101-.337.141-.504l.005-.018A3.015
      3.015 0 0 1 18.741 13c1.019 1.767-.963 4.977-4.417 7.154a1 1 0 1 0 1.067 1.692c4.499-2.836
      6.683-7.069 5.08-9.849M6.796 18.583a1.005 1.005 0 0 1-.98-1.574a11.893 11.893 0 0 1
      2.291-2.323l.027-.021a13.97 13.97 0 0 1 1.144-.793c.06 1.195.173 2.386.326 3.574a8.185 8.185 0
      0 1-2.808 1.137M14.126 12a8.166 8.166 0 0
      1-.316.78c-.056.12-.118.239-.18.358q-.145.278-.311.554c-.085.14-.172.279-.265.418a11.48 11.48
      0 0 1-1.408 1.719c-.07.07-.143.133-.214.2q-.163-1.597-.211-3.202a12.513 12.513 0 0 1
      2.94-.933z"/></svg>
    link: /japan/language.md
  - title: NSFW
    details: ahem... ahem....
    icon:
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g
      fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
      stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9l14.2 14.2"/></g></svg>
    link: /nsfw.md
---

<script setup>
import ChristmasCard from "./.vitepress/theme/components/ChristmasCard.vue";
if (!import.meta.env.SSR) {
  const images = {
    normal: {
      // Hololive Myth (1st Gen EN)
      "/plushies/webp/ame.webp": "linear-gradient(-30deg, #FEE097, #f7f6c8)",    
      "/plushies/webp/calli.webp": "linear-gradient(-30deg, #E35277, #f07392)",  
      "/plushies/webp/gura.webp": "linear-gradient(-30deg, #3E92CF, #57b0f0)",   
      "/plushies/webp/ina.webp": "linear-gradient(-30deg, #532bc2, #a594f9)",    
      "/plushies/webp/kiara.webp": "linear-gradient(-30deg, #EB433F, #FEEB73)",  

      // Hololive Promise (2nd Gen EN)
      "/plushies/webp/bae.webp": "linear-gradient(-30deg, #EE241A, #FEE160)",    
      "/plushies/webp/fauna.webp": "linear-gradient(-30deg, #B2F182, #F8FFDF)", 
      "/plushies/webp/irys.webp": "linear-gradient(-30deg, #E10E5D, #FE6DA5)",   
      "/plushies/webp/kronii.webp": "linear-gradient(-30deg, #2b6cee, #5B9DFE)", 
      "/plushies/webp/mumei.webp": "linear-gradient(-30deg, #E7AE80, #FEF5B0)",  
      "/plushies/webp/sana.webp": "linear-gradient(-30deg, #F5E0CF, #f8eee5)",    

      // Hololive Advent (3rd Gen EN)
      "/plushies/webp/biboo.webp": "linear-gradient(-30deg, #9B8DEE, #FF65DB)",  
      "/plushies/webp/fuwawa.webp": "linear-gradient(-30deg, #9FCEFE, #C7DEFE)", 
      "/plushies/webp/mococo.webp": "linear-gradient(-30deg, #FE78A3, #FEAACC)", 
      "/plushies/webp/nerissa.webp": "linear-gradient(-30deg, #103BD9, #1CD5FC)", 
      "/plushies/webp/shiori.webp": "linear-gradient(-30deg, #deb1f0, #eaddff)", 

      // Hololive Justice (4th Gen EN)
      "/plushies/webp/cecilia.webp": "linear-gradient(-30deg, #61A979, #CFFDCC)", 
      "/plushies/webp/elizabeth.webp": "linear-gradient(-30deg, #BA3036, #2196DB)", 
      "/plushies/webp/gigi.webp": "linear-gradient(-30deg, #F39C35, #FEB743)",  
      "/plushies/webp/raora.webp": "linear-gradient(-30deg, #D26588, #F698BC)",  
    },
  };

  const mode = "normal";

  function randomPlushie() {
    const entries = Object.entries(images[mode]);
    const randomEntry = entries[Math.floor(Math.random() * entries.length)];
    const [bg, color] = randomEntry;
    return [bg, color];
  }

  const handleClick = () => {
    const [bg, color] = randomPlushie();
    document.documentElement.style.setProperty("--vp-home-hero-image-background-image", color);
    document.querySelector(".VPImage.image-src").src = bg;
  }

  const icon = document.querySelector(".VPImage.image-src");

  if (icon) {
    icon.addEventListener("click", handleClick);
  }
}
</script>

<ChristmasCard />
