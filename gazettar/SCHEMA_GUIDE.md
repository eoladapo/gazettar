# Sanity Schema Guide

## Overview

Your Sanity schema uses the **simple object format** without TypeScript helpers like `defineField` and `defineType`. This makes it easier to read and modify.

---

## Schema Structure

### 1. Post Schema (`schemaTypes/post.ts`)

```javascript
export default {
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    // Basic Info
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 3 },
    
    // Media
    { name: "mainImage", title: "Main Image", type: "image", options: { hotspot: true } },
    
    // References
    { name: "category", title: "Category", type: "reference", to: [{ type: "category" }] },
    { name: "author", title: "Author", type: "reference", to: [{ type: "author" }] },
    
    // Meta
    { name: "publishedAt", title: "Published At", type: "datetime" },
    { name: "featured", title: "Featured Post", type: "boolean" },
    { name: "trending", title: "Trending Post", type: "boolean" },
    { name: "readTime", title: "Read Time", type: "number" },
    
    // Content
    { name: "body", title: "Body", type: "array", of: [{ type: "block" }] },
    { name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] },
    
    // SEO
    { name: "seo", title: "SEO Settings", type: "object", fields: [...] },
  ],
}
```

### 2. Category Schema (`schemaTypes/category.ts`)

```javascript
export default {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "color", title: "Color Class", type: "string", options: { list: [...] } },
    { name: "description", title: "Description", type: "text", rows: 3 },
  ],
}
```

### 3. Author Schema (`schemaTypes/author.ts`)

```javascript
export default {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "image", title: "Image", type: "image", options: { hotspot: true } },
    { name: "bio", title: "Bio", type: "text", rows: 4 },
  ],
}
```

---

## Field Types Reference

### Basic Types
- `string` - Single line text
- `text` - Multi-line text (use `rows` option)
- `number` - Numeric value
- `boolean` - True/false checkbox
- `datetime` - Date and time picker

### Complex Types
- `slug` - URL-friendly identifier (auto-generated from `source` field)
- `image` - Image upload with `hotspot` option for focal point
- `reference` - Link to another document (use `to: [{ type: "documentType" }]`)
- `array` - List of items (use `of: [{ type: "..." }]`)
- `object` - Nested fields (use `fields: [...]`)

### Array Content Types
- `{ type: "string" }` - For tags, simple lists
- `{ type: "block" }` - For rich text content (paragraphs, headings, lists)
- `{ type: "image" }` - For image galleries
- `{ type: "reference", to: [...] }` - For related documents

---

## How to Add New Fields

### To Post Schema:

1. Open `gazettar/schemaTypes/post.ts`
2. Add new field to the `fields` array:

```javascript
{
  name: "yourFieldName",
  title: "Your Field Title",
  type: "string", // or text, number, boolean, etc.
  description: "Helper text for editors",
  validation: (Rule: any) => Rule.required(), // Optional
}
```

### Common Field Patterns:

**Simple Text Field:**
```javascript
{
  name: "subtitle",
  title: "Subtitle",
  type: "string",
}
```

**Multi-line Text:**
```javascript
{
  name: "summary",
  title: "Summary",
  type: "text",
  rows: 5,
}
```

**Number with Validation:**
```javascript
{
  name: "views",
  title: "View Count",
  type: "number",
  validation: (Rule: any) => Rule.min(0),
}
```

**Select Dropdown:**
```javascript
{
  name: "status",
  title: "Status",
  type: "string",
  options: {
    list: [
      { title: "Draft", value: "draft" },
      { title: "Published", value: "published" },
      { title: "Archived", value: "archived" },
    ],
  },
}
```

**Tags/Keywords:**
```javascript
{
  name: "keywords",
  title: "Keywords",
  type: "array",
  of: [{ type: "string" }],
  options: {
    layout: "tags",
  },
}
```

**Related Posts:**
```javascript
{
  name: "relatedPosts",
  title: "Related Posts",
  type: "array",
  of: [{ type: "reference", to: [{ type: "post" }] }],
  validation: (Rule: any) => Rule.max(3),
}
```

---

## Preview Configuration

The `preview` section controls how documents appear in Sanity Studio lists:

```javascript
preview: {
  select: {
    title: "title",           // Main title
    subtitle: "author.name",  // Can reference nested fields
    media: "mainImage",       // Thumbnail image
  },
  prepare(selection: any) {
    const { title, subtitle } = selection;
    return {
      title: title,
      subtitle: `by ${subtitle}`,
    };
  },
}
```

---

## Validation Rules

Add validation to ensure data quality:

```javascript
validation: (Rule: any) => Rule.required()                    // Required
validation: (Rule: any) => Rule.required().min(10).max(100)  // Length limits
validation: (Rule: any) => Rule.min(1).max(60)               // Number range
validation: (Rule: any) => Rule.email()                       // Email format
validation: (Rule: any) => Rule.uri()                         // URL format
```

---

## Initial Values

Set default values for new documents:

```javascript
{
  name: "publishedAt",
  title: "Published At",
  type: "datetime",
  initialValue: () => new Date().toISOString(), // Defaults to now
}
```

```javascript
{
  name: "featured",
  title: "Featured",
  type: "boolean",
  initialValue: false, // Defaults to unchecked
}
```

---

## Rich Text (Block Content)

The `body` field uses block content for rich text:

```javascript
{
  name: "body",
  title: "Body",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            title: "Link",
            name: "link",
            type: "object",
            fields: [{ name: "href", type: "url" }],
          },
        ],
      },
    },
    {
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", title: "Alt Text", type: "string" },
        { name: "caption", title: "Caption", type: "string" },
      ],
    },
  ],
}
```

---

## Tips

1. **Use descriptive names**: `publishedAt` is better than `date`
2. **Add descriptions**: Help editors understand what each field is for
3. **Validate important fields**: Use `Rule.required()` for essential fields
4. **Group related fields**: Use comments or order fields logically
5. **Test in Studio**: After changing schema, reload Studio to see changes

---

## Reloading Schema Changes

After editing schema files:

1. Save the file
2. Sanity Studio auto-reloads (if dev server is running)
3. Refresh your browser if needed
4. Changes appear immediately!

---

## Need More?

- [Sanity Schema Types Docs](https://www.sanity.io/docs/schema-types)
- [Field Types Reference](https://www.sanity.io/docs/field-types)
- [Validation Rules](https://www.sanity.io/docs/validation)
