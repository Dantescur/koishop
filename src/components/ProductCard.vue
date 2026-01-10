<template>
  <ion-card class="product-card" @click="handleCardClick">
    <!-- Image Section with Thumbnail -->
    <div class="image-container">
      <ion-thumbnail class="product-thumbnail">
        <ion-img :src="imageSrc" :alt="product.name" loading="lazy" @ionError="handleImageError"
          class="thumbnail-image" />

        <!-- Image Overlay for Badges -->
        <div class="badge-container">
          <!-- Discount Badge -->
          <div v-if="hasDiscount" class="badge discount-badge">
            -{{ discountPercent }}%
          </div>

          <!-- Stock Status -->
          <div v-if="isOutOfStock" class="badge stock-badge sold-out">
            AGOTADO
          </div>
          <div v-else-if="isLowStock" class="badge stock-badge low-stock">
            ¡ÚLTIMAS {{ product.stock_quantity }}!
          </div>
        </div>

        <!-- Hover Overlay -->
        <div class="hover-overlay">
          <ion-button class="view-details-btn" size="small" fill="solid" @click.stop="handleCardClick">
            Ver Detalles
          </ion-button>
        </div>
      </ion-thumbnail>
    </div>

    <!-- Product Info -->
    <div class="product-info">
      <!-- Price Section -->
      <div class="price-section">
        <div class="current-price">${{ formatPrice(product.price) }}</div>
        <div v-if="hasDiscount" class="original-price">
          ${{ formatPrice(originalPrice) }}
        </div>
      </div>

      <!-- Product Name -->
      <h3 class="product-name">{{ product.name }}</h3>

      <!-- Product Description (if available) -->
      <p v-if="product.description" class="product-description">
        {{ truncateText(product.description, 60) }}
      </p>

      <!-- Action Row -->
      <div class="action-row">
        <!-- Stock Indicator -->
        <div class="stock-indicator">
          <div class="stock-dot" :class="stockDotClass" />
          <span class="stock-text">{{ stockText }}</span>
        </div>

        <!-- Add to Cart Button -->
        <ion-button class="add-to-cart-btn" size="small" :disabled="isOutOfStock" @click.stop="handleAddToCart">
          <ion-icon slot="icon-only" :icon="isOutOfStock ? closeCircleIcon : cartIcon" />
        </ion-button>
      </div>
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
  IonImg,
  IonThumbnail
} from '@ionic/vue';
import { cart, closeCircle } from 'ionicons/icons';

const props = defineProps<{
  product: Tables<'products'>
}>();

const emit = defineEmits<{
  'show-details': [product: Tables<'products'>]
}>();

const cartStore = useCartStore();

const imageSrc = ref(props.product.image_url || '/placeholder-image.jpg')

// Icons
const cartIcon = cart;
const closeCircleIcon = closeCircle;

// Computed
const isOutOfStock = computed(() => props.product.stock_quantity <= 0);
const isLowStock = computed(() =>
  props.product.stock_quantity > 0 && props.product.stock_quantity <= 5
);

const hasDiscount = computed(() => false); // Add your discount logic
const discountPercent = computed(() => 25);
const originalPrice = computed(() => props.product.price * 1.25);

const stockDotClass = computed(() => {
  if (isOutOfStock.value) return 'out-of-stock';
  if (isLowStock.value) return 'low-stock';
  return 'in-stock';
});

const stockText = computed(() => {
  if (isOutOfStock.value) return 'Agotado';
  if (isLowStock.value) return 'Pocas unidades';
  return 'Disponible';
});

// Methods
const formatPrice = (price: number) => {
  return price.toFixed(2);
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const handleImageError = () => {
  imageSrc.value = '/placeholder-image.jpg';
};

const handleAddToCart = (event: Event) => {
  event.stopPropagation()
  if (isOutOfStock.value) return;

  cartStore.addItem(props.product);

  // Haptic feedback
  if ('vibrate' in navigator) {
    navigator.vibrate(30);
  }
};

const handleCardClick = () => {
  emit('show-details', props.product);
};
</script>

<style scoped>
/* === Card Container === */
.product-card {
  --background: #fff;
  position: relative;
  border-radius: var(--koi-radius-lg);
  overflow: hidden;
  margin: 0;
  padding: 0;
  cursor: pointer;
  transition: all var(--koi-transition-base);
  border: 1px solid var(--koi-neutral-200);
  box-shadow: var(--koi-shadow-sm);
  display: flex;
  flex-direction: column;
  min-height: 350px;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--koi-shadow-lg);
  border-color: var(--koi-neutral-300);
}

.product-card:active {
  transform: translateY(0) scale(0.99);
}

/* === Thumbnail Container === */
.image-container {
  width: 100%;
  background: var(--koi-neutral-100);
}

.product-thumbnail {
  --size: 100%;
  --border-radius: 0;
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  /* Creates square aspect ratio */
  display: block;
  overflow: hidden;
}

.thumbnail-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--koi-transition-slow);
}

.product-card:hover .thumbnail-image {
  transform: scale(1.05);
}

/* === Badge Container === */
.badge-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* === Badges === */
.badge {
  position: absolute;
  z-index: var(--koi-z-dropdown);
  padding: var(--koi-space-1) var(--koi-space-2);
  border-radius: var(--koi-radius-sm);
  font-size: var(--koi-text-xs);
  font-weight: var(--koi-font-bold);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: var(--koi-shadow-md);
  pointer-events: none;
}

.discount-badge {
  top: var(--koi-space-2);
  left: var(--koi-space-2);
  background: var(--koi-danger);
  color: white;
}

.stock-badge {
  top: var(--koi-space-2);
  right: var(--koi-space-2);
  font-size: 10px;
  padding: var(--koi-space-1) var(--koi-space-2);
}

.stock-badge.sold-out {
  background: rgba(0, 0, 0, 0.75);
  color: white;
}

.stock-badge.low-stock {
  background: var(--koi-warning);
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

/* === Hover Overlay === */
.hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--koi-transition-base);
  backdrop-filter: blur(2px);
  pointer-events: none;
}

.product-card:hover .hover-overlay {
  opacity: 1;
}

.view-details-btn {
  --background: white;
  --color: var(--ion-color-primary);
  --border-radius: var(--koi-radius-full);
  --padding-start: var(--koi-space-5);
  --padding-end: var(--koi-space-5);
  font-weight: var(--koi-font-semibold);
  font-size: var(--koi-text-sm);
  text-transform: none;
  letter-spacing: 0.01em;
  box-shadow: var(--koi-shadow-lg);
  transform: translateY(10px);
  transition: all var(--koi-transition-base);
  pointer-events: auto;
}

.product-card:hover .view-details-btn {
  transform: translateY(0);
}

/* === Product Info === */
.product-info {
  padding: var(--koi-space-3);
  background: white;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* === Price Section === */
.price-section {
  display: flex;
  align-items: baseline;
  gap: var(--koi-space-2);
  margin-bottom: var(--koi-space-2);
}

.current-price {
  font-size: var(--koi-text-xl);
  font-weight: var(--koi-font-bold);
  color: var(--ion-color-primary);
  line-height: 1;
}

.original-price {
  font-size: var(--koi-text-sm);
  color: var(--koi-neutral-400);
  text-decoration: line-through;
  font-weight: var(--koi-font-normal);
}

/* === Product Name === */
.product-name {
  font-size: var(--koi-text-sm);
  font-weight: var(--koi-font-semibold);
  line-height: 1.4;
  color: var(--koi-neutral-900);
  margin: 0 0 var(--koi-space-2) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
  flex: 0 0 auto;
}

/* === Product Description === */
.product-description {
  font-size: var(--koi-text-xs);
  line-height: 1.4;
  color: var(--koi-neutral-500);
  margin: 0 0 var(--koi-space-3) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

/* === Action Row === */
.action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--koi-space-2);
  border-top: 1px solid var(--koi-neutral-200);
  margin-top: auto;
  flex: 0 0 auto;
}

/* === Stock Indicator === */
.stock-indicator {
  display: flex;
  align-items: center;
  gap: var(--koi-space-1);
}

.stock-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.stock-dot.in-stock {
  background: var(--koi-success);
}

.stock-dot.low-stock {
  background: var(--koi-warning);
}

.stock-dot.out-of-stock {
  background: var(--koi-neutral-400);
}

.stock-text {
  font-size: var(--koi-text-xs);
  color: var(--koi-neutral-600);
  font-weight: var(--koi-font-medium);
}

/* === Add to Cart Button === */
.add-to-cart-btn {
  --background: var(--ion-color-primary);
  --background-hover: var(--ion-color-primary-shade);
  --background-activated: var(--ion-color-primary-shade);
  --color: white;
  --border-radius: 50%;
  --padding-start: 0;
  --padding-end: 0;
  width: 36px;
  height: 36px;
  margin: 0;
  box-shadow: var(--koi-shadow-md);
  transition: all var(--koi-transition-base);
}

.add-to-cart-btn:not([disabled]):hover {
  transform: scale(1.1);
  box-shadow: var(--koi-shadow-lg);
}

.add-to-cart-btn:not([disabled]):active {
  transform: scale(0.95);
}

.add-to-cart-btn ion-icon {
  font-size: 1.25rem;
}

.add-to-cart-btn[disabled] {
  --background: var(--koi-neutral-200);
  --color: var(--koi-neutral-400);
  opacity: 1;
}


.thumbnail-image.loaded::before {
  display: none;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* === Responsive === */
@media (max-width: 576px) {
  .product-info {
    padding: var(--koi-space-2);
  }

  .current-price {
    font-size: var(--koi-text-lg);
  }

  .product-name {
    font-size: var(--koi-text-xs);
  }

  .add-to-cart-btn {
    width: 32px;
    height: 32px;
  }

  .badge {
    font-size: 9px;
    padding: 2px 6px;
  }

  .product-thumbnail {
    --border-radius: var(--koi-radius-lg) var(--koi-radius-lg) 0 0;
  }
}

/* === Grid Layout Optimization === */
@media (min-width: 577px) and (max-width: 768px) {
  .product-thumbnail {
    --border-radius: var(--koi-radius-lg) var(--koi-radius-lg) 0 0;
  }

  .current-price {
    font-size: var(--koi-text-lg);
  }
}

@media (min-width: 769px) {
  .product-thumbnail {
    --border-radius: var(--koi-radius-lg) var(--koi-radius-lg) 0 0;
  }
}

/* === Dark Mode === */
@media (prefers-color-scheme: dark) {
  .product-card {
    --background: var(--koi-neutral-100);
    border-color: var(--koi-neutral-300);
  }

  .image-container {
    background: var(--koi-neutral-50);
  }

  .product-info {
    background: var(--koi-neutral-100);
  }

  .product-name {
    color: var(--koi-neutral-900);
  }

  .product-description {
    color: var(--koi-neutral-500);
  }

  .action-row {
    border-top-color: var(--koi-neutral-300);
  }

  .stock-text {
    color: var(--koi-neutral-500);
  }

  .view-details-btn {
    --background: var(--koi-neutral-100);
    --color: var(--ion-color-primary);
  }

  .thumbnail-image::before {
    background: linear-gradient(90deg,
        var(--koi-neutral-200) 0%,
        var(--koi-neutral-300) 50%,
        var(--koi-neutral-200) 100%);
  }
}

/* === Touch Devices === */
@media (hover: none) {
  .product-card:hover {
    transform: none;
  }

  .hover-overlay {
    display: none;
  }

  .product-thumbnail {
    --border-radius: var(--koi-radius-lg) var(--koi-radius-lg) 0 0;
  }
}

/* === High DPI Screens === */
@media (-webkit-min-device-pixel-ratio: 2),
(min-resolution: 192dpi) {
  .thumbnail-image {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* === Reduced Motion === */
@media (prefers-reduced-motion: reduce) {

  .product-card,
  .thumbnail-image,
  .view-details-btn,
  .add-to-cart-btn {
    transition: none;
  }

  .stock-badge.low-stock {
    animation: none;
  }

  .thumbnail-image::before {
    animation: none;
  }
}
</style>