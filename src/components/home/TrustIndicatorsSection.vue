<template>
    <section class="trust-section">
        <div class="trust-items">
            <div class="trust-item">
                <div class="trust-icon">🚀</div>
                <h3>Envío Rápido</h3>
                <p>Entrega en 1-2 días</p>
            </div>
            <div class="trust-item">
                <div class="trust-icon">🔒</div>
                <h3>Pago Seguro</h3>
                <p>100% protegido</p>
            </div>
            <div class="trust-item">
                <div class="trust-icon">💬</div>
                <h3>Atención 24/7</h3>
                <p>Siempre disponibles</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.trust-section {
    padding: var(--koi-space-8) var(--koi-space-4);
    background: var(--koi-neutral-100);
}

.trust-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--koi-space-5);
    max-width: 900px;
    margin: 0 auto;
}

.trust-item {
    text-align: center;
}

.trust-icon {
    font-size: 3rem;
    margin-bottom: var(--koi-space-3);
}

.trust-item h3 {
    font-size: var(--koi-text-base);
    font-weight: var(--koi-font-bold);
    color: var(--koi-neutral-900);
    margin: 0 0 var(--koi-space-1) 0;
}

.trust-item p {
    font-size: var(--koi-text-sm);
    color: var(--koi-neutral-600);
    margin: 0;
}

@media (max-width: 768px) {
    .trust-items {
        grid-template-columns: 1fr;
        gap: var(--koi-space-4);
    }
}

@media (prefers-color-scheme: dark) {
    .trust-section {
        background: var(--koi-neutral-100);
    }

    .trust-item h3 {
        color: var(--koi-neutral-900);
    }

    .trust-item p {
        color: var(--koi-neutral-500);
    }
}
</style>