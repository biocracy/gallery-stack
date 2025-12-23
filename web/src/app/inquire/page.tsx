"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sendInquiry } from "../actions/inquire";
import Link from "next/link";
// useActionState is available in React 19 (which is in package.json) or possibly 'react-dom' experimental.
// If not available, we fall back to standard form handling.
// Given React 19.2.3 in dependencies, useActionState should be available from 'react'.

export default function InquirePage() {
    const searchParams = useSearchParams();
    const artworkTitle = searchParams.get("artwork") || "";
    const isCommission = searchParams.get("type") === "commission";

    const [verification, setVerification] = useState({ q: "", a: 0 });
    const [userAnswer, setUserAnswer] = useState("");

    // Set up Math question on mount to avoid hydration mismatch
    useEffect(() => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        setVerification({ q: `What is ${n1} + ${n2}?`, a: n1 + n2 });
    }, []);

    const [state, formAction, isPending] = useActionState(sendInquiry, null);

    const defaultMessage = isCommission
        ? `Dear Gallery Team,\n\nI have a unique vision for a custom artwork and would like to discuss commissioning a piece.\n\nHere are some initial details about what I have in mind:\n\n[Please describe your idea, preferred size, and any specific requirements]\n\nSincerely,`
        : artworkTitle
            ? `Dear Gallery Team,\n\nI am writing to express my interest in acquiring the artwork titled "${artworkTitle}".\n\nCould you please provide more information regarding its purchase and potential shipping arrangements?\n\nSincerely,`
            : "";

    return (
        <main className="min-h-screen max-w-2xl mx-auto px-6 py-20 flex flex-col justify-center relative z-10">
            <Link href="/" className="mb-8 text-sm text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors">
                ← Back to Gallery
            </Link>

            <header className="mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                    {isCommission ? "Commission a Masterpiece" : "Inquire about an Artwork"}
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-300">
                    {isCommission
                        ? "Tell us about your vision. We specialize in bringing unique concepts to life through bespoke, high-quality art."
                        : "Please fill out the form below to get in touch with us regarding your purchase interest."}
                </p>
            </header>

            {state?.success ? (
                <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl border border-green-200 dark:border-green-800 text-center animate-[fadeIn_0.5s_ease-out]">
                    <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">Message Sent!</h2>
                    <p className="text-green-700 dark:text-green-400 mb-6">{state.message}</p>
                    <Link href="/" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors">
                        Return to Gallery
                    </Link>
                </div>
            ) : (
                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Your Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows={8}
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            defaultValue={defaultMessage}
                        />
                    </div>

                    <div>
                        <label htmlFor="verification" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Human Verification: {verification.q}
                        </label>
                        <input
                            type="number"
                            id="verification"
                            name="verification"
                            required
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Answer"
                        />
                        <input type="hidden" name="expectedVerification" value={verification.a} />
                    </div>

                    {state?.error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-lg font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isPending ? "Sending..." : "Send Inquiry"}
                    </button>
                </form>
            )}
        </main>
    );
}
