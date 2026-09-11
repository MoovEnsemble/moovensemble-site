-- MoovEnsemble — lecture admin des séances/réservations
-- Donne aux comptes admin (connectés via Supabase Auth dans
-- admin/index.html) le droit de LIRE sessions + reservations.
-- Personne d'autre (public, ou un compte qui s'inscrirait tout
-- seul si jamais les inscriptions publiques étaient un jour
-- activées) ne peut lire ces tables : la clause `using` vérifie
-- l'email exact du compte connecté.

create policy "admins lisent les sessions"
on public.sessions
for select
to authenticated
using (
  (auth.jwt() ->> 'email') in ('moovensemble@gmail.com', 'adrien@arzabe-studio.ch')
);

create policy "admins lisent les reservations"
on public.reservations
for select
to authenticated
using (
  (auth.jwt() ->> 'email') in ('moovensemble@gmail.com', 'adrien@arzabe-studio.ch')
);

-- La policy seule ne suffit pas : la migration 0001 a fait un
-- `revoke all` sur ces tables, il faut redonner le droit de base au
-- rôle "authenticated". La policy ci-dessus filtre ensuite les
-- lignes par email — un compte connecté qui n'est pas admin ne verra
-- toujours rien.
grant select on public.sessions to authenticated;
grant select on public.reservations to authenticated;
