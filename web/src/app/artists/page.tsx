import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { sanity } from "@/lib/sanity";

const builder = imageUrlBuilder(sanity);
const urlFor = (src: any) =>
    builder.image(src).width(800).auto("format").url();

type Artist = {
    _id: string;
    name: string;
    info?: string;
    image?: any;
    slug?: { current: string };
};

export default async function ArtistsPage() {
    const artists: Artist[] = await sanity.fetch(`
    *[_type == "artist"] | order(name asc) { _id, name, info, image, slug }
  `);

    return (
        <main className="min-h-screen max-w-[1600px] mx-auto px-6 py-12 sm:px-12 lg:py-20 relative z-10">
            <header className="mb-16 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Our Artists
                </h1>
                <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
                    Meet the visionary creators behind the collection.
                </p>
            </header>

            <div className="flex flex-wrap justify-center gap-8">
                {artists.map((artist) => (
                    <Link
                        key={artist._id}
                        href={artist.slug?.current ? `/artists/${artist.slug.current}` : `/artists/${artist._id}`}
                        className="group flex flex-col overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)]"
                    >
                        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                            {artist.image ? (
                                <Image
                                    src={urlFor(artist.image)}
                                    alt={artist.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    unoptimized
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                                    <span className="text-sm">No Image</span>
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {artist.name}
                            </h2>
                            {artist.info && (
                                <p className="mt-3 text-neutral-600 dark:text-neutral-400 line-clamp-3">
                                    {artist.info}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}

                {artists.length === 0 && (
                    <div className="col-span-full text-center py-20 text-neutral-500">
                        <p>No artists found. Please add some via the CMS.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
