<!-- ./src/components/RefresherComponent.vue - Actualizado -->
<template>
    <ion-refresher slot="fixed" @ionRefresh="handleRefreshTriggered" :pull-min="props.pullMin" :pull-max="props.pullMax"
        :disabled="props.disabled" class="custom-refresher">
        <ion-refresher-content :pulling-icon="pullingIcon" :pulling-text="pullingTextWithUpdate"
            :refreshing-spinner="props.refreshingSpinner" :refreshing-text="refreshingTextWithUpdate"
            class="custom-refresher-content" />
    </ion-refresher>
</template>

<script setup lang="ts">
import { IonRefresher, IonRefresherContent } from '@ionic/vue';
import { chevronDownCircleOutline, cloudDownloadOutline } from 'ionicons/icons';
import { ref, computed, onMounted } from 'vue';

interface Props {
    // Configuration props
    pullMin?: number;
    pullMax?: number;
    disabled?: boolean;

    // Text customization
    pullingText?: string;
    refreshingText?: string;

    // Icon customization
    pullingIcon?: string;
    refreshingSpinner?: 'bubbles' | 'circles' | 'circular' | 'crescent' | 'dots' | 'lines' | 'lines-sharp' | 'lines-sharp-small' | 'lines-small';

    // Callback when refresh is triggered
    onRefresh?: (complete: () => void) => void | Promise<void>;

    // Enable PWA update check
    checkForPwaUpdate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    pullMin: 60,
    pullMax: 200,
    disabled: false,
    pullingText: 'Tira para actualizar',
    refreshingText: 'Actualizando...',
    pullingIcon: chevronDownCircleOutline,
    refreshingSpinner: 'crescent',
    onRefresh: undefined,
    checkForPwaUpdate: true,
});

const emit = defineEmits<{
    'refresh': [completeCallback: () => void];
}>();

const pwaUpdateAvailable = ref(false);
const isCheckingUpdate = ref(false);

// Computed text with update indicator
const pullingTextWithUpdate = computed(() => {
    if (pwaUpdateAvailable.value) {
        return '¡Nueva versión disponible! Suelta para actualizar';
    }
    return props.pullingText;
});

const refreshingTextWithUpdate = computed(() => {
    if (pwaUpdateAvailable.value) {
        return 'Descargando actualización...';
    }
    return props.refreshingText;
});

// Check for PWA updates
const checkForPWAUpdate = async (): Promise<boolean> => {
    if (!props.checkForPwaUpdate || !('serviceWorker' in navigator)) {
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        return registration.waiting !== null;
    } catch (error) {
        console.error('Error checking for PWA update:', error);
        return false;
    }
};

// Apply PWA update
const applyPWAUpdate = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.ready;

            if (registration.waiting) {
                // Send skip waiting message
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });

                // Reload page after update
                return new Promise<void>((resolve) => {
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                        console.log('🔄 Controller changed, reloading page...');
                        resolve();
                    }, { once: true });
                });
            }
        } catch (error) {
            console.error('Error applying PWA update:', error);
            throw error;
        }
    }
};

const handleRefreshTriggered = async (event: CustomEvent) => {
    const complete = () => {
        if (event.target && typeof (event.target as any).complete === 'function') {
            (event.target as any).complete();
        }
    };

    // Check for PWA update first
    if (props.checkForPwaUpdate) {
        const hasUpdate = await checkForPWAUpdate();

        if (hasUpdate) {
            isCheckingUpdate.value = true;
            try {
                await applyPWAUpdate();

                // Update applied, reload the page
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

                return;
            } catch (error) {
                console.error('Failed to apply update:', error);
            } finally {
                isCheckingUpdate.value = false;
            }
        }
    }

    // If no PWA update or update failed, proceed with normal refresh
    if (props.onRefresh) {
        const result = props.onRefresh(complete);

        // Handle async callbacks
        if (result && typeof result.then === 'function') {
            result.finally(complete);
        }
    } else {
        // Otherwise, emit the event with the complete callback
        emit('refresh', complete);
    }
};

// Listen for update events
const handleUpdateAvailable = () => {
    pwaUpdateAvailable.value = true;
};

onMounted(() => {
    // Check for updates on mount
    if (props.checkForPwaUpdate) {
        checkForPWAUpdate().then(hasUpdate => {
            pwaUpdateAvailable.value = hasUpdate;
        });
    }

    // Listen for update events
    window.addEventListener('pwaUpdateAvailable', handleUpdateAvailable);
});

// Update pulling icon based on update availability
const pullingIcon = computed(() => {
    return pwaUpdateAvailable.value ? cloudDownloadOutline : props.pullingIcon;
});
</script>

<style scoped>
.custom-refresher {
    --color: var(--ion-color-primary);
}

.custom-refresher-content {
    --color: var(--ion-color-primary);
}

/* Style for update available state */
.custom-refresher.has-update {
    --color: var(--koi-warning);
}

.custom-refresher-content.has-update {
    --color: var(--koi-warning);
}

/* Optional: Add custom animations */
:deep(.refresher-pulling ion-icon) {
    animation: pulse 1.5s ease-in-out infinite;
}

:deep(.refresher-refreshing ion-spinner) {
    animation: spin 1s linear infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.7;
        transform: scale(1.1);
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Special animation for update available */
:deep(.refresher-pulling.has-update ion-icon) {
    animation: pulse-update 0.8s ease-in-out infinite;
}

@keyframes pulse-update {
    0% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }

    50% {
        opacity: 0.8;
        transform: scale(1.2) translateY(-2px);
    }

    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}
</style>