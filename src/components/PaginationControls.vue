<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  previous: [];
  next: [];
}>();

const buttonClass =
  "flex shrink-0 items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-slate-800 transition-all enabled:hover:bg-slate-200/80 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 max-[359px]:gap-1 max-[359px]:px-2";
</script>

<template>
  <nav
    aria-label="Paginación del catálogo"
    class="pagination flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 text-xs font-semibold shadow-xs sm:text-sm max-[359px]:gap-2 max-[359px]:p-2"
  >
    <button
      type="button"
      :class="buttonClass"
      :disabled="currentPage <= 1 || totalPages <= 1"
      @click="emit('previous')"
    >
      <i class="fa-solid fa-chevron-left text-xs" aria-hidden="true"></i>
      <span>Anterior</span>
    </button>

    <span role="status" class="text-center font-bold text-slate-900">
      PÁGINA {{ currentPage }} DE {{ totalPages }}
    </span>

    <button
      type="button"
      :class="buttonClass"
      :disabled="currentPage >= totalPages || totalPages <= 1"
      @click="emit('next')"
    >
      <span>Siguiente</span>
      <i class="fa-solid fa-chevron-right text-xs" aria-hidden="true"></i>
    </button>
  </nav>
</template>

<style scoped>
  .pagination {
    --color-slate-100: #f1f5f9;
    --color-slate-200: #e2e8f0;
    --color-slate-800: #1e293b;
    --color-slate-900: #0f172a;
  }
</style>
