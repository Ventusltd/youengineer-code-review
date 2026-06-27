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
    const target = button.classList.contains("active") ? "DARK MAP VIEW" : "SATELLITE VIEW";
    setTextIfChanged(button, target);
}

function polishLayerStatuses() {
    document.querySelectorAll("input[data-layer-toggle]").forEach((input) => {
        if (!input.checked) {
            document.querySelectorAll(`[data-status="${input.dataset.layerToggle}"]`).forEach((status) => {
                status.textContent = "OFF";
            });
        }
    });
}

function startAtlasPolish() {
    polishViewLabel();
    polishSatelliteButton();
    polishLayerStatuses();

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

    document.addEventListener("change", (event) => {
        if (event.target && event.target.matches("input[data-layer-toggle]")) {
            setTimeout(polishLayerStatuses, 0);
        }
    });

    const clearButton = document.getElementById("btn-clear");
    if (clearButton) {
        clearButton.addEventListener("click", () => setTimeout(polishLayerStatuses, 0));
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startAtlasPolish);
} else {
    startAtlasPolish();
}
