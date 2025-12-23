"use client";

import { useEffect, useState, useRef } from "react";

const TEXT = `This platform serves as a curated portal into the work of independent thinkers and contemporary artists.
Our mission is to enrich the cultural landscape with artworks that are beautiful, intellectually engaging, and quietly mesmerizing.

The portfolio focuses primarily on oil and acrylic painting, complemented by selective explorations into sculpture and, in the near future, functional art and furniture. Each work reflects a commitment to material integrity, conceptual depth, and refined execution.

Artworks are available for acquisition upon request, unless otherwise specified. We also welcome commissioned projects, offering close collaboration with the artist and a guarantee of exceptional quality and timely delivery.`;

export default function SiteDescription() {
    const [scrollSeed, setScrollSeed] = useState(0);
    const [paragraphHeight, setParagraphHeight] = useState(0);
    // Use state callback ref to ensure we capture the element even if it mounts later/during hydration
    const [paragraphNode, setParagraphNode] = useState<HTMLParagraphElement | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            const seed = Math.floor(window.scrollY / 100);
            setScrollSeed(seed);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ResizeObserver to track paragraph height
    useEffect(() => {
        if (!paragraphNode) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setParagraphHeight(entry.contentRect.height);
            }
        });

        observer.observe(paragraphNode);
        return () => observer.disconnect();
    }, [paragraphNode]);

    const getScale = (index: number, seed: number) => {
        if (!isMounted) return 1;

        // Hash function ensures consistency for a given (index, seed) pair
        const hash = Math.sin(index * 1337 + seed * 9999) * 10000;
        const normalized = Math.abs(hash - Math.floor(hash)); // 0..1

        // Use a threshold to decide if a character should animate (e.g., 10% change chance)
        if (normalized > 0.1) return 1;

        // Map normalized (0..0.1) to range 0.7 .. 1.5
        // (normalized * 10) gives 0..1
        // 0.7 + (0..1 * 0.8) -> 0.7 .. 1.5
        return 0.7 + (normalized * 10) * 0.8;
    };

    // Calculate font size for "VISION" to match paragraph height
    // 6 letters in VISION. Line-height 1 means font-size approx height/6.
    const visionFontSize = paragraphHeight > 0 ? paragraphHeight / 6 : 0;

    return (
        <section className="px-6 sm:px-12 py-16 sm:py-24 max-w-5xl mx-auto flex flex-row items-stretch justify-center gap-8 sm:gap-12">
            {/* VISION Sidebar */}
            <div
                className="flex flex-col justify-between select-none font-serif italic font-light text-neutral-400 dark:text-neutral-600 leading-none items-center"
                aria-hidden="true"
            >
                {"VISION".split("").map((char, i) => (
                    <span
                        key={i}
                        style={{
                            fontSize: `${visionFontSize}px`,
                            lineHeight: 1,
                            height: `${visionFontSize}px`,
                            display: "block"
                        }}
                    >
                        {char}
                    </span>
                ))}
            </div>

            <p
                ref={setParagraphNode}
                className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-neutral-800 dark:text-neutral-200 font-light font-serif text-justify break-words flex-1"
            >
                {(() => {
                    let globalIndex = 0;
                    return TEXT.split(/(\s+)/).map((part, partIndex) => {
                        // If it's whitespace, return it directly to allow wrapping/justification between words
                        if (part.match(/^\s+$/)) {
                            globalIndex += part.length;
                            return <span key={`sep-${partIndex}`}>{part}</span>;
                        }

                        // It's a word: wrap in whitespace-nowrap to keep chars together
                        return (
                            <span key={`word-${partIndex}`} className="inline-block whitespace-nowrap">
                                {part.split("").map((char, charIndex) => {
                                    const currentIndex = globalIndex++;
                                    const scale = getScale(currentIndex, scrollSeed);
                                    const isNormal = scale === 1;

                                    return (
                                        <span
                                            key={`char-${currentIndex}`}
                                            className="inline-block transition-transform duration-500 ease-out will-change-transform"
                                            style={{
                                                transform: isNormal ? "none" : `scale(${scale})`,
                                                transformOrigin: "center bottom",
                                                padding: isNormal ? "0" : "0 0.5px",
                                                zIndex: isNormal ? "auto" : 10,
                                                position: isNormal ? "static" : "relative",
                                                display: "inline-block" // Ensure transform works
                                            }}
                                        >
                                            {char}
                                        </span>
                                    );
                                })}
                            </span>
                        );
                    });
                })()}
            </p>
        </section>
    );
}
