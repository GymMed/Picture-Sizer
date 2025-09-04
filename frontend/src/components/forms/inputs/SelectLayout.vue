<script lang="ts" setup>
import { ENUM_IMAGE_ALIGN } from "@/assets/js/utils/enums/ImageAlignEnum";
import { ref } from "vue";

const props = defineProps<{
    id?: string;
    name?: string;
    label: string;
    modelValue: string;
    options: { value: string; label: string }[];
}>();

function selectedAlignment(option: { value: string; label: string }) {
    emit("update:modelValue", option.value);
}

const emit = defineEmits(["update:modelValue"]);
</script>
<template>
    <div class="flex flex-col gap-1">
        <div
            class="grid grid-cols-3 w-20 h-20 gap-1 bg-gradient-to-br from-emerald-800 to-lime-900 p-1 rounded caret-transparent"
        >
            <div
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :class="[
                    'rounded bg-gradient-to-br cursor-pointer',
                    option.value === modelValue
                        ? 'from-fuchsia-500 to-rose-500 hover:from-fuchsia-600 hover:to-rose-600'
                        : 'from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600',
                ]"
                @click="selectedAlignment(option)"
            ></div>
        </div>
        <div class="hidden">
            <SelectField
                id="align"
                name="align"
                v-model="modelValue"
                :options="options"
                label="Align"
            />
        </div>
    </div>
</template>
