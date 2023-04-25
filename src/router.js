const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

const userController = require("./controllers/userControllers");
const { verifyPassword } = require("./services/auth");

router.get("/users", userController.browse);
router.post(
  "/users/login",
  userController.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

module.exports = router;
