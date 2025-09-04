<script setup lang="ts">
import IconClose from "@/components/icons/IconClose.vue";
import { ref, onMounted, onBeforeUnmount, provide } from "vue";

const props = withDefaults(
    defineProps<{
        showTopBar?: boolean;
        showCloseButton?: boolean;
        topBarTitle?: string;
    }>(),
    {
        showTopBar: true,
        showCloseButton: true,
        topBarTitle: "Window",
    }
);

const emit = defineEmits(["close", "open"]);

const dialogRef = ref<HTMLDialogElement | null>(null);

function openModal() {
    dialogRef.value?.showModal();
}

function closeModal() {
    //emit("close");
    dialogRef.value?.close();
}

function handleOpenModalEvent() {
    openModal();
}

function handleCloseModalEvent() {
    closeModal();
}

onMounted(() => {
    window.addEventListener("open-modal", handleOpenModalEvent);
    window.addEventListener("close-modal", handleCloseModalEvent);
});

onBeforeUnmount(() => {
    window.removeEventListener("open-modal", handleOpenModalEvent);
    window.removeEventListener("close-modal", handleCloseModalEvent);
});

provide("closeModal", closeModal);
</script>

<template>
    <dialog
        ref="dialogRef"
        class="rounded-lg shadow-lg w-8/12 m-auto text-white bg-gradient-to-br from-stone-800 to-zinc-800"
    >
        <div
            class="pt-3 rounded-lg shadow-lg flex flex-col gap-2 border border-indigo-600"
        >
            <div v-if="props.showTopBar" class="flex gap-3 px-3">
                <div
                    class="w-full flex items-center justify-center text-lg font-semibold"
                >
                    {{ props.topBarTitle }}
                </div>
                <div
                    v-if="props.showCloseButton"
                    class="flex justify-end gap-1"
                >
                    <button
                        type="button"
                        class="text-white font-semibold cursor-pointer bg-gradient-to-br from-red-500 to-red-700 hover:from-red-700 hover:to-red-900 rounded"
                        @click="closeModal"
                    >
                        <div class="hover:scale-110 p-1">
                            <IconClose class="w-6 h-6" />
                        </div>
                    </button>
                </div>
            </div>
            <div class="flex gap-3 max-h-[90vh] overflow-y-auto px-3">
                <slot />
            </div>
        </div>
    </dialog>
</template>
