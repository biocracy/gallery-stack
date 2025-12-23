import { defineField, defineType } from "sanity";

export const metalArt = defineType({
    name: "metalArt",
    title: "Metal Art",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),

        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
        }),
        defineField({
            name: "material",
            title: "Material",
            type: "string",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            options: { hotspot: true },
        }),
        defineField({
            name: "moreImages",
            title: "More Images",
            type: "array",
            of: [{ type: "image", options: { hotspot: true } }],
        }),
    ],
});
