"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/image";
import Lightbox from "@/components/Lightbox";

type MetalArt = {
    _id: string;
    title: string;
    material?: string;
    description?: string;
    image?: any;
    moreImages?: any[];
};

export default function MetalArtDetailClient({ item }: { item: MetalArt }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    // Combine main image and gallery images for the lightbox
    const allImages = [
        ...(item.image ? [item.image] : []),
        ...(item.moreImages || []),
    ];

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setLightboxOpen(true);
    };

    return (
        <main className="min-h-screen max-w-[1600px] mx-auto px-6 py-12 sm:px-12 lg:py-20 relative z-10">
            <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-8"
            >
                ← Back to Gallery
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                {/* Left Column: Image */}
                <div
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => item.image && openLightbox(0)}
                >
                    {item.image ? (
                        <Image
                            src={urlFor(item.image)}
                            alt={item.title}
                            fill
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                            <span className="text-sm">No Image Available</span>
                        </div>
                    )}
                </div>

                {/* Right Column: Details */}
                <div className="flex flex-col justify-center space-y-8">
                    <div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
                            {item.title}
                        </h1>
                        {item.material && (
                            <p className="mt-4 text-xl sm:text-2xl text-neutral-500 dark:text-neutral-400 font-medium">
                                {item.material}
                            </p>
                        )}
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        {item.description ? (
                            <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                {item.description}
                            </p>
                        ) : (
                            <p className="text-lg text-neutral-500 italic">
                                No description available for this piece.
                            </p>
                        )}
                    </div>

                    <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
                        <button className="w-full sm:w-auto px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-lg font-semibold rounded-full hover:opacity-90 transition-opacity">
                            Inquire about this piece
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional Images Gallery */}
            {item.moreImages && item.moreImages.length > 0 && (
                <section className="mt-24">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-12">
                        Gallery
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {item.moreImages.map((img: any, index: number) => (
                            <div
                                key={index}
                                className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => openLightbox(item.image ? index + 1 : index)}
                            >
                                <Image
                                    src={urlFor(img)}
                                    alt={`${item.title} - View ${index + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <Lightbox
                    images={allImages}
                    initialIndex={photoIndex}
                    onClose={() => setLightboxOpen(false)}
                    onNext={() => setPhotoIndex((prev) => (prev + 1) % allImages.length)}
                    onPrev={() => setPhotoIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                />
            )}
        </main>
    );
}
