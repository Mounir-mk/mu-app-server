const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

const userController = require("./controllers/userControllers");

router.get("/users", userController.browse);

module.exports = router;
