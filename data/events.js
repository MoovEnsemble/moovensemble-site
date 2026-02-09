// data/events.js
// Tous les événements du site
// Tu modifies UNIQUEMENT ici quand tu veux ajouter/changer un événement
//
// COMMENT ÇA MARCHE :
// - endDate : date de fin au format "YYYY-MM-DD" (ex: "2025-02-20")
//   → Si endDate >= aujourd'hui → affiché sur "Événements"
//   → Si endDate < aujourd'hui → affiché sur "Galerie"
// - status : OPTIONNEL - pour forcer manuellement "future" ou "past"
//   → Si tu mets status: "future", il reste en Événements même si la date est passée
//   → Si tu mets status: "past", il va en Galerie même si la date n'est pas passée

export const eventsData = [
  {
    id: "capoeira-pass-vacances-2025",
    title: "Moov'Capoeira – Pass Vacances",
    date: "15–20 février 2025", // Texte affiché
    endDate: "2025-02-20", // Pour calcul auto (YYYY-MM-DD)
    location: "Genève",
    description:
      "Sensibilisation à l'inclusion sociale à travers la capoeira. Ouvert aux enfants et ados.",
    link: "contact.html#inscription",
    // Photos et vidéos (pour la galerie)
    galleryImages: [
      "../assets/images/contenu/2025/capoeira/pass vacances juillet 2025/capoeira-enfants-1.jpg",
      "../assets/images/contenu/2025/capoeira/pass vacances juillet 2025/capoeira-enfants-2.jpg",
    ],
    galleryVideos: [
      "../assets/videos/2025/Capoeira-pass-vacances-(juillet-2025)/video-pass-vacances.mp4",
    ],
  },
  {
    id: "kids-journee-decouverte-2024",
    title: "Moov'Capoeira – Journée Découverte",
    date: "04 fevrier 2026",
    endDate: "2026-02-04",
    location: "Genève",
    description:
      "Activités ludiques et sportives pour les 6-12 ans. Places limitées !",
    link: "contact.html#inscription",
    galleryImages: [
      "../assets/images/contenu/2026/Capoeira/journee-decouverte-fev26/Capoeira-1.jpeg",
    ],
    galleryVideos: [
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-01.mp4",
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-02.mp4",
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-03.mp4",
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-04.mp4",
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-05.mp4",
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-06.mp4",
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-07.mp4",
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-08.mp4",
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-09.mp4",
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-10.mp4",
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-11.mp4",
      "../assets/videos/2026/capoeira-fev26/video-journee-decouverte-12.mp4",
    ],
  },

  // ← Ajoute ici d'autres événements (copie-colle un bloc ci-dessus)
];
