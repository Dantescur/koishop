<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar><ion-title>MI CARRITO</ion-title></ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="cart.items.length === 0" class="ion-padding ion-text-center">
        <ion-icon :icon="cartOutline" style="font-size: 64px; color: #ccc;"></ion-icon>
        <p>Tu carrito está vacío</p>
        <ion-button fill="outline" router-link="/tabs/tab2">Ver Catálogo</ion-button>
      </div>

      <ion-list v-else>
        <ion-item v-for="item in cart.items" :key="item.id">
          <ion-thumbnail slot="start">
            <img :src="item.image_url ?? ''" />
          </ion-thumbnail>
          <ion-label>
            <h2>{{ item.name }}</h2>
            <p>${{ item.price }} x {{ item.quantity }}</p>
          </ion-label>
          <ion-button slot="end" fill="clear" color="danger" @click="cart.removeItem(item.id)">
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer v-if="cart.items.length > 0" class="ion-padding">
      <div class="summary">
        <span>Total: <strong>${{ cart.totalPrice.toFixed(2) }}</strong></span>
        <span>Peso: {{ cart.totalWeight }}g</span>
      </div>
      <ion-button expand="block" color="success" class="whatsapp-btn" @click="openWhatsApp">
        <ion-icon slot="start" :icon="logoWhatsapp"></ion-icon>
        Pedir por WhatsApp
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { cartOutline, trashOutline, logoWhatsapp } from 'ionicons/icons';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonThumbnail, IonLabel, IonButton, IonIcon, IonFooter } from '@ionic/vue';

const cart = useCartStore();

const openWhatsApp = () => {
  window.open(cart.generateWhatsAppLink(), '_blank');
};
</script>

<style scoped>
.summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.whatsapp-btn {
  --border-radius: 12px;
  font-weight: bold;
}
</style>