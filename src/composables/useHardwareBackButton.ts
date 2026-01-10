import { useBackButton, UseBackButtonResult, useIonRouter } from '@ionic/vue';
import { onUnmounted } from 'vue';

/**
 * Hook for handling hardware back button in modals
 * @param isOpen - Whether the modal is open
 * @param onClose - Function to call when back button is pressed
 * @param priority - Priority (default 101, higher than Ionic's overlay priority of 100)
 */
export function useHardwareBackButton(
  isOpen: boolean,
  onClose: () => void,
  priority: number = 101
) {
  let unregisterHandler: UseBackButtonResult | undefined

  const registerHandler = () => {
    if (isOpen && !unregisterHandler) {
      unregisterHandler = useBackButton(priority, () => {
        onClose();
      });
    }
  };

  const unregister = () => {
    if (unregisterHandler) {
      unregisterHandler;
      unregisterHandler = undefined;
    }
  };

  // Auto-register/unregister based on isOpen changes
  if (isOpen) {
    registerHandler();
  } else {
    unregister();
  }

  onUnmounted(unregister);

  return { unregister };
}

/**
 * Hook for main navigation back button handling
 * Should be used in the main layout component
 */
export function useNavigationBackButton() {
  const ionRouter = useIonRouter();

  useBackButton(0, (processNextHandler) => {
    // Only navigate back if we're not on a main tab page
    const currentPath = window.location.pathname;
    const isOnMainTab = ['/home', '/catalog', '/cart'].includes(currentPath);

    if (!isOnMainTab && ionRouter.canGoBack()) {
      ionRouter.back();
    } else {
      // Let other handlers (like modals) process the event
      processNextHandler();
    }
  });
}
