const express = require("express");
const path = require("path");
const cors = require("cors");
const router = require("./router");

const app = express();

process.env.TZ = "Europe/Paris";

app.use(cors("*"));

app.use(express.json());

// Serve the uploads folder for uploaded resources
app.use(express.static(path.join(__dirname, "../uploads")));

app.use(router);

module.exports = app;
