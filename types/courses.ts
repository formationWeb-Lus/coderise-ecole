// c:/Users/PC/coderise-ecole/types/courses.ts

export type Lesson = {
  id: string;
  title: string;
};

export type Week = {
  weekNumber: number; // S1, S2, ...
  lessons: Lesson[];
};

export type Module = {
  id: string;
  title: string;
  weeks: Week[];
};

export type CourseMenu = {
  id: string;
  title: string;
  announcements: string[];
  modules: Module[];
  grades: number[];
};
