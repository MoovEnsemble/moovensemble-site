// MoovEnsemble — Edge Function "reserver"
// Reçoit une demande d'inscription depuis le site, vérifie le
// contrôle anti-robot (Turnstile), appelle la fonction reserver()
// de la base (qui gère elle-même la capacité de 10), puis envoie
// les emails de confirmation via Brevo.
//
// Secrets attendus (Project Settings → Edge Functions → Secrets) :
//   TURNSTILE_SECRET_KEY   la Secret Key Cloudflare Turnstile
//   BREVO_API_KEY          la clé API Brevo
// (SUPABASE_URL et l'ancienne SUPABASE_ANON_KEY sont dépréciées côté
// Supabase ; la clé publique ci-dessous est la même que celle utilisée
// dans le site — publique par nature, aucun risque à l'écrire ici.)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://djjaxrlsgulaqawzskbu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_CPnHYFaVVnrcvhV6nUDeAw_8eDVVlKJ";
const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY")!;
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;

const EMAIL_ANA = "moovensemble@gmail.com";
const EXPEDITEUR = { name: "Moov'Ensemble", email: "reservations@moovensemble.ch" };
const SITE_URL = "https://moovensemble.ch";

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

async function turnstileValide(token: string, ip: string | null): Promise<boolean> {
  const body = new URLSearchParams();
  body.set("secret", TURNSTILE_SECRET_KEY);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const data = await res.json();
  return data.success === true;
}

async function envoyerEmail(to: { email: string; name?: string }[], subject: string, htmlContent: string, replyTo?: string) {
  const payload: Record<string, unknown> = { sender: EXPEDITEUR, to, subject, htmlContent };
  if (replyTo) payload.replyTo = { email: replyTo };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
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

  const { cle, nom, email, telephone, type, turnstileToken } = payload;
  if (!cle || !nom || !email || !telephone || !type || !turnstileToken) {
    return reponseJson({ ok: false, raison: "champs_manquants" }, 400, origin);
  }

  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for");
  const humain = await turnstileValide(turnstileToken, ip);
  if (!humain) {
    return reponseJson({ ok: false, raison: "verification_echouee" }, 400, origin);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const { data, error } = await supabase.rpc("reserver", {
    p_cle: cle,
    p_nom: nom,
    p_email: email,
    p_telephone: telephone,
    p_type: type,
  });

  if (error) {
    console.error(error);
    return reponseJson({ ok: false, raison: "erreur_serveur" }, 500, origin);
  }

  if (!data.ok) {
    // "complet", "seance_annulee", "type_invalide"… le front affiche le message adapté.
    return reponseJson(data, 200, origin);
  }

  // Emails : un échec d'envoi ne doit pas faire perdre la réservation,
  // donc on ne bloque pas la réponse dessus.
  const [coursNom, , dateStr, heure] = cle.split("|");
  const lienAnnulation = `${SITE_URL}/pages/annuler.html?t=${data.token}`;

  envoyerEmail(
    [{ email, name: nom }],
    `Inscription confirmée — ${coursNom}`,
    `<p>Bonjour ${nom},</p>
     <p>Votre inscription à <strong>${coursNom}</strong> le ${dateStr} à ${heure} est confirmée.</p>
     <p>Un empêchement ? <a href="${lienAnnulation}">Annulez votre place ici</a>.</p>
     <p>À bientôt,<br>Moov'Ensemble</p>`,
    EMAIL_ANA,
  ).catch((e) => console.error("email visiteur:", e));

  envoyerEmail(
    [{ email: EMAIL_ANA }],
    `Nouvelle inscription — ${coursNom}`,
    `<p><strong>${nom}</strong> (${email}, ${telephone}) s'est inscrit·e à
     <strong>${coursNom}</strong> le ${dateStr} à ${heure} — ${type}.</p>`,
  ).catch((e) => console.error("email ana:", e));

  return reponseJson({ ok: true }, 200, origin);
});
