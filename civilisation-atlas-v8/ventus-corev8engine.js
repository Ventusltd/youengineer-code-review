'use strict';

window.initVentusMap = function({ config, center, zoom }) {
    if (typeof maplibregl === 'undefined') {
        document.getElementById('fatal-banner').style.display = 'block';
        throw new Error('CRITICAL: MapLibre failed to load.');
    }

    function escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getName(properties) {
        return properties.name || properties.Name || properties.title || properties.site || 'Unnamed site';
    }

    function getSummary(properties) {
        return properties.summary || properties.description || properties.notes || 'No summary supplied.';
    }

    const GRID_CONFIG = Object.freeze(config);
    const layerConfigById = new Map(GRID_CONFIG.flatMap(group => group.layers).map(layer => [layer.id, layer]));
    const loadedGeoJSON = new Map();
    const runtime = {};

    GRID_CONFIG.forEach(group => group.layers.forEach(layer => {
        runtime[layer.id] = { loading: false, loaded: false, visible: false, count: 0 };
    }));

    const map = new maplibregl.Map({
        container: 'map',
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center,
        zoom,
        attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');

    let activePopup = null;

    function updateClock() {
        const now = new Date();
        document.getElementById('clock').textContent = now.toLocaleTimeString('en-GB');
        document.getElementById('date').textContent = now.toLocaleDateString('en-GB', {
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
        });
        const active = Object.values(runtime).filter(item => item.visible).length;
        document.getElementById('days').textContent = active === 0 ? 'ZERO LAYERS' : `${active} LAYER${active === 1 ? '' : 'S'}`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    function sourceId(layerId) { return `src-${layerId}`; }
    function layerId(layerId) { return `lyr-${layerId}`; }

    function buildPointPaint(layer) {
        return {
            'circle-color': layer.color,
            'circle-radius': layer.radius || 6,
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 1.5,
            'circle-opacity': 0.92
        };
    }

    function addLayerToMap(layer, data) {
        const sid = sourceId(layer.id);
        const lid = layerId(layer.id);

        if (!map.getSource(sid)) {
            map.addSource(sid, { type: 'geojson', data });
        } else {
            map.getSource(sid).setData(data);
        }

        if (map.getLayer(lid)) return;

        if (layer.type === 'line') {
            map.addLayer({
                id: lid,
                type: 'line',
                source: sid,
                paint: {
                    'line-color': layer.color,
                    'line-width': layer.width || 2,
                    'line-opacity': 0.85
                },
                layout: { visibility: 'none' }
            });
        } else if (layer.type === 'fill') {
            map.addLayer({
                id: lid,
                type: 'fill',
                source: sid,
                paint: {
                    'fill-color': layer.color,
                    'fill-opacity': 0.22
                },
                layout: { visibility: 'none' }
            });
        } else {
            map.addLayer({
                id: lid,
                type: 'circle',
                source: sid,
                paint: buildPointPaint(layer),
                layout: { visibility: 'none' }
            });
        }

        map.on('click', lid, (event) => {
            const feature = event.features && event.features[0];
            if (!feature) return;
            openFeaturePopup(feature, layer);
        });
        map.on('mouseenter', lid, () => map.getCanvas().style.cursor = 'pointer');
        map.on('mouseleave', lid, () => map.getCanvas().style.cursor = '');
    }

    async function ensureLayerLoaded(layer) {
        if (runtime[layer.id].loaded || runtime[layer.id].loading) return;
        runtime[layer.id].loading = true;
        updateLayerStatus(layer.id, 'LOAD');

        try {
            const response = await fetch(layer.url);
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            const data = await response.json();
            loadedGeoJSON.set(layer.id, data);
            runtime[layer.id].loaded = true;
            runtime[layer.id].count = Array.isArray(data.features) ? data.features.length : 0;
            addLayerToMap(layer, data);
            updateLayerStatus(layer.id, `${runtime[layer.id].count}`);
        } catch (error) {
            console.error(`Layer ${layer.id} failed`, error);
            updateLayerStatus(layer.id, 'ERR');
        } finally {
            runtime[layer.id].loading = false;
        }
    }

    async function setLayerVisibility(layerIdValue, visible) {
        const layer = layerConfigById.get(layerIdValue);
        if (!layer) return;

        if (visible) {
            await ensureLayerLoaded(layer);
        }

        const lid = layerId(layerIdValue);
        if (map.getLayer(lid)) {
            map.setLayoutProperty(lid, 'visibility', visible ? 'visible' : 'none');
        }

        runtime[layerIdValue].visible = visible;
        updateClock();
    }

    function updateLayerStatus(layerIdValue, text) {
        const element = document.querySelector(`[data-status="${layerIdValue}"]`);
        if (element) element.textContent = text;
    }

    function renderLayerControls(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        GRID_CONFIG.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'key-group';

            const title = document.createElement('div');
            title.className = 'key-title';
            title.textContent = group.group;
            groupDiv.appendChild(title);

            group.layers.forEach(layer => {
                const row = document.createElement('label');
                row.className = 'key-item';

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = false;
                input.addEventListener('change', () => setLayerVisibility(layer.id, input.checked));

                const dot = document.createElement('span');
                dot.className = 'key-dot';
                dot.style.backgroundColor = layer.color;
                dot.style.color = layer.color;

                const label = document.createElement('span');
                label.textContent = layer.label;

                const status = document.createElement('span');
                status.className = 'key-status';
                status.dataset.status = layer.id;
                status.textContent = 'OFF';

                row.appendChild(input);
                row.appendChild(dot);
                row.appendChild(label);
                row.appendChild(status);
                groupDiv.appendChild(row);
            });

            container.appendChild(groupDiv);
        });
    }

    function getVisibleFeatures() {
        const features = [];
        loadedGeoJSON.forEach((data, id) => {
            if (!runtime[id].visible) return;
            const layer = layerConfigById.get(id);
            (data.features || []).forEach(feature => features.push({ feature, layer }));
        });
        return features;
    }

    function openFeaturePopup(feature, layer) {
        const props = feature.properties || {};
        const coords = feature.geometry.type === 'Point'
            ? feature.geometry.coordinates
            : feature.geometry.coordinates.flat(Infinity).length >= 2
                ? [feature.geometry.coordinates.flat(Infinity)[0], feature.geometry.coordinates.flat(Infinity)[1]]
                : map.getCenter().toArray();

        if (activePopup) activePopup.remove();
        activePopup = new maplibregl.Popup({ maxWidth: '340px' })
            .setLngLat(coords)
            .setHTML(`
                <div style="margin-bottom:5px;color:${layer.color};font-weight:bold;font-size:13px;text-transform:uppercase;">${escapeHTML(layer.label)}</div>
                <div class="popup-row"><span>Name:</span><span class="popup-val">${escapeHTML(getName(props))}</span></div>
                <div class="popup-row"><span>Civilisation:</span><span class="popup-val">${escapeHTML(props.civilisation || props.culture || 'Unknown')}</span></div>
                <div class="popup-row"><span>Period:</span><span class="popup-val">${escapeHTML(props.period || 'Unknown')}</span></div>
                <div class="popup-row"><span>Region:</span><span class="popup-val">${escapeHTML(props.region || 'Unknown')}</span></div>
                <div style="margin-top:8px;color:#aaa;line-height:1.4;">${escapeHTML(getSummary(props))}</div>
                ${props.quest ? `<div style="margin-top:8px;color:#ffae00;line-height:1.4;"><b>QUEST:</b> ${escapeHTML(props.quest)}</div>` : ''}
            `)
            .addTo(map);
    }

    function runSearch() {
        const term = document.getElementById('search-input').value.trim().toLowerCase();
        const results = document.getElementById('search-results');
        results.innerHTML = '';

        if (!term) {
            results.style.display = 'none';
            return;
        }

        const matches = getVisibleFeatures()
            .filter(({ feature }) => {
                const props = feature.properties || {};
                return [props.name, props.civilisation, props.period, props.region, props.summary, props.quest]
                    .join(' ').toLowerCase().includes(term);
            })
            .slice(0, 25);

        if (!matches.length) {
            results.innerHTML = '<div class="search-no-results">No loaded visible layer match. Turn on layers first.</div>';
            results.style.display = 'block';
            return;
        }

        matches.forEach(({ feature, layer }) => {
            const props = feature.properties || {};
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `<b>${escapeHTML(getName(props))}</b><br>${escapeHTML(props.civilisation || layer.label)} · ${escapeHTML(props.region || '')}`;
            item.addEventListener('click', () => {
                if (feature.geometry.type === 'Point') {
                    map.flyTo({ center: feature.geometry.coordinates, zoom: 7, speed: 0.9 });
                }
                openFeaturePopup(feature, layer);
                results.style.display = 'none';
            });
            results.appendChild(item);
        });

        results.style.display = 'block';
    }

    function exportVisibleCSV() {
        const rows = [['layer','name','civilisation','period','region','longitude','latitude','summary']];
        getVisibleFeatures().forEach(({ feature, layer }) => {
            const props = feature.properties || {};
            const coords = feature.geometry.type === 'Point' ? feature.geometry.coordinates : ['', ''];
            rows.push([
                layer.label,
                getName(props),
                props.civilisation || '',
                props.period || '',
                props.region || '',
                coords[0],
                coords[1],
                getSummary(props)
            ]);
        });

        const csv = rows.map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'civilisation_atlas_visible_layers.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    function clearLayers() {
        GRID_CONFIG.forEach(group => group.layers.forEach(layer => {
            const lid = layerId(layer.id);
            if (map.getLayer(lid)) map.setLayoutProperty(lid, 'visibility', 'none');
            runtime[layer.id].visible = false;
        }));
        document.querySelectorAll('.key-item input[type="checkbox"]').forEach(input => input.checked = false);
        updateClock();
    }

    function resetView() {
        map.flyTo({ center, zoom, speed: 0.9 });
    }

    window.enterFullscreen = function() {
        document.body.classList.add('fs-active');
        setTimeout(() => map.resize(), 50);
    };

    window.exitFullscreen = function() {
        document.body.classList.remove('fs-active', 'fs-curtain-open');
        setTimeout(() => map.resize(), 50);
    };

    map.on('load', () => {
        renderLayerControls('scada-ui-container');
        renderLayerControls('fs-curtain-keys');

        document.getElementById('search-btn').addEventListener('click', runSearch);
        document.getElementById('search-input').addEventListener('keydown', event => {
            if (event.key === 'Enter') runSearch();
        });
        document.getElementById('search-input').addEventListener('input', runSearch);
        document.getElementById('btn-export').addEventListener('click', exportVisibleCSV);
        document.getElementById('btn-clear').addEventListener('click', clearLayers);
        document.getElementById('btn-reset').addEventListener('click', resetView);
        document.getElementById('fs-curtain-tab').addEventListener('click', () => document.body.classList.toggle('fs-curtain-open'));

        GRID_CONFIG.flatMap(group => group.layers).filter(layer => layer.preload).forEach(layer => ensureLayerLoaded(layer));
    });

    map.on('error', event => console.error('MapLibre error:', event && event.error ? event.error : event));
};
