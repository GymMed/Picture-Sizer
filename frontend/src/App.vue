<script setup lang="ts">
import { ref } from "vue";
import ModalController from "./components/ModalController.vue";
import ImageRequester from "./components/ImageRequester.vue";
import ImagePreview from "./components/modals/ImagePreview.vue";
import type { modalDataInterface } from "./assets/js/interfaces/modalDataInterface";
import { useModalStore } from "./stores/useModalStore";
import { ENUM_MODAL_TYPE } from "./assets/js/utils/enums/ModalTypeEnum";
import ImagesPreview from "./components/modals/ImagesPreview.vue";
import { isBackendOn } from "./assets/js/configs";
import OkModal from "./components/modals/OkModal.vue";

const dialogTitle = ref<string>("");
const modalControllerRef = ref<HTMLElement>();
const modalStore = useModalStore();
</script>

<template>
    <main
        class="text-base min-w-80 bg-stone-800 text-white p-4 flex flex-col gap-3 min-h-screen"
    >
        <ImageRequester />
        <ModalController :topBarTitle="dialogTitle" ref="modalControllerRef">
            <ImagePreview
                v-if="modalStore.modalType === ENUM_MODAL_TYPE.PICO_VIEW"
            />
            <ImagesPreview
                v-if="
                    modalStore.modalType === ENUM_MODAL_TYPE.SHARP_MULTIPLE_VIEW
                "
            />
            <OkModal
                v-if="modalStore.modalType === ENUM_MODAL_TYPE.OK_MODAL"
                :message="modalStore.data.message"
            />
        </ModalController>
    </main>
</template>

<style scoped></style>
