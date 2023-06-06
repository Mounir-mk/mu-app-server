const express = require("express");

const router = express.Router();

const userController = require("./controllers/userControllers");

const {
  verifyPassword,
  hashPassword,
  refreshTokens,
  logout,
} = require("./services/auth");

router.post("/users", hashPassword, userController.register);

router.get("/users", userController.browse);
router.post(
  "/users/login",
  userController.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
router.post("/token", refreshTokens);
router.post("/users/logout", logout);

const teamController = require("./controllers/teamControllers");

router.get("/users/:id/teams", teamController.getTeamByUserId);
router.post("/teams", teamController.createTeam);
router.get("/teams", teamController.browse);
router.put("/teams/:id", teamController.edit);
router.delete("/teams/:id", teamController.destroy);

module.exports = router;
