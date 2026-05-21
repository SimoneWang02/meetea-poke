import React from "react";

const BOBA_IMAGES = [
    "B9363470-5B00-4096-AFC5-99CA56D7EB5E.PNG",
    "IMG_0049.PNG",
    "IMG_0051.PNG",
    "IMG_0053.PNG",
    "IMG_0054.PNG",
    "IMG_0056.PNG",
    "IMG_0059.PNG",
    "IMG_0060.PNG",
    "IMG_0061.PNG",
    "IMG_0062.PNG",
    "IMG_0063.PNG",
    "IMG_0065.PNG",
    "IMG_0066.PNG",
    "IMG_0067.PNG",
    "IMG_0068.PNG",
    "IMG_0069.PNG",
    "IMG_0070.PNG",
    "IMG_0071.PNG",
    "IMG_0072.PNG",
    "IMG_0073.PNG",
    "IMG_0074.PNG",
    "IMG_0075.PNG",
    "IMG_0101.PNG",
    "IMG_0102.PNG",
    "IMG_0839.PNG",
];

export default function FallingBoba({ count = 80 }) {
    const sprites = React.useMemo(() => {
        return Array.from({ length: count }, (_, i) => {
            const size = 40 + Math.random() * 80;
            const duration = 14 + (120 - size) * 0.18;
            const delay = -Math.random() * duration;
            const left = Math.random() * 100;
            const opacity = 0.35 + (size / 120) * 0.45;
            const img =
                BOBA_IMAGES[Math.floor(Math.random() * BOBA_IMAGES.length)];
            const keyframe =
                Math.random() < 0.5 ? "boba-fall" : "boba-fall-ccw";
            return {
                id: i,
                size,
                duration,
                delay,
                left,
                opacity,
                img,
                keyframe,
            };
        });
    }, [count]);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
            {sprites.map((s) => (
                <img
                    key={s.id}
                    src={`/images/boba/${s.img}`}
                    alt=""
                    className="boba-falling absolute top-0 select-none object-contain"
                    style={{
                        left: `${s.left}%`,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        opacity: s.opacity,
                        animation: `${s.keyframe} ${s.duration}s linear ${s.delay}s infinite`,
                        willChange: "transform",
                    }}
                />
            ))}
        </div>
    );
}
