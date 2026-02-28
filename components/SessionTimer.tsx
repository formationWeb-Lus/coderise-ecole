// components/SessionTimer.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const INACTIVITY_LIMIT = 60 * 60; // 1 heure en secondes

export default function SessionTimer() {
  const router = useRouter();

  useEffect(() => {
    let timer = setTimeout(() => {
      router.push("/auth/signin");
    }, INACTIVITY_LIMIT * 1000);

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        router.push("/auth/signin");
      }, INACTIVITY_LIMIT * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [router]);

  return null;
}