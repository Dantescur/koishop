<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <ion-toolbar>
                <ion-title>Página no encontrada</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <div class="not-found">
                <div class="not-found-icon">🔍</div>
                <h1 class="not-found-title">404</h1>
                <p class="not-found-description">
                    La página que buscas no existe.
                </p>
                <ion-button expand="block" router-link="/home" class="home-btn">
                    Volver al inicio
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton
} from '@ionic/vue';
</script>

<style scoped>
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    text-align: center;
}

.not-found-icon {
    font-size: 4rem;
    margin-bottom: var(--koi-space-4);
    opacity: 0.5;
}

.not-found-title {
    font-size: 3rem;
    font-weight: var(--koi-font-bold);
    color: var(--koi-neutral-900);
    margin: 0 0 var(--koi-space-3) 0;
}

.not-found-description {
    font-size: var(--koi-text-base);
    color: var(--koi-neutral-600);
    margin: 0 0 var(--koi-space-6) 0;
    max-width: 300px;
}

.home-btn {
    --border-radius: var(--koi-radius-full);
    max-width: 200px;
}
</style>