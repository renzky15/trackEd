const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://renzadmin:CYKS57yqK0JYZgw8rftK@tracked-db.cdi2w0a0qobc.ap-northeast-1.rds.amazonaws.com:5432/tracked",
    },
  },
});

async function testConnection() {
  try {
    console.log("Testing database connection...");
    const users = await prisma.user.findMany();
    console.log("Users in database:", users);
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
