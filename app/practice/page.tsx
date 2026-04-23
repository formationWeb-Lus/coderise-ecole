"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p className="text-white">Chargement...</p>,
});

export default function PracticePage() {
  const [tab, setTab] = useState("html");
  const [mode, setMode] = useState<"editor" | "preview">("editor");

  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");

  const [output, setOutput] = useState("");
  const [projects, setProjects] = useState<any[]>([]);

  // 🎨 thème
  const [theme, setTheme] = useState("vs-dark");

  // 🔥 Load projets
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("coderise-projects") || "[]");
    setProjects(saved);
  }, []);

  // ▶ RUN
  const runCode = () => {
    const src = `
      <html>
        <style>${css}</style>
        <body>
          ${html}
          <script>${js}<\/script>
        </body>
      </html>
    `;
    setOutput(src);
    setMode("preview");
  };

  const goBack = () => setMode("editor");

  // 💾 SAVE
  const saveCode = () => {
    if (!html && !css && !js) {
      alert("Rien à sauvegarder !");
      return;
    }

    const name = prompt("Nom du projet ?") || "Projet sans nom";

    const newProject = {
      id: Date.now(),
      name,
      html,
      css,
      js,
    };

    const existing = JSON.parse(localStorage.getItem("coderise-projects") || "[]");
    const updated = [newProject, ...existing];

    localStorage.setItem("coderise-projects", JSON.stringify(updated));
    setProjects(updated);

    setHtml("");
    setCss("");
    setJs("");

    alert("Projet sauvegardé !");
  };

  // 📂 LOAD
  const loadProject = (p: any) => {
    setHtml(p.html);
    setCss(p.css);
    setJs(p.js);
    setMode("editor");
  };

  // ✏️ RENAME
  const renameProject = (id: number) => {
    const newName = prompt("Nouveau nom ?");
    if (!newName) return;

    const updated = projects.map((p) =>
      p.id === id ? { ...p, name: newName } : p
    );

    setProjects(updated);
    localStorage.setItem("coderise-projects", JSON.stringify(updated));
  };

  // 🗑 DELETE
  const deleteProject = (id: number) => {
    if (!confirm("Supprimer ce projet ?")) return;

    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem("coderise-projects", JSON.stringify(updated));
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a1b2d] text-white">

      {/* HEADER */}
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h1 className="font-bold text-sm md:text-lg">
          💻 CodeRise Practice
        </h1>

        <div className="flex gap-2">

          {/* 🎨 THEME */}
  <select
    value={theme}
    onChange={(e) => setTheme(e.target.value)}
    className="bg-white text-blue-600 px-3 py-1 rounded border border-blue-500 focus:outline-none"
  >
    <option value="vs-dark" className="text-blue-600">
      ● Dark
    </option>
    <option value="light" className="text-blue-600">
      ● Light
    </option>
  </select>

          {mode === "editor" ? (
            <>
              <button
                onClick={runCode}
                className="bg-green-500 px-3 py-1 rounded"
              >
                ▶ Run
              </button>

              <button
                onClick={saveCode}
                className="bg-blue-500 px-3 py-1 rounded"
              >
                💾 Save
              </button>
            </>
          ) : (
            <button
              onClick={goBack}
              className="bg-yellow-500 px-3 py-1 rounded"
            >
              ⬅ Back
            </button>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 min-h-0">

        {/* EDITOR */}
        <div className="flex flex-col flex-1">

          {mode === "editor" && (
            <>
              {/* TABS */}
              <div className="flex border-b border-gray-700 text-sm">
                {["html", "css", "js"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 px-3 py-2 ${
                      tab === t ? "bg-blue-800" : ""
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* EDITOR */}
              <div className="flex-1">
                {tab === "html" && (
                  <Editor
                    height="100%"
                    language="html"
                    value={html}
                    theme={theme}
                    onChange={(v) => setHtml(v || "")}
                  />
                )}
                {tab === "css" && (
                  <Editor
                    height="100%"
                    language="css"
                    value={css}
                    theme={theme}
                    onChange={(v) => setCss(v || "")}
                  />
                )}
                {tab === "js" && (
                  <Editor
                    height="100%"
                    language="javascript"
                    value={js}
                    theme={theme}
                    onChange={(v) => setJs(v || "")}
                  />
                )}
              </div>
            </>
          )}

          {/* PREVIEW */}
          {mode === "preview" && (
            <iframe
              srcDoc={output}
              className="w-full h-full bg-white"
              sandbox="allow-scripts"
            />
          )}
        </div>

        {/* SIDEBAR */}
        <div className="w-56 border-l border-gray-700 p-2 bg-[#08121f] overflow-y-auto">
          <h2 className="text-sm mb-2">📁 Projets</h2>

          {projects.length === 0 && (
            <p className="text-gray-400 text-xs">Aucun projet</p>
          )}

          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-gray-800 p-2 mb-2 rounded text-xs"
            >
              <div
                onClick={() => loadProject(p)}
                className="cursor-pointer font-bold"
              >
                {p.name}
              </div>

              <div className="flex justify-between mt-1">
                <button
                  onClick={() => renameProject(p.id)}
                  className="text-yellow-400 text-xs"
                >
                  ✏️
                </button>

                <button
                  onClick={() => deleteProject(p.id)}
                  className="text-red-400 text-xs"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}