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
});
