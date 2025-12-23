"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { urlFor } from "@/lib/image";

interface LightboxProps {
    images: any[];
    initialIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function Lightbox({
    images,
    initialIndex,
    onClose,
    onNext,
    onPrev,
}: LightboxProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
        },
        [onClose, onNext, onPrev]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        // Prevent scrolling when lightbox is open
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [handleKeyDown]);

    // Reset zoom when changing images
    useEffect(() => {
        setIsZoomed(false);
    }, [initialIndex]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePosition({ x, y });
    };

    const toggleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!isZoomed) {
            // Set initial zoom origin to where the user clicked
            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            setMousePosition({ x, y });
        }
        setIsZoomed(!isZoomed);
    };

    const currentImage = images[initialIndex];

    if (!currentImage) return null;

    if (typeof window === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-white transition-colors"
                aria-label="Close lightbox"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            {/* Navigation - Left */}
            {!isZoomed && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    className="absolute left-4 z-50 p-2 text-white/50 hover:text-white transition-colors hidden md:block"
                    aria-label="Previous image"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-10 h-10"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>
            )}

            {/* Main Image Container */}
            <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => isZoomed ? toggleZoom(e) : e.stopPropagation()} // Click to zoom out if zoomed
                onMouseMove={handleMouseMove}
            >
                <div
                    className={`relative w-full h-full max-w-[90vw] max-h-[90vh] transition-all duration-200 ease-out overflow-hidden`}
                    style={{
                        cursor: isZoomed ? "zoom-out" : "zoom-in"
                    }}
                    onDoubleClick={toggleZoom}
                >
                    <Image
                        src={urlFor(currentImage)}
                        alt="Gallery image"
                        fill
                        className="object-contain transition-transform duration-200 ease-out"
                        style={{
                            transform: isZoomed ? "scale(2.5)" : "scale(1)",
                            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                        }}
                        unoptimized
                        priority
                    />
                </div>
            </div>

            {/* Navigation - Right */}
            {!isZoomed && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="absolute right-4 z-50 p-2 text-white/50 hover:text-white transition-colors hidden md:block"
                    aria-label="Next image"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-10 h-10"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            )}

            {/* Overlay click to close */}
            <div
                className="absolute inset-0 -z-10"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-medium">
                {initialIndex + 1} / {images.length}
            </div>
        </div>,
        document.body
    );
}
