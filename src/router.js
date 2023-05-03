const express = require("express");

const router = express.Router();

const { sendEmail } = require("./services/emailSending");

router.post("/send-email", sendEmail);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

const teamController = require("./controllers/teamControllers");

router.post("/teams", teamController.createTeam);

const userController = require("./controllers/userControllers");
const { verifyPassword } = require("./services/auth");

router.get("/users", userController.browse);
router.post(
  "/users/login",
  userController.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

module.exports = router;
