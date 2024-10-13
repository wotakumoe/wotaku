import { type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "@nolebase/vitepress-plugin-git-changelog/client/style.css";
import "./style.css";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import { NolebaseGitChangelogPlugin } from "@nolebase/vitepress-plugin-git-changelog/client";
import { NolebasePagePropertiesPlugin } from "@nolebase/vitepress-plugin-page-properties/client";
import "@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css";
import "@nolebase/vitepress-plugin-page-properties/client/style.css";
import "@nolebase/vitepress-plugin-git-changelog/client/style.css";
import { createMediumZoomProvider } from "./composables";
import Button from "./components/Button.vue";
import Tooltip from "./components/Tooltip.vue";
import Authors from "./components/Authors.vue";
import Components from "@fmhy/components";
import "virtual:uno.css";
import Feedback from "./components/Feedback.vue";
import Layout from "./Layout.vue";
import PreferenceRadio from "./components/PreferenceRadio.vue";

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app, router, siteData }) {
    // @ts-expect-error
    enhanceAppWithTabs(app);
    app.component("Button", Button);
    app.component("Authors", Authors);
    app.component("Tooltip", Tooltip);
    app.component("Feedback", Feedback);
    app.component("PreferenceRadio", PreferenceRadio);
    // @ts-expect-error
    createMediumZoomProvider(app, router);
    // @ts-expect-error
    app.use(Components);
    // @ts-expect-error
    app.use(NolebaseGitChangelogPlugin, {
      commitsRelativeTime: true,
      hideChangelogHeader: true,
      mapAuthors: [
        {
          name: "taskylizard",
          username: "taskylizard",
          avatar: "https://github.com/taskylizard.png",
        },
        {
          name: "Duck",
          username: "woducku",
          avatar: "https://github.com/woducku.png",
        },
      ],
    });
    app.use(NolebasePagePropertiesPlugin<{ tags: string[]; progress: number }>(), [
      {
        locales: {
          en: [
            {
              key: "tags",
              type: "tags",
              title: "Tags",
            },
            {
              key: "createdAt",
              type: "datetime",
              title: "Created at",
              formatAsFrom: true,
              dateFnsLocaleName: "enUS",
            },
            {
              key: "updatedAt",
              type: "datetime",
              title: "Updated at",
              formatAsFrom: true,
              dateFnsLocaleName: "enUS",
            },
            {
              key: "wordsCount",
              type: "dynamic",
              title: "Word count",
              options: {
                type: "wordsCount",
              },
            },
            {
              key: "readingTime",
              type: "dynamic",
              title: "Reading time",
              options: {
                type: "readingTime",
                dateFnsLocaleName: "enUS",
              },
            },
          ],
        },
      },
    ]);
  },
} satisfies Theme;
