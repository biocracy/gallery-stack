import { defineField, defineType } from "sanity";

export const artist = defineType({
    name: "artist",
    title: "Artist",
    type: "document",
    fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
        }),
        defineField({ name: "info", title: "Info", type: "text" }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            options: { hotspot: true },
        }),
        defineField({
            name: "socialLinks",
            title: "Social Links",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "platform",
                            title: "Platform",
                            type: "string",
                            options: {
                                list: [
                                    { title: "Instagram", value: "instagram" },
                                    { title: "Twitter / X", value: "twitter" },
                                    { title: "Facebook", value: "facebook" },
                                    { title: "LinkedIn", value: "linkedin" },
                                    { title: "Website", value: "website" },
                                ],
                            },
                        },
                        {
                            name: "url",
                            title: "URL",
                            type: "url",
                        },
                    ],
                    preview: {
                        select: {
                            title: "platform",
                            subtitle: "url",
                        },
                    },
                },
            ],
        }),
    ],
});
