<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
  images: string[];
  title: string;
}>();

const selectedIndex = ref(0);

const thumbnails = computed(() => props.images.slice(0, 3));

const activeImage = computed(
  () => thumbnails.value[selectedIndex.value] ?? props.images[0] ?? ""
);

watch(
  () => props.images,
  () => {
    selectedIndex.value = 0;
  }
);
</script>

<template>
  <div class="space-y-3">
    <div
      class="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-lg bg-slate-900"
    >
      <img
        :src="activeImage"
        :alt="title"
        class="w-full h-full object-cover transition-all duration-300"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none"
      ></div>
    </div>

    <div
      v-if="thumbnails.length > 0"
      class="flex items-center gap-3 overflow-x-auto snap-x no-scrollbar py-1"
    >
      <button
        v-for="(imageUrl, index) in thumbnails"
        :key="`${imageUrl}-${index}`"
        type="button"
        :aria-label="`Ver imagen ${index + 1} de ${title}`"
        :aria-current="selectedIndex === index ? 'true' : undefined"
        :class="
          selectedIndex === index
            ? 'border-blue-600 ring-2 ring-blue-600/20'
            : 'border-transparent hover:border-blue-600'
        "
        class="snap-start w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden cursor-pointer border-2 shrink-0 transition-all shadow-sm bg-slate-100"
        @click="selectedIndex = index"
      >
        <img
          :src="imageUrl"
          :alt="`${title} - vista ${index + 1}`"
          class="w-full h-full object-cover"
        />
      </button>
    </div>
  </div>
</template>
