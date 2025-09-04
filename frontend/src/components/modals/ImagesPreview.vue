<script setup lang="ts">
import { Zipper } from "@/assets/js/utils/zipper";
import { useModalStore } from "@/stores/useModalStore";
import { watch } from "vue";
import { ref, onMounted, onBeforeUnmount, provide } from "vue";

const modalStore = useModalStore();
const selectedImage = ref(0);

function downloadZipped() {
    if (!modalStore.data.images) {
        console.error("Couldn't find any loaded images!");
        return;
    }
    Zipper.downloadZip(modalStore.data.images);
}

watch(
    () => modalStore.data.images,
    (newVal, oldVal) => {
        console.log("Images changed:", oldVal, "→", newVal);
        // e.g., trigger preview update, reload, etc.
    }
);
</script>

<template>
    <div class="flex flex-col gap-3 pb-3 w-full">
        <h3 class="text-xl font-semibold tracking-wider text-center">
            Images Preview
        </h3>
        <div class="flex flex-col gap-3">
            <div>
                <img
                    v-if="
                        modalStore.data.images &&
                        Array.isArray(modalStore.data.images) &&
                        modalStore.data.images.length > selectedImage
                    "
                    :src="modalStore.data.images[selectedImage]"
                    alt="Preview"
                    class="rounded shadow bg-white"
                />
            </div>
            <div
                class="flex gap-3 p-2 rounded bg-gradient-to-br from-stone-600 to-zinc-700"
            >
                <div
                    v-for="(image, index) in modalStore.data.images"
                    :key="image"
                    @click="selectedImage = index"
                >
                    <img
                        :src="image"
                        alt="Preview"
                        :class="[
                            'rounded w-40 max-h-40 shadow bg-stone-800 border-2',
                            selectedImage === index
                                ? 'border-fuchsia-500'
                                : 'border-transparent hover:border-indigo-500',
                        ]"
                    />
                </div>
            </div>

            <div class="w-full">
                <button
                    @click="downloadZipped"
                    class="w-full mt-3 px-4 py-2 bg-gradient-to-br from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 focus:ring-lime-500 focus:ring-offset-2 focus:ring-2 text-white rounded"
                >
                    Download
                </button>
            </div>
        </div>
    </div>
</template>
