-- MoovEnsemble — écriture admin (annuler une inscription,
-- ajuster une capacité) depuis admin/seances.html.
-- Même principe que 0002 : policy + grant, filtrée par email exact.

create policy "admins modifient les reservations"
on public.reservations
for update
to authenticated
using ((auth.jwt() ->> 'email') in ('moovensemble@gmail.com', 'adrien@arzabe-studio.ch'))
with check ((auth.jwt() ->> 'email') in ('moovensemble@gmail.com', 'adrien@arzabe-studio.ch'));

create policy "admins modifient les sessions"
on public.sessions
for update
to authenticated
using ((auth.jwt() ->> 'email') in ('moovensemble@gmail.com', 'adrien@arzabe-studio.ch'))
with check ((auth.jwt() ->> 'email') in ('moovensemble@gmail.com', 'adrien@arzabe-studio.ch'));

grant update on public.reservations to authenticated;
grant update on public.sessions to authenticated;
