"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p className="text-white">Chargement...</p>,
});

export default function PracticePage() {
  const [tab, setTab] = useState("html");
  const [mode, setMode] = useState<"editor" | "preview">("editor");

  const [theme, setTheme] = useState("vs-dark");

  const [output, setOutput] = useState("");

  const [folders, setFolders] = useState<any[]>([]);
  const [activeFile, setActiveFile] = useState<any>(null);
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);

  const [showPanel, setShowPanel] = useState(false);
  const [saved, setSaved] = useState(true);

  const lastSavedRef = useRef("");

  // 📥 LOAD
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("coderise-filesystem") || "[]");
    setFolders(data);
  }, []);

  // 💾 SAVE SYSTEM
  const saveFS = (data: any[]) => {
    setFolders(data);
    localStorage.setItem("coderise-filesystem", JSON.stringify(data));
  };

  // 📁 CREATE FOLDER
  const createFolder = () => {
    const name = prompt("Nom du dossier ?");
    if (!name) return;

    const newFolder = {
      id: Date.now(),
      name,
      files: [],
      open: true,
    };

    saveFS([newFolder, ...folders]);
  };

  // 📄 CREATE FILE
  const addFile = (folderId: number) => {
    const name = prompt("Nom du fichier ?");
    if (!name) return;

    const newFile = {
      id: Date.now(),
      name,
      html: "",
      css: "",
      js: "",
    };

    const updated = folders.map((f) =>
      f.id === folderId
        ? { ...f, files: [newFile, ...f.files] }
        : f
    );

    saveFS(updated);
  };

  // 📂 OPEN FILE
  const openFile = (file: any, folderId: number) => {
    setActiveFile(file);
    setActiveFolderId(folderId);
    setMode("editor");
  };

  // ✏️ UPDATE FILE
  const updateFile = (key: string, value: string) => {
    if (!activeFile) return;

    setSaved(false);

    const updatedFile = { ...activeFile, [key]: value };
    setActiveFile(updatedFile);
  };

  // 💾 MANUAL SAVE
  const saveFile = () => {
    if (!activeFile) return;

    const updated = folders.map((f) =>
      f.id === activeFolderId
        ? {
            ...f,
            files: f.files.map((file: any) =>
              file.id === activeFile.id ? activeFile : file
            ),
          }
        : f
    );

    saveFS(updated);
    setSaved(true);

    alert("💾 Sauvegardé !");
  };

  // ⏱️ AUTOSAVE (2s)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeFile) return;

      const current = JSON.stringify(activeFile);

      if (lastSavedRef.current === current) return;

      lastSavedRef.current = current;

      const updated = folders.map((f) => ({
        ...f,
        files: f.files.map((file: any) =>
          file.id === activeFile.id ? activeFile : file
        ),
      }));

      saveFS(updated);
      setSaved(true);

    }, 2000);

    return () => clearInterval(interval);
  }, [activeFile, folders]);

  // ▶ RUN
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

  // 🗑 DELETE FILE
  const deleteFile = (folderId: number, fileId: number) => {
    const updated = folders.map((f) =>
      f.id === folderId
        ? {
            ...f,
            files: f.files.filter((file: any) => file.id !== fileId),
          }
        : f
    );

    saveFS(updated);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a1b2d] text-white">

      {/* HEADER */}
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">

        <h1 className="font-bold">💻 CodeRise</h1>

        <div className="flex gap-2 items-center">

          <span className={`text-xs ${saved ? "text-green-400" : "text-yellow-400"}`}>
            {saved ? "● Saved" : "● Editing"}
          </span>

          <button onClick={runCode} className="bg-green-500 px-2 rounded">
            ▶
          </button>

          <button onClick={saveFile} className="bg-blue-500 px-2 rounded">
            💾 Save
          </button>

          <button
            onClick={() => setShowPanel(true)}
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
                    onClick={() => setTab(t)}
                    className={`flex-1 p-2 ${tab === t ? "bg-blue-800" : ""}`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex-1">
                <Editor
                  height="100%"
                  language={tab}
                  theme={theme}
                  value={activeFile[tab]}
                  onChange={(v) => updateFile(tab, v || "")}
                />
              </div>
            </>
          )}

          {mode === "preview" && (
            <iframe
              srcDoc={output}
              className="w-full h-full bg-white"
              sandbox="allow-scripts"
            />
          )}
        </div>

        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block w-64 bg-[#08121f] p-2 overflow-y-auto border-l">

          <button onClick={createFolder} className="bg-blue-600 w-full mb-2">
            + Folder
          </button>

          {folders.map((folder) => (
            <div key={folder.id} className="mb-3">

              <div className="bg-gray-800 p-1 rounded">
                📁 {folder.name}
              </div>

              <button
                onClick={() => addFile(folder.id)}
                className="text-xs text-blue-400"
              >
                + file
              </button>

              {folder.files.map((file: any) => (
                <div
                  key={file.id}
                  className="ml-2 text-xs bg-gray-700 p-1 mt-1 rounded flex justify-between"
                >
                  <span onClick={() => openFile(file, folder.id)}>
                    📄 {file.name}
                  </span>

                  <button onClick={() => deleteFile(folder.id, file.id)}>
                    🗑
                  </button>
                </div>
              ))}

            </div>
          ))}
        </div>
      </div>

      {/* MOBILE PANEL */}
      {showPanel && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">

          <div className="w-72 bg-[#08121f] p-3">

            <div className="flex justify-between">
              <h2>📁 Files</h2>
              <button onClick={() => setShowPanel(false)}>✖</button>
            </div>

            <button onClick={createFolder} className="bg-blue-600 w-full my-2">
              + Folder
            </button>

            {folders.map((folder) => (
              <div key={folder.id} className="mb-2">

                <div className="bg-gray-800 p-2 rounded">
                  📁 {folder.name}
                </div>

                <button
                  onClick={() => addFile(folder.id)}
                  className="text-xs text-blue-400"
                >
                  + file
                </button>

                {folder.files.map((file: any) => (
                  <div
                    key={file.id}
                    onClick={() => {
                      openFile(file, folder.id);
                      setShowPanel(false);
                    }}
                    className="ml-2 text-xs bg-gray-700 p-1 mt-1 rounded"
                  >
                    📄 {file.name}
                  </div>
                ))}

              </div>
            ))}

          </div>
        </div>
      )}

    </div>
  );
}