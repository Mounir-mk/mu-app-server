const express = require("express");
const jwt = require("jsonwebtoken");
const { refresh, checkRefreshToken } = require("./services/tokens");

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

const {
  verifyPassword,
  hashPassword,
  verifyToken,
} = require("./services/auth");

router.post(
  "/users/login",
  userController.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
router.post("/users", hashPassword, userController.register);

const tokenController = require("./controllers/tokenControllers");

router.get("/refreshTokens/:email", tokenController.getTokenByEmail);
router.get("/refreshTokens", tokenController.browse);
router.post("/refreshTokens/", tokenController.add);
router.put("/refreshTokens/:email", tokenController.edit);
router.delete("/refreshTokens/:email", tokenController.remove);

/* router.use(verifyToken); */

router.get("/users", userController.browse);

router.post("/refresh", refresh);
router.post("/checkRefreshToken", checkRefreshToken);

// Créez la route pour le rafraîchissement du token

module.exports = router;
