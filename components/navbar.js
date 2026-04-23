class MoovNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg size">
    <div class="container-fluid">
        <!-- Logo à gauche -->
        <a class="navbar-brand nav-link" href="/index.html">
            Moov’Ensemble
        </a>
        
        <!-- Bouton hamburger (mobile) -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <!-- Menu -->
        <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul class="navbar-nav mx-auto">
                <li class="nav-item">
                    <a class="nav-link" href="/pages/qui-sommes-nous.html">Qui sommes-nous?</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="/index.html" id="activitesDropdown">
                        Activités
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="activitesDropdown">
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
    </div>
</nav>
    `;
  }
}

customElements.define("moov-navbar", MoovNavbar);