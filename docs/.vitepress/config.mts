import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import UnoCSS from "unocss/vite";
import { movePlugin, shared } from "./configs";
import {
	PageProperties,
	PagePropertiesMarkdownSection,
} from "@nolebase/vitepress-plugin-page-properties/vite";
import {
	GitChangelog,
	GitChangelogMarkdownSection,
} from "@nolebase/vitepress-plugin-git-changelog/vite";

export default defineConfig({
	...shared,
	vite: {
		optimizeDeps: {
			exclude: [
				"@nolebase/vitepress-plugin-enhanced-readabilities/client",
				"@nolebase/vitepress-plugin-git-changelog/client",
				"@nolebase/vitepress-plugin-page-properties/client",
			],
		},
		ssr: {
			noExternal: [
				"@nolebase/vitepress-plugin-enhanced-readabilities",
				"@nolebase/vitepress-plugin-page-properties",
				"@nolebase/vitepress-plugin-git-changelog",
				"@nolebase/ui",
				"@fmhy/components",
			],
		},
		plugins: [
			PageProperties(),
			PagePropertiesMarkdownSection(),
			GitChangelog({
				maxGitLogCount: 400,
				repoURL: "https://github.com/wotakumoe/Wotaku",
			}),
			GitChangelogMarkdownSection({ sections: { disableContributors: true } }),
			UnoCSS({
				configFile: "../unocss.config.ts",
			}),
			{
				name: "custom:adjust-order",
				configResolved(c) {
					movePlugin(
						c.plugins as any,
						"vitepress",
						"before",
						"unocss:transformers:pre",
					);
				},
			},
		],
		resolve: {
			alias: [
				{
					find: /^.*\/VPBadge\.vue$/,
					replacement: fileURLToPath(
						new URL("./theme/components/Badge.vue", import.meta.url),
					),
				},
				{
					find: /^.*VPSwitchAppearance\.vue$/,
					replacement: fileURLToPath(
						new URL(
							"./theme/components/VPSwitchAppearance.vue",
							import.meta.url,
						),
					),
				},
			],
		},
	},
});
