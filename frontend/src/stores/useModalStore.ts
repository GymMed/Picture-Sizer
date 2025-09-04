import type { modalDataInterface } from "@/assets/js/interfaces/modalDataInterface";
import { ENUM_IMAGE_ALIGN } from "@/assets/js/utils/enums/ImageAlignEnum";
import { ENUM_MODAL_TYPE } from "@/assets/js/utils/enums/ModalTypeEnum";
import { defineStore } from "pinia";

export const useModalStore = defineStore("modalStore", {
  state: () => ({
    isOpen: false,
    modalType: ENUM_MODAL_TYPE.PICO_VIEW,
    data: {
      message: "",
      image: "",
      images: [""],
      width: "0",
      height: "0",
      align: ENUM_IMAGE_ALIGN.CENTER,
    } as modalDataInterface,
  }),
  actions: {
    setImage(url: string, modalType: ENUM_MODAL_TYPE) {
      this.data.image = url;
      this.isOpen = true;
      this.modalType = modalType;
      this.updateModalState();
    },
    setImages(urls: string[], modalType: ENUM_MODAL_TYPE) {
      this.data.images = urls;
      this.isOpen = true;
      this.modalType = modalType;
      this.updateModalState();
    },
    setMessage(message: string, modalType: ENUM_MODAL_TYPE) {
      this.data.message = message;
      this.isOpen = true;
      this.modalType = modalType;
      this.updateModalState();
    },
    updateModalState() {
      if (!this.isOpen) {
        const openModalEvent = new CustomEvent("close-modal", {
          detail: { data: this.data },
        });
        window.dispatchEvent(openModalEvent);
        return;
      } else {
        const openModalEvent = new CustomEvent("open-modal", {
          detail: { data: this.data },
        });
        window.dispatchEvent(openModalEvent);
      }
    },
  },
});
