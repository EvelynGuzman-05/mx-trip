<script setup lang="ts">
import PaginationControls from "./PaginationControls.vue";

defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  previous: [];
  next: [];
}>();
</script>

<template>
  <section aria-label="Catálogo de destinos" class="relative space-y-8">
    <slot />
    <PaginationControls
      v-if="totalPages > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      @previous="emit('previous')"
      @next="emit('next')"
    />
  </section>
</template>
