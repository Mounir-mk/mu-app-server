const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const router = express.Router();

const userController = require("./controllers/userControllers");

const {
  verifyPassword,
  hashPassword,
  refreshTokens,
  logout,
} = require("./services/auth");

router.post("/users", hashPassword, userController.register);
router.post("/register", hashPassword, async (req, res) => {
  const { email, hashedPassword } = req.body;
  const user = await prisma.user.create({
    data: {
      email,
      hashed_password: hashedPassword,
      role: "admin",
    },
  });
  res.json(user);
});

router.get("/users", userController.browse);
router.post(
  "/users/login",
  userController.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
router.post("/token", refreshTokens);
router.post("/users/logout", logout);

const teamController = require("./controllers/teamControllers");

router.post("/teams", teamController.createTeam);
router.get("/teams", teamController.browse);

module.exports = router;
