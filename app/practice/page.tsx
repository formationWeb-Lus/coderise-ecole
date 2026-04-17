"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p className="text-white">Chargement...</p>,
});

export default function PracticePage() {
  const [tab, setTab] = useState("html");
  const [mode, setMode] = useState<"editor" | "preview">("editor");

  const [html, setHtml] = useState("<h1>Bonjour CodeRise</h1>");
  const [css, setCss] = useState("h1 { color: red; }");
  const [js, setJs] = useState("console.log('Hello');");

  const [output, setOutput] = useState("");

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

    // 🔥 MOBILE EXPERIENCE
    setMode("preview");
  };

  const goBack = () => {
    setMode("editor");
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a1b2d] text-white">

      {/* ================= HEADER ================= */}
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h1 className="font-bold text-sm md:text-lg">
          💻 CodeRise Practice
        </h1>

        {mode === "editor" ? (
          <button
            onClick={runCode}
            className="bg-green-500 px-3 py-1 md:px-4 md:py-2 rounded"
          >
            ▶ Run
          </button>
        ) : (
          <button
            onClick={goBack}
            className="bg-yellow-500 px-3 py-1 md:px-4 md:py-2 rounded"
          >
            ⬅ Back
          </button>
        )}
      </div>

      {/* ================= MOBILE MODE ================= */}
      {mode === "editor" && (
        <div className="flex flex-col flex-1 min-h-0">

          {/* TABS */}
          <div className="flex border-b border-gray-700 text-sm">
            {["html", "css", "js"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 px-3 py-2 ${
                  tab === t ? "bg-[#1e3a8a]" : ""
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* EDITOR FULL SCREEN */}
          <div className="flex-1 overflow-hidden">
            {tab === "html" && (
              <Editor
                height="100%"
                language="html"
                value={html}
                onChange={(v) => setHtml(v || "")}
              />
            )}
            {tab === "css" && (
              <Editor
                height="100%"
                language="css"
                value={css}
                onChange={(v) => setCss(v || "")}
              />
            )}
            {tab === "js" && (
              <Editor
                height="100%"
                language="javascript"
                value={js}
                onChange={(v) => setJs(v || "")}
              />
            )}
          </div>
        </div>
      )}

      {/* ================= PREVIEW FULL SCREEN ================= */}
      {mode === "preview" && (
        <div className="flex-1 bg-white">
          <iframe
            srcDoc={output}
            title="preview"
            sandbox="allow-scripts"
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}