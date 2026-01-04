<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard.vue';
import { useCartStore } from '@/stores/cart';
import { Tables } from '@/types/database.types';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonSegment, IonSegmentButton, IonLabel, IonContent, IonRow, IonCol, IonGrid } from '@ionic/vue';

const categories = ref<Tables<'categories'>[]>([]);
const products = ref<Tables<'products'>[] | null>(null)
const selectedSlug = ref('all');
const cart = useCartStore();

const fetchData = async () => {
  // 1. Get Categories
  const { data: catData } = await supabase.from('categories').select('*').is('deleted_at', null);
  categories.value = catData || [];

  // 2. Get Products based on selection
  let query = supabase.from('products').select('*').is('deleted_at', null);

  if (selectedSlug.value !== 'all') {
    const catId = categories.value.find(c => c.slug === selectedSlug.value)?.id;
    if (catId) {
      query = query.eq('category_id', catId);
    }
  }

  const { data: prodData } = await query;
  products.value = prodData || [];
};

onMounted(fetchData);
watch(selectedSlug, fetchData);
</script>

<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>CATÁLOGO</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="selectedSlug" scrollable mode="md">
          <ion-segment-button value="all">
            <ion-label>Todos</ion-label>
          </ion-segment-button>
          <ion-segment-button v-for="cat in categories" :key="cat.id" :value="cat.slug">
            <ion-label>{{ cat.name }}</ion-label>
          </ion-segment-button>
        </ion-segment>
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