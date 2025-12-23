import imageUrlBuilder from "@sanity/image-url";
import { sanity } from "@/lib/sanity";

const builder = imageUrlBuilder(sanity);

export const urlFor = (source: any) => {
    return builder.image(source).auto("format").url();
};
