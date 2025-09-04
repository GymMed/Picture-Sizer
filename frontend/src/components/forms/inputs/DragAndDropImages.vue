<script setup lang="ts">
import { ENUM_MODAL_TYPE } from "@/assets/js/utils/enums/ModalTypeEnum";
import { ImageShaper } from "@/assets/js/utils/imageShaper";
import IconDelete from "@/components/icons/IconDelete.vue";
import IconView from "@/components/icons/IconView.vue";
import { useImageStore } from "@/stores/useImageStore";
import { useModalStore } from "@/stores/useModalStore";
import { ref, watch } from "vue";

const props = withDefaults(
    defineProps<{
        files: FileList | null;
    }>(),
    { files: null }
);

const modalStore = useModalStore();
const imageStore = useImageStore();

const isDragOver = ref(false);
const droppedFiles = ref<File[]>([]);
const previews = ref<string[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

// Handle drag events
function onDragOver(e: DragEvent) {
    e.preventDefault(); // allow drop
    e.dataTransfer!.dropEffect = "copy";
    isDragOver.value = true;
}

function onDragLeave() {
    isDragOver.value = false;
}

function onDrop(e: DragEvent) {
    e.preventDefault();
    isDragOver.value = false;
    if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
}

function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) handleFiles(target.files);
}

function handleFiles(files: FileList) {
    droppedFiles.value = Array.from(files);
    previews.value = droppedFiles.value.map((file) =>
        URL.createObjectURL(file)
    );
    imageStore.setImages(droppedFiles.value);
}

function openFileDialog() {
    fileInput.value?.click();
}

function removePreview(index: number) {
    previews.value.splice(index, 1);
}

async function PreviewTransformedImage(index: number) {
    modalStore.setImage(
        URL.createObjectURL(
            await ImageShaper.resize(
                droppedFiles.value[index],
                Number(modalStore.data.width),
                Number(modalStore.data.height),
                modalStore.data.align
            )
        ),
        ENUM_MODAL_TYPE.PICO_VIEW
    );
}

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

watch(
    () => props.files,
    (newFiles) => {
        if (newFiles === null || !newFiles.length) return;
        handleFiles(newFiles);
    },
    { immediate: true }
);
</script>

<template>
    <div
        class="w-full rounded-lg grid place-items-center transition-colors duration-200 select-none"
        :class="{
            'border-2 border-dashed border-black from-amber-300 to-orange-400 bg-gradient-to-br':
                isDragOver,
            '': !isDragOver,
        }"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
    >
        <div
            class="text-amber-500 hover:text-amber-400 transition-colors duration-500 text-center w-full font-semibold p-2"
        >
            <div
                class="bg-gradient-to-br from-stone-800 to-zinc-800 shadow-inner rounded p-1"
                @click="openFileDialog"
            >
                <p v-if="!droppedFiles.length" class="">Drop images here</p>
                <div v-if="droppedFiles.length">
                    <h4 class="font-semibold">
                        Dropped Files {{ droppedFiles.length }}
                    </h4>
                    <ul class="list-disc list-inside text-sm">
                        <li v-for="file in droppedFiles" :key="file.name">
                            {{ file.name }} ({{ formatBytes(file.size) }})
                        </li>
                    </ul>
                </div>
            </div>

            <div v-if="previews.length" class="flex flex-wrap gap-3">
                <div v-for="(src, idx) in previews" class="relative">
                    <img
                        :key="idx"
                        :src="src"
                        class="max-w-[200px] rounded shadow"
                    />
                    <div class="flex gap-1 absolute top-2 right-2">
                        <button
                            type="button"
                            class="p-2 rounded hover:bg-gray-700 hover:opacity-80 text-sky-500 transition-colors duration-500 cursor-pointer"
                        >
                            <IconView
                                class="w-6 h-6"
                                @click="PreviewTransformedImage(idx)"
                            />
                        </button>
                        <button
                            type="button"
                            class="p-2 rounded hover:bg-gray-700 hover:opacity-80 text-red transition-colors duration-500 cursor-pointer"
                        >
                            <IconDelete
                                class="w-6 h-6"
                                @click="removePreview(idx)"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full">
            <slot />
        </div>

        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="onFileChange"
        />
    </div>
</template>
