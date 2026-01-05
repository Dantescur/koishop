import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';
import piniaPLuginPersistedState from 'pinia-plugin-persistedstate'

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
// import '@ionic/vue/css/palettes/dark.class.css';
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

const pinia = createPinia()
pinia.use(piniaPLuginPersistedState)

const app = createApp(App)
  .use(IonicVue)
  .use(pinia)
  .use(router)


app.mount('#app');

// PWA Service Worker Auto-Update Handler
// The VitePWA plugin handles registration automatically
// This just provides user feedback when updates are available
if ('serviceWorker' in navigator) {
  // Listen for service worker updates
  navigator.serviceWorker.ready.then((registration) => {
    console.log('✅ Service Worker is ready');

    // Check for updates periodically (every hour)
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);
  });

  // Handle service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 New service worker activated, reloading page...');
    window.location.reload();
  });
}

// Log PWA installation status
window.addEventListener('load', () => {
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as any).standalone === true;

  if (isInstalled) {
    console.log('✅ App is running as installed PWA');
  } else {
    console.log('ℹ️ App is running in browser');
  }
});

// Handle app installation event
window.addEventListener('appinstalled', () => {
  console.log('🎉 App was successfully installed!');
});