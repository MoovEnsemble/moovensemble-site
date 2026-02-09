// Gestion du consentement cookies
(function() {
  // Vérifier si l'utilisateur a déjà fait un choix
  const cookieConsent = localStorage.getItem('cookieConsent');

  // Si pas de choix enregistré, afficher la bannière
  if (!cookieConsent) {
    // Attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', function() {
      showCookieBanner();
    });
  }

  function showCookieBanner() {
    // Créer la bannière
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-content">
        <p>Ce site utilise des cookies pour améliorer votre expérience de navigation.</p>
        <div class="cookie-buttons">
          <button id="cookie-refuse" class="cookie-btn cookie-btn-refuse">Refuser</button>
          <button id="cookie-accept" class="cookie-btn cookie-btn-accept">Accepter</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Animation d'apparition
    setTimeout(() => {
      banner.classList.add('show');
    }, 500);

    // Bouton Accepter
    document.getElementById('cookie-accept').addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'accepted');
      hideBanner(banner);
    });

    // Bouton Refuser
    document.getElementById('cookie-refuse').addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'refused');
      hideBanner(banner);
    });
  }

  function hideBanner(banner) {
    banner.classList.remove('show');
    banner.classList.add('hide');
    setTimeout(() => {
      banner.remove();
    }, 400);
  }
})();
