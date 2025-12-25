import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { sanity } from "@/lib/sanity";

const builder = imageUrlBuilder(sanity);
const urlFor = (src: any) =>
    builder.image(src).auto("format").url();

export default async function Header() {
    const logoElement = await sanity.fetch(
        `*[_type == "element" && name == "Logo.Com"][0]{ image }`
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
            <div className="relative max-w-[1600px] mx-auto flex h-24 items-center justify-between px-6 sm:px-12">
                <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-2xl font-light tracking-[0.3em] uppercase text-neutral-900 dark:text-white">Artstrut</span>
                </div>

                <div className="flex items-center gap-0 z-10">
                    <Link href="/" className="flex items-center gap-2">
                        {logoElement?.image ? (
                            <div className="relative h-20 w-32 sm:w-60 mix-blend-multiply dark:mix-blend-screen dark:invert">
                                <Image
                                    src={urlFor(logoElement.image)}
                                    alt="Artstrut.com Logo"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <span className="text-xl font-bold tracking-tight">Artstrut.com</span>
                        )}
                    </Link>

                    <a
                        href="https://www.instagram.com/artstrut/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors sm:-ml-12 relative z-20"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                        >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                </div>

                <nav className="flex items-center gap-6 sm:gap-8 z-10">
                    <Link
                        href="/"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                    >
                        Gallery
                    </Link>
                    <Link
                        href="/artists"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                    >
                        Artists
                    </Link>
                </nav>
            </div>
        </header>
    );
}
