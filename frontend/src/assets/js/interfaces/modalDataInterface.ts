import type { ENUM_IMAGE_ALIGN } from "../utils/enums/ImageAlignEnum";

export interface modalDataInterface {
  message?: string;
  image?: string;
  images?: string[];
  width: string;
  height: string;
  align: ENUM_IMAGE_ALIGN;
}
