const LOGO_FILE_MAP = {
  seniors: 'Moov-Vital.png',
  adultes: 'Moov-Ladies.png',
  enfants: 'Moov-Capoeira.png',
};

class MoovLogo extends HTMLElement {
  connectedCallback() {
    const base = this.dataset.base || '';
    const activity = this.dataset.activity;
    const filename = LOGO_FILE_MAP[activity] || 'Logo-original.png';
    this.innerHTML = `
      <div class="logo-img container">
        <div class="logo-hover-container">
          <img src="${base}assets/images/Images site/${filename}"
               alt="Logo Moov'Ensemble"
               style="width:100%;height:auto;display:block;">
        </div>
      </div>
    `;
  }
}

customElements.define("moov-logo", MoovLogo);
