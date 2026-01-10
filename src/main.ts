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
  .use(IonicVue, {
    experimentalCloseWatcher: true
  })
  .use(pinia)
  .use(router)


// app.mount('#app');

declare global {
  interface Window {
    pwaUpdateAvailable: boolean;
    pwaUpdateHandler: (() => void) | null;
    pwaDeferredPrompt: any;
  }
}

window.pwaUpdateAvailable = false;
window.pwaUpdateHandler = null;

// PWA Service Worker Update Handler
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // Registrar el service worker
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado con éxito:', registration.scope);

        // Verificar actualizaciones periódicamente
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Cada hora

        // Escuchar actualizaciones encontradas
        registration.addEventListener('updatefound', () => {
          console.log('🔄 Nueva versión del Service Worker encontrada...');
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🎯 Nueva versión disponible!');
                window.pwaUpdateAvailable = true;

                // Emitir evento personalizado para notificar a la app
                const event = new CustomEvent('pwaUpdateAvailable');
                window.dispatchEvent(event);
              }
            });
          }
        });

        // Manejar cambio de controller (nuevo service worker activado)
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            console.log('🔄 Nuevo Service Worker activado, recargando página...');
            window.location.reload();
          }
        });

      })
      .catch((error) => {
        console.error('❌ Error al registrar Service Worker:', error);
      });
  }
};

// Inicializar Service Worker
if (import.meta.env.PROD) {
  registerServiceWorker();
}

// Manejar evento de actualización de PWA
window.addEventListener('pwaUpdateAvailable', () => {
  console.log('📢 Nueva actualización disponible para la PWA');
  // Aquí puedes mostrar una notificación al usuario
});

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

app.mount('#app');

// Exportar función para verificar actualizaciones manualmente
export const checkForUpdates = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.update();
    });
  }
};

// Exportar función para activar actualización
export const activateUpdate = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        // Enviar mensaje al service worker waiting para que se active
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  }
};