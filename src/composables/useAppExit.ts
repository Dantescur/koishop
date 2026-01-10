// composables/useAppExit.ts
import { useBackButton } from '@ionic/vue';
import { App } from '@capacitor/app';
import { toastController } from '@ionic/vue';
import { ref } from 'vue';

export function useAppExitConfirmation() {
    const backButtonPressedOnce = ref(false);
    let toast: HTMLIonToastElement | null = null;

    useBackButton(-1, async (processNextHandler) => {
        const currentPath = window.location.pathname;
        const isOnMainTab = ['/home', '/catalog', '/cart'].includes(currentPath);

        // If on main tab and pressed once, show exit confirmation
        if (isOnMainTab) {
            if (!backButtonPressedOnce.value) {
                backButtonPressedOnce.value = true;

                toast = await toastController.create({
                    message: 'Presiona de nuevo para salir',
                    duration: 2000,
                    position: 'bottom',
                    color: 'medium'
                });
                await toast.present();

                // Reset after 2 seconds
                setTimeout(() => {
                    backButtonPressedOnce.value = false;
                }, 2000);

                return;
            } else {
                // Exit app on second press
                App.exitApp();
            }
        } else {
            processNextHandler();
        }
    });
}