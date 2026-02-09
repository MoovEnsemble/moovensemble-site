// Accordion - fermer en recliquant
// Annimation pour qui-sommes-nous.html
document.addEventListener("DOMContentLoaded", function () {
  const radioButtons = document.querySelectorAll(
    '.accordion--radio input[type="radio"]',
  );

  radioButtons.forEach((radio) => {
    radio.addEventListener("click", function () {
      if (this.dataset.checked === "true") {
        this.checked = false;
        this.dataset.checked = "false";
      } else {
        radioButtons.forEach((r) => (r.dataset.checked = "false"));
        this.dataset.checked = "true";
      }
    });
  });

  // Mobile dropdown - Premier clic ouvre le menu, deuxième clic navigue
  const dropdownToggle = document.querySelector('.nav-item.dropdown .dropdown-toggle');
  const dropdownMenu = document.querySelector('.nav-item.dropdown .dropdown-menu');

  if (dropdownToggle && dropdownMenu) {
    let dropdownOpen = false;

    dropdownToggle.addEventListener('click', function(e) {
      // Seulement sur mobile/tablette (écran < 992px)
      if (window.innerWidth < 992) {
        if (!dropdownOpen) {
          // Premier clic : ouvre le dropdown
          e.preventDefault();
          dropdownMenu.classList.add('show');
          dropdownOpen = true;
        } else {
          // Deuxième clic : laisse naviguer vers le lien
          dropdownOpen = false;
        }
      }
    });

    // Fermer le dropdown si on clique ailleurs
    document.addEventListener('click', function(e) {
      if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
        dropdownOpen = false;
      }
    });

    // Réinitialiser au redimensionnement
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 992) {
        dropdownMenu.classList.remove('show');
        dropdownOpen = false;
      }
    });
  }
});
