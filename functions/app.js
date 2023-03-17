const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const serverless = require("serverless-http");
const { mongoose } = require("mongoose");
require("dotenv").config();

const swaggerDocument = require('../swagger.json')
const contactsRouter = require("../routes/api/contacts");
const usersRouter = require("../routes/api/users");

const app = express();

const uriDb = process.env.DB_HOST;
mongoose.connect(uriDb, () => {
    console.log("Mongo connected");
});

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(
  "/avatars",
  express.static(path.join(process.cwd(), "public", "avatars"))
);

app.use("/.netlify/functions/app/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/.netlify/functions/app/contact", contactsRouter);
app.use("/.netlify/functions/app/user", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
module.exports.handler = serverless(app);