// seed.js
const { prisma } = require("../lib/prisma"); // <-- chemin relatif correct


async function main() {
  // Création d'un cours
  const course = await prisma.course.create({
    data: {
      title: "Fullstack Web Dev",
      description: "Apprends à créer des applications web complètes",
      duration: 12,
      imageUrl: null,
      modules: {
        create: [
          {
            order: 1,
            title: "Module 1 : Introduction",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : Présentation du cours", content: "Contenu Leçon 1", videoUrl: null },
                { order: 2, title: "Leçon 2 : Installation des outils", content: "Contenu Leçon 2", videoUrl: null },
              ],
            },
          },
          {
            order: 2,
            title: "Module 2 : HTML & CSS",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : Structure HTML", content: "Contenu Leçon 1", videoUrl: null },
                { order: 2, title: "Leçon 2 : Mise en page CSS", content: "Contenu Leçon 2", videoUrl: null },
              ],
            },
          },
          {
            order: 3,
            title: "Module 3 : JavaScript Basics",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : Variables et types", content: "Contenu Leçon 1", videoUrl: null },
                { order: 2, title: "Leçon 2 : Fonctions et boucles", content: "Contenu Leçon 2", videoUrl: null },
              ],
            },
          },
          {
            order: 4,
            title: "Module 4 : Advanced JS",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : Objet et classes", content: "Contenu Leçon 1", videoUrl: null },
              ],
            },
          },
          {
            order: 5,
            title: "Module 5 : Git & GitHub",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : Git basics", content: "Contenu Leçon 1", videoUrl: null },
              ],
            },
          },
          {
            order: 6,
            title: "Module 6 : Node.js",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : Introduction Node", content: "Contenu Leçon 1", videoUrl: null },
              ],
            },
          },
          {
            order: 7,
            title: "Module 7 : Express.js",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : Routes et Middleware", content: "Contenu Leçon 1", videoUrl: null },
              ],
            },
          },
          {
            order: 8,
            title: "Module 8 : PostgreSQL",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : Modélisation", content: "Contenu Leçon 1", videoUrl: null },
              ],
            },
          },
          {
            order: 9,
            title: "Module 9 : Prisma",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : ORM et migrations", content: "Contenu Leçon 1", videoUrl: null },
              ],
            },
          },
          {
            order: 10,
            title: "Module 10 : Next.js",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : Pages et Routes", content: "Contenu Leçon 1", videoUrl: null },
              ],
            },
          },
          {
            order: 11,
            title: "Module 11 : Deployment",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : Vercel et hébergement", content: "Contenu Leçon 1", videoUrl: null },
              ],
            },
          },
          {
            order: 12,
            title: "Module 12 : Projet Final",
            lessons: {
              create: [
                { order: 1, title: "Leçon 1 : Mise en place du projet", content: "Contenu Leçon 1", videoUrl: null },
              ],
            },
          },
        ],
      },
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });

  console.log("Cours et modules créés avec succès :", course);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
