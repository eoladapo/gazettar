export default {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "color",
      title: "Color Class",
      type: "string",
      description: "CSS color class (e.g., text-politics, text-technology, text-entertainment)",
      options: {
        list: [
          { title: "Politics", value: "text-politics" },
          { title: "Technology", value: "text-technology" },
          { title: "Entertainment", value: "text-entertainment" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
}
