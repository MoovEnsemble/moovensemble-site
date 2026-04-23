class MoovFooter extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `
        <footer class="footer-section">
    <div class="container-fluid">
        <div class="row">
            <!-- Colonne 1 : Contact -->
            <div class="col-md-4">
                <h6>Moov'Ensemble</h6>
                <p><strong>Adresse:</strong> Rue François Durafour 14</p>
                <p><strong>E-mail:</strong> moovensemble@gmail.com</p>
                <p><strong>Tel:</strong> +41 79 926 27 82</p>
            </div>
            
            <!-- Colonne 2 : Liens rapides -->
            <div class="col-md-4">
                <h6>Liens rapides</h6>
                <ul>
                    <li><a href="/pages/qui-sommes-nous.html">Qui sommes-nous</a></li>
                    <li><a href="/index.html">Activités</a></li>
                    <li><a href="/pages/cours-planing.html">Cours & Horaires</a></li>
                    <li><a href="/pages/evenements.html">Événements</a></li>
                    <li><a href="/pages/gallerie.html">Galerie</a></li>
                    <li><a href="/pages/prevention-sante.html">Prévention / Santé</a></li>
                    <li><a href="/pages/contact.html">Contactez-nous</a></li>
                </ul>
            </div>
            
            <!-- Colonne 3 : Réseaux sociaux -->
            <div class="col-md-4">
                <h6>Suivez-nous</h6>
                <a href="https://www.instagram.com/moovensemble" target="_blank" class="social-link">
                    <i class="fa-brands fa-instagram"></i> @moovensemble
                </a>
            </div>
        </div>
        
        <!-- Copyright -->
        <div class="row mt-4">
            <div class="col-12 text-center">
                <p class="copyright">© 2026 Moov'Ensemble - Tous droits réservés</p>
                <p class="copyright">Developed by <a href="https://arzabe-studio.ch" target="_blank" class="dev-credit">Arzabe Studio</a></p>
            </div>
        </div>
    </div>
</footer>
        `;
    }
}

customElements.define("moov-footer", MoovFooter);