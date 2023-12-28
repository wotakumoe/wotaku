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
import Feedback from "./components/Modal.vue"
import Tooltip from "./components/Tooltip.vue";
import Authors from "./components/Authors.vue";

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      "layout-bottom": () => h(ReloadPrompt),
      "sidebar-nav-after": () => h(Feedback)
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    enhanceAppWithTabs(app);
    app.component("Button", Button);
    app.component("Authors", Authors);
    app.component("Tooltip", Tooltip);
    createMediumZoomProvider(app, router);
  },
};
