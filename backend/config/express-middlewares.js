const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const messageHandler = require("./middlewares/message");

require("./cron-jobs");
//const pagesRouter = require("../routes/pages");
// const postRoutes

const imageApiRouter = require("../routes/api/image-router");

function config(app) {
	app.use(express.json());
	app.use(
		session({
			secret: process.env.SESSIONS_SECRET,
			resave: false,
			saveUninitialized: false,
			store: new SQLiteStore({
				db: "picture-sizer.sessions.sqlite",
				dir: "./database",
			}),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 7,
			},
		})
	);
	app.use(declareResponseVariables);

	app.locals.APP_NAME = process.env.APP_NAME || "Picture Sizer";

	const publicRoutes = express.Router();
	publicRoutes.use(express.static("../frontend/dist"));
	app.use("/public", publicRoutes);
	//app.use(pagesRouter);

	app.use("/api/image", imageApiRouter);

	//error handling
	app.use((err, req, res, next) => {
		console.error("[ERROR] Error caught:" + err.stack);

		return res.redirect(
			`/${messageHandler.formatMessage(
				"We encountered a problem and are working on it!",
				messageHandler.MESSAGE_STATUSES.Error
			)}`
		);
	});
}

function declareResponseVariables(req, res, next) {
	res.locals.currentUrl = req.originalUrl;
	next();
}

module.exports = { config };
