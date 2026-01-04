<template>
  <ion-card class="product-card" @click="handleCardClick">
    <!-- Image Section -->
    <div class="image-container">
      <ion-img :src="imageSrc" :alt="product.name" loading="lazy" @error="handleImageError"></ion-img>

      <!-- Discount Badge (if applicable) -->
      <div v-if="hasDiscount" class="discount-badge">
        -{{ discountPercent }}%
      </div>

      <!-- Stock Status -->
      <div v-if="isOutOfStock" class="stock-badge sold-out">
        AGOTADO
      </div>
      <div v-else-if="isLowStock" class="stock-badge low-stock">
        ¡SOLO {{ product.stock_quantity }}!
      </div>
    </div>

    <!-- Product Info -->
    <div class="product-info">
      <!-- Price Section - Prominent like Temu/Shein -->
      <div class="price-section">
        <div class="current-price">${{ product.price.toFixed(2) }}</div>
        <div v-if="hasDiscount" class="original-price">${{ originalPrice }}</div>
      </div>

      <!-- Product Name - Compact -->
      <div class="product-name">{{ product.name }}</div>

      <!-- Quick Stats Row -->
      <!-- <div class="stats-row">
        <div class="stat-item">
          <ion-icon :icon="starIcon" class="icon-star" />
          <span>4.5</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="sold-count">{{ soldCount }} vendidos</span>
        </div>
      </div> -->

      <!-- Add to Cart Button - Always visible, Shein style -->
      <ion-button class="quick-add-btn" size="small" fill="clear" :disabled="isOutOfStock"
        @click.stop="handleAddToCart">
        <ion-icon slot="icon-only" :icon="isOutOfStock ? closeIcon : cartIcon" />
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
  IonButton,
  IonIcon,
  IonImg
} from '@ionic/vue';
import { cart, close } from 'ionicons/icons';

const props = defineProps<{
  product: Tables<'products'>
}>();

const emit = defineEmits<{
  'show-details': [product: Tables<'products'>]
}>();

const cartStore = useCartStore();
const imageSrc = ref(props.product.image_url || '/placeholder-image.jpg');

// Icons
const cartIcon = cart;
// const starIcon = star;
const closeIcon = close;

// Computed
const isOutOfStock = computed(() => props.product.stock_quantity <= 0);
const isLowStock = computed(() => props.product.stock_quantity > 0 && props.product.stock_quantity <= 5);

// Mock data - replace with real data from your product object
const hasDiscount = computed(() => false); // Add discount logic
const discountPercent = computed(() => 25);
const originalPrice = computed(() => (props.product.price * 1.25).toFixed(2));
// const soldCount = computed(() => Math.floor(Math.random() * 500) + 100); // Mock sold count

const handleImageError = () => {
  imageSrc.value = '/placeholder-image.jpg';
};

const handleAddToCart = () => {
  if (isOutOfStock.value) return;
  cartStore.addItem(props.product);

  if ('vibrate' in navigator) {
    navigator.vibrate(30);
  }
};

const handleCardClick = () => {
  emit('show-details', props.product);
};
</script>

<style scoped>
.product-card {
  --background: #fff;
  border-radius: 8px;
  overflow: visible;
  box-shadow: none;
  border: 1px solid #f0f0f0;
  margin: 0;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.product-card:active {
  transform: scale(0.98);
}

/* Image Container */
.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #fafafa;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Badges - Temu/Shein Style */
.discount-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #ff3b3b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stock-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  z-index: 2;
}

.stock-badge.sold-out {
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

.stock-badge.low-stock {
  background: #ff9500;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }
}

/* Product Info Section */
.product-info {
  padding: 8px;
  position: relative;
}

/* Price Section - Bold and Prominent */
.price-section {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ff3b3b;
  line-height: 1;
}

.original-price {
  font-size: 0.875rem;
  color: #999;
  text-decoration: line-through;
  font-weight: 400;
}

/* Product Name - Compact */
.product-name {
  font-size: 0.8125rem;
  line-height: 1.3;
  color: #333;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.6em;
}

/* Stats Row - Shein/Temu Style */
.stats-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.icon-star {
  font-size: 0.875rem;
  color: #ffa500;
}

.stat-divider {
  color: #e0e0e0;
}

.sold-count {
  color: #999;
}

/* Quick Add Button - Floating bottom right */
.quick-add-btn {
  position: absolute;
  bottom: 6px;
  right: 6px;
  --padding-start: 8px;
  --padding-end: 8px;
  width: 32px;
  height: 32px;
  margin: 0;
  --background: #fff;
  --color: #333;
  --border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 3;
}

.quick-add-btn:not([disabled]) {
  --background: #ff3b3b;
  --background-activated: #e63333;
  --color: white;
}

.quick-add-btn ion-icon {
  font-size: 1.125rem;
}

.quick-add-btn:disabled {
  --background: #f5f5f5;
  --color: #ccc;
  opacity: 1;
}

/* Responsive */
@media (max-width: 576px) {
  .product-card {
    border-radius: 6px;
  }

  .current-price {
    font-size: 1.125rem;
  }

  .product-name {
    font-size: 0.75rem;
  }

  .stats-row {
    font-size: 0.6875rem;
  }

  .quick-add-btn {
    width: 28px;
    height: 28px;
    bottom: 4px;
    right: 4px;
  }

  .discount-badge,
  .stock-badge {
    font-size: 0.625rem;
    padding: 3px 6px;
  }
}

/* Touch feedback */
@media (hover: none) {
  .product-card:active {
    background: #fafafa;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .product-card {
    --background: #1a1a1a;
    border-color: #2a2a2a;
  }

  .image-container {
    background: #0a0a0a;
  }

  .product-name {
    color: #e0e0e0;
  }

  .stats-row {
    color: #999;
  }

  .quick-add-btn {
    --background: #2a2a2a;
    --color: #fff;
  }

  .quick-add-btn:not([disabled]) {
    --background: #ff3b3b;
  }
}
</style>
