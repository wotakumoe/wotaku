interface ContributorInfo {
  name: string;
  avatar: string;
  // Optional.
  site?: string;
}

export interface Contributors {
  core: ContributorInfo[];
  contributors: ContributorInfo[];
  special: ContributorInfo[];
}

export const contribs = {
  core: [
    {
      name: "taskylizard",
      avatar: "https://github.com/taskylizard.png",
      site: "https://github.com/taskylizard",
    },
    {
      name: "Duck",
      avatar: "https://github.com/anotherduckling.png",
      site: "https://github.com/anotherduckling",
    },
    {
      name: "Memenami",
      avatar: "https://github.com/memenami.png",
      site: "https://github.com/memenami",
    },

    {
      name: "Static",
      avatar: "https://github.com/whitenoisy.png",
      site: "https://github.com/whitenoisy",
    },

    {
      name: "TubaApollo",
      avatar: "https://github.com/TubaApollo.png",
      site: "https://github.com/TubaApollo",
    },
    {
      name: "Venlicht",
      avatar: "https://github.com/RenaraScope.png",
      site: "https://github.com/RenaraScope",
    },
    {
      name: "Zinklog",
      avatar: "https://github.com/zinklog2.png",
      site: "https://github.com/zinklog2",
    },
  ],
  contributors: [
    {
      avatar: "https://github.com/knightmob.png",
      name: "Abyss",
      site: "https://github.com/knightmob",
    },
    {
      avatar: "https://github.com/farahnur42.png",
      name: "Fahim",
      site: "https://github.com/farahnur42",
    },
    {
      avatar: "/pfp/green.webp",
      name: "Green",
    },
    {
      avatar: "https://github.com/Helmasko.png",
      name: "Helmasko",
      site: "https://github.com/Helmasko",
    },
    {
      name: "Ishtar",
      avatar: "/pfp/ishtar.png",
    },
    {
      name: "Kai",
      avatar: "https://github.com/officialkaizen.png",
      site: "https://github.com/officialkaizen",
    },
    {
      name: "loocool",
      avatar: "https://github.com/loocool2.png",
      site: "https://github.com/loocool2",
    },
    {
      name: "nuff",
      avatar: "https://github.com/gengotech.png",
      site: "https://github.com/gengotech",
    },
  ],
  special: [
    {
      name: "Kobayashi",
      avatar: "https://github.com/kobayashi90.png",
      site: "https://www.ryuko.space/",
    },
    {
      name: "TubaApollo",
      avatar: "https://github.com/TubaApollo.png",
      site: "https://github.com/TubaApollo",
    },
  ],
} satisfies Contributors;
