-- MoovEnsemble — compteur de places par séance
-- Étape A : tables + sécurité + fonctions
-- Réf. plan : https://claude.ai/code/artifact/4d014615-f6b5-4184-bba1-d52799fadcb8

create extension if not exists pgcrypto;

-- ============================================================
-- Tables
-- ============================================================

-- Une ligne par occurrence datée d'un cours.
-- Créée à la volée par reserver() lors de la première réservation
-- sur cette séance : pas besoin de la peupler à l'avance.
create table public.sessions (
  id           uuid primary key default gen_random_uuid(),
  cours        text not null,          -- ex. "Moov'Ladies"
  salle        text not null,          -- avanchets | saconnex
  date         date not null,
  heure_debut  time not null,
  heure_fin    time not null,
  capacite     smallint not null default 10,
  annulee      boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (cours, salle, date, heure_debut)
);

create table public.reservations (
  id                uuid primary key default gen_random_uuid(),
  session_id        uuid not null references public.sessions(id) on delete cascade,
  nom               text not null,
  email             text not null,
  telephone         text not null,
  type              text not null check (type in ('essai', 'habituel')),
  statut            text not null default 'confirmee'
                       check (statut in ('confirmee', 'annulee')),
  token_annulation  uuid not null default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  annule_le         timestamptz
);

-- Compte rapide des réservations qui tiennent encore.
create index reservations_actives on public.reservations (session_id)
  where statut = 'confirmee';
create unique index reservations_token on public.reservations (token_annulation);

-- ============================================================
-- Sécurité
-- RLS activé, aucune règle publique : personne ne peut lire ou
-- écrire ces deux tables directement depuis le site. Tout passe
-- par les fonctions ci-dessous (elles s'exécutent avec des droits
-- élevés via "security definer").
-- ============================================================
alter table public.sessions enable row level security;
alter table public.reservations enable row level security;

revoke all on public.sessions from anon, authenticated;
revoke all on public.reservations from anon, authenticated;

-- ============================================================
-- Lecture publique : ne renvoie qu'une couleur par séance,
-- jamais le nombre d'inscrits ni leurs coordonnées.
-- p_cles : ex. "Moov'Ladies|avanchets|2026-09-12|19:00"
-- ============================================================
create or replace function public.disponibilites(p_cles text[])
returns table (cle text, statut text)
language sql
security definer
set search_path = public
stable
as $$
  select
    k.cle,
    case
      when coalesce(n.inscrits, 0) >= s.capacite then 'complet'
      when coalesce(n.inscrits, 0) >= 5           then 'bientot_complet'
      else 'disponible'
    end
  from unnest(p_cles) as k(cle)
  left join public.sessions s
    on  s.cours || '|' || s.salle || '|' || s.date || '|' ||
        to_char(s.heure_debut, 'HH24:MI') = k.cle
    and s.annulee = false
  left join lateral (
    select count(*) as inscrits
    from public.reservations r
    where r.session_id = s.id and r.statut = 'confirmee'
  ) n on true;
$$;

-- ============================================================
-- Écriture : crée la séance si besoin, verrouille sa ligne le
-- temps de la transaction (empêche deux inscriptions simultanées
-- de dépasser la capacité), puis insère.
-- ============================================================
create or replace function public.reserver(
  p_cle text, p_nom text, p_email text, p_telephone text, p_type text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cours  text := split_part(p_cle, '|', 1);
  v_salle  text := split_part(p_cle, '|', 2);
  v_date   date := split_part(p_cle, '|', 3)::date;
  v_heure  time := split_part(p_cle, '|', 4)::time;
  v_session public.sessions;
  v_inscrits int;
  v_token   uuid;
begin
  if p_type not in ('essai', 'habituel') then
    return json_build_object('ok', false, 'raison', 'type_invalide');
  end if;

  insert into public.sessions (cours, salle, date, heure_debut, heure_fin)
  values (v_cours, v_salle, v_date, v_heure, v_heure + interval '1 hour')
  on conflict (cours, salle, date, heure_debut) do nothing;

  select * into v_session
  from public.sessions
  where cours = v_cours and salle = v_salle and date = v_date and heure_debut = v_heure
  for update;

  if v_session.annulee then
    return json_build_object('ok', false, 'raison', 'seance_annulee');
  end if;

  select count(*) into v_inscrits
  from public.reservations
  where session_id = v_session.id and statut = 'confirmee';

  if v_inscrits >= v_session.capacite then
    return json_build_object('ok', false, 'raison', 'complet');
  end if;

  insert into public.reservations (session_id, nom, email, telephone, type)
  values (v_session.id, p_nom, p_email, p_telephone, p_type)
  returning token_annulation into v_token;

  return json_build_object('ok', true, 'token', v_token);
end;
$$;

-- ============================================================
-- Annulation via le lien envoyé dans l'email de confirmation.
-- ============================================================
create or replace function public.annuler(p_token uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.reservations;
begin
  update public.reservations
  set statut = 'annulee', annule_le = now()
  where token_annulation = p_token and statut = 'confirmee'
  returning * into v_row;

  if v_row.id is null then
    return json_build_object('ok', false, 'raison', 'introuvable_ou_deja_annulee');
  end if;

  return json_build_object('ok', true);
end;
$$;

grant execute on function public.disponibilites(text[])                    to anon, authenticated;
grant execute on function public.reserver(text, text, text, text, text)    to anon, authenticated;
grant execute on function public.annuler(uuid)                             to anon, authenticated;

select pg_notify('pgrst', 'reload schema');
