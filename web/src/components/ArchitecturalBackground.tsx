"use client";

import { useEffect, useRef, useState } from "react";

interface BackgroundElement {
    id: number;
    type: "line" | "curve" | "measure";
    x: number; // percentage
    angle: number; // degrees
    width: number;
    opacity: number;
    segmentDashArray: string; // "draw gap draw gap..."
    duration: number;
    offset: number;
    controlOffset?: number;
    ticks?: number[];
    isHorizontal?: boolean;
}

export default function ArchitecturalBackground() {
    const [verticalElements, setVerticalElements] = useState<BackgroundElement[]>([]);
    const [horizontalElements, setHorizontalElements] = useState<BackgroundElement[]>([]);

    const vertContainerRef = useRef<HTMLDivElement>(null);
    const horzContainerRef = useRef<HTMLDivElement>(null);

    // Physics state refs
    const state = useRef({
        yVert: 0, velVert: 0,
        yHorz: 0, velHorz: 0,
        lastScroll: 0
    });

    const generateBrokenLineAttr = () => {
        // 1. Generate random cut points to create segments
        const cuts = 3 + Math.floor(Math.random() * 4); // 3 to 6 cuts
        const points = [0];
        for (let i = 0; i < cuts; i++) {
            points.push(Math.random() * 100);
        }
        points.push(100);
        points.sort((a, b) => a - b);

        // 2. Calculate segment lengths
        const segments: number[] = [];
        for (let i = 1; i < points.length; i++) {
            const len = points[i] - points[i - 1];
            if (len > 0) segments.push(len);
        }

        // 3. Assign random visibility and merge consecutive states
        // We want a robust [Draw, Gap, Draw, Gap] sequence that sums to 100.

        let currentIsVisible = Math.random() > 0.5; // Start state
        const mergedBlocks: { len: number, vis: boolean }[] = [];

        // Initial block
        if (segments.length > 0) {
            mergedBlocks.push({ len: segments[0], vis: currentIsVisible });
        }

        // Merge rest
        for (let i = 1; i < segments.length; i++) {
            const segLen = segments[i];
            const segVis = Math.random() > 0.5; // Randomize each segment

            if (segVis === currentIsVisible) {
                // Extend current block
                mergedBlocks[mergedBlocks.length - 1].len += segLen;
            } else {
                // New block
                mergedBlocks.push({ len: segLen, vis: segVis });
                currentIsVisible = segVis;
            }
        }

        // 4. Construct DashArray
        // Must start with DRAW. If first block is Hidden, Draw=0.
        const dashArray: number[] = [];

        if (!mergedBlocks[0].vis) {
            dashArray.push(0);
        }

        mergedBlocks.forEach(block => {
            dashArray.push(block.len);
        });

        return dashArray.join(" ");
    };

    useEffect(() => {
        // Generate Vertical Elements
        const vertCount = 12;
        const verts: BackgroundElement[] = [];

        for (let i = 0; i < vertCount; i++) {
            const rand = Math.random();
            // 40% curve, 30% measure, 30% line
            const type = rand > 0.6 ? "curve" : rand > 0.3 ? "measure" : "line";

            verts.push({
                id: i,
                type,
                isHorizontal: false,
                x: Math.random() * 100,
                angle: (Math.random() - 0.5) * 5,
                width: 0.5 + Math.random() * 1.5,
                opacity: 0.15 + Math.random() * 0.25,
                segmentDashArray: generateBrokenLineAttr(),
                duration: 20 + Math.random() * 30,
                offset: (Math.random() - 0.5) * 60,
                controlOffset: (Math.random() - 0.5) * 80,
                ticks: type === "measure" ? [10 + Math.random() * 20, 40 + Math.random() * 20, 70 + Math.random() * 20] : undefined
            });
        }
        setVerticalElements(verts);

        // Generate Horizontal Elements
        const horzCount = 8;
        const horzs: BackgroundElement[] = [];
        for (let i = 0; i < horzCount; i++) {
            horzs.push({
                id: i + 100,
                type: "line",
                isHorizontal: true,
                x: Math.random() * 100, // Acts as Y position
                angle: (Math.random() - 0.5) * 2,
                width: 0.5 + Math.random() * 1.0,
                opacity: 0.1 + Math.random() * 0.2,
                segmentDashArray: generateBrokenLineAttr(),
                duration: 30 + Math.random() * 40,
                offset: (Math.random() - 0.5) * 40,
            });
        }
        setHorizontalElements(horzs);

    }, []);

    useEffect(() => {
        let rId: number;

        // Initial scroll position
        state.current.lastScroll = window.scrollY;

        const loop = () => {
            const currentScroll = window.scrollY;
            const delta = currentScroll - state.current.lastScroll;
            state.current.lastScroll = currentScroll;

            // PHYSICS UPDATE
            // Cap delta logic for safety
            const cappedDelta = Math.max(Math.min(delta, 100), -100);

            // Vertical Physics (Snappy but Low Sensitivity)
            const tVert = 0.2;
            const fVert = 0.88;
            const sVert = 0.05; // Low sensitivity

            state.current.velVert += cappedDelta * sVert;
            state.current.velVert += (-state.current.yVert * tVert);
            state.current.velVert *= fVert;
            state.current.velVert = Math.max(Math.min(state.current.velVert, 20), -20); // Cap

            state.current.yVert += state.current.velVert;

            // Horizontal Physics (Floaty)
            const tHorz = 0.05;
            const fHorz = 0.94;
            const sHorz = 0.02; // Very low sensitivity

            state.current.velHorz += cappedDelta * sHorz;
            state.current.velHorz += (-state.current.yHorz * tHorz);
            state.current.velHorz *= fHorz;
            state.current.velHorz = Math.max(Math.min(state.current.velHorz, 15), -15); // Cap

            state.current.yHorz += state.current.velHorz;

            if (vertContainerRef.current) {
                vertContainerRef.current.style.transform = `translate3d(0, ${state.current.yVert}px, 0)`;
            }
            if (horzContainerRef.current) {
                horzContainerRef.current.style.transform = `translate3d(0, ${state.current.yHorz}px, 0)`;
            }

            rId = requestAnimationFrame(loop);
        };

        loop();

        return () => cancelAnimationFrame(rId);
    }, []);

    const colorClass = "stroke-neutral-900 dark:stroke-blue-400";

    const renderElement = (el: BackgroundElement) => {
        const style = {
            animation: `drift ${el.duration}s ease-in-out infinite`,
            "--drift-offset": `${el.offset}px`
        } as React.CSSProperties;

        // Horizontal Rendering
        if (el.isHorizontal) {
            return (
                <line
                    key={el.id}
                    x1="-10%"
                    y1={`${el.x}%`}
                    x2="110%"
                    y2={`${el.x + (el.angle || 0)}%`}
                    pathLength="100"
                    stroke="currentColor"
                    strokeWidth={el.width}
                    strokeOpacity={el.opacity}
                    strokeDasharray={el.segmentDashArray}
                    className={colorClass}
                    style={style}
                />
            )
        }

        // Vertical Rendering
        const skewOffset = (el.angle || 0) * 1.5;

        if (el.type === "curve") {
            return (
                <path
                    key={el.id}
                    d={`M ${el.x}% -10% Q ${el.x + (el.controlOffset || 0)}% 50% ${el.x + skewOffset}% 110%`}
                    pathLength="100"
                    fill="none"
                    className={colorClass}
                    strokeWidth={el.width}
                    strokeOpacity={el.opacity}
                    strokeDasharray={el.segmentDashArray}
                    style={style}
                />
            );
        }

        if (el.type === "measure") {
            return (
                <g key={el.id} style={style} className={colorClass} strokeOpacity={el.opacity} strokeWidth={el.width}>
                    <line
                        x1={`${el.x}%`} y1="-10%" x2={`${el.x + skewOffset}%`} y2="110%"
                        pathLength="100"
                        strokeDasharray={el.segmentDashArray}
                        stroke="currentColor"
                    />
                    {el.ticks?.map((t, idx) => {
                        const progress = (t + 10) / 120;
                        const currentX = el.x + (skewOffset * progress);
                        return (
                            <line
                                key={idx}
                                x1={`${currentX - 0.5}%`}
                                y1={`${t}%`}
                                x2={`${currentX + 0.5}%`}
                                y2={`${t}%`}
                                pathLength="100"
                                strokeDasharray={el.segmentDashArray} // Apply broken logic to ticks too
                                stroke="currentColor"
                            />
                        )
                    })}
                </g>
            )
        }

        // Standard Vertical Line
        return (
            <line
                key={el.id}
                x1={`${el.x}%`}
                y1="-10%"
                x2={`${el.x + skewOffset}%`}
                y2="110%"
                pathLength="100"
                stroke="currentColor"
                strokeWidth={el.width}
                strokeOpacity={el.opacity}
                strokeDasharray={el.segmentDashArray}
                className={colorClass}
                style={style}
            />
        );
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes drift {
                0% { transform: translateX(0); }
                50% { transform: translateX(var(--drift-offset)); }
                100% { transform: translateX(0); }
            }
        `}} />

            {/* Vertical Layer (Snappy) - z-index 1 */}
            <div ref={vertContainerRef} className="fixed inset-0 pointer-events-none z-[1] overflow-hidden mix-blend-multiply dark:mix-blend-screen">
                <svg className="w-full h-full">
                    {verticalElements.map(renderElement)}
                </svg>
            </div>

            {/* Horizontal Layer (Floaty) - z-index 1 to match verts and show over bg */}
            <div ref={horzContainerRef} className="fixed inset-0 pointer-events-none z-[1] overflow-hidden mix-blend-multiply dark:mix-blend-screen">
                <svg className="w-full h-full">
                    {horizontalElements.map(renderElement)}
                </svg>
            </div>
        </>
    );
}
