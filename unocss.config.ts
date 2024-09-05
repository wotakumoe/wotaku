import { colors } from "@fmhy/colors";
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";
import { resolve } from "node:path";
import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives,
} from "unocss";

const safelist = Object.entries(colors).flatMap(([group, shades]) =>
  Object.keys(shades).flatMap((shade) => [`text-${group}-${shade}`, `bg-${group}-${shade}`]),
);

export default defineConfig({
  content: {
    filesystem: [".vitepress/configs/shared.ts"],
  },
  safelist,
  theme: {
    colors: {
      ...colors,
      primary: "var(--vp-c-brand-1)",
      bg: "var(--vp-c-bg)",
      "bg-alt": "var(--vp-c-bg-alt)",
      "bg-elv": "var(--vp-c-bg-elv)",
      text: "var(--vp-c-text-1)",
      "text-2": "var(--vp-c-text-2)",
      div: "var(--vp-c-divider)",
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
      warn: true,
      collections: {
        custom: FileSystemIconLoader(resolve(__dirname, ".docs/public/custom")),
      },
    }),
  ],
  transformers: [transformerDirectives()],
});
