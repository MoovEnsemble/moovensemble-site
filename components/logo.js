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

    // Pages sans hero (tout sauf l'accueil) : le grand logo rétrécit et
    // rejoint visuellement le petit logo de la navbar au fil du scroll.
    if (!this.closest('#hero-header')) {
      this._initMergeOnScroll();
    }
  }

  _initMergeOnScroll() {
    const source = this.querySelector('.logo-hover-container');
    if (!source) return;

    const DISTANCE = 160; // px de scroll pour que la fusion soit complète
    let sourceRect = null;
    let targetRect = null;

    const pickTarget = () => {
      const imgs = document.querySelectorAll('.nav-logo-split-crop img');
      for (const img of imgs) {
        if (img.offsetParent !== null) return img; // celui visible selon le breakpoint
      }
      return imgs[0] || null;
    };

    const measure = () => {
      // remise à zéro avant mesure pour capturer la position/taille naturelles
      source.style.transform = '';
      source.style.opacity = '';
      const target = pickTarget();
      if (!target) { sourceRect = null; targetRect = null; return; }
      sourceRect = source.getBoundingClientRect();
      targetRect = target.getBoundingClientRect();
    };

    const onScroll = () => {
      if (!sourceRect || !targetRect) return;
      const progress = Math.min(Math.max(window.scrollY / DISTANCE, 0), 1);

      const sourceCenterX = sourceRect.left + sourceRect.width / 2;
      const sourceCenterY = sourceRect.top + sourceRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      // dx/dy compensent le déplacement naturel du scroll pour que le logo
      // atteigne exactement la position du logo de la navbar à progress = 1
      const dx = progress * (targetCenterX - sourceCenterX);
      const dy = progress * (targetCenterY - sourceCenterY + DISTANCE);
      const scale = 1 - progress * (1 - targetRect.width / sourceRect.width);

      source.style.willChange = 'transform, opacity';
      source.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      source.style.opacity = String(1 - progress);
    };

    // Double rAF : laisse la navbar et la mise en page se stabiliser avant de mesurer
    requestAnimationFrame(() => requestAnimationFrame(() => {
      measure();
      onScroll();
    }));

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      measure();
      onScroll();
    });
  }
}

customElements.define("moov-logo", MoovLogo);
