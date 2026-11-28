<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { favorites, initStore, toggleFavorite } from "../stores/catalogStore";

const props = defineProps<{
  destinationId: string;
}>();

const isFavorite = computed(() =>
  favorites.value.includes(props.destinationId)
);

const handleFavoritesUpdated = () => {
  initStore();
};

const handleStorage = (event: StorageEvent) => {
  if (event.key === "destinos_favs_hi") {
    initStore();
  }
};

onMounted(() => {
  initStore();
  window.addEventListener("favorites-updated", handleFavoritesUpdated);
  window.addEventListener("storage", handleStorage);
});

onUnmounted(() => {
  window.removeEventListener("favorites-updated", handleFavoritesUpdated);
  window.removeEventListener("storage", handleStorage);
});
</script>

<template>
  <button
    type="button"
    :aria-pressed="isFavorite"
    :aria-label="
      isFavorite
        ? 'Quitar destino de favoritos'
        : 'Guardar destino en favoritos'
    "
    :class="
      isFavorite
        ? 'bg-red-50 border-red-200 hover:bg-red-100/70 text-red-700'
        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
    "
    class="border font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
    @click="toggleFavorite(destinationId)"
  >
    <i
      :class="
        isFavorite
          ? 'fa-solid fa-heart text-red-500'
          : 'fa-regular fa-heart text-slate-700'
      "
      aria-hidden="true"
    ></i>
    <span>{{ isFavorite ? "En Favoritos" : "Guardar en Favoritos" }}</span>
  </button>
</template>
