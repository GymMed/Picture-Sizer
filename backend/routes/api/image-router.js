const express = require("express");
const router = express.Router();

const upload = require("../../config/multer").upload;

const ImageManager = require("../../utils/managers/ImageManager");
const messageHandler = require("../../config/middlewares/message");

router.post("/resize", upload.array("images"), async (req, res) => {
	try {
		console.log("resize route reached", req.files);
		const { width, height, align } = req.body;
		const targetWidth = parseInt(width);
		const targetHeight = parseInt(height);

		const processedImages = await ImageManager.resizeImages(
			req.files,
			targetWidth,
			targetHeight,
			align
		);
		//res.set("Content-Type", "image/png");
		//res.send(composite);
		res.status(200).json({
			images: processedImages.map(
				(buf) => `data:image/png;base64,${buf.toString("base64")}`
			),
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Error processing image");
	}
});

module.exports = router;
