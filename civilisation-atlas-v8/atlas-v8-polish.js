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

function getPopupField(content, fieldName) {
    const wanted = fieldName.toLowerCase();
    for (const row of content.querySelectorAll(".popup-row")) {
        const key = row.querySelector("span:first-child")?.textContent?.replace(":", "").trim().toLowerCase();
        const value = row.querySelector(".popup-val")?.textContent?.trim();
        if (key === wanted && value) return value;
    }
    return "";
}

function buildKnowledgeQuery(content) {
    const name = getPopupField(content, "Name");
    const civilisation = getPopupField(content, "Civilisation");
    const region = getPopupField(content, "Region");
    return [name, civilisation, region, "history archaeology"]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

function addKnowledgeButtonsToPopup(content) {
    if (!content || content.querySelector(".popup-search-btns")) return;

    const query = buildKnowledgeQuery(content);
    if (!query) return;

    const encoded = encodeURIComponent(query);
    const wikiQuery = encodeURIComponent(getPopupField(content, "Name") || query);

    const row = document.createElement("div");
    row.className = "popup-search-btns";

    const links = [
        { label: "News", className: "popup-btn-news", href: `https://news.google.com/search?q=${encoded}` },
        { label: "Wiki", className: "popup-btn-wiki", href: `https://en.wikipedia.org/w/index.php?search=${wikiQuery}` },
        { label: "Images", className: "popup-btn-images", href: `https://www.google.com/search?tbm=isch&q=${encoded}` }
    ];

    links.forEach((link) => {
        const anchor = document.createElement("a");
        anchor.className = `popup-btn ${link.className}`;
        anchor.href = link.href;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = link.label;
        row.appendChild(anchor);
    });

    content.appendChild(row);
}

function polishPopups() {
    document.querySelectorAll(".maplibregl-popup-content").forEach(addKnowledgeButtonsToPopup);
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
    polishPopups();

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

    new MutationObserver(polishPopups).observe(document.body, { childList: true, subtree: true });

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
