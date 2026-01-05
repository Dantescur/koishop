<template>
  <ion-app>
    <main-layout>
      <p-w-a-install-prompt />
      <ion-router-outlet />
    </main-layout>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import MainLayout from './layouts/MainLayout.vue';
import PWAInstallPrompt from './components/PWAInstallPrompt.vue';
</script>
