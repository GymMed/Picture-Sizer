<script setup lang="ts">
import { useModalStore } from "@/stores/useModalStore";

const modalStore = useModalStore();
</script>

<template>
    <div class="flex flex-col gap-3 pb-3 w-full">
        <h3 class="text-xl font-semibold tracking-wider text-center">
            Image Preview
        </h3>
        <img
            v-if="modalStore.data.image"
            :src="modalStore.data.image"
            alt="Preview"
            class="rounded shadow bg-white"
        />
        <p v-else>No image selected</p>
    </div>
</template>
