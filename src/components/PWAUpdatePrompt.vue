<template>
    <div v-if="showUpdatePrompt" class="pwa-update-prompt">
        <div class="update-content">
            <div class="update-icon">🔄</div>
            <div class="update-text">
                <h3>¡Nueva versión disponible!</h3>
                <p>Hay una actualización de la aplicación lista para instalar.</p>
            </div>
            <div class="update-actions">
                <ion-button fill="clear" size="small" @click="dismissUpdate">
                    Más tarde
                </ion-button>
                <ion-button fill="solid" size="small" color="primary" @click="applyUpdate">
                    Actualizar ahora
                </ion-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { IonButton, toastController } from '@ionic/vue';

const showUpdatePrompt = ref(false);

// Verificar si hay una actualización disponible
const checkForUpdate = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
            if (registration.waiting) {
                showUpdatePrompt.value = true;
            }
        });
    }
};

// Aplicar la actualización
const applyUpdate = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.ready;

            if (registration.waiting) {
                // Enviar mensaje al service worker en espera
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });

                // Mostrar toast de confirmación
                const toast = await toastController.create({
                    message: 'Actualizando aplicación...',
                    duration: 2000,
                    position: 'bottom',
                    color: 'success'
                });
                await toast.present();

                showUpdatePrompt.value = false;

                // Recargar después de un breve delay
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        } catch (error) {
            console.error('Error aplicando actualización:', error);
        }
    }
};

// Posponer la actualización
const dismissUpdate = () => {
    showUpdatePrompt.value = false;

    // Volver a mostrar después de 24 horas
    setTimeout(() => {
        checkForUpdate();
    }, 24 * 60 * 60 * 1000);
};

// Escuchar eventos de actualización
const handleUpdateFound = () => {
    showUpdatePrompt.value = true;
};

onMounted(() => {
    // Verificar actualización al montar
    checkForUpdate();

    // Escuchar evento personalizado de actualización disponible
    window.addEventListener('pwaUpdateAvailable', handleUpdateFound);
});

onUnmounted(() => {
    window.removeEventListener('pwaUpdateAvailable', handleUpdateFound);
});
</script>

<style scoped>
.pwa-update-prompt {
    position: fixed;
    bottom: 80px;
    /* Por encima del bottom navigation */
    left: 0;
    right: 0;
    z-index: 1000;
    padding: var(--koi-space-4);
    animation: slideUp 0.3s ease-out;
}

.update-content {
    background: white;
    border-radius: var(--koi-radius-lg);
    padding: var(--koi-space-3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: var(--koi-space-3);
    border: 1px solid var(--koi-neutral-200);
}

.update-icon {
    font-size: 2rem;
    flex-shrink: 0;
}

.update-text {
    flex: 1;
}

.update-text h3 {
    font-size: var(--koi-text-base);
    font-weight: var(--koi-font-bold);
    color: var(--koi-neutral-900);
    margin: 0 0 var(--koi-space-1) 0;
}

.update-text p {
    font-size: var(--koi-text-sm);
    color: var(--koi-neutral-600);
    margin: 0;
}

.update-actions {
    display: flex;
    gap: var(--koi-space-2);
    flex-shrink: 0;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    .update-content {
        background: var(--koi-neutral-100);
        border-color: var(--koi-neutral-300);
    }

    .update-text h3 {
        color: var(--koi-neutral-900);
    }

    .update-text p {
        color: var(--koi-neutral-500);
    }
}

/* Animations */
@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Responsive */
@media (max-width: 576px) {
    .pwa-update-prompt {
        bottom: 70px;
        padding: var(--koi-space-3);
    }

    .update-content {
        flex-direction: column;
        text-align: center;
        gap: var(--koi-space-2);
    }

    .update-actions {
        width: 100%;
        justify-content: center;
    }
}
</style>