const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getTokenByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        email,
      },
    });

    if (!refreshToken) {
      return res.status(404).json({ message: "Token not found" });
    }

    res.status(200).json(refreshToken);
  } catch (error) {
    console.error("Error retrieving token by email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const browse = async (req, res) => {
  try {
    const tokens = await prisma.refreshToken.findMany();
    res.status(200).json(tokens);
  } catch (error) {
    console.error("Error browsing tokens:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const edit = async (req, res) => {
  try {
    const { token, email } = req.body;

    const updatedToken = await prisma.refreshToken.update({
      where: {
        email: req.params.email,
      },
      data: {
        token,
        email,
      },
    });

    res.status(200).json(updatedToken);
  } catch (error) {
    console.error("Error editing token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const add = async (req, res) => {
  try {
    const { token, email } = req.body;

    const newToken = await prisma.refreshToken.create({
      data: {
        token,
        email,
      },
    });

    res.status(201).json(newToken);
  } catch (error) {
    console.error("Error adding token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const remove = async (req, res) => {
  try {
    await prisma.refreshToken.delete({
      where: {
        email: req.params.email,
      },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getTokenByEmail,
  browse,
  edit,
  add,
  remove,
};
