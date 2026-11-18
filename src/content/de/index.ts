import type { Content } from "../ru";
import { systems, compareRows, categories } from "./systems";
import { solutions, solutionGroups } from "./solutions";
import { accessories, accessoriesPage, accessoryChips } from "./accessories";
import { cases, caseTags } from "./cases";
import { news } from "./news";
import { pages } from "./pages";

export const content = {
  systems, compareRows, categories,
  solutions, solutionGroups,
  accessories, accessoriesPage, accessoryChips,
  cases, caseTags,
  news,
  pages,
};
// Same shape as the Russian content, checked at build time.
content satisfies { [K in keyof Content]: unknown };
