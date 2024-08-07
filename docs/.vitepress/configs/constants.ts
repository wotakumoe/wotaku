export const hostname: string = "https://wotaku.wiki";
export const githubSourceContentRegex = new RegExp(
  "^https://(((raw|user-images|camo).githubusercontent.com))/.*",
  "i",
);
export const googleFontRegex = new RegExp("^https://fonts.googleapis.com/.*", "i");
export const googleStaticFontRegex = new RegExp("^https://fonts.gstatic.com/.*", "i");
export const jsdelivrCDNRegex = new RegExp("^https://cdn.jsdelivr.net/.*", "i");
