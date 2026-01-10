<template>
    <section class="hero-section">
        <div class="hero-content">
            <div class="hero-badge">
                <ion-icon :icon="flashOutline" />
                <span>Envíos Rápidos a Cuba</span>
            </div>
            <h1 class="hero-title">
                Conecta con Cuba<br />
                <span class="hero-highlight">de forma fácil</span>
            </h1>
            <p class="hero-description">
                Envía productos y recarga desde cualquier lugar del mundo
            </p>
            <div class="hero-actions">
                <ion-button fill="solid" size="large" class="hero-btn primary" router-link="/catalog">
                    Explorar Catálogo
                    <ion-icon slot="end" :icon="arrowForwardOutline" />
                </ion-button>
            </div>
        </div>
        <div class="hero-decoration">
            <div class="decoration-circle circle-1"></div>
            <div class="decoration-circle circle-2"></div>
            <div class="decoration-circle circle-3"></div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { flashOutline, arrowForwardOutline } from 'ionicons/icons';
</script>

<style scoped>
.hero-section {
    position: relative;
    padding: var(--koi-space-8) var(--koi-space-4);
    background: linear-gradient(135deg, #FFF5F5 0%, #FFF 50%, #FFF5F5 100%);
    overflow: hidden;
    min-height: 320px;
    display: flex;
    align-items: center;
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--koi-space-1);
    padding: var(--koi-space-1) var(--koi-space-3);
    background: rgba(217, 4, 41, 0.1);
    /* color: var(--ion-color-primary); */
    border-radius: var(--koi-radius-full);
    font-size: var(--koi-text-sm);
    font-weight: var(--koi-font-semibold);
    margin-bottom: var(--koi-space-4);
}

.hero-badge ion-icon {
    font-size: 1rem;
}

.hero-title {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    font-weight: var(--koi-font-extrabold);
    line-height: 1.2;
    color: var(--koi-neutral-900);
    margin: 0 0 var(--koi-space-3) 0;
    font-family: var(--koi-font-display);
}

.hero-highlight {
    color: var(--ion-color-primary);
    display: block;
}

.hero-description {
    font-size: var(--koi-text-base);
    color: var(--koi-neutral-600);
    margin: 0 0 var(--koi-space-6) 0;
    line-height: 1.6;
}

.hero-actions {
    display: flex;
    gap: var(--koi-space-3);
    justify-content: center;
    flex-wrap: wrap;
}

.hero-btn {
    --border-radius: var(--koi-radius-full);
    --padding-start: var(--koi-space-6);
    --padding-end: var(--koi-space-6);
    font-weight: var(--koi-font-semibold);
    text-transform: none;
    box-shadow: var(--koi-shadow-lg);
}

.hero-btn.primary {
    --background: var(--ion-color-primary);
}

.hero-decoration {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
}

.decoration-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(217, 4, 41, 0.05);
}

.circle-1 {
    width: 300px;
    height: 300px;
    top: -150px;
    right: -100px;
}

.circle-2 {
    width: 200px;
    height: 200px;
    bottom: -100px;
    left: -50px;
}

.circle-3 {
    width: 150px;
    height: 150px;
    top: 50%;
    right: 10%;
    opacity: 0.5;
}

@media (max-width: 768px) {
    .hero-section {
        padding: var(--koi-space-6) var(--koi-space-4);
        min-height: 280px;
    }

    .circle-1 {
        width: 200px;
        height: 200px;
        top: -100px;
        right: -50px;
    }

    .circle-2 {
        width: 150px;
        height: 150px;
    }

    .circle-3 {
        display: none;
    }
}

@media (max-width: 576px) {
    .hero-actions {
        flex-direction: column;
        width: 100%;
    }

    .hero-btn {
        width: 100%;
    }
}

@media (prefers-color-scheme: dark) {
    .hero-section {
        background: linear-gradient(135deg, #1a0a0a 0%, var(--koi-neutral-50) 50%, #1a0a0a 100%);
    }

    .hero-title {
        color: var(--koi-neutral-900);
    }

    .hero-description {
        color: var(--koi-neutral-500);
    }

    .decoration-circle {
        background: rgba(217, 4, 41, 0.08);
    }
}
</style>