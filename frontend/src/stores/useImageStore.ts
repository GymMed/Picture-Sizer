import { defineStore } from "pinia";

export const useImageStore = defineStore("imageStore", {
  state: () => ({
    images: [] as File[],
    processedImages: [] as string[],
  }),
  actions: {
    setImages(newImages: File[]) {
      this.images = newImages;
    },
    setProcessedImages(newImages: string[]) {
      this.processedImages = newImages;
    },
  },
});
