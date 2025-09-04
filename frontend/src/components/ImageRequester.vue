<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import InputField from "./forms/inputs/InputField.vue";
import SelectField from "./forms/inputs/SelectField.vue";
import DragAndDropImages from "./forms/inputs/DragAndDropImages.vue";
import pica from "pica";
import { useImageStore } from "@/stores/useImageStore";
import { ImageShaper } from "@/assets/js/utils/imageShaper";
import { useModalStore } from "@/stores/useModalStore";
import { ENUM_IMAGE_ALIGN } from "@/assets/js/utils/enums/ImageAlignEnum";
import SelectLayout from "./forms/inputs/SelectLayout.vue";
import { ENUM_MODAL_TYPE } from "@/assets/js/utils/enums/ModalTypeEnum";
import { Zipper } from "@/assets/js/utils/zipper";
import { githubLink, isBackendOn } from "@/assets/js/configs";

const imageStore = useImageStore();
const modalStore = useModalStore();

const alignOptions = Object.values(ENUM_IMAGE_ALIGN).map((value) => ({
    value,
    label: value
        .toUpperCase() // all caps
        .replace(/_/g, " ") // replace underscores with space
        .split("-") // split hyphen into words
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase()) // capitalize first letter
        .join(" "), // join words back
}));

async function tryResizeImagesDonwloadZipped() {
    const blobs: Blob[] = [];

    for (const image of imageStore.images) {
        const blob = await ImageShaper.resize(
            image,
            Number(modalStore.data.width),
            Number(modalStore.data.height),
            modalStore.data.align
        );

        blobs.push(blob);
    }

    Zipper.downloadZipFromBlobs(blobs);
}

async function tryResizeImagesDownloadByOne() {
    for (const image of imageStore.images) {
        const blob = await ImageShaper.resize(
            image,
            Number(modalStore.data.width),
            Number(modalStore.data.height),
            modalStore.data.align
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `resized-${image.name}`; // custom filename
        link.click();
        URL.revokeObjectURL(url);
    }
}

async function tryResizeImagesSharpJs() {
    if (!isBackendOn) {
        modalStore.setMessage(
            `You need backend for Sharp js to work. Follow &nbsp;<a target="_blank" href="${githubLink}" class="hover:underline text-indigo-200">Readme document on github</a>&nbsp; for detailed instructions.`,
            ENUM_MODAL_TYPE.OK_MODAL
        );
        return;
    }
    const formData = new FormData();

    imageStore.images.forEach((file: File, index: number) => {
        const blob =
            file instanceof File
                ? file
                : new Blob([file], { type: "image/png" });

        formData.append(`images`, blob, file.name || `image-${index}.png`);
    });

    formData.append("width", modalStore.data.width);
    formData.append("height", modalStore.data.height);
    formData.append("align", modalStore.data.align);

    const response = await fetch("/api/image/resize", {
        method: "POST",
        body: formData, // formData contains images, width, height, align
    });
    const data = await response.json();
    imageStore.setProcessedImages(data.images);
    modalStore.setImages(data.images, ENUM_MODAL_TYPE.SHARP_MULTIPLE_VIEW);
}

const pasteZone = ref<HTMLDivElement | null>(null);
const pastedFiles = ref<FileList | null>(null);

function handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
        if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
                if (pastedFiles.value)
                    pastedFiles.value = toFileList([
                        ...pastedFiles.value,
                        file,
                    ]);
                else pastedFiles.value = toFileList([file]);
            }
        }
    }
}

function toFileList(files: File[]): FileList {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    return dt.files;
}

onMounted(() => {
    pasteZone.value?.addEventListener("paste", handlePaste);
});

onBeforeUnmount(() => {
    pasteZone.value?.removeEventListener("paste", handlePaste);
});
</script>

<template>
    <div class="flex flex-col gap-3" ref="pasteZone" tabindex="0">
        <div class="flex flex-col gap-3 items-center justify-center">
            <h1 class="text-2xl font-semibold">Picture Sizer</h1>
            <div class="text-lg">
                Change image size while keeping aspect ratio and fill space with
                transperancy
            </div>
        </div>

        <InputField
            id="height"
            name="height"
            placeholder="Height"
            type="number"
            label="Height"
            v-model="modalStore.data.height"
        />

        <InputField
            id="width"
            name="width"
            placeholder="Width"
            type="number"
            label="Width"
            v-model="modalStore.data.width"
        />

        <SelectField
            id="align"
            name="align"
            v-model="modalStore.data.align"
            :options="alignOptions"
            label="Align"
        />

        <SelectLayout
            id="align"
            name="align"
            v-model="modalStore.data.align"
            :options="alignOptions"
            label="Align"
        />

        <DragAndDropImages :files="pastedFiles" />

        <button
            @click="tryResizeImagesDonwloadZipped"
            class="mt-3 px-4 py-2 bg-gradient-to-br from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 focus:ring-sky-500 focus:ring-offset-2 focus:ring-2 text-white rounded"
        >
            Resize Images using Pico Frontend
        </button>

        <div class="w-full">
            <button
                @click="tryResizeImagesSharpJs"
                class="w-full mt-3 px-4 py-2 bg-gradient-to-br from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 focus:ring-lime-500 focus:ring-offset-2 focus:ring-2 text-white rounded"
            >
                Resize Images using Sharp js Backend
            </button>
        </div>
    </div>
</template>