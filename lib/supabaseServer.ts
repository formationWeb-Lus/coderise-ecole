// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

// 🔹 Client Supabase serveur sécurisé
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,       // URL de ton projet Supabase
  process.env.SUPABASE_SERVICE_ROLE_KEY!,      // Clé Service Role (privée, ne jamais exposer au client)
  {
    auth: { persistSession: false },           // On ne persiste pas les sessions côté serveur
  }
);
