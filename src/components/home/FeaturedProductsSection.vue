<template>
    <section class="featured-section">
        <div class="section-header">
            <div>
                <h2 class="section-title">Productos Destacados</h2>
                <p class="section-subtitle">Los más populares de esta semana</p>
            </div>
            <ion-button fill="clear" size="small" router-link="/catalog" class="view-all-btn">
                Ver todos
                <ion-icon slot="end" :icon="arrowForwardOutline" />
            </ion-button>
        </div>

        <ion-grid class="featured-grid">
            <ion-row>
                <ion-col v-for="product in products" :key="product.id" size="6" size-sm="4" size-md="3" size-lg="2">
                    <ProductCard @show-details="emit('showProductDetail', product)" :product="product"
                        @add="emit('addToCart', product)" />
                </ion-col>
            </ion-row>
        </ion-grid>

        <div class="show-more">
            <ion-button expand="block" fill="outline" router-link="/catalog" class="show-more-btn">
                Ver Todo el Catálogo
            </ion-button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/vue';
import ProductCard from '@/components/ProductCard.vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { Tables } from '@/types/database.types';

defineProps<{
    products: Tables<'products'>[];
}>();

const emit = defineEmits<{
    showProductDetail: [product: Tables<'products'>];
    addToCart: [product: Tables<'products'>];
}>();
</script>

<style scoped>
.featured-section {
    padding: var(--koi-space-6) var(--koi-space-4);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--koi-space-5);
    gap: var(--koi-space-4);
}

.section-title {
    font-size: var(--koi-text-2xl);
    font-weight: var(--koi-font-bold);
    color: var(--koi-neutral-900);
    margin: 0 0 var(--koi-space-1) 0;
    font-family: var(--koi-font-display);
}

.section-subtitle {
    font-size: var(--koi-text-sm);
    color: var(--koi-neutral-500);
    margin: 0;
}

.view-all-btn {
    --color: var(--ion-color-primary);
    font-weight: var(--koi-font-semibold);
    text-transform: none;
    flex-shrink: 0;
}

.featured-grid {
    --ion-grid-padding: 0;
    --ion-grid-column-padding: var(--koi-space-2);
    margin-bottom: var(--koi-space-5);
}

.show-more {
    max-width: 400px;
    margin: 0 auto;
}

.show-more-btn {
    --border-width: 2px;
    --border-color: var(--ion-color-primary);
    --border-radius: var(--koi-radius-lg);
    --padding-top: var(--koi-space-3);
    --padding-bottom: var(--koi-space-3);
    font-weight: var(--koi-font-semibold);
    text-transform: none;
}

@media (max-width: 768px) {
    .section-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .view-all-btn {
        align-self: flex-start;
    }
}

@media (max-width: 576px) {
    .featured-grid {
        --ion-grid-column-padding: var(--koi-space-1);
    }
}
</style>