<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import RefresherComponent from '@/components/RefresherComponent.vue';
import ProductCard from '@/components/ProductCard.vue';
import { useCartStore } from '@/stores/cart';
import { Tables } from '@/types/database.types';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
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

const refreshing = ref(false);

const itemsPerPage = 12;
const currentPage = ref(0);
const hasMoreData = ref(true);

const loadCache = () => {
  const cachedProds = localStorage.getItem(`cache_prods_${selectedSlug.value}`);
  if (cachedProds) {
    products.value = JSON.parse(cachedProds);
    isLoading.value = false;
  }
};

const pullText = computed(() => {
  if (searchQuery.value) {
    return `Tira para buscar "${searchQuery.value}" de nuevo`;
  }
  return 'Tira para actualizar productos';
});

const refreshText = computed(() => {
  if (searchQuery.value) {
    return `Buscando "${searchQuery.value}"...`;
  }
  return 'Actualizando productos...';
});

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

const fetchData = async (isFirstLoad = true) => {
  if (isFirstLoad) {
    currentPage.value = 0;
    hasMoreData.value = true;
    if (products.value?.length === 0) isLoading.value = true;
  }

  const from = currentPage.value * itemsPerPage;
  const to = from + itemsPerPage - 1;

  try {
    // 1. Fetch Categories (only on first load)
    if (isFirstLoad && categories.value.length === 0) {
      const { data: catData } = await supabase.from('categories').select('*').is('deleted_at', null).order('name');
      categories.value = catData || [];
    }

    // 2. Fetch Products with Range
    let query = supabase.from('products').select('*').is('deleted_at', null).order('name').range(from, to);

    if (selectedSlug.value !== 'all') {
      const catId = categories.value.find(c => c.slug === selectedSlug.value)?.id;
      if (catId) query = query.eq('category_id', catId);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data) {
      if (isFirstLoad) {
        products.value = data;
        // Save to cache
        localStorage.setItem(`cache_prods_${selectedSlug.value}`, JSON.stringify(data));
      } else {
        products.value?.push(...data);
      }

      if (data.length < itemsPerPage) hasMoreData.value = false;
    }
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    isLoading.value = false;
  }
};

const loadMore = async (ev: CustomEvent) => {
  currentPage.value++;
  await fetchData(false);
  (ev.target as HTMLIonInfiniteScrollElement).complete();
};

const handleRefresh = async (complete: () => void) => {
  await fetchData(true);
  complete();
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

onMounted(() => {
  loadCache();
  fetchData(true);
});

watch(selectedSlug, () => fetchData(true));
</script>

<template>
  <ion-page>
    <ion-header class="ion-no-border">
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
        <ion-searchbar v-model="searchQuery" @ionInput="handleSearchInput" placeholder="Buscar productos (ej: cafe)..."
          animated mode="md" class="custom-searchbar" :debounce="300" show-clear-button="always" inputmode="search"
          enterkeyhint="search" type="search" />
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <RefresherComponent @refresh="handleRefresh" :pulling-text="pullText" :refreshing-text="refreshText"
        :disabled="isLoading" />

      <!-- Loading State -->
      <div v-if="isLoading && !refreshing" class="loading-container">
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

        <ion-grid :fixed="true" class="products-grid">
          <ion-row>
            <ion-col v-for="p in filteredProducts" :key="p.id" size-md="3" size-sm="4">
              <ProductCard :product="p" @add="cart.addItem(p)" @show-details="showProductDetail" />
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-infinite-scroll @ionInfinite="loadMore" :disabled="!hasMoreData">
          <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Cargando más productos..." />
        </ion-infinite-scroll>
      </div>
    </ion-content>

    <ProductDetailModal :is-open="isModalOpen" :product="selectedProduct" @close="closeModal" />
  </ion-page>
</template>

<style scoped>
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

.products-grid ion-row::after {
  content: '';
  flex: 6;
}
</style>