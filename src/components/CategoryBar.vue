<template>
  <section class="space-y-4">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4"
    >
      <div
        class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
        id="category-bar"
      >
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          @click="selectCategory(cat.id)"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          :class="
            selectedCategory === cat.id && !isShowingFavorites
              ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
          "
          :aria-pressed="selectedCategory === cat.id && !isShowingFavorites"
        >
          <i :class="['fa-solid', cat.icon, 'text-xs']"></i>
          <span>{{ cat.name }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { categories } from "../data/data";
import {
  currentCategory,
  showingFavoritesOnly,
  setCategory,
} from "../stores/catalogStore";

const selectedCategory = ref(currentCategory.value || "all");
const isShowingFavorites = ref(showingFavoritesOnly.value);

const selectCategory = (categoryId: string) => {
  setCategory(categoryId);
  selectedCategory.value = categoryId;
  isShowingFavorites.value = false;
};

const handleCategoryChanged = (event: Event) => {
  const customEvent = event as CustomEvent<string>;
  selectedCategory.value = customEvent.detail;
};

const handleViewToggled = (event: Event) => {
  const customEvent = event as CustomEvent<boolean>;
  isShowingFavorites.value = customEvent.detail;
};

onMounted(() => {
  selectedCategory.value = currentCategory.value || "all";
  isShowingFavorites.value = showingFavoritesOnly.value;

  window.addEventListener("category-changed", handleCategoryChanged);
  window.addEventListener("toggle-favorites-view", handleViewToggled);
});

onUnmounted(() => {
  window.removeEventListener("category-changed", handleCategoryChanged);
  window.removeEventListener("toggle-favorites-view", handleViewToggled);
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
