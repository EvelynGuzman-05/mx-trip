<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { destinationsData, ITEMS_PER_PAGE } from "../data/data";
import {
  favorites,
  initStore,
  searchQuery,
  showingFavoritesOnly,
} from "../stores/catalogStore";
import DestinationCard from "./DestinationCard.vue";
import PaginationControls from "./PaginationControls.vue";

const currentPage = ref(1);

const filteredDestinations = computed(() => {
  let list = destinationsData;

  if (showingFavoritesOnly.value) {
    list = list.filter((item) => favorites.value.includes(item.id));
  }

  const query = searchQuery.value.trim().toLowerCase();
  if (query !== "") {
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.categoryName.toLowerCase().includes(query)
    );
  }

  return list;
});

const totalPages = computed(() =>
  Math.ceil(filteredDestinations.value.length / ITEMS_PER_PAGE)
);

const paginatedDestinations = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return filteredDestinations.value.slice(start, start + ITEMS_PER_PAGE);
});

watch([searchQuery, showingFavoritesOnly], () => {
  currentPage.value = 1;
});

watch(totalPages, (nextTotalPages) => {
  if (nextTotalPages > 0 && currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages;
  }
});

const scrollToCatalog = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 300, behavior: "smooth" });
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    scrollToCatalog();
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    scrollToCatalog();
  }
};

const handleFavoritesUpdated = () => {
  initStore();
};

const handleViewToggled = (event: Event) => {
  const customEvent = event as CustomEvent<boolean>;
  showingFavoritesOnly.value = customEvent.detail;
};

const handleStorage = (event: StorageEvent) => {
  if (event.key === "destinos_favs_hi") {
    initStore();
  }
};

onMounted(() => {
  initStore();
  window.addEventListener("favorites-updated", handleFavoritesUpdated);
  window.addEventListener("toggle-favorites-view", handleViewToggled);
  window.addEventListener("storage", handleStorage);
});

onUnmounted(() => {
  window.removeEventListener("favorites-updated", handleFavoritesUpdated);
  window.removeEventListener("toggle-favorites-view", handleViewToggled);
  window.removeEventListener("storage", handleStorage);
});
</script>

<template>
  <section aria-label="Catálogo de destinos" class="relative">
    <div v-if="totalPages > 0" class="space-y-8">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <DestinationCard
          v-for="destination in paginatedDestinations"
          :key="destination.id"
          :destination="destination"
        />
      </div>

      <PaginationControls
        :current-page="currentPage"
        :total-pages="totalPages"
        @previous="goToPreviousPage"
        @next="goToNextPage"
      />
    </div>
    <div aria-live="polite">
      <slot v-if="totalPages === 0" name="empty" />
    </div>
  </section>
</template>
