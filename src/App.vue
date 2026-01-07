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
</script>
