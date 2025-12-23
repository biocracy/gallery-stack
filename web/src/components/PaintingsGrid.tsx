"use client";

import { useState } from "react";
import InteractiveArtworkCard from "./InteractiveArtworkCard";

type Artwork = {
    _id: string;
    title: string;
    year?: number;
    image?: any;
    moreImages?: any[];
    slug?: { current: string };
};

interface PaintingsGridProps {
    artworks: Artwork[];
}

const ITEMS_PER_PAGE = 8;

export default function PaintingsGrid({ artworks }: PaintingsGridProps) {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(artworks.length / ITEMS_PER_PAGE);
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const displayedArtworks = artworks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <section id="paintings-grid" className="scroll-mt-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 min-h-[600px]">
                {displayedArtworks.map((a, index) => (
                    <InteractiveArtworkCard
                        key={a._id}
                        artwork={a}
                        priority={index < 4}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-8 mt-16">
                    <button
                        onClick={prevPage}
                        className="p-4 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Previous page"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={nextPage}
                        className="p-4 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Next page"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}
