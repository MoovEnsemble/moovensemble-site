-- MoovEnsemble — permet aux admins de créer une séance à l'avance
-- (capacité 0) pour la bloquer avant même la première inscription.
-- Ex. : Ana sait qu'elle sera absente tel week-end, elle marque la
-- séance "complet" pour que personne ne s'inscrive.

create policy "admins créent des sessions"
on public.sessions
for insert
to authenticated
with check ((auth.jwt() ->> 'email') in ('moovensemble@gmail.com', 'adrien@arzabe-studio.ch'));

grant insert on public.sessions to authenticated;
