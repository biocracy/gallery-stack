import { defineField, defineType } from "sanity";

export const element = defineType({
    name: "element",
    title: "Element",
    type: "document",
    fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            options: { hotspot: true },
        }),
    ],
});
