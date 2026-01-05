<template>
  <ion-alert v-if="showInstallPrompt" :is-open="showInstallPrompt" header="Instalar KOISEND"
    message="Instala nuestra app para una mejor experiencia y acceso offline." :buttons="alertButtons"
    @didDismiss="showInstallPrompt = false">
  </ion-alert>

  <!-- Floating install button -->
  <div v-if="showInstallButton" class="install-fab">
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="showInstallPrompt = true">
        <ion-icon :icon="downloadOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  IonAlert,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/vue'
import { downloadOutline } from 'ionicons/icons'

const showInstallPrompt = ref(false)
const showInstallButton = ref(false)
let deferredPrompt: any = null

const alertButtons = [
  {
    text: 'Cancelar',
    role: 'cancel',
    handler: () => {
      console.log('Install cancelled')
    }
  },
  {
    text: 'Instalar',
    role: 'confirm',
    handler: async () => {
      await installPWA()
    }
  }
]

const handleBeforeInstallPrompt = (e: Event) => {
  console.log('✅ beforeinstallprompt event fired')

  // Prevent the default browser install prompt
  e.preventDefault()

  // Store the event for later use
  deferredPrompt = e

  // Show our install button
  showInstallButton.value = true

  // Optionally show the prompt automatically
  // setTimeout(() => {
  //   showInstallPrompt.value = true
  // }, 3000)
}

const handleAppInstalled = () => {
  console.log('🎉 App was installed')
  showInstallButton.value = false
  showInstallPrompt.value = false
  deferredPrompt = null

  // Clear any stored install prompt
  localStorage.removeItem('pwaInstallDismissed')
}

const installPWA = async () => {
  if (!deferredPrompt) return

  try {
    // Show the browser's install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response: ${outcome}`)

    if (outcome === 'accepted') {
      console.log('User accepted the install')
    } else {
      console.log('User dismissed the install')
      // Store dismissal to not show again for a while
      localStorage.setItem('pwaInstallDismissed', Date.now().toString())
    }

    // Clear the deferredPrompt
    deferredPrompt = null
    showInstallButton.value = false
    showInstallPrompt.value = false
  } catch (error) {
    console.error('Error during install:', error)
  }
}

const checkIfAppIsInstalled = () => {
  // Check various installation indicators
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const isFullscreen = (window.navigator as any).standalone === true
  const isInstalled = isStandalone || isFullscreen

  console.log('App installed check:', { isStandalone, isFullscreen, isInstalled })
  return isInstalled
}

const shouldShowInstallButton = () => {
  // Don't show if already installed
  if (checkIfAppIsInstalled()) return false

  // Check if user recently dismissed
  const dismissedTime = localStorage.getItem('pwaInstallDismissed')
  if (dismissedTime) {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    if (parseInt(dismissedTime) > oneWeekAgo) {
      return false
    }
  }

  return true
}

onMounted(() => {
  // Add event listeners
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)

  // Check initial state
  if (shouldShowInstallButton() && !deferredPrompt) {
    // If we missed the event, show button anyway after delay
    setTimeout(() => {
      showInstallButton.value = true
    }, 5000)
  }
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<style scoped>
.install-fab {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 9999;
}

/* Animation for the install button */
.install-fab ion-fab-button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(217, 4, 41, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(217, 4, 41, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(217, 4, 41, 0);
  }
}
</style>
