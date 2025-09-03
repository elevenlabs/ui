import { categories } from "@showcase/data/categories"

export function createProjectsPageTree() {
  return {
    url: "/projects",
    children: [
      {
        $id: "categories",
        name: "Categories",
        type: "folder" as const,
        children: [
          {
            type: "page" as const,
            name: "Featured",
            url: "/projects",
          },
          ...categories.map((category) => ({
            type: "page" as const,
            name: category.name,
            url: `/projects/category/${category.id}`,
          })),
        ],
      },
    ],
  }
}