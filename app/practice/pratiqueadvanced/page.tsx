"use client";

import { useEffect, useRef, useState } from "react";

// 🔥 FIX TypeScript (évite l'erreur module introuvable)
declare global {
  interface Window {
    pyodide: any;
  }
}

export default function PracticePage() {
  const pyodideRef = useRef<any>(null);

  const [code, setCode] = useState(`
name = input("Nom ? ")
age = input("Age ? ")
print("Bonjour", name, age)
`);

  const [output, setOutput] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [waiting, setWaiting] = useState(false);

  const inputResolveRef = useRef<any>(null);

  // =========================
  // 🚀 LOAD PYODIDE (SAFE NEXT.JS)
  // =========================
  useEffect(() => {
    const loadPyodide = async () => {
      const pyodideModule = await import("@pyodide/pyodide");

      const pyodide = await pyodideModule.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
      });

      pyodideRef.current = pyodide;
    };

    loadPyodide();
  }, []);

  // =========================
  // ▶ RUN PYTHON CODE
  // =========================
  const runCode = async () => {
    if (!pyodideRef.current) {
      setOutput("⏳ Pyodide pas encore chargé...");
      return;
    }

    setOutput("");
    setWaiting(false);

    // 🔥 override input()
    pyodideRef.current.globals.set("input", (prompt: string) => {
      setWaiting(true);

      return new Promise((resolve) => {
        inputResolveRef.current = resolve;
      });
    });

    try {
      await pyodideRef.current.runPythonAsync(code);
    } catch (err: any) {
      setOutput(err.message);
    }
  };

  // =========================
  // 📥 SEND INPUT
  // =========================
  const sendInput = () => {
    if (inputResolveRef.current) {
      inputResolveRef.current(inputValue);
      inputResolveRef.current = null;
    }

    setInputValue("");
    setWaiting(false);
  };

  return (
    <div className="h-screen bg-black text-green-400 p-4">

      {/* EDITOR */}
      <textarea
        className="w-full h-60 bg-gray-900 text-white p-2"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {/* RUN BUTTON */}
      <button
        onClick={runCode}
        className="bg-green-600 px-4 py-2 mt-2"
      >
        ▶ Run Python
      </button>

      {/* OUTPUT */}
      <pre className="mt-4 whitespace-pre-wrap text-yellow-300">
        {output}
      </pre>

      {/* INPUT BOX */}
      {waiting && (
        <div className="mt-4">
          <input
            className="text-black p-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tape ta réponse..."
          />

          <button
            onClick={sendInput}
            className="ml-2 bg-blue-500 px-3 py-2"
          >
            Enter
          </button>
        </div>
      )}
    </div>
  );
}