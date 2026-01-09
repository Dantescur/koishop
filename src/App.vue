<template>
  <ion-app>
    <main-layout>
      <ion-router-outlet />
    </main-layout>
    <p-w-a-update-prompt></p-w-a-update-prompt>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import MainLayout from './layouts/MainLayout.vue';
import PWAUpdatePrompt from './components/PWAUpdatePrompt.vue';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { onMounted } from 'vue';
import { useCartStore } from './stores/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore()
const router = useRouter()

onMounted(() => {
  App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    const url = new URL(event.url.replace('koisend://', 'https://'))
    const path = url.pathname
    const params = url.searchParams

    if (path === '/cart' && params.has('items')) {
      const ids = params.get('items')?.split(',') || []
      cartStore.handleSharedCart(ids)
    }

    router.push(path)
  })
})
</script>
