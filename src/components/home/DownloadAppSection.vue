<template>
    <section class="download-section">
        <div class="download-container">
            <div class="download-text">
                <h2 class="download-title">Lleva KOISEND en tu bolsillo</h2>
                <p>Descarga nuestra app nativa para una experiencia más rápida y sin gastar datos extras.</p>
            </div>

            <div class="download-actions">
                <ion-button expand="block" class="download-btn android" @click="emit('downloadApp', 'android')">
                    <ion-icon slot="start" :icon="logoAndroid" />
                    <div class="btn-label">
                        <span class="btn-small">Descargar para</span>
                        <span class="btn-large">Android (APK)</span>
                    </div>
                </ion-button>

                <ion-button :disabled="true" expand="block" class="download-btn ios"
                    @click="emit('downloadApp', 'ios')">
                    <ion-icon slot="start" :icon="logoApple" />
                    <div class="btn-label">
                        <span class="btn-small">Instalar en</span>
                        <span class="btn-large">iOS (Jailbreak)</span>
                    </div>
                </ion-button>
            </div>

            <p class="download-note">
                * Para iOS requiere tener el dispositivo liberado (Jailbreak).
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { logoAndroid, logoApple } from 'ionicons/icons';

const emit = defineEmits<{
    downloadApp: [platform: 'android' | 'ios'];
}>();
</script>

<style scoped>
.download-section {
    padding: var(--koi-space-8) var(--koi-space-4);
}

.download-container {
    max-width: 800px;
    margin: 0 auto;
    background: var(--koi-neutral-100);
    padding: var(--koi-space-6);
    border-radius: var(--koi-radius-2xl);
    text-align: center;
    border: 1px solid var(--koi-neutral-200);
}

.download-title {
    font-size: var(--koi-text-xl);
    font-weight: var(--koi-font-bold);
    color: var(--koi-neutral-900);
    margin: 0 0 var(--koi-space-2) 0;
}

.download-actions {
    display: flex;
    gap: var(--koi-space-4);
    justify-content: center;
    margin: var(--koi-space-6) 0;
    flex-wrap: wrap;
}

.download-btn {
    --padding-top: var(--koi-space-4);
    --padding-bottom: var(--koi-space-4);
    --border-radius: var(--koi-radius-lg);
    margin: 0;
    min-width: 220px;
    transition: transform 0.2s ease;
}

.download-btn:active {
    transform: scale(0.98);
}

.download-btn.android {
    --background: #3DDC84;
    --color: #073042;
}

.download-btn.ios {
    --background: #000000;
    --color: white;
}

.btn-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    line-height: 1.2;
}

.btn-small {
    font-size: 0.7rem;
    text-transform: uppercase;
    opacity: 0.8;
}

.btn-large {
    font-size: var(--koi-text-base);
    font-weight: var(--koi-font-bold);
}

.download-btn ion-icon {
    font-size: 2rem;
    margin-right: var(--koi-space-2);
}

.download-note {
    font-size: var(--koi-text-xs);
    color: var(--koi-neutral-500);
    font-style: italic;
}

@media (max-width: 576px) {
    .download-btn {
        width: 100%;
    }
}
</style>