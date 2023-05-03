const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const browse = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    users.forEach((user) => {
      const userToModify = user;
      delete userToModify.hashed_password;
    });
    res.json(users);
  } catch (err) {
    console.error(err);
  }
};
const getUserByEmailWithPasswordAndPassToNext = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      req.user = user;
      next();
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  browse,
  getUserByEmailWithPasswordAndPassToNext,
};
