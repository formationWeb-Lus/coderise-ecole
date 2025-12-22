import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    include: { modules: { include: { lessons: true } } },
  });
  console.log(courses);
}

main().finally(() => prisma.$disconnect());
