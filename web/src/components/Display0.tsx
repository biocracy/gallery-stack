"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { sanity } from "@/lib/sanity";

// We need to fetch data on the client or pass it as props since this component has interactivity (hooks)
// However, standard Next.js pattern suggests fetching in parent server component and passing data.
// For simplicity in this specific request which asks to "fetch" and "display", I'll fetch inside useEffect to keep it self-contained
// OR even better, make it a server component that fetches, and a client component wrapper for the slider.
// Let's go with the Client Component fetching for now to ensure dynamic behavior easily, or Server Component fetching passed to client part.
// Actually, 'page.tsx' is a Server Component. I should fetch there and pass data.
// But the prompt says "Create in the CMS another category... from which the images will be sources".
// I will fetch in the component for encapsulation as requested by "component... which scrolls up".

const builder = imageUrlBuilder(sanity);
const urlFor = (src: any) => builder.image(src).width(1920).quality(90).auto("format").url();

interface DisplayItem {
    _id: string;
    name: string;
    description: string;
    image: any;
}

interface Display0Props {
    items: DisplayItem[];
}

export default function Display0({ items }: Display0Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000); // 5 seconds per slide
        return () => clearInterval(interval);
    }, [items.length]);

    if (!items || items.length === 0) {
        return null;
    }

    return (

        <section className="relative w-full h-[50vh] sm:h-[80vh] overflow-hidden mb-16">
            {items.map((item, index) => (
                <div
                    key={item._id}
                    className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <div className={`relative w-full h-full transform transition-transform duration-[6000ms] ease-out ${index === currentIndex ? "scale-110" : "scale-100"}`}>
                        {item.image && (
                            <Image
                                src={urlFor(item.image)}
                                alt={item.name || "Display Image"}
                                fill
                                className="object-contain sm:object-cover"
                                priority={index === 0}
                                unoptimized
                            />
                        )}
                        <div className="hidden sm:block absolute inset-0 bg-black/30" /> {/* Dimming overlay - hidden on mobile */}
                    </div>
                </div>
            ))}

            <div className="absolute bottom-12 left-6 sm:left-12 z-20 max-w-2xl text-neutral-500 sm:text-white landscape-text">
                <h2
                    key={`title-${currentIndex}`}
                    className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 animate-[fadeInUp_1s_ease-out] stroke-mobile sm:stroke-desktop"
                >
                    {items[currentIndex].name}
                </h2>
                <p
                    key={`desc-${currentIndex}`}
                    className="text-lg sm:text-xl font-light text-neutral-500 sm:text-neutral-200 animate-[fadeInUp_1.2s_ease-out] stroke-mobile-thin sm:stroke-desktop-thin"
                >
                    {items[currentIndex].description}
                </p>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .stroke-mobile {
                    -webkit-text-stroke: 1px white;
                    text-shadow: 0 0 10px rgba(255,255,255,0.5);
                }
                .stroke-mobile-thin {
                    -webkit-text-stroke: 0.5px white;
                }
                @media (min-width: 640px) {
                    .stroke-desktop {
                        -webkit-text-stroke: 1px rgba(0,0,0,0.5);
                        text-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    }
                    .stroke-desktop-thin {
                        text-shadow: 0 2px 4px rgba(0,0,0,0.8);
                    }
                }
                @media (max-height: 500px) and (orientation: landscape) {
                    .landscape-text h2 {
                        font-size: 1.25rem !important;
                        margin-bottom: 0.25rem !important;
                    }
                    .landscape-text p {
                        font-size: 0.75rem !important;
                        line-height: 1.25 !important;
                    }
                }
            `}</style>
        </section>
    );
}
