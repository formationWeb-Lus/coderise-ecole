const { PrismaClient, Role } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.user.upsert({
    where: { email: "admin@coderise.com" },
    update: {},
    create: {
      email: "admin@coderise.com",
      name: "Admin",
      role: Role.ADMIN,
      password: "admin123",
    },
  });

  console.log("✅ Seeding terminé avec succès");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
