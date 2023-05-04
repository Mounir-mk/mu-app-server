const express = require("express");

const router = express.Router();

const { sendEmail } = require("./services/emailSending");

router.post("/send-email", sendEmail);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

const teamController = require("./controllers/teamControllers");

router.post("/teams", teamController.createTeam);
router.get("/teams", teamController.browse);

const userController = require("./controllers/userControllers");

const { verifyPassword, hashPassword } = require("./services/auth");

router.post("/users", hashPassword, userController.register);
router.get("/users", userController.browse);
router.post(
  "/users/login",
  userController.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

module.exports = router;
