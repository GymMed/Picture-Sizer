const express = require("express");
const router = express.Router();
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const upload = require("../../config/multer").upload;

const messageHandler = require("../../config/middlewares/message");

router.post("/resize", upload.single("image"), async (req, res) => {
	try {
		const { width, height, align } = req.body; // align = 'center', 'top', 'bottom'
		const targetWidth = parseInt(width);
		const targetHeight = parseInt(height);

		const image = sharp(req.file.path);
		const metadata = await image.metadata();

		// Keep aspect ratio
		const ratio = Math.min(
			targetWidth / metadata.width,
			targetHeight / metadata.height
		);
		const newWidth = Math.round(metadata.width * ratio);
		const newHeight = Math.round(metadata.height * ratio);

		// Create blank canvas
		let top = 0,
			left = 0;
		if (align === "center") {
			top = Math.floor((targetHeight - newHeight) / 2);
			left = Math.floor((targetWidth - newWidth) / 2);
		} else if (align === "top") {
			left = Math.floor((targetWidth - newWidth) / 2);
		} else if (align === "bottom") {
			top = targetHeight - newHeight;
			left = Math.floor((targetWidth - newWidth) / 2);
		}

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
		fs.unlinkSync(req.file.path);

		res.set("Content-Type", "image/png");
		res.send(composite);
	} catch (error) {
		console.error(error);
		res.status(500).send("Error processing image");
	}
});

module.exports = router;
