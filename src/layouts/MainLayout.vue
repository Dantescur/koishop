<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import {
    IonApp,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonBadge,
    IonContent,
    IonFooter,
    IonSegment,
    IonSegmentButton,
    IonLabel
} from '@ionic/vue';
import {
    homeOutline,
    copyOutline,
    cartOutline,
    chevronBack
} from 'ionicons/icons';

const router = useRouter();
const route = useRoute();
const cart = useCartStore();

const activeRoute = ref(route.path);

const pageTitles = {
    '/home': 'KOISEND',
    '/catalog': 'Catálogo',
    '/cart': 'Mi Carrito'
};

const currentPageTitle = computed(() =>
    pageTitles[route.path as keyof typeof pageTitles] || 'KOISEND'
);

const showBackButton = computed(() =>
    route.path !== '/home' && route.path !== '/catalog' && route.path !== '/cart'
);

const handleSegmentChange = (event: CustomEvent) => {
    const newRoute = event.detail.value;
    if (newRoute !== route.path) {
        router.push(newRoute);
    }
};

const goBack = () => {
    router.back();
};

// Watch route changes to update active segment
watch(() => route.path, (newPath) => {
    activeRoute.value = newPath;
});
</script>



<template>
    <ion-app>
        <!-- Main Navigation -->
        <ion-header class="ion-no-border">
            <ion-toolbar>
                <ion-title>{{ currentPageTitle }}</ion-title>

                <!-- Optional: Add a back button for non-home pages -->
                <ion-buttons slot="start" v-if="showBackButton">
                    <ion-button @click="goBack">
                        <ion-icon :icon="chevronBack" slot="icon-only" />
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <!-- Main Content -->
        <ion-content>
            <slot />
        </ion-content>

        <!-- Bottom Navigation -->
        <ion-footer class="ion-no-border">
            <ion-toolbar>
                <ion-segment v-model="activeRoute" @ionChange="handleSegmentChange" class="bottom-nav">
                    <ion-segment-button value="/home">
                        <ion-icon :icon="homeOutline" />
                        <ion-label>Inicio</ion-label>
                    </ion-segment-button>

                    <ion-segment-button value="/catalog">
                        <ion-icon :icon="copyOutline" />
                        <ion-label>Catálogo</ion-label>
                    </ion-segment-button>

                    <ion-segment-button value="/cart">
                        <ion-icon :icon="cartOutline" />
                        <ion-label>Carrito</ion-label>
                        <ion-badge v-if="cart.totalItems > 0" color="danger" class="nav-badge">
                            {{ cart.totalItems }}
                        </ion-badge>
                    </ion-segment-button>
                </ion-segment>
            </ion-toolbar>
        </ion-footer>
    </ion-app>
</template>

<style scoped>
.bottom-nav {
    --background: white;
    padding: var(--koi-space-1) 0;
}

.bottom-nav::part(indicator) {
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: var(--ion-color-primary);
}

.bottom-nav ion-segment-button {
    --color: var(--koi-neutral-500);
    --color-checked: var(--ion-color-primary);
    --indicator-color: transparent;
    min-height: 56px;
    position: relative;
}

.bottom-nav ion-icon {
    font-size: 1.5rem;
    margin-bottom: 4px;
}

.bottom-nav ion-label {
    font-size: var(--koi-text-xs);
    font-weight: var(--koi-font-medium);
    text-transform: none;
}

.nav-badge {
    position: absolute;
    top: 6px;
    right: 20px;
    font-size: 10px;
    padding: 2px 4px;
    min-width: 16px;
    height: 16px;
}

.cart-button {
    position: relative;
}

.cart-button ion-badge {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 10px;
    padding: 2px 6px;
    min-width: 16px;
    height: 16px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .bottom-nav {
        --background: var(--koi-neutral-100);
    }
}
</style>