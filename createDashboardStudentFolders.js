const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "app", "dashboard", "student");

const structure = [
  "courses/page.tsx",
  "courses/[courseId]/page.tsx",
  "courses/[courseId]/modules/page.tsx",
  "courses/[courseId]/modules/[moduleId]/page.tsx",
  "courses/[courseId]/modules/[moduleId]/lessons/page.tsx",
  "courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx",
  "courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/exercises/page.tsx",
];

structure.forEach((relativePath) => {
  const fullPath = path.join(baseDir, relativePath);
  const dir = path.dirname(fullPath);

  // Crée le dossier si inexistant
  fs.mkdirSync(dir, { recursive: true });

  // Crée un fichier page.tsx vide si inexistant
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(
      fullPath,
      `// ${relativePath} - Next.js page\nexport default function Page() {\n  return <div>${relativePath}</div>;\n}`
    );
    console.log("Créé :", fullPath);
  }
});

console.log("Arborescence student créée avec succès !");
