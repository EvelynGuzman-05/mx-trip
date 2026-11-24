<script setup lang="ts">
import { ref } from "vue";
import { searchQuery } from "../stores/catalogStore";

const searchInput = ref<HTMLInputElement | null>(null);

function clearSearch(): void {
  searchQuery.value = "";
  searchInput.value?.focus();
}
</script>

<template>
  <div role="search" class="max-w-xl mx-auto relative pt-2">
    <div
      class="relative flex items-center bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-lg"
    >
      <span aria-hidden="true" class="pl-4 pr-2 text-slate-500">
        <i class="fa-solid fa-magnifying-glass text-lg"></i>
      </span>
      <input
        id="search-input"
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        aria-label="Buscar destino o categoría"
        placeholder="Buscar destino o categoría..."
        class="w-full min-w-0 bg-transparent text-slate-900 text-base focus:outline-none px-2 py-1.5 placeholder-slate-500 font-medium"
      />
      <button
        v-if="searchQuery.trim()"
        id="clear-search"
        type="button"
        aria-label="Limpiar búsqueda"
        class="text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg w-7 h-7 flex items-center justify-center mr-1 transition-all"
        @click="clearSearch"
      >
        X
      </button>
    </div>
  </div>
</template>
