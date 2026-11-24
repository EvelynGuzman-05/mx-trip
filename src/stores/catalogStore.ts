import { ref } from "vue";

export const searchQuery = ref("");
export const favorites = ref<string[]>([]);
export const showingFavoritesOnly = ref<boolean>(false);

export function initStore(): void {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("destinos_favs_hi");
      favorites.value = stored ? JSON.parse(stored) : [];
    } catch {
      favorites.value = [];
    }
  }
}

export function toggleFavorite(id: string): void {
  const index = favorites.value.indexOf(id);
  if (index > -1) {
    favorites.value.splice(index, 1);
  } else {
    favorites.value.push(id);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("destinos_favs_hi", JSON.stringify(favorites.value));
    window.dispatchEvent(
      new CustomEvent("favorites-updated", { detail: favorites.value })
    );
  }
}

export function toggleFavoritesView(): void {
  showingFavoritesOnly.value = !showingFavoritesOnly.value;
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("toggle-favorites-view", {
        detail: showingFavoritesOnly.value,
      })
    );
  }
}
