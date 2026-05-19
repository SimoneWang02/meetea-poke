import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StepTipo from '../components/steps/StepTipo';
import StepPoke from '../components/steps/StepPoke';
import StepBubbleTea from '../components/steps/StepBubbleTea';
import StepRiepilogo from '../components/steps/StepRiepilogo';
import StepDatiCliente from '../components/steps/StepDatiCliente';
import StepConferma from '../components/steps/StepConferma';

const STEPS_LABELS = ['Cosa', 'Personalizza', 'Riepilogo', 'Dati', 'Conferma'];

function stepIndex(step) {
    switch (step) {
        case 'tipo':
            return 0;
        case 'poke':
        case 'bubbletea':
            return 1;
        case 'riepilogo':
            return 2;
        case 'dati':
            return 3;
        case 'conferma':
            return 4;
        default:
            return 0;
    }
}

function ProgressBar({ step }) {
    const current = stepIndex(step);
    return (
        <ol className="mt-6 grid grid-cols-5 gap-2">
            {STEPS_LABELS.map((label, idx) => {
                const active = idx <= current;
                return (
                    <li key={label} className="flex flex-col items-center">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                                active
                                    ? 'bg-mint-600 text-white'
                                    : 'bg-stone-200 text-stone-500'
                            }`}
                        >
                            {idx + 1}
                        </div>
                        <span
                            className={`mt-1 text-center text-[10px] font-medium uppercase tracking-wider ${
                                active ? 'text-mint-700' : 'text-stone-400'
                            }`}
                        >
                            {label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

export default function Ordina() {
    const [step, setStep] = useState('tipo');
    const [items, setItems] = useState([]);
    const [cliente, setCliente] = useState({
        nome: '',
        telefono: '',
        orario_ritiro: '',
        note: '',
    });

    const reset = () => {
        setStep('tipo');
        setItems([]);
        setCliente({ nome: '', telefono: '', orario_ritiro: '', note: '' });
    };

    const addItem = (item) => {
        setItems([...items, item]);
        setStep('riepilogo');
    };

    const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            <header className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
                    <Link to="/" className="text-xl font-extrabold tracking-tight">
                        MeeTea<span className="text-accent-400">&amp;</span>Poke
                    </Link>
                    <Link
                        to="/"
                        className="text-sm font-medium text-stone-500 hover:text-stone-700"
                    >
                        Annulla
                    </Link>
                </div>
                <div className="mx-auto max-w-2xl px-6 pb-6">
                    <ProgressBar step={step} />
                </div>
            </header>

            <main className="mx-auto max-w-2xl px-6 py-8">
                {step === 'tipo' && (
                    <StepTipo
                        items={items}
                        onChoose={(t) => setStep(t)}
                        onProcedi={() => setStep('riepilogo')}
                    />
                )}

                {step === 'poke' && (
                    <StepPoke onCancel={() => setStep('tipo')} onAdd={addItem} />
                )}

                {step === 'bubbletea' && (
                    <StepBubbleTea onCancel={() => setStep('tipo')} onAdd={addItem} />
                )}

                {step === 'riepilogo' && (
                    <StepRiepilogo
                        items={items}
                        onRemove={removeItem}
                        onAddAnother={() => setStep('tipo')}
                        onProcedi={() => setStep('dati')}
                    />
                )}

                {step === 'dati' && (
                    <StepDatiCliente
                        cliente={cliente}
                        onChange={setCliente}
                        onIndietro={() => setStep('riepilogo')}
                        onProcedi={() => setStep('conferma')}
                    />
                )}

                {step === 'conferma' && (
                    <StepConferma
                        items={items}
                        cliente={cliente}
                        onReset={reset}
                    />
                )}
            </main>
        </div>
    );
}
