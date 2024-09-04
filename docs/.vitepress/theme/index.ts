import { defineAsyncComponent, h } from "vue";
import { type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "@nolebase/vitepress-plugin-git-changelog/client/style.css";
import "./style.css";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import {
	NolebaseEnhancedReadabilitiesMenu,
	NolebaseEnhancedReadabilitiesScreenMenu,
} from "@nolebase/vitepress-plugin-enhanced-readabilities/client";
import { NolebaseGitChangelogPlugin } from "@nolebase/vitepress-plugin-git-changelog/client";
import { NolebasePagePropertiesPlugin } from "@nolebase/vitepress-plugin-page-properties/client";
import "@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css";
import "@nolebase/vitepress-plugin-page-properties/client/style.css";
import "@nolebase/vitepress-plugin-git-changelog/client/style.css";
import { createMediumZoomProvider } from "./composables";
import Button from "./components/Button.vue";
import SidebarCard from "./components/SidebarCard.vue";
import NotFoundComponent from "./components/NotFound.vue";
import Tooltip from "./components/Tooltip.vue";
import Authors from "./components/Authors.vue";
import Components from "@fmhy/components";
import AnnouncementPill from "./components/AnnouncementPill.vue";
import "virtual:uno.css";
import Feedback from "./components/Feedback.vue";

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			"layout-top": () =>
				h(
					defineAsyncComponent(
						() => import("./components/NewDomainBanner.vue"),
					),
				),
			"sidebar-nav-after": () => h(SidebarCard),
			"home-hero-info-before": () => h(AnnouncementPill),
			// A enhanced readabilities menu for wider screens
			"nav-bar-content-after": () => h(NolebaseEnhancedReadabilitiesMenu),
			// A enhanced readabilities menu for narrower screens (usually smaller than iPad Mini)
			"nav-screen-content-after": () =>
				h(NolebaseEnhancedReadabilitiesScreenMenu),
			"not-found": () => h(NotFoundComponent)
		});
	},
	enhanceApp({ app, router, siteData }) {
		// @ts-expect-error
		enhanceAppWithTabs(app);
		app.component("Button", Button);
		app.component("Authors", Authors);
		app.component("Tooltip", Tooltip);
		app.component("Feedback", Feedback);
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
		app.use(
			NolebasePagePropertiesPlugin<{ tags: string[]; progress: number }>(),
			[
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
			],
		);
	},
} satisfies Theme;
