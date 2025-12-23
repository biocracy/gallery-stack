import { sanity } from "@/lib/sanity";
import Link from "next/link";
import MetalArtDetailClient from "./MetalArtDetailClient";

type MetalArt = {
    _id: string;
    title: string;
    material?: string;
    description?: string;
    image?: any;
    moreImages?: any[];
};

export default async function MetalArtPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    if (!slug) {
        return (
            <main style={{ padding: 24 }}>
                <p>Missing item slug.</p>
                <p>
                    <Link href="/">Back</Link>
                </p>
            </main>
        );
    }

    const item: MetalArt | null = await sanity.fetch(
        `*[_type == "metalArt" && (slug.current == $slug || _id == $slug)][0]{ 
      _id, 
      title, 
      material, 
      description,
      image,
      moreImages
    }`,
        { slug }
    );

    if (!item) {
        return (
            <main style={{ padding: 24 }}>
                <p>Not found.</p>
                <p>
                    <Link href="/">Back</Link>
                </p>
            </main>
        );
    }

    return <MetalArtDetailClient item={item} />;
}
