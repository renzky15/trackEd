import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create super admin
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Super Admin",
      password: await hash("admin123", 12),
      role: Role.SUPER_ADMIN,
      lrnId: "LRN-ADMIN-001",
    },
  });

  console.log({ superAdmin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
