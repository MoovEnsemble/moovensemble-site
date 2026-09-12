-- MoovEnsemble — empêche la même adresse email de s'inscrire deux
-- fois à la même séance (double-clic, quelqu'un qui relance le
-- formulaire plusieurs fois...). Ne touche pas au reste : deux
-- personnes différentes derrière la même IP/wifi ne sont jamais
-- pénalisées, seul l'email compte.

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
  v_deja_inscrit boolean;
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

  select exists(
    select 1 from public.reservations
    where session_id = v_session.id
      and statut = 'confirmee'
      and lower(email) = lower(p_email)
  ) into v_deja_inscrit;

  if v_deja_inscrit then
    return json_build_object('ok', false, 'raison', 'deja_inscrit');
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
