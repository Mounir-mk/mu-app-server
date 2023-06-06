const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");

const prisma = new PrismaClient();

const { generatePassword } = require("../services/generatePassword");
const { sendEmail } = require("../services/emailSending");

// Create a team with a manager and an invitation link to invite other users, this controller is used by the admin only
const createTeam = async (req, res) => {
  const {
    managerFirstname,
    managerLastname,
    managerEmail,
    teamMaxSize,
    companyName,
  } = req.body;

  const teamName = `Team - ${(await prisma.team.count()) + 1}`;
  const companyNameToUse = companyName || "Non spécifié";

  const hashOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    parallelism: 1,
    timeCost: 5,
  };

  const generatedPassword = generatePassword();

  try {
    const manager = await prisma.user.create({
      data: {
        firstname: managerFirstname,
        lastname: managerLastname,
        email: managerEmail,
        hashed_password: await argon2.hash(generatedPassword, hashOptions),
        role: "chief",
        company: {
          connectOrCreate: {
            where: {
              name: companyNameToUse,
            },
            create: {
              name: companyNameToUse,
            },
          },
        },
      },
    });
    console.warn(`Created manager: ${manager.email}`);

    const team = await prisma.team.create({
      data: {
        name: `Team - ${(await prisma.team.count()) + 1}`,
        max_size: parseInt(teamMaxSize, 10),
        manager: {
          connect: {
            id: manager.id,
          },
        },
        company: {
          connectOrCreate: {
            where: {
              name: companyNameToUse,
            },
            create: {
              name: companyNameToUse,
            },
          },
        },
        users: {
          connect: {
            id: manager.id,
          },
        },
      },
    });
    console.warn(`Created team: ${team.name}`);

    // Calculate usageLimit by excluding the manager
    const usageLimit = teamMaxSize - 1;

    // Create an invitation link
    const token = Math.random().toString(36).substr(2, 10);
    const invitationLink = `${process.env.FRONTEND_URL}/register?invitationToken=${token}`;
    await prisma.invitation.create({
      data: {
        token,
        usage_limit: usageLimit,
        teamId: team.id,
      },
    });
    console.warn(`Created invitation link: ${invitationLink}`);

    // send email to manager with his generated password and team name
    const emailData = {
      to: managerEmail,
      subject: "Bienvenue sur Mu Entreprise",

      message: `Bonjour <strong>${managerFirstname} ${managerLastname}</strong>,<br><br>
      Votre compte a été créé avec succès.<br>
      Votre mot de passe est : <strong>${generatedPassword}</strong><br>
      Vous pouvez vous connecter à l'application avec votre adresse email et ce mot de passe.<br><br>
      Votre équipe s'appelle : <strong>${teamName}</strong><br><br>
      Vous pouvez inviter vos collègues à rejoindre votre équipe en leur envoyant ce lien : <a href="${invitationLink}">${invitationLink}</a><br><br>
      Cordialement,<br>
      L'équipe Mu Entreprise`,
    };
    req.emailData = emailData;
    sendEmail(req, res);

    res.status(200).send({
      success: true,
      message: "Team created successfully",
      data: { manager, team },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function browse(req, res) {
  try {
    const teams = await prisma.team.findMany({
      include: {
        manager: true,
        company: true,
        users: true,
        invitations: true,
      },
    });

    const teamsWithDetails = teams.map((team) => {
      const numberOfEmployees = team.users.length;

      return {
        id: team.id,
        name: team.name,
        managerName:
          `${team.manager.firstname} ${team.manager.lastname}` || "No Manager",
        numberOfEmployees,
        max_size: team.max_size,
        invitationToken: team.invitations[0]?.token || "No Token",
        companyName: team.company.name,
      };
    });

    res.status(200).json(teamsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getTeamByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const team = await prisma.team.findFirst({
      where: {
        users: {
          some: {
            id: parseInt(id, 10),
          },
        },
      },
      include: {
        manager: true,
        users: true,
        invitations: true,
      },
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const teamWithDetails = {
      id: team.id,
      name: team.name,
      numberOfEmployees: team.users.length,
      employee: team.users.map((user) => ({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      })),
      max_size: team.max_size,
      invitationToken: team.invitations[0]?.token || "No Token",
    };

    res.status(200).json(teamWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

const edit = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const team = await prisma.team.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        name,
      },
    });

    res.status(200).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const team = await prisma.team.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    res.status(200).json({
      team,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTeam,
  browse,
  getTeamByUserId,
  edit,
  destroy,
};
