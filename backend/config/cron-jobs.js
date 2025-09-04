const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const IMAGE_DIR = path.join(__dirname, "../public/images");

cron.schedule("0 * * * *", () => {
	// Runs every hour
	const now = Date.now();
	const cutoff = 24 * 60 * 60 * 1000; // 24 hours

	fs.readdir(IMAGE_DIR, (err, files) => {
		if (err) return console.error("Read dir error:", err);

		files.forEach((file) => {
			const filePath = path.join(IMAGE_DIR, file);
			fs.stat(filePath, (err, stats) => {
				if (err) return console.error("Stat error:", err);

				if (now - stats.mtimeMs > cutoff) {
					fs.unlink(filePath, (err) => {
						if (err) console.error("Delete error:", err);
						else console.log(`Deleted old file: ${file}`);
					});
				}
			});
		});
	});
});
