<script setup lang="ts">
import {
  IonPage,
  IonContent,
} from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';

import HeroSection from '@/components/home/HeroSection.vue';
import ServicesSection from '@/components/home/ServicesSection.vue';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection.vue';
import TrustIndicatorsSection from '@/components/home/TrustIndicatorsSection.vue';
import DownloadAppSection from '@/components/home/DownloadAppSection.vue';
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

const downloadApp = async () => {
  // const fileName = platform === 'android' ? 'koisend.apk' : 'koisend.ipa';
  window.open('https://voeofwcplfnplooqwhch.supabase.co/storage/v1/object/sign/apps/koisend.apk?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lYmZhN2JhNi1hYzZhLTRjOGUtYTlhNS0yNjM2YWRlOWQ2ZjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcHBzL2tvaXNlbmQuYXBrIiwiaWF0IjoxNzY4MDIxNDc0LCJleHAiOjE3OTk1NTc0NzR9.5ITm3czTaMaEjfOYeVGtokD9JsmxmeZMTcZS1-wimC4')
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

const openRemittanceWhatsApp = () => {
  const phoneNumber = "5354149326";
  const message = encodeURIComponent(
    "¡Hola! Quiero información sobre las remesas a Cuba 💰"
  );
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
};

onMounted(async () => {
  await fetchProducts()
});
</script>

<template>
  <ion-page>
    <ion-content>
      <HeroSection />

      <ServicesSection @topup-click="openTopUpWhatsApp" @remittance-click="openRemittanceWhatsApp" />

      <FeaturedProductsSection :products="products || []" @show-product-detail="showProductDetail"
        @add-to-cart="cart.addItem" />

      <TrustIndicatorsSection />

      <DownloadAppSection @download-app="downloadApp" />
    </ion-content>

    <ProductDetailModal @close="closeModal" :product="selectedProduct" :is-open="isModalOpen" />
  </ion-page>
</template>