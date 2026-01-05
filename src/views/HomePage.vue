<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonRow,
  IonCol,
  IonGrid,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/vue';
import { onMounted, ref } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import { useCartStore } from '@/stores/cart';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';
import {
  logoWhatsapp,
  phonePortraitOutline,
  flashOutline,
  checkmarkCircleOutline,
  arrowForwardOutline
} from 'ionicons/icons';
import ProductDetailModal from '@/components/ProductDetailModal.vue';

const products = ref<Tables<'products'>[] | null>(null);
const cart = useCartStore();

const isModalOpen = ref(false);
const selectedProduct = ref<Tables<'products'> | null>(null);


const showProductDetail = (product: Tables<'products'>) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => {
    selectedProduct.value = null;
  }, 300);
};

const fetchProducts = async () => {
  const { data } = await supabase
    .from('products')
    .select('*')
    .is('deleted_at', null)
    .eq('is_featured', true)
    .limit(6);
  products.value = data;
};

const openTopUpWhatsApp = () => {
  const phoneNumber = "5354149326";
  const message = encodeURIComponent(
    "¡Hola! Quiero información sobre las recargas a Cuba 📱"
  );
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
};

onMounted(fetchProducts);
</script>

<template>
  <ion-page>
    <ion-content>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <ion-icon :icon="flashOutline" />
            <span>Envíos Rápidos a Cuba</span>
          </div>
          <h1 class="hero-title">
            Conecta con Cuba<br />
            <span class="hero-highlight">de forma fácil</span>
          </h1>
          <p class="hero-description">
            Envía productos y recarga minutos desde cualquier lugar del mundo
          </p>
          <div class="hero-actions">
            <ion-button fill="solid" size="large" class="hero-btn primary" router-link="/catalog">
              Explorar Catálogo
              <ion-icon slot="end" :icon="arrowForwardOutline" />
            </ion-button>
          </div>
        </div>
        <div class="hero-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
        </div>
      </section>

      <!-- Top-up Service Banner -->
      <section class="topup-banner">
        <ion-card class="topup-card">
          <ion-card-content class="topup-content">
            <div class="topup-icon">
              <ion-icon :icon="phonePortraitOutline" />
            </div>
            <div class="topup-info">
              <h2 class="topup-title">Recargas a Cuba</h2>
              <p class="topup-description">
                Recarga de forma instantánea y segura
              </p>
              <ul class="topup-features">
                <li>
                  <ion-icon :icon="checkmarkCircleOutline" />
                  <span>Entrega inmediata</span>
                </li>
                <li>
                  <ion-icon :icon="checkmarkCircleOutline" />
                  <span>Mejores tarifas</span>
                </li>
                <li>
                  <ion-icon :icon="checkmarkCircleOutline" />
                  <span>100% seguro</span>
                </li>
              </ul>
            </div>
            <ion-button expand="block" size="large" class="topup-btn" @click="openTopUpWhatsApp">
              <ion-icon slot="start" :icon="logoWhatsapp" />
              Recargar Ahora
            </ion-button>
          </ion-card-content>
        </ion-card>
      </section>

      <!-- Featured Products Section -->
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
            <ion-col v-for="p in products" :key="p.id" size="6" size-sm="4" size-md="3" size-lg="2">
              <ProductCard @show-details="showProductDetail" :product="p" @add="cart.addItem(p)" />
            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- Show All Products CTA -->
        <div class="show-more">
          <ion-button expand="block" fill="outline" router-link="/catalog" class="show-more-btn">
            Ver Todo el Catálogo
          </ion-button>
        </div>
      </section>

      <!-- Trust Indicators -->
      <section class="trust-section">
        <div class="trust-items">
          <div class="trust-item">
            <div class="trust-icon">🚀</div>
            <h3>Envío Rápido</h3>
            <p>Entrega en 7-15 días</p>
          </div>
          <div class="trust-item">
            <div class="trust-icon">🔒</div>
            <h3>Pago Seguro</h3>
            <p>100% protegido</p>
          </div>
          <div class="trust-item">
            <div class="trust-icon">💬</div>
            <h3>Atención 24/7</h3>
            <p>Siempre disponibles</p>
          </div>
        </div>
      </section>
    </ion-content>
    <ProductDetailModal @close="closeModal" :product="selectedProduct" :is-open="isModalOpen" />
  </ion-page>
</template>

<style scoped>
/* === Hero Section === */
.hero-section {
  position: relative;
  padding: var(--koi-space-8) var(--koi-space-4);
  background: linear-gradient(135deg, #FFF5F5 0%, #FFF 50%, #FFF5F5 100%);
  overflow: hidden;
  min-height: 320px;
  display: flex;
  align-items: center;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--koi-space-1);
  padding: var(--koi-space-1) var(--koi-space-3);
  background: rgba(217, 4, 41, 0.1);
  color: var(--ion-color-primary);
  border-radius: var(--koi-radius-full);
  font-size: var(--koi-text-sm);
  font-weight: var(--koi-font-semibold);
  margin-bottom: var(--koi-space-4);
}

.hero-badge ion-icon {
  font-size: 1rem;
}

.hero-title {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: var(--koi-font-extrabold);
  line-height: 1.2;
  color: var(--koi-neutral-900);
  margin: 0 0 var(--koi-space-3) 0;
  font-family: var(--koi-font-display);
}

.hero-highlight {
  color: var(--ion-color-primary);
  display: block;
}

.hero-description {
  font-size: var(--koi-text-base);
  color: var(--koi-neutral-600);
  margin: 0 0 var(--koi-space-6) 0;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--koi-space-3);
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  --border-radius: var(--koi-radius-full);
  --padding-start: var(--koi-space-6);
  --padding-end: var(--koi-space-6);
  font-weight: var(--koi-font-semibold);
  text-transform: none;
  box-shadow: var(--koi-shadow-lg);
}

.hero-btn.primary {
  --background: var(--ion-color-primary);
}

/* Hero Decoration */
.hero-decoration {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(217, 4, 41, 0.05);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -100px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -50px;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 10%;
  opacity: 0.5;
}

/* === Top-up Banner === */
.topup-banner {
  padding: var(--koi-space-4);
  padding-top: 0;
}

.topup-card {
  margin: 0;
  box-shadow: var(--koi-shadow-xl);
  border: 1px solid var(--koi-neutral-200);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  overflow: hidden;
  position: relative;
}

.topup-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.topup-content {
  padding: var(--koi-space-6);
  position: relative;
  z-index: 2;
}

.topup-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--koi-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--koi-space-4);
  backdrop-filter: blur(10px);
}

.topup-icon ion-icon {
  font-size: 2rem;
  color: white;
}

.topup-info {
  margin-bottom: var(--koi-space-5);
}

.topup-title {
  font-size: var(--koi-text-2xl);
  font-weight: var(--koi-font-bold);
  color: white;
  margin: 0 0 var(--koi-space-2) 0;
  font-family: var(--koi-font-display);
}

.topup-description {
  font-size: var(--koi-text-base);
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 var(--koi-space-4) 0;
  line-height: 1.5;
}

.topup-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--koi-space-2);
}

.topup-features li {
  display: flex;
  align-items: center;
  gap: var(--koi-space-2);
  color: white;
  font-size: var(--koi-text-sm);
  font-weight: var(--koi-font-medium);
}

.topup-features ion-icon {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
}

.topup-btn {
  --background: white;
  --color: #059669;
  --border-radius: var(--koi-radius-lg);
  --padding-top: var(--koi-space-4);
  --padding-bottom: var(--koi-space-4);
  font-weight: var(--koi-font-bold);
  text-transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.topup-btn ion-icon {
  font-size: 1.5rem;
}

/* === Featured Section === */
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

/* === Trust Section === */
.trust-section {
  padding: var(--koi-space-8) var(--koi-space-4);
  background: var(--koi-neutral-100);
}

.trust-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--koi-space-5);
  max-width: 900px;
  margin: 0 auto;
}

.trust-item {
  text-align: center;
}

.trust-icon {
  font-size: 3rem;
  margin-bottom: var(--koi-space-3);
}

.trust-item h3 {
  font-size: var(--koi-text-base);
  font-weight: var(--koi-font-bold);
  color: var(--koi-neutral-900);
  margin: 0 0 var(--koi-space-1) 0;
}

.trust-item p {
  font-size: var(--koi-text-sm);
  color: var(--koi-neutral-600);
  margin: 0;
}

/* === Responsive === */
@media (max-width: 768px) {
  .hero-section {
    padding: var(--koi-space-6) var(--koi-space-4);
    min-height: 280px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .view-all-btn {
    align-self: flex-start;
  }

  .topup-content {
    padding: var(--koi-space-4);
  }

  .topup-features {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .trust-items {
    grid-template-columns: 1fr;
    gap: var(--koi-space-4);
  }

  .circle-1 {
    width: 200px;
    height: 200px;
    top: -100px;
    right: -50px;
  }

  .circle-2 {
    width: 150px;
    height: 150px;
  }

  .circle-3 {
    display: none;
  }
}

@media (max-width: 576px) {
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero-btn {
    width: 100%;
  }

  .featured-grid {
    --ion-grid-column-padding: var(--koi-space-1);
  }
}

/* === Dark Mode === */
@media (prefers-color-scheme: dark) {
  .hero-section {
    background: linear-gradient(135deg, #1a0a0a 0%, var(--koi-neutral-50) 50%, #1a0a0a 100%);
  }

  .hero-title,
  .section-title,
  .trust-item h3 {
    color: var(--koi-neutral-900);
  }

  .hero-description,
  .section-subtitle,
  .trust-item p {
    color: var(--koi-neutral-500);
  }

  .topup-card {
    border-color: var(--koi-neutral-300);
  }

  .trust-section {
    background: var(--koi-neutral-100);
  }

  .decoration-circle {
    background: rgba(217, 4, 41, 0.08);
  }
}
</style>
