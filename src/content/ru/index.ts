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
export type Content = typeof content;
