INSERT INTO "User" 
(name, email, password, id, phone, image, role)
VALUES

('Alexandre Lusa', 'jiresselusa127@gmail.com', '$2b$10$tg1uiUSIaGjj5ES50hg0JeFtyyZOjH41GnG9piI5cEzeG.lkkgFKC', 2, '0899864081', NULL, 'ADMIN'),

('rodriguez Songoy munsense', 'rodmunsense@gmail.com', '$2b$10$DT2Vz6eSUlpPBxIpYTbqLOfn.Als.i/xqQjaUxnP3R5a/gYODnaVW', 3, '+243995214007', NULL, 'STUDENT'),

('Mufuankolo', 'mufuankolojames@gmail.com', '$2b$10$3QG5MhTbnJd0zgSVq66JKuqNJJBrdk5ugTGCgRfQjKWzZOpso5yJm', 4, '+243820803136', NULL, 'STUDENT'),

('alexandre lusa', 'jiresselus@gmail.com', '$2b$10$ewGiPZQsrwizwNqAjn//G.4vrbKs4y/cZi0PylyD.iVuhsdR5s6De', 14, '08866589562', NULL, 'STUDENT'),

('alexandre lusa', 'jiresselusa@gmail.com', '$2b$10$S71bYl3EO2cmdNruiY.SMOl8XTQJZn5ukc4gkejeAGVjGRRNfzN.m', 15, '0995271831', NULL, 'STUDENT'),

('Prince Bahati', 'pbkanambi@gmail.com', '$2b$10$dfcNkKNmoLvtPSE/fYe8jOK2RfYBmBfOoQzQYOJm8GD0D1s1IG34W', 16, '+243978315631', NULL, 'STUDENT'),

('jimmy baniki mukishi', 'banikimukishijimmy@gmail.com', '$2b$10$JXGvSTqGf3m9y3MacXeu4uFMLUKvHdhINHdnWCNBCOt9ZQaW6v4Wa', 17, '+243978415814', NULL, 'STUDENT'),

('Farael', 'faraelsam06@gmail.com', '$2b$10$HOZx58W6nyHMc1L3Jsx5BeOa.UvZYT9Qd07uST4BPB2A1DimSEfeO', 18, '+243896706412', NULL, 'STUDENT')

ON CONFLICT (id) DO NOTHING;


INSERT INTO "StudentCourse" (id, "userId", "courseId", "studentId") VALUES
(1, 9, 15, NULL),
(2, 9, 6, NULL),
(3, 7, 15, NULL),
(4, 7, 6, NULL),
(6, 11, 21, 1),
(7, 11, 21, 2),
(8, 11, 6, 2),
(9, 11, 15, 2),
(10, 11, 15, 3),
(11, 11, 6, 3),
(12, 11, 30, 2);


INSERT INTO "Student" (id, name, email) VALUES
(1, 'Jerome Mata', 'Jeromekeys7@gmail.com'),
(2, 'Alexandre lusa', 'jiresselusa127@gmail.com'),
(3, 'mufuankolo', 'mufuankolojames@gmail.com');



INSERT INTO "Course" (id, title, description, "imageUrl", duration, "createdAt") VALUES
(1, 'Web Frontend', 'Ce cours enseigne la création d’interfaces web modernes et responsives avec HTML, CSS et JavaScript. Il met l’accent sur l’intégration web, l’accessibilité, les animations et l’optimisation de l’expérience utilisateur.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/AppelCr%C3%A9ationdeFonctions.jpg?raw=true', 40, '2025-12-31 07:39:10.108'),

(2, 'Responsive Web Design', 'Ce cours apprend à concevoir des sites web qui s’adaptent à tous les écrans (mobile, tablette, ordinateur). Les apprenants maîtriseront Flexbox, Grid, Media Queries et les bonnes pratiques du design mobile-first.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/pexels-shkrabaanthony-5475793.jpg?raw=true', 24, '2025-12-31 07:39:10.108'),

(3, 'Intégration Web & SEO', 'Ce cours est dédié à l’intégration professionnelle des sites web et à leur visibilité sur les moteurs de recherche. Il couvre le HTML sémantique, les performances web, l’optimisation SEO et l’accessibilité.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/OAuthetS%C3%A9curit%C3%A9desAPI.jpg?raw=true', 20, '2025-12-31 07:39:10.108'),

(4, 'Animations Web', 'Ce cours enseigne à créer des animations interactives et fluides sur les sites web avec CSS, JavaScript et des bibliothèques comme GSAP.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/ReactFondamentauxetProjetsInitiaux.jpg?raw=true', 15, '2025-12-31 09:14:52.389'),

(5, 'Accessibilité Web (a11y)', 'Ce cours est dédié à la création de sites accessibles pour tous, incluant les personnes en situation de handicap.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/pexels-shkrabaanthony-5475793.jpg?raw=true', 18, '2025-12-31 09:14:52.389'),

(6, 'Frontend Web Dynamique', 'Ce cours couvre les bases de la création de pages web interactives et dynamiques.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/ProgrammationAvanc%C3%A9eC%23.png?raw=true', 40, '2025-12-31 09:24:27.184'),

(7, 'Interactions JavaScript', 'Ce cours approfondit la manipulation du DOM et les interactions utilisateur avec JavaScript.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/csharpc.png?raw=true', 30, '2025-12-31 09:24:27.184'),

(8, 'Design Responsive et Mise en Page', 'Ce cours est dédié à la conception de sites adaptatifs et modernes.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/JavaScriptAvanc%C3%A9.jpg?raw=true', 25, '2025-12-31 09:24:27.184'),

(9, 'Hébergement Web et Collaboration', 'Ce cours enseigne comment héberger un site web sur GitHub Pages.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/pexels-fauxels-3182800.jpg?raw=true', 20, '2025-12-31 09:24:27.184'),

(10, 'Bonnes Pratiques et Qualité du Code', 'Ce cours montre comment écrire un code propre, lisible et maintenable.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/WebFull-StackD%C3%A9veloppementIntroduction.png?raw=true', 15, '2025-12-31 09:24:27.184'),

(11, 'WDD 130 : Fondamentaux du Web', 'Ce cours introduit les concepts essentiels du développement web.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/MVCetLivraisondeContenu.jpg?raw=true', 40, '2025-12-31 09:29:55.25'),

(12, 'Images et Médias Web', 'Ce cours enseigne comment intégrer des images et médias dans les pages web.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/TestsD%C3%A9bogageetGestiondesErreurs.jpg?raw=true', 25, '2025-12-31 09:29:55.25'),

(13, 'Gestion des Fichiers et Dossiers', 'Ce cours explique comment organiser efficacement les fichiers.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/Requ%C3%AAtesHTTPetDocumentationdAPI.jpg?raw=true', 20, '2025-12-31 09:29:55.25'),

(14, 'Publication sur GitHub Pages', 'Ce cours montre comment héberger et publier un site web en ligne.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/WebFrontend.jpg?raw=true', 15, '2025-12-31 09:29:55.25'),

(15, 'Atelier Pratique : Création d’une Page d’Accueil Étudiant', 'Ce cours pratique permet aux apprenants de créer leur première page HTML complète.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/ipad-632394_1280.jpg?raw=true', 30, '2025-12-31 09:29:55.25'),

(16, 'Web Service', 'Ce cours introduit les services web et l’architecture Node.js.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/Introduction%C3%A0laProgrammation.jpg?raw=true', 30, '2025-12-31 09:34:53.804'),

(17, 'Requêtes HTTP et Documentation d’API', 'Ce cours se concentre sur la réalisation de requêtes HTTP vers des API.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/api.png?raw=true', 25, '2025-12-31 09:34:53.804'),

(18, 'REST, Alternatives et Validation', 'Ce cours approfondit le REST et ses alternatives pour la création d’API.', NULL, 25, '2025-12-31 09:34:53.804'),

(19, 'OAuth et Sécurité des API', 'Ce cours enseigne les principes de sécurisation des API.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/Web-Backend.jpg?raw=true', 20, '2025-12-31 09:34:53.804'),

(20, 'Web-Backend', 'Ce cours introduit le développement web côté serveur.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/RESTAlternativesetValidation.jpg?raw=true', 40, '2025-12-31 09:38:21.284'),

(21, 'Bases de Données et SQL', 'Ce cours enseigne la gestion des données à l’aide de bases de données relationnelles.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/InsertionetValidationdesDonn%C3%A9es.png?raw=true', 35, '2025-12-31 09:38:21.284'),

(22, 'MVC et Livraison de Contenu', 'Ce cours couvre le modèle MVC et la livraison de contenu web.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/AuthentificationetAutorisation.jpg?raw=true', 30, '2025-12-31 09:38:21.284'),

(23, 'Insertion et Validation des Données', 'Ce cours explique comment insérer et valider les données côté serveur.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/big-data-7216839_1280.png?raw=true', 25, '2025-12-31 09:38:21.284'),

(24, 'Authentification et Autorisation', 'Ce cours enseigne comment gérer les comptes utilisateurs.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/Introduction%C3%A0laProgrammation.jpg?raw=true', 30, '2025-12-31 09:38:21.284'),

(25, 'Introduction à Python', 'Ce cours initie les apprenants à Python.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/Pr4ogrammationaveclesFonctionsIntroduction.png?raw=true', 20, '2025-12-31 09:47:41.614'),

(26, 'Introduction à la Programmation', 'Ce cours présente les fondamentaux de la programmation.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/pexels-mizunokozuki-12899188.jpg?raw=true', 25, '2025-12-31 09:47:41.614'),

(27, 'Programmation avec les Fonctions : Introduction', 'Ce cours initie les apprenants aux concepts fondamentaux des fonctions.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/pexels-mizunokozuki-12899188.jpg?raw=true', 25, '2025-12-31 09:50:37.304'),

(28, 'Appel et Création de Fonctions', 'Ce cours approfondit l’utilisation des fonctions.', NULL, 30, '2025-12-31 09:50:37.304'),

(29, 'Tests, Débogage et Gestion des Erreurs', 'Ce cours enseigne les techniques de test et débogage.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/testin%20error.png?raw=true', 25, '2025-12-31 09:50:37.304'),

(30, 'CSharp', 'Ce cours introduit les fondamentaux de C#.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/csharpc.png?raw=true', 30, '2025-12-31 09:54:24.42'),

(31, 'Programmation Avancée en C#', 'Ce cours approfondit la maîtrise des concepts de C#.', NULL, 35, '2025-12-31 09:54:24.42'),

(32, 'Web Full-Stack Développement : Introduction', 'Ce cours introduit les concepts de développement Full-Stack.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/pexels-fauxels-3182800.jpg?raw=true', 25, '2025-12-31 10:04:28.894'),

(33, 'React : Fondamentaux et Projets Initiaux', 'Ce cours enseigne les bases de React.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/pexels-anete-lusina-5239917.jpg?raw=true', 30, '2025-12-31 10:04:28.894'),

(34, 'Next.js et Applications Web Avancées', 'Ce cours approfondit Next.js.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/office-620822_1280.jpg?raw=true', 30, '2025-12-31 10:04:28.894'),

(35, 'Gestion des API et Communication Frontend-Backend', 'Ce cours enseigne comment intégrer des API REST.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/image/pexels-markusspiske-177598.jpg?raw=true', 25, '2025-12-31 10:04:28.894'),

(36, 'Optimisation et Debugging Full-Stack', 'Ce cours couvre les techniques d’optimisation et de débogage.', 'https://github.com/formationWeb-Lus/coderise-images/blob/main/images/MVCetLivraisondeContenu.jpg?raw=true', 25, '2025-12-31 10:04:28.894');



INSERT INTO "Module" (id, "courseId", "order", title) VALUES
(1, 6, 1, 'Introduction au cours'),
(2, 6, 2, 'Introduction à JavaScript'),
(3, 6, 3, 'Révision HTML et CSS'),
(4, 6, 4, 'Conventions de dénomination'),
(5, 6, 5, 'Projet final et évaluation'),

(6, 15, 1, 'Introduction au Projet : Page d’Accueil Étudiant'),
(7, 15, 2, 'Structure HTML de la Page d’Accueil'),
(8, 15, 3, 'Intégration des Images et Organisation des Fichiers'),
(9, 15, 4, 'Mise en Forme et Bonnes Pratiques HTML'),
(10, 15, 5, 'Publication du Projet sur GitHub et Évaluation Finale'),

(11, 21, 1, 'Introduction aux bases de données'),
(12, 21, 2, 'Stockage de données'),
(13, 21, 3, 'Base de données relationnelles'),
(14, 21, 4, 'Conception et création de bases de données'),
(15, 21, 5, 'Collecte des données');



INSERT INTO "Lesson"
(id, "moduleId", "order", title, content, "videoUrl", "pdfUrl", description, "videoDescription")
VALUES

(1, 2, 1, 'Introduction de JavaScript',
'JavaScript est un langage de programmation populaire et largement pris en charge, utilisé pour créer des pages web interactives et dynamiques, des applications mobiles, des applications de bureau, etc. C''est un langage interprété de haut niveau, conçu pour s''exécuter dans les navigateurs web, et il peut également être utilisé côté serveur grâce à des technologies comme Node.js.

Dans ce cours, vous apprendrez à appliquer vos connaissances préalables en programmation au développement web en utilisant JavaScript. Ce langage utilise les mêmes principes et structures de contrôle communes que d''autres langages de programmation tels que Python et C#.',
'https://youtu.be/7nsg0MFXoho',
'https://dynamic-files.onrender.com/download/Document%20sans%20titre%20(2).pdf',
'Découverte des bases de JavaScript et de son utilisation dans le développement web.',
NULL),

(2, 2, 2, 'Comprendre les variables en JavaScript',
'Pour vous permettre de mieux comprendre le fonctionnement de JavaScript, ce cours aborde les fonctionnalités et les structures de contrôle fondamentales du langage, notamment les variables. Ces structures et concepts de programmation sont communs à tous les langages. Les cas d''utilisation présentés ici constituent une révision des notions abordées dans les cours préalables.',
'https://youtu.be/6528zecefnw',
'https://dynamic-files.onrender.com/download/Document%20sans%20titre%20(2).pdf',
'Comprendre la déclaration et l’utilisation des variables en JavaScript.',
NULL),

(3, 2, 3, 'Constructions JavaScript',
'Les cours de programmation préalables vous ont permis d''acquérir une compréhension fondamentale des structures de programmation courantes, notamment les opérateurs, les expressions, les structures de décision, les boucles et les fonctions. Cette activité porte sur quelques structures de contrôle essentielles.',
'https://youtu.be/-fwJ-hXRtSw',
'https://dynamic-files.onrender.com/download/Constructions%20JavaScript.pdf',
'Apprendre les structures de contrôle fondamentales en JavaScript.',
NULL),

(4, 2, 3, 'Vidéo pratique pour maîtriser les constructions JavaScript',
'En programmation, les opérateurs sont des symboles utilisés pour effectuer des opérations sur des opérandes (variables et valeurs) et pour traiter des expressions. De nombreux opérateurs réalisent des opérations mathématiques telles que l''addition, la soustraction, la multiplication et la division. D''autres gèrent l''affectation, la comparaison et les opérations logiques.',
'https://youtu.be/0LRqsv9CuYw',
'https://dynamic-files.onrender.com/download/Constructions%20JavaScript.pdf',
'Maîtriser les opérateurs et expressions JavaScript à travers des exemples pratiques.',
NULL),

(5, 2, 4, 'Modèle objet de document',
'Une compétence essentielle pour tout développeur web front-end est la capacité à manipuler le DOM (Document Object Model), un objet JavaScript créé par le navigateur après l''analyse du document HTML.

Manipuler le DOM signifie lire, modifier, mettre à jour ou supprimer dynamiquement des éléments et leurs propriétés CSS. Le DOM est la représentation arborescente de la structure et du contenu de votre page.

L''objectif de cette activité est de présenter le DOM HTML et d''apprendre à manipuler le document à l''aide de JavaScript.',
'https://youtu.be/wVIjdaoXHvQ',
'https://dynamic-files.onrender.com/download/DOM%20JavaScript.pdf',
'Découvrir et manipuler le DOM avec JavaScript.',
NULL),

(6, 2, 5, 'Maîtriser les méthodes de tableaux JavaScript comme un pro',
'Prêts à explorer l''univers fascinant des tableaux JavaScript ? Accrochez-vous, car nous allons découvrir quelques-unes des méthodes les plus originales et utiles qu''ils offrent. De l''ajout et la suppression d''éléments au découpage et à la manipulation de tableaux, nous allons tout vous apprendre.',
'https://youtu.be/9rnBvw0_8Js',
'https://dynamic-files.onrender.com/download/OBJECT%20JavaScript.pdf',
'Apprendre les principales méthodes de manipulation des tableaux JavaScript.',
NULL),

(15, 1, 1, 'Lesson1: instalation Git',
'Dans ce cours, les étudiants apprendront ce qu’est Git, pourquoi il est indispensable pour le développement logiciel moderne, et comment l’installer correctement sur leur ordinateur (Windows, macOS ou Linux). À la fin de cette leçon, ils seront capables de vérifier l’installation de Git et de l’utiliser pour la gestion de versions de leurs projets.',
'https://youtu.be/Wv2O7cBsUto',
'https://dynamic-files.onrender.com/download/1767678019831-Configuration%20W01.pdf',
'Installation de Git sur Windows, macOS et Linux, avec vérification du bon fonctionnement de l’outil.',
NULL),

(16, 6, 1, 'Lesson1: instalation Git',
'Dans ce cours, les étudiants apprendront ce qu’est Git, pourquoi il est indispensable pour le développement logiciel moderne, et comment l’installer correctement sur leur ordinateur (Windows, macOS ou Linux). À la fin de cette leçon, ils seront capables de vérifier l’installation de Git et de l’utiliser pour la gestion de versions de leurs projets.',
'https://youtu.be/Wv2O7cBsUto',
'https://dynamic-files.onrender.com/download/1767678019831-Configuration%20W01.pdf',
'Installation de Git sur Windows, macOS et Linux, avec vérification du bon fonctionnement de l’outil.',
NULL),

(17, 6, 1, 'Lesson2: Outils – Hébergement – Dépôt GitHub',
'Ce cours utilise la plateforme GitHub pour héberger vos travaux et le service GitHub Pages pour les afficher sous forme de site web classique, accessible aux utilisateurs.',
'https://youtu.be/FWZ1gtnrhS0',
'https://dynamic-files.onrender.com/download/1767678019831-Configuration%20W01.pdf',
'L''objectif de cette activité de configuration est de mettre en place un dépôt distant qui permettra de générer et de diffuser des pages web aux clients.',
NULL),

(18, 1, 2, 'Lesson2: Outils – Hébergement – Dépôt GitHub',
'GitHub est une plateforme web de gestion de versions et de collaboration. Elle offre les fonctionnalités de contrôle de versions distribué et de gestion du code source de Git, tout en possédant ses propres caractéristiques.',
'https://youtu.be/FWZ1gtnrhS0',
'https://dynamic-files.onrender.com/download/1767678019831-Configuration%20W01.pdf',
'Ce cours utilise la plateforme GitHub pour héberger vos travaux et le service GitHub Pages pour les afficher sous forme de site web classique, accessible aux utilisateurs.',
NULL),

(19, 1, 3, 'Lesson3 CSS avec exemples concrets',
'Tandis que le CSS définit l’apparence visuelle. Sans CSS, une page web fonctionne, mais elle est très basique et peu agréable à lire.',
'https://youtu.be/X5xF-XD2LB0',
'https://dynamic-files.onrender.com/download/1767811170221-Activit%C3%83%C2%A9%20d''apprentissage%20S1%20_%20Conventions%20de%20d%C3%83%C2%A9nomination.pdf',
'Le CSS (Cascading Style Sheets) est le langage qui permet de styliser une page HTML.',
NULL),

(20, 1, 4, 'Comment effectuer un commit efficace sur GitHub',
'Un commit est un enregistrement de modifications dans votre projet. Il permet de garder l’historique de votre travail et de collaborer facilement avec d’autres développeurs.',
'https://youtu.be/HUobLR60M2w',
NULL,
'Apprenez à sauvegarder vos modifications dans Git et à les envoyer sur GitHub grâce à des commits clairs et organisés.',
NULL),

(21, 1, 5, 'Lesson5 Comment créer une page sur GitHub',
'GitHub Pages est un service gratuit qui permet d’héberger des sites web directement depuis un dépôt GitHub.',
'https://youtu.be/CUmxGWiNpRY',
NULL,
'Apprenez à publier votre site web directement depuis un dépôt GitHub en utilisant GitHub Pages.',
NULL),

(22, 11, 1, 'Configuration S1 : MySQL Workbench',
'Il est utile de disposer d''une application graphique performante pour travailler avec des bases de données.',
'https://youtu.be/8iunlY-pH5o',
'https://drive.google.com/file/d/1r9Z0bky3IKColtZezFKkrwY8tYnnSpaA/view?usp=sharing',
'Installation de Windows MySQL Workbench',
NULL),

(23, 11, 2, 'Explorer MySQL Workbench',
'Regardez les quatre vidéos suivantes et suivez les instructions sur votre ordinateur.',
'https://youtu.be/lPEfJHA2KEo',
NULL,
'Se familiariser avec l''outil CASE utilisé dans le cadre de ce cours.',
NULL),

(24, 11, 3, 'Explorer MySQL Workbench',
'Se familiariser avec l''outil CASE utilisé dans le cadre de ce cours.',
'https://youtu.be/H7gd0_RIjNM',
NULL,
'Objectif : Se familiariser avec l''outil CASE utilisé dans le cadre de ce cours.',
NULL),

(25, 11, 4, 'Activité d''apprentissage S1 : Comprendre les données',
'Cette semaine, vous allez apprendre ce que sont les données et les bases de données.',
'https://youtu.be/E08bJKZXN3E',
'https://drive.google.com/file/d/1dTTaJ85u2Dp4OAkJfqqTvzHltZ5T_P_8/view?usp=sharing',
'Termes à connaître : téléchargez le PDF et lisez-le attentivement.',
NULL);  

INSERT INTO "Quiz" (id, "lessonId", title, "order", "createdAt")
VALUES
(1, 19, 'Les bases du CSS', 0, '2026-01-08 12:51:52.487'),
(2, 25, 'Comprendre les données', 0, '2026-01-16 16:25:58.113');


INSERT INTO "Question" (id, "quizId", question, type, options, answer, points)
VALUES
(1, 1, 'Quel est le rôle principal du CSS ?', 'QCM',
 '["Ajouter du contenu dynamique","Styliser et mettre en forme les éléments HTML","Créer des bases de données","Envoyer des emails"]',
 'Styliser et mettre en forme les éléments HTML', 10),

(2, 1, 'Que signifie `* { margin: 0; padding: 0; }` dans un reset CSS ?', 'QCM',
 '["Appliquer margin et padding par défaut","Supprimer les marges et paddings par défaut","Ajouter une bordure à tous les éléments","Créer des animations"]',
 'Supprimer les marges et paddings par défaut', 10),

(3, 1, 'Quelle propriété CSS permet de changer la police de caractères ?', 'QCM',
 '["font-style","text-transform","font-family","font-weight"]',
 'font-family', 10),

(4, 1, 'Que fait `display: grid;` ?', 'QCM',
 '["Active le modèle Flexbox","Permet d’aligner les éléments horizontalement uniquement","Active le modèle CSS Grid pour organiser les éléments","Masque les éléments"]',
 'Active le modèle CSS Grid pour organiser les éléments', 10),

(5, 1, 'Comment créer 3 colonnes de taille égale dans CSS Grid ?', 'QCM',
 '["grid-template-columns: 1fr 2fr 3fr;","grid-template-columns: repeat(3, 1fr);","columns: 3;","grid-columns: 33%;"]',
 'grid-template-columns: repeat(3, 1fr);', 10),

(6, 1, 'Quel `display` est utilisé pour aligner des éléments sur une seule ligne facilement ?', 'QCM',
 '["block","inline-block","flex","grid"]',
 'flex', 10),

(7, 1, 'Comment supprimer les puces d’une liste non ordonnée ?', 'QCM',
 '["list-style: none;","display: none;","text-decoration: none;","margin: 0;"]',
 'list-style: none;', 10),

(8, 1, 'Quel pseudo-sélecteur permet d’ajouter un style au survol d’un lien ?', 'QCM',
 '[":hover",":active",":focus",":visited"]',
 ':hover', 10),

(9, 1, 'Comment donner un fond rouge au deuxième `<section>` seulement ?', 'QCM',
 '["section:nth-child(2) { background-color: red; }","section:nth-of-type(2) { background-color: red; }","section[2] { background-color: red; }","section.second { background-color: red; }"]',
 'section:nth-of-type(2) { background-color: red; }', 10),

(10, 1, 'Quelle propriété CSS arrondit les angles d’un élément ?', 'QCM',
 '["border-width","border-radius","border-style","border-color"]',
 'border-radius', 10),

(11, 2, 'Que sont les données ?', 'QCM',
 '["Des informations déjà interprétées","Des connaissances utilisées pour décider","Des bribes d’informations sans contexte","Des décisions stratégiques"]',
 'Des bribes d’informations sans contexte', 10),

(12, 2, 'Quand les données deviennent-elles des informations ?', 'QCM',
 '["Lorsqu’elles sont stockées dans une base de données","Lorsqu’elles sont triées","Lorsqu’elles sont pertinentes et ont du sens pour quelqu’un","Lorsqu’elles sont numériques"]',
 'Lorsqu’elles sont pertinentes et ont du sens pour quelqu’un', 10),

(13, 2, 'Quelle est la différence principale entre information et connaissance ?', 'QCM',
 '["La connaissance est moins précise","La connaissance correspond à la compréhension de l’importance de l’information","L’information est toujours fausse","Il n’y a aucune différence"]',
 'La connaissance correspond à la compréhension de l’importance de l’information', 8),

(14, 2, 'La prise de décision consiste à :', 'QCM',
 '["Collecter des données","Trier des informations","Mettre en pratique les connaissances acquises","Stocker des données"]',
 'Mettre en pratique les connaissances acquises', 8),

(15, 2, 'Qu’est-ce qu’une entité ?', 'QCM',
 '["Une personne, un lieu, une chose ou un concept sur lequel on collecte des données","Une valeur unique","Une ligne dans une table","Une colonne dans une table"]',
 'Une personne, un lieu, une chose ou un concept sur lequel on collecte des données', 9),

(16, 2, 'Un attribut correspond à :', 'QCM',
 '["Une entité complète","Une caractéristique décrivant une entité","Une base de données","Une décision"]',
 'Une caractéristique décrivant une entité', 8),

(17, 2, 'Quel est l’objectif principal de la prise de décision fondée sur les données ?', 'QCM',
 '["Gagner du temps","Éviter les biais et les fausses hypothèses","Stocker plus de données","Utiliser uniquement l’intuition"]',
 'Éviter les biais et les fausses hypothèses', 8),

(18, 2, 'Que fait une requête ?', 'QCM',
 '["Elle supprime les données","Elle stocke les données","Elle pose une question aux données","Elle crée une entité"]',
 'Elle pose une question aux données', 8),

(19, 2, 'Quelle est la conséquence de la redondance des données ?', 'QCM',
 '["Amélioration de la performance","Gain d’espace","Gaspillage d’espace et difficultés de mise à jour","Meilleure cohérence"]',
 'Gaspillage d’espace et difficultés de mise à jour', 9),

(20, 2, 'L’intégrité des données signifie :', 'QCM',
 '["Que les données sont stockées dans Excel","Que les données sont exactes et fiables","Que les données sont nombreuses","Que les données sont publiques"]',
 'Que les données sont exactes et fiables', 10);


INSERT INTO "QuizSubmission" (id, "quizId", "userId", score, "submittedAt", "createdAt", "updatedAt")
VALUES
(2, 1, 7, 100, '2026-01-09 08:02:07.739', '2026-01-09 04:22:41.13', '2026-01-09 08:02:07.741'),
(7, 1, 9, 70, '2026-01-10 16:13:46.546', '2026-01-09 17:20:14.542', '2026-01-10 16:13:46.696');

INSERT INTO "Announcement" (id, "courseId", title, content, "createdAt", "videoUrl")
VALUES
(1, 6, 'Comprendre correctement le devoir avant de commencer', 
'Le CSS Responsive permet à un site web de s’adapter à toutes les tailles d’écran : ordinateurs, tablettes, téléphones.
L’objectif est d’offrir une expérience utilisateur optimale quel que soit le dispositif. 

CSS Grid

Le CSS Grid est une méthode moderne pour créer des mises en page en deux dimensions : lignes et colonnes.
Il est parfait pour construire des grilles complexes sans utiliser de frameworks externes.', 
'2026-01-08 06:43:10.908', 'https://youtu.be/tWSx3wGB_RU'),

(2, 6, 'utilisation de cette aplication', 
'Cette vidéo présente de manière claire et structurée la meilleure façon de naviguer sur l’ensemble de la plateforme de cours.', 
'2026-01-24 12:40:49.872', 'https://youtu.be/9I58-f4trxs'),

(3, 21, 'utilisation d''application', 
'Cette vidéo présente de manière claire et structurée la meilleure façon de naviguer sur l’ensemble de la plateforme de cours.', 
'2026-01-24 12:42:25.974', 'https://youtu.be/9I58-f4trxs'),

(4, 6, 'apprendre a soumettre le devoir', 
'Cette vidéo explique la procédure à suivre pour soumettre le devoir.', 
'2026-01-24 12:45:12.948', 'https://youtu.be/YOEKNL-26FM');
INSERT INTO "AnnouncementRead" (id, "userId", "announcementId", "readAt")
VALUES
(1, 7, 1, '2026-01-08 06:43:59.751'),
(2, 9, 1, '2026-01-10 16:15:46.265');

 
