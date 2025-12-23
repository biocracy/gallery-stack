import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { sanity } from "@/lib/sanity";
import Display0 from "@/components/Display0";
import SiteDescription from "@/components/SiteDescription";
import PaintingsGrid from "@/components/PaintingsGrid";

const builder = imageUrlBuilder(sanity);
const urlFor = (src: any) => builder.image(src).width(900).quality(80).auto("format").url();

type Artwork = { _id: string; title: string; year?: number; image?: any; moreImages?: any[], slug?: { current: string } };
type MetalArt = { _id: string; title: string; material?: string; image?: any, slug?: { current: string } };

export const dynamic = "force-dynamic";

export default async function Page() {
  const [artworksBase, displayItems, metalArts] = await Promise.all([
    sanity.fetch(`*[_type == "artwork"] | order(_createdAt desc) { _id, title, year, image, moreImages, slug }`),
    sanity.fetch(`*[_type == "display0"] | order(_createdAt desc)[0...5] { _id, name, description, image }`),
    sanity.fetch(`*[_type == "metalArt"] | order(_createdAt desc) { _id, title, material, image, slug }`)
  ]);

  // Fisher-Yates shuffle
  const artworks = [...artworksBase];
  for (let i = artworks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [artworks[i], artworks[j]] = [artworks[j], artworks[i]];
  }

  return (
    <main className="min-h-screen pt-4 relative">
      {/* Section 1: Hero (Display0) */}
      {/* Section 1: Hero (Display0) */}
      <section className="pb-12 sm:pb-16 lg:pb-20 relative">
        <div className="absolute inset-0 bg-white dark:bg-neutral-950 -z-10" />
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 relative z-10">
          <Display0 items={displayItems} />
        </div>
      </section>

      {/* Section 2: Site Description */}
      {/* Section 2: Site Description */}
      <section className="py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-300 dark:border-neutral-700 -z-10" />
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 relative z-10">
          <SiteDescription />
        </div>
      </section>

      {/* Section 3: Unique Paintings */}
      {/* Section 3: Unique Paintings */}
      <section className="py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-white dark:bg-neutral-950 -z-10" />
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 relative z-10">
          <header className="mb-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Original Paintings
            </h1>
            <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Hand-crafted fine art paintings in oil and acrylic.
            </p>
          </header>

          <PaintingsGrid artworks={artworks} />
        </div>
      </section>

      {/* Section 4: Metal Art Series */}
      <section className="py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-300 dark:border-neutral-700 -z-10" />
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 relative z-10">
          <header className="mb-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Metal Art Series
            </h1>
            <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Explore our exclusive series of laser-cut metal panels, produced in limited numbers.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {metalArts.map((item: MetalArt) => (
              <Link
                key={item._id}
                href={item.slug?.current ? `/metal-art/${item.slug.current}` : `/metal-art/${item._id}`}
                prefetch={false}
                className="group block transition-transform duration-300 hover:-translate-y-2"
              >
                <article className="flex flex-col h-full">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-800 transition-shadow duration-300 group-hover:shadow-md">
                    {item.image ? (
                      <Image
                        src={urlFor(item.image)}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-5">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h2>
                    {item.material && (
                      <p className="mt-1 text-sm text-neutral-500 font-medium">
                        {item.material}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Commissioning */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-white dark:bg-neutral-950 -z-10" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            Commission a Masterpiece
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-10 leading-relaxed">
            Have a specific vision in mind? We specialize in translating your unique concepts into tailored, high-quality artworks.
            Collaborate with us to create a piece that perfectly resonates with your space and story.
          </p>
          <Link
            href="/inquire?type=commission"
            className="inline-block px-10 py-5 bg-black dark:bg-white text-white dark:text-black text-lg font-bold rounded-full hover:opacity-90 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Start a Commission
          </Link>
        </div>
      </section>
    </main>
  );
}
