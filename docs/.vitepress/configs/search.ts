import type { DefaultTheme } from "vitepress";

export const search: DefaultTheme.Config["search"] = {
  options: {
    miniSearch: {
      searchOptions: {
        combineWith: "AND",
        fuzzy: false,
        // @ts-ignore
        boostDocument: (_, term, storedFields: Record<string, string | string[]>) => {
          const titles = (storedFields?.titles as string[])
            .filter((t) => Boolean(t))
            .map((t) => t.toLowerCase());
          // Uprate if term appears in titles. Add bonus for higher levels (i.e. lower index)
          const titleIndex =
            titles.map((t, i) => (t?.includes(term) ? i : -1)).find((i) => i >= 0) ?? -1;
          if (titleIndex >= 0) return 10000 - titleIndex;

          return 1;
        },
      },
    },
    detailedView: true,
  },
  provider: "local",
};
