/**
 *  Copyright (c) 2024 taskylizard
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "pathe";
import matter from "gray-matter";

export interface TooltipData {
  id: string;
  frontmatter: Record<string, string>;
  content: string;
}

let tooltipsCache: TooltipData[] | null = null;

export function loadTooltips(): TooltipData[] {
  if (tooltipsCache) return tooltipsCache;

  const tooltipsDir = resolve(process.cwd(), "docs/.vitepress/tooltips");
  const tooltips: TooltipData[] = [];

  try {
    const files = readdirSync(tooltipsDir).filter((file) =>
      file.endsWith(".md"),
    );

    for (const file of files) {
      const filePath = join(tooltipsDir, file);
      const fileContent = readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      const id = basename(file, ".md");
      const cleanContent = content.trim();

      tooltips.push({
        id,
        frontmatter: data,
        content: cleanContent,
      });
    }
  } catch (error) {
    console.warn("Failed to load tooltips:", error);
  }

  tooltipsCache = tooltips;
  return tooltips;
}

export function getTooltip(id: string): TooltipData | undefined {
  const tooltips = loadTooltips();
  return tooltips.find((tooltip) => tooltip.id === id);
}

export const tooltips = loadTooltips();
