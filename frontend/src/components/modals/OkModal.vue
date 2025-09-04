<script setup lang="ts">
import { useModalStore } from "@/stores/useModalStore";
import { inject } from "vue";

const modalStore = useModalStore();

const props = withDefaults(
    defineProps<{
        message?: string;
        buttonMessage?: string;
    }>(),
    {
        message: "You agree?",
        buttonMessage: "Ok",
    }
);

const closeModal = inject<() => void>("closeModal");

function handleAgree() {
    try {
        if (closeModal) closeModal();
        else console.warn("closeModal is undefined");
    } catch (err) {
        console.error("handleSave error:", err);
    }
}
</script>

<template>
    <div class="flex flex-col gap-2 w-full text-base mb-3">
        <div
            class="flex items-center justify-center overflow-y-auto"
            v-html="message"
        ></div>
        <button
            type="submit"
            class="px-4 py-2 w-full cursor-pointer rounded bg-gradient-to-br from-green-500 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-800 focus:ring focus:ring-offset-2 focus:ring-green-500"
            @click="handleAgree"
        >
            {{ buttonMessage }}
        </button>
    </div>
</template>
