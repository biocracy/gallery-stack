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
        <section className="relative w-full h-[80vh] overflow-hidden bg-neutral-900 mb-16">
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
                                className="object-cover"
                                priority={index === 0}
                                unoptimized
                            />
                        )}
                        <div className="absolute inset-0 bg-black/30" /> {/* Dimming overlay */}
                    </div>
                </div>
            ))}

            <div className="absolute bottom-12 left-6 sm:left-12 z-20 max-w-2xl text-white">
                <h2
                    key={`title-${currentIndex}`}
                    className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 animate-[fadeInUp_1s_ease-out]"
                >
                    {items[currentIndex].name}
                </h2>
                <p
                    key={`desc-${currentIndex}`}
                    className="text-lg sm:text-xl font-light text-neutral-200 animate-[fadeInUp_1.2s_ease-out]"
                >
                    {items[currentIndex].description}
                </p>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}
