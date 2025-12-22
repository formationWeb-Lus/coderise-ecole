"use client";

import { useState } from "react";
import { CourseMenu } from "../types/courses"; // tes types

type SidebarProps = {
  courses: CourseMenu[];
  onSelectModule?: (moduleId: string, moduleTitle: string) => void;
};

export default function Sidebar({ courses, onSelectModule }: SidebarProps) {
  const [openCourses, setOpenCourses] = useState<string[]>([]);
  const [openModules, setOpenModules] = useState<string[]>([]);
  const [activeModule, setActiveModule] = useState<string | null>(null); // highlight

  const toggleCourse = (courseId: string) => {
    setOpenCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const toggleModule = (moduleId: string, moduleTitle: string) => {
    setOpenModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );

    setActiveModule(moduleId);

    if (onSelectModule) {
      onSelectModule(moduleId, moduleTitle);
    }
  };

  return (
    <aside className="w-64 bg-white p-4 border-r h-screen overflow-y-auto">
      {courses.map(course => (
        <div key={course.id} className="mb-2">
          {/* COURSES */}
          <div
            className={`cursor-pointer font-bold p-2 rounded ${
              openCourses.includes(course.id) ? "bg-blue-200" : "hover:bg-gray-100"
            }`}
            onClick={() => toggleCourse(course.id)}
          >
            {course.title}
          </div>

          {/* SUBMENU */}
          {openCourses.includes(course.id) && (
            <div className="pl-4 space-y-1 mt-1">

              {/* ANNONCES */}
              <div className="cursor-pointer p-1 rounded hover:bg-gray-100">
                Annonces
              </div>

              {/* MODULES */}
              {course.modules?.map(module => (
                <div key={module.id} className="pl-2">
                  <div
                    className={`cursor-pointer p-1 rounded ${
                      activeModule === module.id
                        ? "bg-blue-300"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleModule(module.id, module.title)}
                  >
                    {module.title}
                  </div>
                </div>
              ))}

              {/* GRADES */}
              <div className="cursor-pointer p-1 rounded hover:bg-gray-100">
                Grades
              </div>
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
