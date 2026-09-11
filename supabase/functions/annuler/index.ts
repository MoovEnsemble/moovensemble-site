// MoovEnsemble — Edge Function "annuler"
// Appelée depuis pages/annuler.html quand quelqu'un clique le lien
// d'annulation reçu par email. Libère la place et prévient Ana.
//
// Secrets attendus (Project Settings → Edge Functions → Secrets) :
//   BREVO_API_KEY   la clé API Brevo
// (SUPABASE_URL et l'ancienne SUPABASE_ANON_KEY sont dépréciées côté
// Supabase ; la clé publique ci-dessous est la même que celle utilisée
// dans le site — publique par nature, aucun risque à l'écrire ici.)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://djjaxrlsgulaqawzskbu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_CPnHYFaVVnrcvhV6nUDeAw_8eDVVlKJ";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;

const EMAIL_ANA = "moovensemble@gmail.com";
const EXPEDITEUR = { name: "Moov'Ensemble", email: "reservations@moovensemble.ch" };

const ORIGINES_FIXES = new Set([
  "https://moovensemble.ch",
  "https://www.moovensemble.ch",
  "https://dashing-quokka-979d06.netlify.app",
  "http://localhost:8888",
]);

function corsHeaders(origin: string | null) {
  const autorisee =
    origin != null &&
    (ORIGINES_FIXES.has(origin) || origin.endsWith("--dashing-quokka-979d06.netlify.app"));
  return {
    "Access-Control-Allow-Origin": autorisee ? origin! : "https://moovensemble.ch",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function reponseJson(obj: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

async function envoyerEmailAna(subject: string, htmlContent: string) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ sender: EXPEDITEUR, to: [{ email: EMAIL_ANA }], subject, htmlContent }),
  });
  if (!res.ok) {
    console.error("Brevo:", res.status, await res.text());
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return reponseJson({ ok: false, raison: "methode_non_autorisee" }, 405, origin);
  }

  let payload: Record<string, string>;
  try {
    payload = await req.json();
  } catch {
    return reponseJson({ ok: false, raison: "corps_invalide" }, 400, origin);
  }

  const { token } = payload;
  if (!token) {
    return reponseJson({ ok: false, raison: "token_manquant" }, 400, origin);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const { data, error } = await supabase.rpc("annuler", { p_token: token });

  if (error) {
    console.error(error);
    return reponseJson({ ok: false, raison: "erreur_serveur" }, 500, origin);
  }

  if (data.ok) {
    envoyerEmailAna(
      "Annulation d'une inscription",
      `<p>Une personne vient d'annuler sa réservation via le lien reçu par email.</p>`,
    ).catch((e) => console.error("email ana:", e));
  }

  return reponseJson(data, 200, origin);
});
