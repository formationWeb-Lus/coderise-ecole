"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p className="text-black">Chargement...</p>,
});

export default function PracticePage() {
  const [folders, setFolders] = useState<any[]>([]);
  const [activeFile, setActiveFile] = useState<any>(null);
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);

  const [openFolders, setOpenFolders] = useState<{ [key: number]: boolean }>({});

  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [mode, setMode] = useState<"editor" | "preview">("editor");

  const [output, setOutput] = useState("");
  const [saved, setSaved] = useState(true);

  // 🎨 LIGHT MODE PAR DÉFAUT
  const [theme] = useState("light");

  // 📥 LOAD DATA
  useEffect(() => {
    fetch("/api/folder")
      .then((res) => res.json())
      .then((data) => setFolders(Array.isArray(data) ? data : []))
      .catch(() => setFolders([]));
  }, []);

  // 📂 TOGGLE FOLDER
  const toggleFolder = (id: number) => {
    setOpenFolders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

    setOpenFolders((prev) => ({ ...prev, [folderId]: true }));
  };

  // 🗑 DELETE FOLDER
  const deleteFolder = async (id: number) => {
    if (!confirm("Supprimer ce dossier ?")) return;

    await fetch(`/api/folder?id=${id}`, { method: "DELETE" });

    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  // 🗑 DELETE FILE
  const deleteFile = async (id: number, folderId: number) => {
    if (!confirm("Supprimer ce fichier ?")) return;

    await fetch(`/api/codefile?id=${id}`, { method: "DELETE" });

    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? { ...f, files: f.files.filter((file: any) => file.id !== id) }
          : f
      )
    );
  };

  // ✏️ RENAME FOLDER
  const renameFolder = async (folder: any) => {
    const name = prompt("Nouveau nom ?", folder.name);
    if (!name) return;

    const res = await fetch("/api/folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: folder.id, name }),
    });

    const updated = await res.json();

    setFolders((prev) =>
      prev.map((f) => (f.id === folder.id ? updated : f))
    );
  };

  // ✏️ RENAME FILE
  const renameFile = async (file: any, folderId: number) => {
    const name = prompt("Nouveau nom ?", file.name);
    if (!name) return;

    const res = await fetch("/api/codefile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...file, name }),
    });

    const updated = await res.json();

    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? {
              ...f,
              files: f.files.map((fi: any) =>
                fi.id === file.id ? updated : fi
              ),
            }
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

  // ✏️ EDIT FILE
  const updateFile = (key: string, value: string) => {
    if (!activeFile) return;
    setSaved(false);
    setActiveFile({ ...activeFile, [key]: value });
  };

  // 💾 SAVE
  const saveFile = async () => {
    if (!activeFile) return;

    const res = await fetch("/api/codefile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...activeFile, folderId: activeFolderId }),
    });

    const data = await res.json();
    setActiveFile(data);
    setSaved(true);
  };

  // ▶ RUN
  const runCode = () => {
    if (!activeFile) return;

    setOutput(`
      <html>
        <style>${activeFile.css}</style>
        <body>
          ${activeFile.html}
          <script>${activeFile.js}<\/script>
        </body>
      </html>
    `);

    setMode("preview");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 text-black">

      {/* HEADER */}
      <div className="p-3 flex justify-between items-center border-b bg-white">

        <h1 className="font-bold">💻 CodeRise</h1>

        <div className="flex gap-2 flex-wrap">

          <span className={saved ? "text-green-600" : "text-red-600"}>
            {saved ? "● Saved" : "● Unsaved"}
          </span>

          <button onClick={saveFile} className="bg-blue-500 text-white px-2 rounded">
            💾 Save
          </button>

          <button onClick={runCode} className="bg-green-500 text-white px-2 rounded">
            ▶ Run
          </button>

          <button onClick={createFolder} className="bg-gray-200 px-2 rounded">
            📁
          </button>

        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-full md:w-64 bg-white border-r p-2 overflow-y-auto">

          {folders.map((folder) => (
            <div key={folder.id} className="mb-3">

              {/* FOLDER HEADER */}
              <div
                onClick={() => toggleFolder(folder.id)}
                className="flex justify-between items-center bg-gray-200 p-2 rounded cursor-pointer"
              >
                <span>
                  {openFolders[folder.id] ? "📂" : "📁"} {folder.name}
                </span>

                <div
                  className="flex gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={() => renameFolder(folder)}>✏️</button>
                  <button onClick={() => deleteFolder(folder.id)}>🗑</button>
                </div>
              </div>

              {/* FILES */}
              {openFolders[folder.id] && (
                <div className="ml-3 mt-1">

                  <button
                    onClick={() => addFile(folder.id)}
                    className="text-xs text-blue-600"
                  >
                    + file
                  </button>

                  {(folder.files || []).map((file: any) => (
                    <div
                      key={file.id}
                      className="flex justify-between bg-gray-100 p-1 mt-1 rounded cursor-pointer"
                      onClick={() => openFile(file, folder.id)}
                    >
                      <span>📄 {file.name}</span>

                      <div
                        className="flex gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button onClick={() => renameFile(file, folder.id)}>✏️</button>
                        <button onClick={() => deleteFile(file.id, folder.id)}>🗑</button>
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </div>
          ))}
        </div>

        {/* EDITOR */}
        <div className="flex-1 flex flex-col">

          {mode === "editor" && activeFile && (
            <>
              <div className="flex border-b bg-white">
                {["html", "css", "js"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t as any)}
                    className={`flex-1 p-2 ${tab === t ? "bg-gray-300" : ""}`}
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
      </div>
    </div>
  );
}