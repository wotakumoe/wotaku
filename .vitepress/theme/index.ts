// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import Theme from "vitepress/theme";
import "uno.css";
import "./style.css";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import { createMediumZoomProvider } from "./composables";
// @ts-expect-error
import ReloadPrompt from "./components/ReloadPrompt.vue";
// @ts-expect-error
import Button from "./components/Button.vue";
import Authors from "./components/Authors.vue";

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      "layout-bottom": () => h(ReloadPrompt),
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    enhanceAppWithTabs(app);
    app.component("Button", Button);
    app.component("Authors", Authors)
    createMediumZoomProvider(app, router);
  },
};
