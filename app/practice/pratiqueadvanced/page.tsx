"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function PracticePage() {
  const [language, setLanguage] = useState<"python" | "csharp">("python");
  const [code, setCode] = useState('print("Bonjour RDC")');
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"editor" | "output">("editor");

  const runCode = async () => {
    try {
      setLoading(true);
      setMode("output");
      setOutput("⏳ Exécution...");

     const res = await fetch("https://emkc.org/api/v2/piston/execute", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    language,
    version: language === "csharp" ? "6.12.0" : "*",
    files: [{ content: code }],
  }),
});

const data = await res.json();

console.log("RESPONSE:", data);

const result =
  data?.run?.stdout ??
  data?.run?.output ??
  data?.run?.stderr ??
  JSON.stringify(data);

setOutput(result || "Aucune sortie");
    } catch {
      setOutput("❌ Erreur lors de l'exécution");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang: "python" | "csharp") => {
    setLanguage(lang);
    setMode("editor");

    if (lang === "python") {
      setCode('print("Bonjour RDC")');
    } else {
      setCode(`using System;

class Program {
  static void Main() {
    Console.WriteLine("Bonjour RDC");
  }
}`);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0a1b2d] text-white flex flex-col">

      {/* HEADER */}
      <div className="p-3 border-b border-gray-700 flex flex-col gap-2">

        {/* TOP BAR */}
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-sm md:text-lg">
            💻 CodeRise Practice
          </h1>

          {mode === "editor" ? (
            <button
              onClick={runCode}
              className="bg-green-500 px-3 py-1 rounded"
            >
              ▶ Run
            </button>
          ) : (
            <button
              onClick={() => setMode("editor")}
              className="bg-blue-500 px-3 py-1 rounded"
            >
              🔙 Code
            </button>
          )}
        </div>

        {/* 🔥 LANG MENU HORIZONTAL */}
        <div className="flex gap-2">
          <button
            onClick={() => handleLanguageChange("python")}
            className={`px-4 py-1 rounded ${
              language === "python"
                ? "bg-yellow-500 text-black"
                : "bg-gray-700"
            }`}
          >
            🐍 Python
          </button>

          <button
            onClick={() => handleLanguageChange("csharp")}
            className={`px-4 py-1 rounded ${
              language === "csharp"
                ? "bg-blue-500"
                : "bg-gray-700"
            }`}
          >
            ⚙️ C#
          </button>
        </div>
      </div>

      {/* EDITOR */}
      {mode === "editor" && (
        <div className="flex-1">
          <Editor
            height="100%"
            language={language === "csharp" ? "csharp" : "python"}
            value={code}
            onChange={(v) => setCode(v || "")}
            theme="vs-dark"
          />
        </div>
      )}

      {/* OUTPUT */}
      {mode === "output" && (
        <div className="flex-1 bg-black p-4 overflow-auto">
          <h2 className="text-gray-400 mb-2">Résultat :</h2>

          <pre className="text-green-400 whitespace-pre-wrap">
            {loading ? "⏳ Chargement..." : output}
          </pre>
        </div>
      )}
    </div>
  );
}