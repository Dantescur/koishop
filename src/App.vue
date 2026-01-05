<template>
  <ion-app>
    <main-layout>
      <ion-router-outlet />
    </main-layout>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import MainLayout from './layouts/MainLayout.vue';
</script>
