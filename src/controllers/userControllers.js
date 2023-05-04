const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const register = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    dateOfBirth,
    description,
    invitationToken,
  } = req.body;

  // Find the invitation by token
  const invitation = await prisma.invitation.findUnique({
    where: { token: invitationToken },
  });

  // Check if the invitation exists and has not exceeded the usage limit
  if (!invitation || invitation.used_times >= invitation.usage_limit) {
    return res.status(400).json({ message: "Invalid or expired invitation" });
  }

  // Create the employee user
  await prisma.user.create({
    data: {
      firstname,
      lastname,
      email,
      hashed_password: req.body.hashed_password, // Use the hashed password from the middleware
      date_of_birth: new Date(dateOfBirth).toISOString(),
      description: description || null,
      role: "employee",
      teamId: invitation.teamId,
    },
  });

  // Increment the used_times value of the invitation
  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { used_times: { increment: 1 } },
  });

  res.status(201).json({ message: "Employee registered successfully" });

  return null;
};

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
  register,
};
