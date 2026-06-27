"use strict";

function setTextIfChanged(element, value) {
    if (element && element.textContent !== value) {
        element.textContent = value;
    }
}

function polishViewLabel() {
    const label = document.getElementById("days");
    if (!label) return;
    setTextIfChanged(label, label.textContent.replace("ZERO LAYERS", "0 LAYERS"));
}

function polishSatelliteButton() {
    const button = document.getElementById("btn-satellite");
    if (!button) return;
    setTextIfChanged(button, button.classList.contains("active") ? "DARK MAP VIEW" : "SATELLITE VIEW");
}

function startAtlasPolish() {
    polishViewLabel();
    polishSatelliteButton();

    const label = document.getElementById("days");
    if (label) {
        new MutationObserver(polishViewLabel).observe(label, { childList: true, characterData: true, subtree: true });
    }

    const button = document.getElementById("btn-satellite");
    if (button) {
        new MutationObserver(polishSatelliteButton).observe(button, {
            attributes: true,
            attributeFilter: ["class"]
        });
        button.addEventListener("click", () => setTimeout(polishSatelliteButton, 0));
    }
}

window.addEventListener("load", startAtlasPolish);
