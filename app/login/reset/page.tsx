export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ResetClient from "./ResetClient";

export default function ResetPage() {
  return (
    <Suspense fallback={<div style={{ color: "white" }}>Chargement...</div>}>
      <ResetClient />
    </Suspense>
  );
}
