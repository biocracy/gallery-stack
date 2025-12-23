"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/image";

type Artwork = {
    _id: string;
    title: string;
    year?: number;
    image?: any;
    moreImages?: any[];
    slug?: { current: string };
};

export default function InteractiveArtworkCard({ artwork, priority = false }: { artwork: Artwork; priority?: boolean }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Combine main image and extra images
    const allImages = useMemo(() => {
        const images = [];
        if (artwork.image) images.push(artwork.image);
        if (artwork.moreImages) images.push(...artwork.moreImages);
        return images;
    }, [artwork.image, artwork.moreImages]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (allImages.length <= 1) return;
        if (!containerRef.current) return;

        const { left, width } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;

        // Calculate percentage (0 to 1)
        const percentage = Math.max(0, Math.min(1, x / width));

        // Map to index
        const index = Math.min(
            allImages.length - 1,
            Math.floor(percentage * allImages.length)
        );

        setCurrentIndex(index);
    };

    const handleMouseLeave = () => {
        setCurrentIndex(0);
    };

    const currentImage = allImages[currentIndex];

    // If no images at all, render placeholder
    if (!currentImage) {
        return (
            <Link
                href={artwork.slug?.current ? `/artwork/${artwork.slug.current}` : `/artwork/${artwork._id}`}
                prefetch={false}
                className="group block transition-transform duration-300 hover:-translate-y-2"
            >
                <article className="flex flex-col h-full">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-800 transition-shadow duration-300 group-hover:shadow-md flex items-center justify-center text-neutral-400">
                        <span className="text-sm">No Image</span>
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {artwork.title}
                            </h2>
                            {artwork.year && (
                                <p className="mt-1 text-sm text-neutral-500 font-medium">
                                    {artwork.year}
                                </p>
                            )}
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    return (
        <Link
            href={artwork.slug?.current ? `/artwork/${artwork.slug.current}` : `/artwork/${artwork._id}`}
            prefetch={false}
            className="group block transition-transform duration-300 hover:-translate-y-2"
        >
            <article className="flex flex-col h-full animate-[fadeIn_0.5s_ease-out]">
                <div
                    ref={containerRef}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-800 transition-shadow duration-300 group-hover:shadow-md"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <Image
                        key={currentIndex} // Force re-render for smooth switch or keep same for simple src swap? 
                        // Using key forces a fade if we added animation, but for "scrubbing" standard src swap is usually snappy enough. 
                        // However, Next.js Image might blink. Let's try without key first, or rely on browser cache.
                        // Actually, for instant scrubbing, standard img or properly cached Next Image is best.
                        // Let's use the URL as ID.
                        src={urlFor(currentImage)}
                        alt={`${artwork.title} - View ${currentIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        unoptimized
                        priority={priority}
                    />

                    {/* Optional: Show Scrubber Indicator if multiple images */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 px-2 py-1 bg-black/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {allImages.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {artwork.title}
                        </h2>
                        {artwork.year && (
                            <p className="mt-1 text-sm text-neutral-500 font-medium">
                                {artwork.year}
                            </p>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}
