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

function isSatelliteActive() {
    const button = document.getElementById("btn-satellite");
    return Boolean(button && button.classList.contains("active"));
}

function polishSatelliteButton() {
    const button = document.getElementById("btn-satellite");
    if (!button) return;
    const target = isSatelliteActive() ? "DARK MAP VIEW" : "SATELLITE VIEW";
    setTextIfChanged(button, target);
    syncBasemapRadios();
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

function addBasemapControls(containerId) {
    const container = document.getElementById(containerId);
    if (!container || container.querySelector(".basemap-group")) return;

    const group = document.createElement("div");
    group.className = "key-group basemap-group";

    const title = document.createElement("div");
    title.className = "key-title";
    title.textContent = "Basemap";
    group.appendChild(title);

    const options = [
        { value: "dark", label: "Dark" },
        { value: "satellite", label: "Satellite" }
    ];

    options.forEach((option) => {
        const row = document.createElement("label");
        row.className = "key-item";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = `${containerId}-basemap`;
        input.value = option.value;
        input.checked = option.value === "dark";
        input.addEventListener("change", () => {
            const button = document.getElementById("btn-satellite");
            if (!button) return;
            const wantsSatellite = option.value === "satellite";
            if (isSatelliteActive() !== wantsSatellite) button.click();
        });

        const text = document.createElement("span");
        text.textContent = option.label;

        row.appendChild(input);
        row.appendChild(text);
        group.appendChild(row);
    });

    container.appendChild(group);
}

function syncBasemapRadios() {
    const active = isSatelliteActive();
    document.querySelectorAll(".basemap-group input[type='radio']").forEach((input) => {
        input.checked = active ? input.value === "satellite" : input.value === "dark";
    });
}

function startAtlasPolish() {
    polishViewLabel();
    polishSatelliteButton();
    polishLayerStatuses();
    addBasemapControls("scada-ui-container");
    addBasemapControls("fs-curtain-keys");
    syncBasemapRadios();

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
