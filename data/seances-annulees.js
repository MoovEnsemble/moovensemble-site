// data/seances-annulees.js
// Séances annulées (vacances scolaires, jours fériés, imprévus).
// Une séance listée ici disparaît automatiquement du calendrier "Prochaines séances".
//
// Format d'une entrée :
//   { date: "2026-09-10" }
//        -> annule TOUS les cours de cette date
//   { date: "2026-09-12", nom: "Moov'Ladies", salle: "avanchets" }
//        -> annule uniquement ce cours-là, ce jour-là
//
// `date` : toujours au format AAAA-MM-JJ
// `nom` / `salle` : doivent correspondre exactement à data/cours.js
// `motif` : facultatif, juste pour se souvenir pourquoi

export const seancesAnnulees = [
  // Exemples (à décommenter / adapter) :
  // { date: "2026-10-19", motif: "Vacances d'automne" },
  // { date: "2026-10-26", motif: "Vacances d'automne" },
];
