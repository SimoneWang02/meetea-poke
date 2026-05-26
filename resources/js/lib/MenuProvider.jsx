import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from '../bootstrap';

const STORAGE_KEY = 'mtp.menu.cache.v1';
const STORAGE_TTL_MS = 60 * 60 * 1000;

const MenuContext = createContext(null);

function storagePath(relative) {
    if (!relative) return null;
    return `/storage/${relative}`;
}

function findGroup(groups, slug) {
    return groups.find((g) => g.slug === slug);
}

function adaptMenu(raw) {
    if (!raw) return null;

    const pokeGroups = raw.poke?.groups ?? [];
    const namesOf = (slug) =>
        findGroup(pokeGroups, slug)?.ingredients.map((i) => i.nome) ?? [];
    const extraOf = (slug) => Number(findGroup(pokeGroups, slug)?.prezzo_extra ?? 0);

    const POKE_DIMENSIONI = (raw.poke?.sizes ?? []).map((s) => ({
        id: s.slug,
        nome: s.nome,
        prezzo: s.prezzo,
        proteine: s.max_proteine,
        green: s.max_green,
        crispy: s.max_crispy,
        salse: s.max_salse,
    }));

    const singoliGroup = (raw.boba?.topping_groups ?? []).find((g) => g.slug === 'singoli');
    const otherToppingGroups = (raw.boba?.topping_groups ?? []).filter((g) => g.slug !== 'singoli');

    const BOBA_TOPPING = {
        singoli: (singoliGroup?.toppings ?? []).map((t) => ({ nome: t.nome })),
        gruppi: otherToppingGroups
            .map((g) => {
                const parent = g.toppings?.[0];
                if (!parent) return null;
                return {
                    nome: g.nome,
                    gusti: (parent.gusti ?? []).map((c) => c.nome),
                };
            })
            .filter(Boolean),
    };

    const BOBA_CATEGORIE = (raw.boba?.categories ?? []).map((c) => {
        const sizesPresent = new Set();
        c.drinks.forEach((d) => Object.keys(d.sizes ?? {}).forEach((s) => sizesPresent.add(s)));
        return {
            id: c.slug,
            titolo: c.nome,
            basi: c.basi ?? [],
            sizes: ['M', 'G'].filter((s) => sizesPresent.has(s)),
            items: c.drinks.map((d) => ({
                nome: d.nome,
                prezzi: d.sizes ?? {},
                ingredienti: d.ingredienti ?? undefined,
                image: d.image_path ? storagePath(d.image_path) : undefined,
            })),
        };
    });

    const SNACKS_LISTA = (raw.snacks ?? []).map((s) => ({
        nome: s.nome,
        image: s.image_path ? storagePath(s.image_path) : null,
        opzioni: (s.variants ?? []).map((v) => ({ qty: v.qty, prezzo: v.prezzo, mix_gusti: v.mix_gusti ?? false, num_pz: v.num_pz ?? null })),
        gusti: s.flavors ?? [],
    }));

    const BEVANDE_LISTA = (raw.bevande ?? []).map((b) => ({
        nome: b.nome,
        prezzo: Number(b.prezzo),
        image: b.image_path ? storagePath(b.image_path) : null,
    }));

    return {
        POKE_DIMENSIONI,
        POKE_BASI_MAX: raw.poke?.basi_max ?? 2,
        POKE_BASI: namesOf('basi'),
        POKE_PROTEINE: namesOf('proteine'),
        POKE_GREEN: namesOf('green'),
        POKE_CRISPY: namesOf('crispy'),
        POKE_SALSE: namesOf('salse'),
        POKE_EXTRA_PREZZI: {
            proteine: extraOf('proteine'),
            green: extraOf('green'),
            crispy: extraOf('crispy'),
            salse: extraOf('salse'),
        },
        BOBA_CATEGORIE,
        BOBA_TOPPING,
        SNACKS_LISTA,
        BEVANDE_LISTA,
    };
}

function readCache() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.menu || !parsed?.savedAt) return null;
        if (Date.now() - parsed.savedAt > STORAGE_TTL_MS) return null;
        return parsed.menu;
    } catch {
        return null;
    }
}

function writeCache(menu) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ menu, savedAt: Date.now() }));
    } catch {
        // localStorage piena o disabilitata: ignora
    }
}

export function MenuProvider({ children }) {
    const cached = readCache();
    const [rawMenu, setRawMenu] = useState(cached);
    const [loading, setLoading] = useState(!cached);
    const [error, setError] = useState(null);

    const reload = useCallback(async () => {
        try {
            const { data } = await axios.get('/menu');
            setRawMenu(data);
            writeCache(data);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    const menu = adaptMenu(rawMenu);

    return (
        <MenuContext.Provider value={{ menu, loading, error, reload }}>
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    const ctx = useContext(MenuContext);
    if (!ctx) {
        throw new Error('useMenu deve essere usato dentro <MenuProvider>');
    }
    return ctx;
}
