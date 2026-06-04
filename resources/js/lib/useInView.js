import { useCallback, useRef, useState } from "react";

export function useInView(threshold = 0.12) {
    const [inView, setInView] = useState(false);
    const obsRef = useRef(null);

    // Callback ref: si riaggancia ogni volta che il nodo entra/esce dal DOM.
    // Necessario perché alcune sezioni vengono montate solo dopo il caricamento
    // async del menu: un useEffect con deps vuote girerebbe prima che l'elemento
    // esista e non si rieseguirebbe più, lasciando la sezione invisibile.
    const ref = useCallback(
        (node) => {
            if (obsRef.current) {
                obsRef.current.disconnect();
                obsRef.current = null;
            }
            if (!node) return;
            const obs = new IntersectionObserver(
                ([e]) => {
                    if (e.isIntersecting) {
                        setInView(true);
                        obs.disconnect();
                    }
                },
                { threshold },
            );
            obs.observe(node);
            obsRef.current = obs;
        },
        [threshold],
    );

    return [ref, inView];
}
