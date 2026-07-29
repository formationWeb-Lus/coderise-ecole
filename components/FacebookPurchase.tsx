"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}
interface Props {
  amount: number;
  eventId?: string;
}
export default function FacebookPurchase({
  amount,
  eventId,
}: Props) {
  useEffect(() => {
   if (typeof window !== "undefined" && window.fbq && eventId) {
  window.fbq(
    "track",
    "Purchase",
    {
      value: amount,
      currency: "USD",
    },
    {
      eventID: eventId,
    }
  );
}
  }, [amount, eventId]);

  return null;
}