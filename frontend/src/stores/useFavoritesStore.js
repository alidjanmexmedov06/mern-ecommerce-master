import { create } from "zustand";
import { persist } from "zustand/middleware"; // Добавяме persist, за да запазваме в localStorage

const useFavoritesStore = create(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (product) =>
        set((state) => {
          // Проверяваме дали продуктът вече е в любимите
          if (state.favorites.some((item) => item._id === product._id)) {
            return state; // Ако е добавен, не правим нищо
          }
          return {
            favorites: [...state.favorites, product],
          };
        }),
      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item._id !== productId),
        })),
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "favorites-storage",
    }
  )
);

export { useFavoritesStore };