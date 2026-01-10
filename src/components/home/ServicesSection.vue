<template>
    <section class="services-section">
        <div class="services-header">
            <h2 class="services-title">Nuestros Servicios</h2>
            <p class="services-subtitle">Conectamos Cuba con el mundo</p>
        </div>

        <div class="services-grid">
            <!-- Top-up Service Card -->
            <ion-card class="service-card">
                <ion-card-content class="service-content">
                    <div class="service-icon topup-icon">
                        <ion-icon :icon="phonePortraitOutline" />
                    </div>
                    <div class="service-info">
                        <h3 class="service-name">Recargas a Cuba</h3>
                        <p class="service-description">
                            Recarga móviles ETECSA de forma instantánea y segura
                        </p>
                        <ul class="service-features">
                            <li>
                                <ion-icon :icon="checkmarkCircleOutline" />
                                <span>Entrega inmediata</span>
                            </li>
                            <li>
                                <ion-icon :icon="checkmarkCircleOutline" />
                                <span>Mejores tarifas</span>
                            </li>
                            <li>
                                <ion-icon :icon="checkmarkCircleOutline" />
                                <span>Soporte 24/7</span>
                            </li>
                        </ul>
                    </div>
                    <ion-button expand="block" size="large" class="service-btn" @click="emit('topupClick')">
                        <ion-icon slot="start" :icon="logoWhatsapp" />
                        Recargar Ahora
                    </ion-button>
                </ion-card-content>
            </ion-card>

            <!-- Remittances Service Card -->
            <ion-card class="service-card">
                <ion-card-content class="service-content">
                    <div class="service-icon remittance-icon">
                        <ion-icon :icon="cashOutline" />
                    </div>
                    <div class="service-info">
                        <h3 class="service-name">Remesas a Cuba</h3>
                        <p class="service-description">
                            Envía dinero a Cuba de forma rápida, segura y con las mejores tasas
                        </p>
                        <ul class="service-features">
                            <li>
                                <ion-icon :icon="checkmarkCircleOutline" />
                                <span>Tasas competitivas</span>
                            </li>
                            <li>
                                <ion-icon :icon="checkmarkCircleOutline" />
                                <span>Envío rápido (24-48h)</span>
                            </li>
                            <li>
                                <ion-icon :icon="checkmarkCircleOutline" />
                                <span>100% seguro y confiable</span>
                            </li>
                        </ul>
                    </div>
                    <ion-button expand="block" size="large" class="service-btn" @click="emit('remittanceClick')">
                        <ion-icon slot="start" :icon="logoWhatsapp" />
                        Enviar Remesa
                    </ion-button>
                </ion-card-content>
            </ion-card>
        </div>
    </section>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/vue';
import {
    phonePortraitOutline,
    checkmarkCircleOutline,
    logoWhatsapp,
    cashOutline
} from 'ionicons/icons';

const emit = defineEmits<{
    topupClick: [];
    remittanceClick: [];
}>();
</script>

<style scoped>
.services-section {
    padding: var(--koi-space-6) var(--koi-space-4);
    padding-top: 0;
}

.services-header {
    text-align: center;
    margin-bottom: var(--koi-space-6);
}

.services-title {
    font-size: var(--koi-text-2xl);
    font-weight: var(--koi-font-bold);
    color: var(--koi-neutral-900);
    margin: 0 0 var(--koi-space-1) 0;
    font-family: var(--koi-font-display);
}

.services-subtitle {
    font-size: var(--koi-text-base);
    color: var(--koi-neutral-600);
    margin: 0;
}

.services-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--koi-space-4);
    justify-content: center;
}

.service-card {
    flex: 1;
    min-width: 300px;
    max-width: 500px;
    margin: 0;
    box-shadow: var(--koi-shadow-lg);
    border: 1px solid var(--koi-neutral-200);
    border-radius: var(--koi-radius-xl);
    overflow: hidden;
    transition: transform var(--koi-transition-base);
}

.service-card:hover {
    transform: translateY(-4px);
}

.services-grid .service-card:first-child {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.services-grid .service-card:last-child {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.service-content {
    padding: var(--koi-space-6);
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

.service-content::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 250px;
    height: 250px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.service-icon {
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--koi-radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--koi-space-4);
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 2;
}

.service-icon ion-icon {
    font-size: 2rem;
    color: white;
}

.service-info {
    margin-bottom: var(--koi-space-5);
    position: relative;
    z-index: 2;
    flex-grow: 1;
}

.service-name {
    font-size: var(--koi-text-xl);
    font-weight: var(--koi-font-bold);
    color: white;
    margin: 0 0 var(--koi-space-2) 0;
    font-family: var(--koi-font-display);
}

.service-description {
    font-size: var(--koi-text-base);
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 var(--koi-space-4) 0;
    line-height: 1.5;
}

.service-features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--koi-space-2);
}

.service-features li {
    display: flex;
    align-items: center;
    gap: var(--koi-space-2);
    color: white;
    font-size: var(--koi-text-sm);
    font-weight: var(--koi-font-medium);
}

.service-features ion-icon {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    flex-shrink: 0;
}

.service-btn {
    --background: white;
    --border-radius: var(--koi-radius-lg);
    --padding-top: var(--koi-space-4);
    --padding-bottom: var(--koi-space-4);
    font-weight: var(--koi-font-bold);
    text-transform: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 2;
}

.services-grid .service-card:first-child .service-btn {
    --color: #059669;
}

.services-grid .service-card:last-child .service-btn {
    --color: #7c3aed;
}

.service-btn ion-icon {
    font-size: 1.5rem;
}

@media (max-width: 768px) {
    .services-grid {
        flex-direction: column;
        align-items: center;
    }

    .service-card {
        width: 100%;
        max-width: 100%;
    }

    .service-content {
        padding: var(--koi-space-4);
    }

    .service-features {
        flex-direction: row;
        flex-wrap: wrap;
    }
}

@media (max-width: 576px) {
    .services-section {
        padding: var(--koi-space-4);
    }

    .service-name {
        font-size: var(--koi-text-lg);
    }

    .service-description {
        font-size: var(--koi-text-sm);
    }
}

@media (prefers-color-scheme: dark) {
    .service-card {
        border-color: var(--koi-neutral-300);
    }

    .services-title {
        color: var(--koi-neutral-900);
    }

    .services-subtitle {
        color: var(--koi-neutral-500);
    }
}
</style>