"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_LIMIT = 4 * 60 * 1000; // 4 minutes

export default function ActivityWatcher() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        signOut({ callbackUrl: "/auth/signin" });
      }, INACTIVITY_LIMIT);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    events.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // démarrer dès le chargement

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  return null;
}
