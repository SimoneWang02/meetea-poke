import React from 'react';

const STILI = {
    nuovo: {
        label: 'Nuovo',
        cls: 'bg-red-100 text-red-800 ring-red-200',
    },
    in_preparazione: {
        label: 'In preparazione',
        cls: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    },
    pronto: {
        label: 'Pronto',
        cls: 'bg-green-100 text-green-800 ring-green-200',
    },
};

export default function StatoBadge({ stato }) {
    const s = STILI[stato] || STILI.nuovo;
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ${s.cls}`}
        >
            {s.label}
        </span>
    );
}
