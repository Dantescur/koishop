<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonGrid } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import { useCartStore } from '@/stores/cart';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';

const products = ref<Tables<'products'>[] | null>(null)
const cart = useCartStore()

const fetchProducts = async () => {
  const { data } = await supabase.from('products').select('*').is('deleted_at', null).eq('is_featured', true)
  products.value = data
}

onMounted(fetchProducts)

</script>

<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>KOISEND</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="p in products" :key="p.id">
            <ProductCard class="products-grid" :product="p" @add="cart.addItem(p)" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<style>
.products-grid {
  display: grid;
}

@media (min-width: 576px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 12px;
  }
}

@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    padding: 16px;
  }
}

@media (min-width: 1440px) {
  .products-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
