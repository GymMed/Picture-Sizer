const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

class ImageManager {
	static async resizeImages(files, targetWidth, targetHeight, align) {
		if (!Array.isArray(files)) files = [files].filter(Boolean);

		const promises = files.map((file) =>
			ImageManager.resizeImage(
				targetWidth,
				targetHeight,
				align,
				file.path
			)
		);

		return Promise.all(promises);
	}

	static async resizeImage(targetWidth, targetHeight, align, filePath) {
		const image = sharp(filePath);
		const metadata = await image.metadata();

		// Keep aspect ratio
		const ratio = Math.min(
			targetWidth / metadata.width,
			targetHeight / metadata.height
		);
		const newWidth = Math.round(metadata.width * ratio);
		const newHeight = Math.round(metadata.height * ratio);

		const { top, left } = ImageManager.getImageTopLeftPosition(
			align,
			targetWidth,
			targetHeight,
			newWidth,
			newHeight
		);

		const buffer = await image.resize(newWidth, newHeight).toBuffer();

		const composite = await sharp({
			create: {
				width: targetWidth,
				height: targetHeight,
				channels: 4,
				background: { r: 255, g: 255, b: 255, alpha: 1 }, // white background
			},
		})
			.composite([{ input: buffer, top, left }])
			.png()
			.toBuffer();

		// Clean up temp file
		fs.unlinkSync(filePath);
		return composite;
	}

	static getImageTopLeftPosition(
		align,
		targetWidth,
		targetHeight,
		newWidth,
		newHeight
	) {
		// Default offsets
		let top = 0;
		let left = 0;

		// Calculate offsets based on ENUM_IMAGE_ALIGN
		switch (align) {
			case "top-left":
				top = 0;
				left = 0;
				break;
			case "top-center":
				top = 0;
				left = Math.floor((targetWidth - newWidth) / 2);
				break;
			case "top-right":
				top = 0;
				left = targetWidth - newWidth;
				break;
			case "center-left":
				top = Math.floor((targetHeight - newHeight) / 2);
				left = 0;
				break;
			case "center":
				top = Math.floor((targetHeight - newHeight) / 2);
				left = Math.floor((targetWidth - newWidth) / 2);
				break;
			case "center-right":
				top = Math.floor((targetHeight - newHeight) / 2);
				left = targetWidth - newWidth;
				break;
			case "bottom-left":
				top = targetHeight - newHeight;
				left = 0;
				break;
			case "bottom-center":
				top = targetHeight - newHeight;
				left = Math.floor((targetWidth - newWidth) / 2);
				break;
			case "bottom-right":
				top = targetHeight - newHeight;
				left = targetWidth - newWidth;
				break;
		}

		return { top, left };
	}
}

module.exports = ImageManager;
