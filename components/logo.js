class MoovLogo extends HTMLElement {
  connectedCallback() {
    const base = this.dataset.base;
    this.innerHTML = `
      <div class="logo-img container">
        <img src="${base}assets/images/logo/logo_sans_fond.png" alt="Logo association">
      </div>
    `;
  }
}

customElements.define("moov-logo", MoovLogo);
