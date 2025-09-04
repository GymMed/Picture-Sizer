import pica from "pica";
import { ENUM_IMAGE_ALIGN } from "./enums/ImageAlignEnum";

export class ImageShaper {
  construct() {}

  static async resize(file: File, width: number, height: number, align: ENUM_IMAGE_ALIGN) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();

    // Original dimensions
    const originalWidth = img.width;
    const originalHeight = img.height;

    // Calculate aspect ratio scaling
    const scale = Math.min(width / originalWidth, height / originalHeight);

    const newWidth = originalWidth * scale;
    const newHeight = originalHeight * scale;

    // Create source canvas
    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = originalWidth;
    srcCanvas.height = originalHeight;
    const srcCtx = srcCanvas.getContext("2d")!;
    srcCtx.drawImage(img, 0, 0, originalWidth, originalHeight);

    // Create resized canvas
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = newWidth;
    resizedCanvas.height = newHeight;

    // Use Pica to resize with high quality
    await pica().resize(srcCanvas, resizedCanvas, {
      alpha: true,
      unsharpAmount: 80, // optional for sharpening
      unsharpRadius: 0.6,
      unsharpThreshold: 2,
    } as any);

    // Create target canvas with padding/alignment
    const targetCanvas = document.createElement("canvas");
    targetCanvas.width = width;
    targetCanvas.height = height;
    const ctx = targetCanvas.getContext("2d")!;

    // Fill background (transparent or white)
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, width, height);

    // Compute offsets for alignment
    const { offsetX, offsetY } = ImageShaper.getOffsets(width, height, newWidth, newHeight, align);

    // Draw the high-quality resized image onto the target canvas
    ctx.drawImage(resizedCanvas, offsetX, offsetY, newWidth, newHeight);

    // Convert to blob
    return new Promise<Blob>((resolve) =>
      targetCanvas.toBlob((blob) => resolve(blob!), "image/png")
    );
  }

  static getOffsets(
    canvasWidth: number,
    canvasHeight: number,
    imgWidth: number,
    imgHeight: number,
    align: ENUM_IMAGE_ALIGN
  ) {
    let offsetX = 0;
    let offsetY = 0;

    switch (align) {
      case ENUM_IMAGE_ALIGN.TOP_LEFT:
        offsetX = 0;
        offsetY = 0;
        break;
      case ENUM_IMAGE_ALIGN.TOP_CENTER:
        offsetX = (canvasWidth - imgWidth) / 2;
        offsetY = 0;
        break;
      case ENUM_IMAGE_ALIGN.TOP_RIGHT:
        offsetX = canvasWidth - imgWidth;
        offsetY = 0;
        break;
      case ENUM_IMAGE_ALIGN.CENTER_LEFT:
        offsetX = 0;
        offsetY = (canvasHeight - imgHeight) / 2;
        break;
      case ENUM_IMAGE_ALIGN.CENTER:
        offsetX = (canvasWidth - imgWidth) / 2;
        offsetY = (canvasHeight - imgHeight) / 2;
        break;
      case ENUM_IMAGE_ALIGN.CENTER_RIGHT:
        offsetX = canvasWidth - imgWidth;
        offsetY = (canvasHeight - imgHeight) / 2;
        break;
      case ENUM_IMAGE_ALIGN.BOTTOM_LEFT:
        offsetX = 0;
        offsetY = canvasHeight - imgHeight;
        break;
      case ENUM_IMAGE_ALIGN.BOTTOM_CENTER:
        offsetX = (canvasWidth - imgWidth) / 2;
        offsetY = canvasHeight - imgHeight;
        break;
      case ENUM_IMAGE_ALIGN.BOTTOM_RIGHT:
        offsetX = canvasWidth - imgWidth;
        offsetY = canvasHeight - imgHeight;
        break;
    }

    return { offsetX, offsetY };
  }
}
