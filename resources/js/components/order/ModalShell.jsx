import React, { useEffect, useRef } from "react";

export default function ModalShell({ open, onClose, title, children, footer }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const t = setTimeout(() => {
            const focusable = dialogRef.current?.querySelector(
                "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
            );
            focusable?.focus();
        }, 30);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            clearTimeout(t);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div
                className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                ref={dialogRef}
                className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[85vh] sm:rounded-3xl"
            >
                <div className="flex shrink-0 items-center justify-between gap-4 border-b border-stone-100 px-6 py-4">
                    <h2 className="text-lg font-bold tracking-tight">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Chiudi"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <path d="M6 6l12 12" />
                            <path d="M18 6L6 18" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>
                {footer && (
                    <div className="shrink-0 border-t border-stone-100 bg-white px-6 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
