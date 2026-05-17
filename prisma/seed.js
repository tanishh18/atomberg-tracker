const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      role: 'Admin',
    },
  });

  // Create Manager
  const manager = await prisma.user.create({
    data: {
      name: 'Manager User',
      role: 'Manager',
    },
  });

  // Create Employee under Manager
  const employee = await prisma.user.create({
    data: {
      name: 'Employee User',
      role: 'Employee',
      managerId: manager.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
