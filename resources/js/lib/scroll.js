function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function animateScroll(targetY, duration, onDone) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime = null;
    function step(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        window.scrollTo(0, startY + diff * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
        else onDone?.();
    }
    requestAnimationFrame(step);
}

function animateScrollTop(container, targetTop, duration, onDone) {
    const startTop = container.scrollTop;
    const diff = targetTop - startTop;
    if (Math.abs(diff) < 1) {
        onDone?.();
        return;
    }
    let startTime = null;
    function step(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        container.scrollTop = startTop + diff * easeInOutCubic(progress);
        if (progress < 1) requestAnimationFrame(step);
        else onDone?.();
    }
    requestAnimationFrame(step);
}

// Scrolls `target` into view inside its closest scrollable ancestor by
// animating scrollTop manually — native `scrollIntoView({behavior:"smooth"})`
// is silently downgraded to an instant jump by some browsers/webviews
// (e.g. under reduced-motion settings), so this guarantees a visible animation.
export function scrollIntoViewSmooth(target, duration = 450, onDone) {
    if (!target) return;
    const container = target.closest(".overflow-y-auto") ?? target.parentElement;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offset = targetRect.top - containerRect.top + container.scrollTop;
    const centered = offset - (container.clientHeight - targetRect.height) / 2;
    const maxScroll = container.scrollHeight - container.clientHeight;
    const clamped = Math.max(0, Math.min(centered, maxScroll));
    animateScrollTop(container, clamped, duration, onDone);
}
