<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { Tables } from '@/types/database.types';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton } from '@ionic/vue';

const props = defineProps<{
  product: Tables<'products'>
}>()

const cart = useCartStore()

function handleAdd() {
  cart.addItem(props.product)
}

</script>

<template>
  <ion-card class="product-card ion-no-margin">
    <div class="image-container">
      <img :src="product.image_url ?? ''" :alt="product.name" />
      <div class="price-badge">${{ product.price }}</div>
    </div>
    <ion-card-header>
      <ion-card-title>{{ product.name }}</ion-card-title>
      <ion-card-subtitle>{{ product.stock_quantity }} in stock</ion-card-subtitle>
    </ion-card-header>
    <ion-button :disabled="product.stock_quantity <= 0" fill="clear" size="small" expand="block" @click="handleAdd">
      {{ product.stock_quantity > 0 ? 'Agregar al carrito' : 'Agotado' }}
    </ion-button>
  </ion-card>
</template>

<style scoped>
.product-card {
  box-shadow: none;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.image-container {
  position: relative;
  aspect-ratio: 1/1;
  background: #f9f9f9;
}

.price-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: var(--ion-color-primary);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.9rem;
}
</style>