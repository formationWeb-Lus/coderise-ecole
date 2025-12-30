"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  setSessionTimer,
  checkSessionExpired,
  SessionDurations,
} from "@/utils/sessionExpiration";

interface SessionTimerProps {
  duration?: number; // Durée en secondes, par défaut 2 minutes
}

export default function SessionTimer({ duration = SessionDurations.LONG }: SessionTimerProps) {
  const router = useRouter();

  useEffect(() => {
    // Définir le timer
    setSessionTimer(duration);

    // Vérifier expiration au chargement
    if (checkSessionExpired()) {
      router.push("/auth/signin");
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSessionTimer(duration);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, duration]);

  return null; // composant invisible
}
