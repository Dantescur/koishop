<template>
  <ion-modal :expand-to-scroll="false" :is-open="isOpen" @didDismiss="handleClose" :initial-breakpoint="0.95"
    :breakpoints="[0, 0.5, 0.95]">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="handleClose">
            <ion-icon :icon="closeIcon" />
          </ion-button>
        </ion-buttons>
        <ion-title>Detalles del Producto</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="product" class="modal-content">
      <!-- Product Image Gallery -->
      <div class="image-section">
        <div class="main-image">
          <ion-img :src="product.image_url || '/placeholder-image.jpg'" :alt="product.name" />

          <!-- Badges -->
          <div v-if="isOutOfStock" class="badge sold-out-badge">
            AGOTADO
          </div>
          <div v-else-if="isLowStock" class="badge low-stock-badge">
            ¡ÚLTIMAS {{ product.stock_quantity }}!
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-details">
        <!-- Name & Price -->
        <div class="header-section">
          <h1 class="product-title">{{ product.name }}</h1>

          <div class="price-container">
            <div class="current-price">${{ product.price.toFixed(2) }}</div>
            <div v-if="hasDiscount" class="original-price">
              ${{ originalPrice.toFixed(2) }}
            </div>
          </div>
        </div>

        <!-- Stock Status -->
        <div class="status-section">
          <div class="stock-status" :class="stockStatusClass">
            <div class="stock-dot" :class="stockDotClass" />
            <span class="stock-text">{{ stockText }}</span>
          </div>

          <div v-if="product.weight_grams" class="weight-info">
            <ion-icon :icon="scaleOutline" />
            <span>{{ product.weight_grams }}g</span>
          </div>
        </div>

        <!-- Description -->
        <div v-if="product.description" class="description-section">
          <h2 class="section-title">Descripción</h2>
          <p class="description-text">{{ product.description }}</p>
        </div>

        <!-- Product Features/Details -->
        <div class="features-section">
          <h2 class="section-title">Características</h2>
          <ul class="features-list">
            <li>
              <ion-icon :icon="checkmarkCircleOutline" />
              <span>Envío asegurado a Cuba</span>
            </li>
            <li>
              <ion-icon :icon="checkmarkCircleOutline" />
              <span>Entrega en 1-2 días hábiles</span>
            </li>
            <li v-if="product.weight_grams">
              <ion-icon :icon="checkmarkCircleOutline" />
              <span>Peso: {{ product.weight_grams }}g</span>
            </li>
            <li>
              <ion-icon :icon="checkmarkCircleOutline" />
              <span>Producto garantizado</span>
            </li>
          </ul>
        </div>

        <!-- Shipping Info -->
        <div class="shipping-section">
          <ion-card class="info-card">
            <ion-card-content>
              <div class="info-header">
                <ion-icon :icon="airplaneOutline" />
                <h3>Información de Envío</h3>
              </div>
              <p class="info-text">
                Tu pedido será enviado directamente a Cuba. El tiempo estimado de entrega es de 1-2 días hábiles.
                Realizaremos seguimiento completo del envío.
              </p>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>

    <!-- Floating Action Bar -->
    <ion-footer v-if="product" class="modal-footer ion-safe-area-bottom">
      <div class="action-bar">
        <!-- Quantity Selector -->
        <div class="quantity-section">
          <label class="quantity-label">Cantidad</label>
          <div class="quantity-controls">
            <ion-button fill="clear" size="small" class="qty-btn" :disabled="quantity <= 1" @click="decrementQuantity">
              <ion-icon :icon="removeIcon" />
            </ion-button>

            <span class="quantity-display">{{ quantity }}</span>

            <ion-button fill="clear" size="small" class="qty-btn"
              :disabled="isOutOfStock || quantity >= product.stock_quantity" @click="incrementQuantity">
              <ion-icon :icon="addIcon" />
            </ion-button>
          </div>
        </div>

        <!-- Add to Cart Button -->
        <ion-button expand="block" size="large" class="add-cart-btn" :disabled="isOutOfStock" @click="handleAddToCart">
          <ion-icon slot="start" :icon="cartIcon" />
          {{ isOutOfStock ? 'Agotado' : `Agregar $${totalPrice.toFixed(2)}` }}
        </ion-button>
      </div>
    </ion-footer>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Tables } from '@/types/database.types';
import { useCartStore } from '@/stores/cart';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonFooter,
  IonIcon,
  IonImg,
  IonCard,
  IonCardContent,
  toastController
} from '@ionic/vue';
import {
  close,
  cart,
  add,
  remove,
  checkmarkCircleOutline,
  scaleOutline,
  airplaneOutline
} from 'ionicons/icons';
import { useHardwareBackButton } from '@/composables/useHardwareBackButton';

const props = defineProps<{
  isOpen: boolean;
  product: Tables<'products'> | null;
}>();

const emit = defineEmits<{
  'close': [];
}>();

const cartStore = useCartStore();
const quantity = ref(1);

// Icons
const closeIcon = close;
const cartIcon = cart;
const addIcon = add;
const removeIcon = remove;

// Computed
const isOutOfStock = computed(() =>
  props.product ? props.product.stock_quantity <= 0 : true
);

const isLowStock = computed(() =>
  props.product
    ? props.product.stock_quantity > 0 && props.product.stock_quantity <= 5
    : false
);

const hasDiscount = computed(() => false); // Add your discount logic
const originalPrice = computed(() =>
  props.product ? props.product.price * 1.25 : 0
);

const totalPrice = computed(() =>
  props.product ? props.product.price * quantity.value : 0
);

const stockStatusClass = computed(() => {
  if (isOutOfStock.value) return 'out-of-stock';
  if (isLowStock.value) return 'low-stock';
  return 'in-stock';
});

const stockDotClass = computed(() => {
  if (isOutOfStock.value) return 'out-of-stock';
  if (isLowStock.value) return 'low-stock';
  return 'in-stock';
});

const stockText = computed(() => {
  if (isOutOfStock.value) return 'Agotado';
  if (isLowStock.value) return `Solo ${props.product?.stock_quantity} disponibles`;
  return `${props.product?.stock_quantity} disponibles`;
});

// Methods
const handleClose = () => {
  quantity.value = 1;
  emit('close');
};

const incrementQuantity = () => {
  if (props.product && quantity.value < props.product.stock_quantity) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = async () => {
  if (!props.product || isOutOfStock.value) return;

  // Add items to cart
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem(props.product);
  }

  // Show success toast
  const toast = await toastController.create({
    message: `${quantity.value}x ${props.product.name} agregado al carrito`,
    duration: 2000,
    position: 'bottom',
    color: 'success',
    icon: checkmarkCircleOutline,
    cssClass: 'custom-toast'
  });
  await toast.present();

  // Haptic feedback
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }

  // Reset and close
  quantity.value = 1;
  handleClose();
};

// Reset quantity when modal opens/closes
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    quantity.value = 1;
  }
});


useHardwareBackButton(props.isOpen, handleClose, 101);

</script>

<style scoped>
/* === Modal Content === */
.modal-content {
  --background: var(--koi-neutral-50);
}

/* === Image Section === */
.image-section {
  position: relative;
  width: 100%;
  background: white;
  padding: var(--koi-space-4);
}

.main-image {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  aspect-ratio: 1;
  border-radius: var(--koi-radius-xl);
  overflow: hidden;
  background: var(--koi-neutral-100);
  box-shadow: var(--koi-shadow-lg);
}

.main-image ion-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* === Badges === */
.badge {
  position: absolute;
  top: var(--koi-space-3);
  right: var(--koi-space-3);
  padding: var(--koi-space-2) var(--koi-space-3);
  border-radius: var(--koi-radius-md);
  font-size: var(--koi-text-xs);
  font-weight: var(--koi-font-bold);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  z-index: 2;
  box-shadow: var(--koi-shadow-md);
}

.sold-out-badge {
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.low-stock-badge {
  background: var(--koi-warning);
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

/* === Product Details === */
.product-details {
  padding: var(--koi-space-5) var(--koi-space-4);
  padding-bottom: calc(140px + env(safe-area-inset-bottom));
}

/* === Header Section === */
.header-section {
  margin-bottom: var(--koi-space-4);
}

.product-title {
  font-size: var(--koi-text-2xl);
  font-weight: var(--koi-font-bold);
  color: var(--koi-neutral-900);
  margin: 0 0 var(--koi-space-3) 0;
  line-height: 1.3;
  font-family: var(--koi-font-display);
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: var(--koi-space-3);
}

.current-price {
  font-size: var(--koi-text-3xl);
  font-weight: var(--koi-font-extrabold);
  color: var(--ion-color-primary);
  line-height: 1;
}

.original-price {
  font-size: var(--koi-text-lg);
  color: var(--koi-neutral-400);
  text-decoration: line-through;
}

/* === Status Section === */
.status-section {
  display: flex;
  align-items: center;
  gap: var(--koi-space-4);
  padding: var(--koi-space-3);
  background: var(--koi-neutral-100);
  border-radius: var(--koi-radius-lg);
  margin-bottom: var(--koi-space-5);
}

.stock-status {
  display: flex;
  align-items: center;
  gap: var(--koi-space-2);
  flex: 1;
}

.stock-dot {
  width: 10px;
  height: 10px;
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
  font-size: var(--koi-text-sm);
  font-weight: var(--koi-font-semibold);
  color: var(--koi-neutral-700);
}

.weight-info {
  display: flex;
  align-items: center;
  gap: var(--koi-space-1);
  font-size: var(--koi-text-sm);
  color: var(--koi-neutral-600);
  font-weight: var(--koi-font-medium);
}

.weight-info ion-icon {
  font-size: 1.125rem;
}

/* === Description Section === */
.description-section,
.features-section,
.shipping-section {
  margin-bottom: var(--koi-space-5);
}

.section-title {
  font-size: var(--koi-text-lg);
  font-weight: var(--koi-font-bold);
  color: var(--koi-neutral-900);
  margin: 0 0 var(--koi-space-3) 0;
}

.description-text {
  font-size: var(--koi-text-base);
  line-height: 1.7;
  color: var(--koi-neutral-700);
  margin: 0;
  white-space: pre-line;
}

/* === Features List === */
.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--koi-space-3);
}

.features-list li {
  display: flex;
  align-items: center;
  gap: var(--koi-space-2);
  font-size: var(--koi-text-base);
  color: var(--koi-neutral-700);
}

.features-list ion-icon {
  font-size: 1.5rem;
  color: var(--koi-success);
  flex-shrink: 0;
}

/* === Info Card === */
.info-card {
  margin: 0;
  box-shadow: var(--koi-shadow-sm);
  border: 1px solid var(--koi-neutral-200);
}

.info-card ion-card-content {
  padding: var(--koi-space-4);
}

.info-header {
  display: flex;
  align-items: center;
  gap: var(--koi-space-2);
  margin-bottom: var(--koi-space-2);
}

.info-header ion-icon {
  font-size: 1.5rem;
  color: var(--ion-color-primary);
}

.info-header h3 {
  font-size: var(--koi-text-base);
  font-weight: var(--koi-font-semibold);
  color: var(--koi-neutral-900);
  margin: 0;
}

.info-text {
  font-size: var(--koi-text-sm);
  line-height: 1.6;
  color: var(--koi-neutral-600);
  margin: 0;
}

/* === Modal Footer === */
.modal-footer {
  background: white;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  padding: var(--koi-space-4);
  padding-bottom: calc(var(--koi-space-4) + env(safe-area-inset-bottom));
}

.action-bar {
  display: flex;
  gap: var(--koi-space-3);
  /* align-items: flex-end; */
}

/* === Quantity Section === */
.quantity-section {
  flex-shrink: 0;
}

.quantity-label {
  display: block;
  font-size: var(--koi-text-xs);
  font-weight: var(--koi-font-semibold);
  color: var(--koi-neutral-600);
  margin-bottom: var(--koi-space-1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: var(--koi-space-1);
  background: var(--koi-neutral-100);
  border-radius: var(--koi-radius-lg);
  padding: var(--koi-space-1);
}

.qty-btn {
  --padding-start: var(--koi-space-2);
  --padding-end: var(--koi-space-2);
  --color: var(--ion-color-primary);
  width: 32px;
  height: 32px;
  margin: 0;
}

.qty-btn[disabled] {
  --color: var(--koi-neutral-300);
}

.qty-btn ion-icon {
  font-size: 1.25rem;
}

.quantity-display {
  min-width: 40px;
  text-align: center;
  font-size: var(--koi-text-lg);
  font-weight: var(--koi-font-bold);
  color: var(--koi-neutral-900);
}

/* === Add to Cart Button === */
.add-cart-btn {
  flex: 1;
  --background: var(--ion-color-primary);
  --background-hover: var(--ion-color-primary-shade);
  --background-activated: var(--ion-color-primary-shade);
  --border-radius: var(--koi-radius-lg);
  --padding-top: var(--koi-space-4);
  --padding-bottom: var(--koi-space-4);
  font-weight: var(--koi-font-bold);
  font-size: var(--koi-text-base);
  text-transform: none;
  box-shadow: var(--koi-shadow-lg);
  min-height: 52px;
}

.add-cart-btn[disabled] {
  --background: var(--koi-neutral-300);
  --color: var(--koi-neutral-500);
  opacity: 1;
}

.add-cart-btn ion-icon {
  font-size: 1.5rem;
}

/* === Responsive === */
@media (max-width: 576px) {
  .image-section {
    padding: var(--koi-space-3);
  }

  .product-details {
    padding: var(--koi-space-4) var(--koi-space-3);
  }

  .product-title {
    font-size: var(--koi-text-xl);
  }

  .current-price {
    font-size: var(--koi-text-2xl);
  }

  .action-bar {
    flex-direction: column;
    gap: var(--koi-space-2);
  }

  .quantity-section {
    width: 100%;
  }

  .quantity-controls {
    justify-content: space-between;
  }
}

/* === Dark Mode === */
@media (prefers-color-scheme: dark) {
  .modal-content {
    --background: var(--koi-neutral-50);
  }

  .image-section {
    background: var(--koi-neutral-100);
  }

  .main-image {
    background: var(--koi-neutral-50);
  }

  .product-title,
  .section-title,
  .info-header h3 {
    color: var(--koi-neutral-900);
  }

  .description-text,
  .features-list li {
    color: var(--koi-neutral-600);
  }

  .status-section {
    background: var(--koi-neutral-100);
  }

  .stock-text {
    color: var(--koi-neutral-600);
  }

  .info-card {
    background: var(--koi-neutral-100);
    border-color: var(--koi-neutral-300);
  }

  .info-text {
    color: var(--koi-neutral-500);
  }

  .modal-footer {
    background: var(--koi-neutral-100);
  }

  .quantity-controls {
    background: var(--koi-neutral-200);
  }

  .quantity-display {
    color: var(--koi-neutral-900);
  }
}

/* === Animations === */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}
</style>
