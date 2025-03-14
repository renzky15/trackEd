const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://renzadmin:CYKS57yqK0JYZgw8rftK@tracked-db.cdi2w0a0qobc.ap-northeast-1.rds.amazonaws.com:5432/tracked",
    },
  },
});

async function seed() {
  try {
    console.log("Starting database seed...");

    // First, check if we can connect to the database
    await prisma.$connect();
    console.log("Successfully connected to database");

    // Create super admin
    console.log("Creating super admin user...");
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    const superAdmin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        name: "Super Admin",
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });
    console.log("Super admin created:", superAdmin);

    // Create staff admin
    console.log("Creating staff admin user...");
    const staffAdmin = await prisma.user.upsert({
      where: { email: "staff@example.com" },
      update: {},
      create: {
        email: "staff@example.com",
        name: "Staff Admin",
        password: bcrypt.hashSync("staff123", 10),
        role: "ADMIN_STAFF",
      },
    });
    console.log("Staff admin created:", staffAdmin);

    // Create facilities admin
    console.log("Creating facilities admin user...");
    const facilitiesAdmin = await prisma.user.upsert({
      where: { email: "facilities@example.com" },
      update: {},
      create: {
        email: "facilities@example.com",
        name: "Facilities Admin",
        password: bcrypt.hashSync("facilities123", 10),
        role: "ADMIN_FACILITIES",
      },
    });
    console.log("Facilities admin created:", facilitiesAdmin);

    // Create regular user
    console.log("Creating regular user...");
    const regularUser = await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        email: "user@example.com",
        name: "Regular User",
        password: bcrypt.hashSync("user123", 10),
        role: "USER",
      },
    });
    console.log("Regular user created:", regularUser);

    // Create test feedback
    console.log("Creating test feedback...");
    const feedback = await Promise.all([
      prisma.feedback.create({
        data: {
          title: "Staff Feedback",
          content: "This is a test feedback for staff category",
          rating: 4,
          category: "Staff",
          status: "IN_PROGRESS",
          userId: regularUser.id,
        },
      }),
      prisma.feedback.create({
        data: {
          title: "Facilities Feedback",
          content: "This is a test feedback for facilities category",
          rating: 5,
          category: "Facilities",
          status: "IN_PROGRESS",
          userId: regularUser.id,
        },
      }),
    ]);
    console.log("Test feedback created:", feedback);

    console.log("Database seed completed successfully");
  } catch (error) {
    console.error("Error during database seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("Database connection closed");
  }
}

// Run the seed function
seed();
