import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/database.types";
import { alertController } from "@ionic/vue";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

type Product = Tables<'products'>
interface CartItem extends Product {
  quantity: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  // Getters
  const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0));
  const totalPrice = computed(() => items.value.reduce((acc, item) => acc + (item.price * item.quantity), 0));
  const totalWeight = computed(() => items.value.reduce((acc, item) => acc + ((item.weight_grams || 0) * item.quantity), 0));

  function addItem(product: Product) {
    const existing = items.value.find(i => i.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  }

  function removeItem(productId: string) {
    const index = items.value.findIndex(i => i.id === productId);
    if (index > -1) {
      if (items.value[index].quantity > 1) {
        items.value[index].quantity--;
      } else {
        items.value.splice(index, 1);
      }
    }
  }

  function removeItemCompletely(productId: string) {
    const index = items.value.findIndex(i => i.id === productId);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  }

  function decrementItem(productId: string) {
    const index = items.value.findIndex(i => i.id === productId);
    if (index > -1) {
      if (items.value[index].quantity > 1) {
        items.value[index].quantity--;
      } else {
        items.value.splice(index, 1);
      }
    }
  }

  function generateWhatsAppLink() {
    const phoneNumber = "5354149326";
    const intro = "¡Hola! Quisiera realizar el siguiente pedido en KoiSend:\n\n";

    const list = items.value.map(i =>
      `• ${i.name} (${i.quantity}x) - $${(i.price * i.quantity).toFixed(2)}`
    ).join('\n');

    const summary = `\n\n💰 *Total:* $${totalPrice.value.toFixed(2)}`;
    const weight = `\n⚖️ *Peso estimado:* ${totalWeight.value}g`;

    const message = encodeURIComponent(intro + list + summary + weight);
    return `https://wa.me/${phoneNumber}?text=${message}`;
  }

  async function importSharedItems(ids: string[]) {
    for (const id of ids) {
      // Fetch product data from Supabase by ID
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (data && !error) {
        addItem(data);
      }
    }
  }

  async function handleSharedCart(ids: string[]) {
    if (items.value.length > 0) {
      const alert = await alertController.create({
        header: 'Carrito Compartido',
        message: 'Ya tienes productos en tu carrito. ¿Qué prefieres hacer?',
        buttons: [
          {
            text: 'Combinar',
            handler: () => {
              importSharedItems(ids); // Add new ones to existing
            }
          },
          {
            text: 'Reemplazar',
            role: 'destructive',
            handler: () => {
              clearCart(); // Wipe existing
              importSharedItems(ids); // Add new ones
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
    } else {
      // If cart is empty, just import
      importSharedItems(ids);
    }
  }

  function clearCart() {
    items.value = []
  }

  return { items, totalItems, totalPrice, totalWeight, addItem, decrementItem, removeItemCompletely, removeItem, generateWhatsAppLink, handleSharedCart, importSharedItems, clearCart };
}, { persist: true });
