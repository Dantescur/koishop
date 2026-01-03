<template>
  <ion-card class="product-card" @click="handleCardClick">
    <!-- Image Section -->
    <div class="image-wrapper">
      <img :src="imageSrc" :alt="product.name" loading="lazy" class="product-image" @error="handleImageError" />

      <!-- Status Badge -->
      <div v-if="isOutOfStock" class="badge badge-danger">
        Agotado
      </div>
      <div v-else-if="isLowStock" class="badge badge-warning">
        ¡Últimas unidades!
      </div>

      <!-- Price Badge -->
      <div class="price-badge">
        {{ formattedPrice }}
      </div>
    </div>

    <!-- Content Section -->
    <ion-card-header class="card-header">
      <ion-card-title class="product-title">
        {{ product.name }}
      </ion-card-title>

      <ion-card-subtitle v-if="product.description" class="product-subtitle">
        {{ truncatedDescription }}
      </ion-card-subtitle>

      <!-- Stock Info -->
      <div class="stock-indicator" :class="stockClass">
        <ion-icon :icon="stockIcon" class="stock-icon" />
        <span>{{ stockText }}</span>
      </div>
    </ion-card-header>

    <!-- Actions -->
    <div class="card-footer">
      <ion-button class="add-button" expand="block" :disabled="isOutOfStock"
        :color="isOutOfStock ? 'medium' : 'primary'" @click.stop="handleAddToCart">
        <ion-icon v-if="!isOutOfStock" slot="start" :icon="cartOutline" />
        {{ buttonText }}
      </ion-button>
    </div>
  </ion-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { Tables } from '@/types/database.types';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { cartOutline, checkmarkCircle, alertCircle, closeCircle } from 'ionicons/icons';

// Props
const props = defineProps<{
  product: Tables<'products'>
}>();

// Emits
const emit = defineEmits<{
  'show-details': [product: Tables<'products'>]
}>();

// Store
const cartStore = useCartStore();

// Local state
const imageSrc = ref(props.product.image_url || '/placeholder-image.jpg');
const imageLoadError = ref(false);

// Computed properties
const isOutOfStock = computed(() => props.product.stock_quantity <= 0);
const isLowStock = computed(() => props.product.stock_quantity > 0 && props.product.stock_quantity <= 5);

const formattedPrice = computed(() => {
  const price = props.product.price;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
});

const truncatedDescription = computed(() => {
  const desc = props.product.description;
  if (!desc) return '';
  return desc.length > 80 ? `${desc.substring(0, 80)}...` : desc;
});

const stockText = computed(() => {
  const qty = props.product.stock_quantity;
  if (qty <= 0) return 'Sin stock';
  if (qty <= 5) return `Solo ${qty} disponibles`;
  return `${qty} disponibles`;
});

const stockClass = computed(() => {
  if (isOutOfStock.value) return 'stock-out';
  if (isLowStock.value) return 'stock-low';
  return 'stock-available';
});

const stockIcon = computed(() => {
  if (isOutOfStock.value) return closeCircle;
  if (isLowStock.value) return alertCircle;
  return checkmarkCircle;
});

const buttonText = computed(() => {
  return isOutOfStock.value ? 'Agotado' : 'Agregar al carrito';
});

// Methods
const handleImageError = () => {
  if (!imageLoadError.value) {
    imageLoadError.value = true;
    imageSrc.value = '/placeholder-image.jpg';
  }
};

const handleAddToCart = () => {
  if (isOutOfStock.value) return;

  cartStore.addItem(props.product);

  // Optional: Add haptic feedback on mobile
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
};

const handleCardClick = () => {
  emit('show-details', props.product);
};
</script>

<style scoped>
.product-card {
  --background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.product-card:active {
  transform: translateY(-2px);
}

/* Image Section */
.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

/* Badges */
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.badge-danger {
  background: rgba(var(--ion-color-danger-rgb, 235, 68, 90), 0.95);
  color: white;
}

.badge-warning {
  background: rgba(var(--ion-color-warning-rgb, 255, 206, 84), 0.95);
  color: #333;
}

.price-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: linear-gradient(135deg,
      var(--ion-color-primary, #3880ff) 0%,
      var(--ion-color-primary-shade, #3171e0) 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 24px;
  font-weight: 700;
  font-size: 1.125rem;
  box-shadow: 0 4px 12px rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.4);
  backdrop-filter: blur(8px);
}

/* Content Section */
.card-header {
  padding: 16px;
  padding-bottom: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  color: #1a1a1a;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-subtitle {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Stock Indicator */
.stock-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 4px;
}

.stock-icon {
  font-size: 1rem;
}

.stock-available {
  color: var(--ion-color-success, #2dd36f);
}

.stock-low {
  color: var(--ion-color-warning, #ffc409);
}

.stock-out {
  color: var(--ion-color-danger, #eb445a);
}

/* Footer */
.card-footer {
  padding: 0 16px 16px;
  margin-top: auto;
}

.add-button {
  --border-radius: 12px;
  --box-shadow: none;
  height: 44px;
  font-weight: 600;
  font-size: 0.9375rem;
  text-transform: none;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
}

.add-button:not([disabled]):hover {
  transform: scale(1.02);
}

.add-button:not([disabled]):active {
  transform: scale(0.98);
}

/* Responsive Design */
@media (max-width: 576px) {
  .product-card {
    border-radius: 12px;
  }

  .product-title {
    font-size: 1rem;
  }

  .product-subtitle {
    font-size: 0.8125rem;
  }

  .price-badge {
    font-size: 1rem;
    padding: 6px 12px;
  }

  .add-button {
    height: 40px;
    font-size: 0.875rem;
  }

  .badge {
    font-size: 0.6875rem;
    padding: 5px 10px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .product-card {
    max-width: 320px;
    margin: 0 auto;
  }
}

/* Touch devices */
@media (hover: none) and (pointer: coarse) {
  .product-card:hover {
    transform: none;
  }

  .product-card:active {
    transform: scale(0.97);
    transition: transform 0.1s ease;
  }

  .product-image {
    transform: none !important;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .product-card {
    --background: #1e1e1e;
  }

  .product-title {
    color: #ffffff;
  }

  .product-subtitle {
    color: #b0b0b0;
  }

  .image-wrapper {
    background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
  }
}

/* Accessibility */
.product-card:focus-visible {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>