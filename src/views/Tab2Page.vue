<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard.vue';
import { useCartStore } from '@/stores/cart';
import { Tables } from '@/types/database.types';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonSearchbar
} from '@ionic/vue';
import ProductDetailModal from '@/components/ProductDetailModal.vue';

const categories = ref<Tables<'categories'>[]>([]);
const products = ref<Tables<'products'>[] | null>(null);
const selectedSlug = ref('all');
const cart = useCartStore();
const isLoading = ref(true);
const searchQuery = ref('');

const isModalOpen = ref(false)
const selectedProduct = ref<Tables<'products'> | null>(null);

// Function to normalize text (remove accents)
const normalizeText = (text: string): string => {
  if (!text) return '';

  return text
    .toLowerCase()
    .normalize('NFD')                          // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '')           // Remove combining diacritical marks
    .replace(/ñ/g, 'n')                        // Handle Spanish ñ separately
    .replace(/ç/g, 'c')                        // Handle ç
    .trim();
};

const filteredProducts = computed(() => {
  if (!products.value) return [];
  if (!searchQuery.value.trim()) return products.value;

  // Normalize the search query
  const normalizedQuery = normalizeText(searchQuery.value);

  return products.value.filter(p => {
    // Normalize product name and description
    const normalizedName = normalizeText(p.name);
    const normalizedDescription = p.description
      ? normalizeText(p.description)
      : '';

    // Check if normalized text includes the normalized query
    return normalizedName.includes(normalizedQuery) ||
      normalizedDescription.includes(normalizedQuery);
  });
});

const fetchData = async () => {
  isLoading.value = true;

  try {
    // Get Categories
    const { data: catData } = await supabase
      .from('categories')
      .select('*')
      .is('deleted_at', null)
      .order('name');
    categories.value = catData || [];

    // Get Products based on selection
    let query = supabase
      .from('products')
      .select('*')
      .is('deleted_at', null);

    if (selectedSlug.value !== 'all') {
      const catId = categories.value.find(c => c.slug === selectedSlug.value)?.id;
      if (catId) {
        query = query.eq('category_id', catId);
      }
    }

    const { data: prodData } = await query.order('name');
    products.value = prodData || [];
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
};

const showProductDetail = (product: Tables<'products'>) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => {
    selectedProduct.value = null;
  }, 300);
};

// Optional: Add debounced search
const handleSearchInput = (event: any) => {
  searchQuery.value = event.target.value || '';
};

onMounted(fetchData);
watch(selectedSlug, fetchData);
</script>

<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Catálogo</ion-title>
      </ion-toolbar>

      <!-- Category Filter -->
      <ion-toolbar>
        <ion-segment v-model="selectedSlug" scrollable mode="md" class="category-segment">
          <ion-segment-button value="all">
            <ion-label>Todos</ion-label>
          </ion-segment-button>
          <ion-segment-button v-for="cat in categories" :key="cat.id" :value="cat.slug">
            <ion-label>{{ cat.name }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>

      <!-- Search Bar with improved properties -->
      <ion-toolbar>
        <ion-searchbar v-model="searchQuery" @ionInput="handleSearchInput"
          placeholder="Buscar productos (ej: cafe, nino, telefono)..." animated mode="ios" class="custom-searchbar"
          :debounce="300" show-clear-button="always" inputmode="search" enterkeyhint="search" type="search" />
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <ion-spinner name="crescent" color="primary" />
        <p class="loading-text">Cargando productos...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h2 class="empty-title">
          {{ searchQuery ? 'No se encontraron productos' : 'No hay productos' }}
        </h2>
        <p class="empty-description">
          {{ searchQuery
            ? `No encontramos productos para "${searchQuery}"`
            : 'No hay productos disponibles en esta categoría'
          }}
        </p>
        <p v-if="searchQuery" class="search-hint">
          <small>¿Buscabas algo específico? Prueba sin acentos.</small>
        </p>
      </div>

      <!-- Products Grid -->
      <div v-else class="products-container">
        <!-- Search Results Info -->
        <div v-if="searchQuery" class="search-results-info">
          <p>
            Mostrando {{ filteredProducts.length }} resultado{{ filteredProducts.length !== 1 ? 's' : '' }}
            para "{{ searchQuery }}"
          </p>
        </div>

        <ion-grid class="products-grid">
          <ion-row>
            <ion-col v-for="p in filteredProducts" :key="p.id" size-sm="4" size-md="3" size-lg="2.4" size-xl="2">
              <ProductCard :product="p" @add="cart.addItem(p)" @show-details="showProductDetail" />
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>

    <ProductDetailModal :is-open="isModalOpen" :product="selectedProduct" @close="closeModal" />
  </ion-page>
</template>

<style scoped>
/* === Custom Searchbar === */
.custom-searchbar {
  --background: var(--koi-neutral-100);
  --border-radius: var(--koi-radius-lg);
  --box-shadow: none;
  --icon-color: var(--koi-neutral-500);
  --placeholder-color: var(--koi-neutral-400);
  --placeholder-opacity: 1;
  --clear-button-color: var(--koi-neutral-500);
  padding: var(--koi-space-2) var(--koi-space-4);
}

/* === Category Segment === */
.category-segment {
  padding: var(--koi-space-2) var(--koi-space-4);
}

/* === Loading State === */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--koi-space-4);
}

.loading-text {
  font-size: var(--koi-text-sm);
  color: var(--koi-neutral-500);
  margin: 0;
}

/* === Empty State === */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--koi-space-8);
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--koi-space-4);
  opacity: 0.5;
}

.empty-title {
  font-size: var(--koi-text-xl);
  font-weight: var(--koi-font-bold);
  color: var(--koi-neutral-900);
  margin: 0 0 var(--koi-space-2) 0;
}

.empty-description {
  font-size: var(--koi-text-sm);
  color: var(--koi-neutral-500);
  max-width: 300px;
  margin: 0 0 var(--koi-space-2) 0;
}

.search-hint {
  font-size: var(--koi-text-xs);
  color: var(--koi-neutral-400);
  margin: var(--koi-space-2) 0 0 0;
  font-style: italic;
}

/* === Search Results Info === */
.search-results-info {
  padding: var(--koi-space-3) var(--koi-space-4);
  background: var(--koi-neutral-100);
  border-bottom: 1px solid var(--koi-neutral-200);
}

.search-results-info p {
  font-size: var(--koi-text-sm);
  color: var(--koi-neutral-600);
  margin: 0;
}

/* === Products Container === */
.products-container {
  padding: var(--koi-space-4) 0;
}

.products-grid {
  --ion-grid-padding: var(--koi-space-4);
  --ion-grid-column-padding: var(--koi-space-2);
}

/* === Responsive Adjustments === */
@media (max-width: 576px) {
  .products-grid {
    --ion-grid-padding: var(--koi-space-3);
    --ion-grid-column-padding: var(--koi-space-1);
  }

  .custom-searchbar {
    padding: var(--koi-space-2) var(--koi-space-3);
  }

  .empty-state {
    padding: var(--koi-space-6);
  }

  .empty-icon {
    font-size: 3rem;
  }

  .empty-title {
    font-size: var(--koi-text-lg);
  }

  .search-results-info {
    padding: var(--koi-space-2) var(--koi-space-3);
  }
}

/* === Dark Mode === */
@media (prefers-color-scheme: dark) {
  .custom-searchbar {
    --background: var(--koi-neutral-200);
    --icon-color: var(--koi-neutral-600);
    --placeholder-color: var(--koi-neutral-500);
    --clear-button-color: var(--koi-neutral-600);
  }

  .empty-title {
    color: var(--koi-neutral-900);
  }

  .loading-text {
    color: var(--koi-neutral-500);
  }

  .search-results-info {
    background: var(--koi-neutral-200);
    border-bottom-color: var(--koi-neutral-300);
  }

  .search-results-info p {
    color: var(--koi-neutral-500);
  }
}
</style>