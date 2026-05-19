let ctx = null;

function getCtx() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
}

export function beep({ frequency = 880, duration = 0.15, volume = 0.25 } = {}) {
    const context = getCtx();
    if (!context) return;
    if (context.state === 'suspended') context.resume();

    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    osc.connect(gain).connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + duration + 0.02);
}

export function beepNewOrder() {
    beep({ frequency: 880, duration: 0.12 });
    setTimeout(() => beep({ frequency: 1175, duration: 0.18 }), 150);
}
