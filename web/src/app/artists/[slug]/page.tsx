import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { sanity } from "@/lib/sanity";

const builder = imageUrlBuilder(sanity);
const urlFor = (src: any) =>
    builder.image(src).width(1200).auto("format").url();
const artworkUrlFor = (src: any) =>
    builder.image(src).width(600).quality(80).auto("format").url();

type Artist = {
    _id: string;
    name: string;
    info?: string;
    image?: any;
    socialLinks?: { platform: string; url: string }[];
    slug?: { current: string };
};

type Artwork = {
    _id: string;
    title: string;
    year?: number;
    image?: any;
    slug?: { current: string };
};

export default async function ArtistDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {


    // Fetch artist and their artworks in parallel
    const { slug } = await params;
    console.log('[Debug] Fetching artist with slug/id:', slug);

    const [artist, artworks] = await Promise.all([
        sanity.fetch<Artist>(
            `*[_type == "artist" && (slug.current == $slug || _id == $slug)][0]{ ..., socialLinks }`,
            { slug }
        ),
        sanity.fetch<Artwork[]>(
            `*[_type == "artwork" && (artist->slug.current == $slug || artist->_id == $slug)] | order(year desc) { ..., slug }`,
            { slug }
        ),
    ]);

    console.log('[Debug] Artist result:', artist ? artist.name : 'Not Found');

    if (!artist) {
        return (
            <main className="min-h-screen px-6 py-20 text-center">
                <h1 className="text-2xl font-bold">Artist not found {slug}</h1>
                <Link href="/artists" className="text-neutral-500 hover:underline mt-4 block">
                    Back to Artists
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen max-w-[1600px] mx-auto px-6 py-12 sm:px-12 lg:py-20 relative z-10">
            <Link
                href="/artists"
                className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-8"
            >
                ← Back to Artists
            </Link>

            {/* Artist Profile */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="relative aspect-square w-full sm:w-80 lg:w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-800">
                        {artist.image ? (
                            <Image
                                src={urlFor(artist.image)}
                                alt={artist.name}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                                <span className="text-sm">No Image</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9 max-w-3xl">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                        {artist.name}
                    </h1>
                    {artist.info && (
                        <div className="prose prose-lg prose-neutral dark:prose-invert">
                            <p className="whitespace-pre-wrap">{artist.info}</p>
                        </div>
                    )}

                    {artist.socialLinks && artist.socialLinks.length > 0 && (
                        <div className="flex gap-4 mt-8">
                            {artist.socialLinks.map((link) => {
                                let icon = null;
                                switch (link.platform) {
                                    case "instagram":
                                        icon = (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                        );
                                        break;
                                    case "twitter":
                                        icon = (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h8.044L8.143 4H4z" /></svg>
                                            // Simple X/Twitter placeholder as standard libraries use complex paths. Using a generic 'X' shape or similar might be safer if path is complex, but let's try a simple X path simulation or fallback to generic external link if complex.
                                            // Actually, the feather icon for Twitter is standard:
                                            // <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                        );
                                        // Update to standard Twitter icon path
                                        icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
                                        break;
                                    case "facebook":
                                        icon = (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                        );
                                        break;
                                    case "linkedin":
                                        icon = (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                        );
                                        break;
                                    default:
                                        icon = (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                        );
                                }

                                return (
                                    <a
                                        key={link.platform}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
                                        title={link.platform}
                                    >
                                        {icon}
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Linked Artworks */}
            <section>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                    Artworks by {artist.name}
                </h2>

                {artworks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {artworks.map((a) => (
                            <Link
                                key={a._id}
                                href={a.slug?.current ? `/artwork/${a.slug.current}` : `/artwork/${a._id}`}
                                className="group block"
                            >
                                <article>
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 mb-4 transition-transform duration-300 group-hover:-translate-y-1">
                                        {a.image ? (
                                            <Image
                                                src={artworkUrlFor(a.image)}
                                                alt={a.title}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : null}
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {a.title}
                                    </h3>
                                    {a.year && (
                                        <p className="text-sm text-neutral-500">{a.year}</p>
                                    )}
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-500 italic">
                        There are no artworks linked to this artist yet.
                    </p>
                )}
            </section>
        </main>
    );
}
