<script setup lang="ts">
import { computed, onMounted } from "vue";
import type { Destination } from "../types/Destination";
import { favorites, initStore, toggleFavorite } from "../stores/catalogStore";

const props = defineProps<{
  destination: Destination;
}>();

const isFavorite = computed(() =>
  favorites.value.includes(props.destination.id)
);

onMounted(() => {
  initStore();
});
</script>

<template>
  <a
    :href="`/destino/${destination.slug}/`"
    class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
  >
    <div class="relative h-48 overflow-hidden bg-slate-100">
      <img
        :src="destination.image"
        :alt="destination.title"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"
      ></div>

      <span
        class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
      >
        {{ destination.categoryName }}
      </span>

      <button
        type="button"
        :aria-pressed="isFavorite"
        :aria-label="
          isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
        "
        class="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-md hover:bg-white transition-all active:scale-95 cursor-pointer"
        @click.stop.prevent="toggleFavorite(destination.id)"
      >
        <i
          :class="
            isFavorite
              ? 'fa-solid fa-heart text-red-500'
              : 'fa-regular fa-heart text-slate-700'
          "
          class="text-sm"
          aria-hidden="true"
        ></i>
      </button>
    </div>

    <div class="p-5 flex-grow flex flex-col justify-between space-y-4">
      <div class="space-y-2">
        <div
          class="flex items-center justify-between text-xs font-semibold text-slate-500"
        >
          <span class="truncate">📍 {{ destination.location }}</span>
          <span class="text-amber-500 font-bold shrink-0">
            ★ {{ destination.rating }}
          </span>
        </div>

        <h3
          class="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1"
        >
          {{ destination.title }}
        </h3>

        <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {{ destination.shortDescription }}
        </p>
      </div>

      <div
        class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs"
      >
        <span class="font-semibold text-slate-500">
          {{ destination.budget }}
        </span>
      </div>
    </div>
  </a>
</template>

