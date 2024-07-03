// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import Theme from "vitepress/theme";
import "./style.css";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import { createMediumZoomProvider } from "./composables";
import Button from "./components/Button.vue";
import SidebarCard from "./components/SidebarCard.vue";
import Tooltip from "./components/Tooltip.vue";
import Authors from "./components/Authors.vue";
import Components from "@fmhy/components";
import AnnouncementPill from "./components/AnnouncementPill.vue";
import "virtual:uno.css";

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      "sidebar-nav-after": () => h(SidebarCard),
      "home-hero-prelink": () => h(AnnouncementPill),
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    enhanceAppWithTabs(app);
    app.component("Button", Button);
    app.component("Authors", Authors);
    app.component("Tooltip", Tooltip);
    createMediumZoomProvider(app, router);
    app.use(Components);
  },
};
