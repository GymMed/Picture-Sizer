import { zipSync, strToU8 } from "fflate";

export class Zipper {
  construct() {}

  static base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64.split(",")[1]); // remove "data:image/png;base64,"
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  static downloadZip(images: string[], fileName: string = "images.zip") {
    const files: Record<string, Uint8Array> = {};

    images.forEach((img, i) => {
      files[`image-${i + 1}.png`] = Zipper.base64ToUint8Array(img);
    });

    const zipped: Uint8Array = zipSync(files) as Uint8Array;
    const blob = new Blob([zipped as unknown as BlobPart], {
      type: "application/zip",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  static async downloadZipFromBlobs(blobs: Blob[], fileName = "images.zip") {
    const files: Record<string, Uint8Array> = {};

    for (let i = 0; i < blobs.length; i++) {
      const arrayBuffer = await blobs[i].arrayBuffer();
      files[`image-${i + 1}.png`] = new Uint8Array(arrayBuffer);
    }

    const zipped: Uint8Array = zipSync(files) as Uint8Array;
    const blob = new Blob([zipped as unknown as BlobPart], { type: "application/zip" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
}
