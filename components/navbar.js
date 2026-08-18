const MOOV_LOGO_MAP = {
  seniors: 'Moov-Vital.png',
  adultes: 'Moov-Ladies.png',
  enfants: 'Moov-Capoeira.png',
};
const MOOV_LOGO_DEFAULT = 'Logo-original.png';

class MoovNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg size" id="main-navbar">

        <!-- Mobile : logo + hamburger (masqué sur desktop via CSS) -->
        <div class="navbar-mobile-bar">
          <a class="nav-logo-split" href="/index.html">
            <div class="nav-logo-split-crop">
              <img src="/assets/images/Images site/Logo-original.png" alt="Moov'Ensemble">
            </div>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMobile">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <!-- Mobile : menu collapsible (masqué sur desktop via CSS) -->
        <div class="collapse navbar-collapse navbar-mobile-menu" id="navbarMobile">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/pages/qui-sommes-nous.html">Qui sommes-nous?</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="/index.html">Activités</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/pages/activites-enfants.html">Enfants</a></li>
                <li><a class="dropdown-item" href="/pages/activites-adultes.html">Adultes</a></li>
                <li><a class="dropdown-item" href="/pages/activites-seniors.html">Seniors</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/pages/cours-planing.html">Cours & Horaires</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/pages/evenements.html">Événements</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/pages/gallerie.html">Galerie</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/pages/prevention-sante.html">Prévention / Santé</a>
            </li>
            <li class="nav-item">
              <a class="nav-link contact-link" href="/pages/contact.html">Contactez-nous</a>
            </li>
          </ul>
        </div>

        <!-- Desktop : split logo centré (masqué sur mobile via CSS) -->
        <div class="navbar-split">
          <ul class="navbar-nav nav-split-left">
            <li class="nav-item">
              <a class="nav-link" href="/pages/qui-sommes-nous.html">Qui sommes-nous?</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="/index.html">Activités</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/pages/activites-enfants.html">Enfants</a></li>
                <li><a class="dropdown-item" href="/pages/activites-adultes.html">Adultes</a></li>
                <li><a class="dropdown-item" href="/pages/activites-seniors.html">Seniors</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/pages/cours-planing.html">Cours & Horaires</a>
            </li>
          </ul>

          <a class="nav-logo-split" href="/index.html">
            <div class="nav-logo-split-crop">
              <img src="/assets/images/Images site/Logo-original.png" alt="Moov'Ensemble">
            </div>
          </a>

          <ul class="navbar-nav nav-split-right">
            <li class="nav-item">
              <a class="nav-link" href="/pages/evenements.html">Événements</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/pages/gallerie.html">Galerie</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/pages/prevention-sante.html">Prévention / Santé</a>
            </li>
            <li class="nav-item">
              <a class="nav-link contact-link" href="/pages/contact.html">Contact</a>
            </li>
          </ul>
        </div>

      </nav>
    `;

    this._applyActivityLogo();
    this._initScroll();
    this._exposeLogoSetter();
  }

  _applyActivityLogo() {
    const activity = this.dataset.activity;
    if (!activity) return;
    const filename = MOOV_LOGO_MAP[activity] || MOOV_LOGO_DEFAULT;
    this.querySelectorAll('.nav-logo-split-crop img').forEach(img => {
      img.src = `/assets/images/Images site/${filename}`;
    });
  }

  _exposeLogoSetter() {
    window.moovSetNavLogo = (filename) => {
      const imgs = document.querySelectorAll('.nav-logo-split-crop img');
      imgs.forEach(img => {
        img.style.opacity = '0';
        setTimeout(() => {
          img.src = `/assets/images/Images site/${filename}`;
          img.style.opacity = '1';
        }, 150);
      });
    };
  }

  _initScroll() {
    const nav = this.querySelector('#main-navbar');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('navbar-scrolled', window.scrollY > 20);
      const hero = document.getElementById('hero-header');
      if (hero) {
        hero.classList.toggle('hero-collapsed', window.scrollY > hero.offsetHeight * 0.85);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

customElements.define("moov-navbar", MoovNavbar);
