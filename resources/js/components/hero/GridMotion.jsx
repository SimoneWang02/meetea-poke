import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function GridMotion({ items = [], gradientColor = "black" }) {
    const gridRef = useRef(null);
    const rowRefs = useRef([]);
    const progressRef = useRef(0.5);

    const totalItems = 28;
    const defaultItems = Array.from({ length: totalItems }, (_, i) => `Item ${i + 1}`);
    const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

    useEffect(() => {
        gsap.ticker.lagSmoothing(0);

        const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        const handleMouseMove = (e) => {
            progressRef.current = e.clientX / window.innerWidth;
        };

        const handleScroll = () => {
            const max = window.innerHeight;
            const p = Math.min(1, Math.max(0, window.scrollY / max));
            progressRef.current = p;
        };

        const updateMotion = () => {
            const maxMoveAmount = 300;
            const baseDuration = 0.8;
            const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

            rowRefs.current.forEach((row, index) => {
                if (!row) return;
                const direction = index % 2 === 0 ? 1 : -1;
                const moveAmount =
                    (progressRef.current * maxMoveAmount - maxMoveAmount / 2) * direction;

                gsap.to(row, {
                    x: moveAmount,
                    duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
                    ease: "power3.out",
                    overwrite: "auto",
                });
            });
        };

        const removeAnimationLoop = gsap.ticker.add(updateMotion);

        if (isDesktop) {
            progressRef.current = 0.5;
            window.addEventListener("mousemove", handleMouseMove);
        } else {
            handleScroll();
            window.addEventListener("scroll", handleScroll, { passive: true });
        }

        return () => {
            if (isDesktop) {
                window.removeEventListener("mousemove", handleMouseMove);
            } else {
                window.removeEventListener("scroll", handleScroll);
            }
            removeAnimationLoop();
        };
    }, []);

    const isImagePath = (s) =>
        typeof s === "string" && (s.startsWith("http") || s.startsWith("/"));

    return (
        <div ref={gridRef} className="h-full w-full overflow-hidden">
            <section
                className="relative flex h-full w-full items-center justify-center overflow-hidden"
                style={{
                    background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
                }}
            >
                <div className="pointer-events-none absolute inset-0 z-[4] bg-[length:250px]" />
                <div className="relative z-[2] grid h-[140vh] w-[280vw] flex-none origin-center grid-cols-1 grid-rows-4 gap-3 rotate-[-15deg] md:h-[150vh] md:w-[150vw] md:gap-4">
                    {Array.from({ length: 4 }, (_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="grid grid-cols-7 gap-3 md:gap-4"
                            style={{ willChange: "transform, filter" }}
                            ref={(el) => {
                                if (el) rowRefs.current[rowIndex] = el;
                            }}
                        >
                            {Array.from({ length: 7 }, (_, itemIndex) => {
                                const content = combinedItems[rowIndex * 7 + itemIndex];
                                return (
                                    <div key={itemIndex} className="relative">
                                        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-[#111] text-[1.5rem] text-white">
                                            {isImagePath(content) ? (
                                                <div
                                                    className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
                                                    style={{ backgroundImage: `url("${content}")` }}
                                                />
                                            ) : (
                                                <div className="z-[1] p-4 text-center">{content}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="pointer-events-none relative left-0 top-0 h-full w-full" />
            </section>
        </div>
    );
}
