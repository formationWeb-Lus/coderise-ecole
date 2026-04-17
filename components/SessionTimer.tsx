"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  duration?: number; // en secondes
};

const DEFAULT_INACTIVITY = 60 * 60; // 1h

export default function SessionTimer({ duration }: Props) {
  const router = useRouter();

  const limit = duration ?? DEFAULT_INACTIVITY;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const startTimer = () => {
      timer = setTimeout(() => {
        router.push("/auth/signin");
      }, limit * 1000);
    };

    const resetTimer = () => {
      clearTimeout(timer);
      startTimer();
    };

    startTimer();

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
  }, [router, limit]);

  return null;
}