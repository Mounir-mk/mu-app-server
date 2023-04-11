const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const data = require("./data");

async function main() {
  await prisma.user.createMany({
    data: data.users,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
