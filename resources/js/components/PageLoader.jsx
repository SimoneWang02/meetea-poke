import { useEffect, useState } from "react";

export default function PageLoader({
    images = [],
    minDuration = 350,
    maxDuration = 6000,
}) {
    const skip =
        typeof window !== "undefined" &&
        sessionStorage.getItem("heroImagesPreloaded") === "1";
    const [done, setDone] = useState(skip);
    const [removed, setRemoved] = useState(skip);

    useEffect(() => {
        if (skip || images.length === 0) return;
        document.body.style.overflow = "hidden";
        let loaded = 0;
        let finished = false;
        const startedAt = performance.now();
        const finish = () => {
            if (finished) return;
            finished = true;
            const elapsed = performance.now() - startedAt;
            const wait = Math.max(0, minDuration - elapsed);
            setTimeout(() => setDone(true), wait);
        };
        images.forEach((src) => {
            const img = new Image();
            const tick = () => {
                loaded += 1;
                if (loaded === images.length) finish();
            };
            img.onload = tick;
            img.onerror = tick;
            img.src = src;
        });
        const safety = setTimeout(finish, maxDuration);
        return () => {
            clearTimeout(safety);
            document.body.style.overflow = "";
        };
    }, [images, minDuration, maxDuration, skip]);

    useEffect(() => {
        if (done) sessionStorage.setItem("heroImagesPreloaded", "1");
    }, [done]);

    if (removed) return null;

    return (
        <div
            onTransitionEnd={() => done && setRemoved(true)}
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-stone-50 transition-opacity duration-500 ${done ? "opacity-0" : "opacity-100"}`}
        >
            <div className="flex flex-col items-center gap-6">
                <img
                    src="/images/name.svg"
                    alt="MeeTea&Poke"
                    className="w-[min(70%,320px)] animate-loader-pulse"
                />
                <div className="flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-mint-500 animate-loader-dot" />
                    <span className="h-2 w-2 rounded-full bg-mint-500 animate-loader-dot [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-mint-500 animate-loader-dot [animation-delay:300ms]" />
                </div>
            </div>
        </div>
    );
}
