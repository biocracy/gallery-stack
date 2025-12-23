import { sanity } from "@/lib/sanity";
import Link from "next/link";
import ArtworkDetailClient from "./ArtworkDetailClient";

type Artwork = {
  _id: string;
  title: string;
  year?: number;
  description?: string;
  image?: any;
  moreImages?: any[];
  artist?: {
    _id: string;
    name: string;
  };
  sold?: boolean;
};

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return (
      <main style={{ padding: 24 }}>
        <p>Missing artwork slug.</p>
        <p>
          <Link href="/">Back</Link>
        </p>
      </main>
    );
  }

  console.log("ArtworkPage params slug:", slug);

  const artwork: Artwork | null = await sanity.fetch(
    `*[_type == "artwork" && (slug.current == $slug || _id == $slug)][0]{ 
      _id, 
      title, 
      year, 
      description,
      image,
      moreImages,
      artist->{_id, name},
      sold
    }`,
    { slug }
  );

  console.log("ArtworkPage fetch result:", artwork ? "Found" : "Null");

  if (!artwork) {
    return (
      <main style={{ padding: 24 }}>
        <p>Not found.</p>
        <p>
          <Link href="/">Back</Link>
        </p>
      </main>
    );
  }

  return <ArtworkDetailClient artwork={artwork} />;
}
