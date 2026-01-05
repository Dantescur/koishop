<template>
  <ion-page>
    <!-- <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Mi Carrito</ion-title>
      </ion-toolbar>
    </ion-header> -->

    <ion-content>
      <!-- Empty Cart State -->
      <div v-if="cart.items.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2 class="empty-title">Tu carrito está vacío</h2>
        <p class="empty-description">
          Explora nuestro catálogo y encuentra productos increíbles
        </p>
        <ion-button fill="solid" router-link="/catalog" class="browse-btn">
          Ver Catálogo
        </ion-button>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-content">
        <!-- Cart Items List -->
        <div class="cart-items-section">
          <div class="section-header">
            <h3 class="section-title">Productos ({{ cart.totalItems }})</h3>
            <ion-button fill="clear" size="small" color="danger" @click="clearCart">
              Limpiar todo
            </ion-button>
          </div>

          <div class="cart-items">
            <div v-for="item in cart.items" :key="item.id" class="cart-item">
              <!-- Product Image -->
              <div class="item-image">
                <ion-img :src="item.image_url || '/placeholder-image.jpg'" :alt="item.name" />
              </div>

              <!-- Product Info -->
              <div class="item-info">
                <h4 class="item-name">{{ item.name }}</h4>
                <p class="item-price">${{ item.price.toFixed(2) }} c/u</p>

                <!-- Quantity Controls -->
                <div class="quantity-controls">
                  <ion-button fill="clear" size="small" class="qty-btn" @click="cart.decrementItem(item.id)">
                    <ion-icon :icon="removeIcon" />
                  </ion-button>

                  <span class="quantity-display">{{ item.quantity }}</span>

                  <ion-button fill="clear" size="small" class="qty-btn" @click="cart.addItem(item)">
                    <ion-icon :icon="addIcon" />
                  </ion-button>
                </div>
              </div>

              <!-- Item Total & Remove -->
              <div class="item-actions">
                <div class="item-total">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </div>
                <ion-button fill="clear" size="small" color="danger" class="remove-btn"
                  @click="cart.removeItemCompletely(item.id)">
                  <ion-icon :icon="trashIcon" slot="icon-only" />
                </ion-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Cart Footer -->
    <ion-footer v-if="cart.items.length > 0" class="cart-footer">
      <div class="footer-content">
        <!-- Order Summary -->
        <div class="order-summary">
          <div class="summary-row">
            <span class="summary-label">Subtotal</span>
            <span class="summary-value">${{ cart.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Peso total</span>
            <span class="summary-value">{{ cart.totalWeight }}g</span>
          </div>
          <div class="summary-row total-row">
            <span class="summary-label">Total</span>
            <span class="summary-value">${{ cart.totalPrice.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Checkout Button -->
        <ion-button expand="block" size="large" class="checkout-btn" @click="openWhatsApp">
          <ion-icon slot="start" :icon="logoWhatsapp" />
          Pedir por WhatsApp
        </ion-button>

        <!-- Info Text -->
        <p class="footer-info">
          Serás redirigido a WhatsApp para completar tu pedido
        </p>
      </div>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import {
  logoWhatsapp,
  trash,
  add,
  remove
} from 'ionicons/icons';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonFooter,
  IonImg,
  alertController
} from '@ionic/vue';

const cart = useCartStore();

// Icons
const trashIcon = trash;
const addIcon = add;
const removeIcon = remove;

const openWhatsApp = () => {
  window.open(cart.generateWhatsAppLink(), '_blank');
};

const clearCart = async () => {
  const alert = await alertController.create({
    header: '¿Vaciar carrito?',
    message: 'Se eliminarán todos los productos del carrito.',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Vaciar',
        role: 'destructive',
        handler: () => {
          cart.items.forEach(item => {
            cart.removeItemCompletely(item.id);
          });
        }
      }
    ]
  });

  await alert.present();
};
</script>

<style scoped>
/* === Empty Cart State === */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: var(--koi-space-8);
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: var(--koi-space-4);
  opacity: 0.5;
}

.empty-title {
  font-size: var(--koi-text-2xl);
  font-weight: var(--koi-font-bold);
  color: var(--koi-neutral-900);
  margin: 0 0 var(--koi-space-2) 0;
}

.empty-description {
  font-size: var(--koi-text-base);
  color: var(--koi-neutral-500);
  margin: 0 0 var(--koi-space-6) 0;
  max-width: 300px;
}

.browse-btn {
  --border-radius: var(--koi-radius-full);
  --padding-start: var(--koi-space-8);
  --padding-end: var(--koi-space-8);
  font-weight: var(--koi-font-semibold);
}

/* === Cart Content === */
.cart-content {
  padding: var(--koi-space-4);
}

/* === Section Header === */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--koi-space-4);
}

.section-title {
  font-size: var(--koi-text-lg);
  font-weight: var(--koi-font-bold);
  color: var(--koi-neutral-900);
  margin: 0;
}

/* === Cart Items === */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--koi-space-3);
}

.cart-item {
  display: flex;
  gap: var(--koi-space-3);
  padding: var(--koi-space-3);
  background: white;
  border-radius: var(--koi-radius-lg);
  border: 1px solid var(--koi-neutral-200);
  box-shadow: var(--koi-shadow-sm);
  transition: all var(--koi-transition-base);
}

.cart-item:hover {
  box-shadow: var(--koi-shadow-md);
}

/* === Item Image === */
.item-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: var(--koi-radius-md);
  overflow: hidden;
  background: var(--koi-neutral-100);
}

.item-image ion-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* === Item Info === */
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--koi-space-1);
}

.item-name {
  font-size: var(--koi-text-base);
  font-weight: var(--koi-font-semibold);
  color: var(--koi-neutral-900);
  margin: 0;
  line-height: 1.3;
}

.item-price {
  font-size: var(--koi-text-sm);
  color: var(--koi-neutral-500);
  margin: 0;
}

/* === Quantity Controls === */
.quantity-controls {
  display: flex;
  align-items: center;
  gap: var(--koi-space-2);
  margin-top: auto;
}

.qty-btn {
  --padding-start: var(--koi-space-2);
  --padding-end: var(--koi-space-2);
  --color: var(--ion-color-primary);
  width: 32px;
  height: 32px;
  margin: 0;
}

.qty-btn ion-icon {
  font-size: 1.25rem;
}

.quantity-display {
  min-width: 32px;
  text-align: center;
  font-size: var(--koi-text-base);
  font-weight: var(--koi-font-semibold);
  color: var(--koi-neutral-900);
}

/* === Item Actions === */
.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.item-total {
  font-size: var(--koi-text-lg);
  font-weight: var(--koi-font-bold);
  color: var(--ion-color-primary);
}

.remove-btn {
  --padding-start: var(--koi-space-2);
  --padding-end: var(--koi-space-2);
  width: 32px;
  height: 32px;
  margin: 0;
}

/* === Cart Footer === */
.cart-footer {
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  padding-bottom: env(safe-area-inset-bottom);
}

.footer-content {
  padding: var(--koi-space-4);
}

/* === Order Summary === */
.order-summary {
  background: var(--koi-neutral-100);
  border-radius: var(--koi-radius-lg);
  padding: var(--koi-space-4);
  margin-bottom: var(--koi-space-4);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--koi-space-2) 0;
}

.summary-row:not(:last-child) {
  border-bottom: 1px solid var(--koi-neutral-200);
}

.summary-label {
  font-size: var(--koi-text-sm);
  color: var(--koi-neutral-600);
  font-weight: var(--koi-font-medium);
}

.summary-value {
  font-size: var(--koi-text-base);
  color: var(--koi-neutral-900);
  font-weight: var(--koi-font-semibold);
}

.total-row {
  padding-top: var(--koi-space-3);
  border-top: 2px solid var(--koi-neutral-300);
}

.total-row .summary-label,
.total-row .summary-value {
  font-size: var(--koi-text-lg);
  font-weight: var(--koi-font-bold);
  color: var(--koi-neutral-900);
}

/* === Checkout Button === */
.checkout-btn {
  --background: var(--koi-success);
  --background-hover: #059669;
  --background-activated: #047857;
  --border-radius: var(--koi-radius-lg);
  --padding-top: var(--koi-space-4);
  --padding-bottom: var(--koi-space-4);
  font-weight: var(--koi-font-bold);
  font-size: var(--koi-text-base);
  margin-bottom: var(--koi-space-2);
}

.checkout-btn ion-icon {
  font-size: 1.5rem;
}

/* === Footer Info === */
.footer-info {
  text-align: center;
  font-size: var(--koi-text-xs);
  color: var(--koi-neutral-500);
  margin: 0;
}

/* === Responsive === */
@media (max-width: 576px) {
  .cart-content {
    padding: var(--koi-space-3);
  }

  .cart-item {
    gap: var(--koi-space-2);
    padding: var(--koi-space-2);
  }

  .item-image {
    width: 70px;
    height: 70px;
  }

  .item-name {
    font-size: var(--koi-text-sm);
  }

  .item-total {
    font-size: var(--koi-text-base);
  }

  .empty-cart {
    padding: var(--koi-space-6);
  }

  .empty-icon {
    font-size: 4rem;
  }

  .empty-title {
    font-size: var(--koi-text-xl);
  }
}

/* === Dark Mode === */
@media (prefers-color-scheme: dark) {

  .empty-title,
  .section-title,
  .item-name {
    color: var(--koi-neutral-900);
  }

  .cart-item {
    background: var(--koi-neutral-100);
    border-color: var(--koi-neutral-300);
  }

  .item-image {
    background: var(--koi-neutral-50);
  }

  .order-summary {
    background: var(--koi-neutral-100);
  }

  .summary-row:not(:last-child) {
    border-bottom-color: var(--koi-neutral-300);
  }

  .total-row {
    border-top-color: var(--koi-neutral-400);
  }

  .summary-value,
  .total-row .summary-label,
  .total-row .summary-value,
  .quantity-display {
    color: var(--koi-neutral-900);
  }
}
</style>
