<template>
  <button
    id="fav-toggle-btn"
    type="button"
    @click="handleClick"
    class="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all cursor-pointer"
    :class="{ 'ring-2 ring-blue-500/50 bg-blue-50 text-blue-700': isShowingFavorites }"
    :aria-pressed="isShowingFavorites"
    aria-label="Ver favoritos"
  >
    <i class="fa-solid fa-heart text-red-500" id="fav-icon"></i>
    <span class="hidden sm:inline">Favoritos</span>
    <span
      id="fav-counter"
      class="bg-slate-900 text-white px-2 py-0.5 text-xs font-bold rounded-full transition-transform"
    >
      {{ count }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {
  favorites,
  showingFavoritesOnly,
  initStore,
  toggleFavoritesView,
} from "../stores/catalogStore";

const count = ref(0);
const isShowingFavorites = ref(false);

const syncState = () => {
  count.value = favorites.value.length;
  isShowingFavorites.value = showingFavoritesOnly.value;
};

const handleClick = () => {
  toggleFavoritesView();
  syncState();
};

const handleFavoritesUpdated = () => {
  initStore();
  syncState();
};

const handleViewToggled = (event: Event) => {
  const customEvent = event as CustomEvent<boolean>;
  isShowingFavorites.value = customEvent.detail;
};

const handleStorage = (event: StorageEvent) => {
  if (event.key === "destinos_favs_hi") {
    initStore();
    syncState();
  }
};

onMounted(() => {
  initStore();
  syncState();

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
