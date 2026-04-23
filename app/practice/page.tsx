"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p className="text-white">Chargement...</p>,
});

export default function PracticePage() {
  // 📦 STATE
  const [folders, setFolders] = useState<any[]>([]);
  const [activeFile, setActiveFile] = useState<any>(null);
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);

  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [mode, setMode] = useState<"editor" | "preview">("editor");

  const [output, setOutput] = useState("");
  const [saved, setSaved] = useState(true);
  const [theme, setTheme] = useState("vs-dark");

  // 📥 LOAD DATA FROM DB
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/folder");
        const data = await res.json();

        setFolders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("LOAD ERROR:", err);
        setFolders([]);
      }
    };

    load();
  }, []);

  // 📁 CREATE FOLDER
  const createFolder = async () => {
    const name = prompt("Nom du dossier ?");
    if (!name) return;

    const res = await fetch("/api/folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const folder = await res.json();

    setFolders((prev) => [folder, ...prev]);
  };

  // 📄 CREATE FILE
  const addFile = async (folderId: number) => {
    const name = prompt("Nom du fichier ?");
    if (!name) return;

    const res = await fetch("/api/codefile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        html: "",
        css: "",
        js: "",
        folderId,
      }),
    });

    const file = await res.json();

    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? { ...f, files: [file, ...(f.files || [])] }
          : f
      )
    );
  };

  // 📂 OPEN FILE
  const openFile = (file: any, folderId: number) => {
    setActiveFile(file);
    setActiveFolderId(folderId);
    setTab("html");
    setMode("editor");
    setSaved(true);
  };

  // ✏️ EDIT FILE (LOCAL ONLY)
  const updateFile = (key: string, value: string) => {
    if (!activeFile) return;

    setSaved(false);

    setActiveFile({
      ...activeFile,
      [key]: value,
    });
  };

  // 💾 MANUAL SAVE (IMPORTANT)
  const saveFile = async () => {
    if (!activeFile) return;

    try {
      const res = await fetch("/api/codefile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeFile.id, // update
          name: activeFile.name,
          html: activeFile.html,
          css: activeFile.css,
          js: activeFile.js,
          folderId: activeFolderId,
        }),
      });

      const data = await res.json();

      setActiveFile(data); // sync DB version
      setSaved(true);
    } catch (err) {
      console.error("SAVE ERROR:", err);
    }
  };

  // ▶ RUN CODE
  const runCode = () => {
    if (!activeFile) return;

    const src = `
      <html>
        <style>${activeFile.css}</style>
        <body>
          ${activeFile.html}
          <script>${activeFile.js}<\/script>
        </body>
      </html>
    `;

    setOutput(src);
    setMode("preview");
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a1b2d] text-white">

      {/* HEADER */}
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h1 className="font-bold">💻 CodeRise</h1>

        <div className="flex gap-2 items-center">

          <span className={saved ? "text-green-400" : "text-red-400"}>
            {saved ? "● Saved" : "● Unsaved"}
          </span>

          <button
            onClick={saveFile}
            className="bg-blue-500 px-2 rounded"
          >
            💾 Save
          </button>

          <button
            onClick={runCode}
            className="bg-green-500 px-2 rounded"
          >
            ▶ Run
          </button>

          <button
            onClick={createFolder}
            className="bg-white text-blue-600 px-2 rounded"
          >
            📁
          </button>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-white text-blue-600 px-2 rounded"
          >
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
          </select>

        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1">

        {/* EDITOR */}
        <div className="flex flex-col flex-1">

          {mode === "editor" && activeFile && (
            <>
              <div className="flex border-b border-gray-700">
                {["html", "css", "js"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t as any)}
                    className={`flex-1 p-2 ${
                      tab === t ? "bg-blue-800" : ""
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              <Editor
                height="100%"
                language={tab}
                theme={theme}
                value={activeFile[tab]}
                onChange={(v) => updateFile(tab, v || "")}
              />
            </>
          )}

          {mode === "preview" && (
            <iframe className="w-full h-full bg-white" srcDoc={output} />
          )}
        </div>

        {/* SIDEBAR */}
        <div className="hidden md:block w-64 bg-[#08121f] p-2 overflow-y-auto border-l">

          <button
            onClick={createFolder}
            className="bg-blue-600 w-full mb-2"
          >
            + Folder
          </button>

         {Array.isArray(folders) &&
  folders.map((folder) => (
    <div key={`folder-${folder.id}`} className="mb-3">

      <div className="bg-gray-800 p-2 rounded">
        📁 {folder.name}
      </div>

      <button
        onClick={() => addFile(folder.id)}
        className="text-xs text-blue-400"
      >
        + file
      </button>

      {(folder.files || []).map((file: any) => (
        <div
          key={`file-${file.id}-${folder.id}`}
          onClick={() => openFile(file, folder.id)}
          className="text-xs bg-gray-700 p-1 mt-1 rounded cursor-pointer"
        >
          📄 {file.name}
        </div>
      ))}

    </div>
  ))}
        </div>
      </div>
    </div>
  );
}