"use strict";

function polishViewLabel() {
    const label = document.getElementById("days");
    if (!label) return;
    label.textContent = label.textContent.replace("ZERO LAYERS", "0 LAYERS");
}

function polishSatelliteButton() {
    const button = document.getElementById("btn-satellite");
    if (!button) return;
    button.textContent = button.classList.contains("active") ? "DARK MAP VIEW" : "SATELLITE VIEW";
}

function startAtlasPolish() {
    polishViewLabel();
    polishSatelliteButton();

    const label = document.getElementById("days");
    if (label) {
        new MutationObserver(polishViewLabel).observe(label, { childList: true });
    }

    const button = document.getElementById("btn-satellite");
    if (button) {
        new MutationObserver(polishSatelliteButton).observe(button, {
            attributes: true,
            attributeFilter: ["class"],
            childList: true
        });
        button.addEventListener("click", () => setTimeout(polishSatelliteButton, 0));
    }
}

window.addEventListener("load", startAtlasPolish);
