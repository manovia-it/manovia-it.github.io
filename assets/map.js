// ===== CONFIG =====
// Замените на URL вашего Google Sheets CSV:
// Файл → Поделиться → Опубликовать в интернете → CSV → скопировать ссылку
const DATA_URL = 'assets/clients.csv';

const COLORS = {
  terra:  '#B0502F',
  ochre:  '#C9974A',
  cream:  '#F7F3E8',
  sienna: '#5E2814'
};

const MAPLIBRE_JS  = 'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js';
const MAPLIBRE_CSS = 'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.css';
const PAPAPARSE    = 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js';
const MAP_STYLE    = 'https://tiles.openfreemap.org/styles/positron';

// ===== STATE =====
let mapInst    = null;
let cities     = null;
let clients    = null;
let activeLayer = 'from';

const mapEl      = document.getElementById('map');
const fallbackEl = document.getElementById('map-fallback');

// ===== HELPERS =====
function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

function loadCSS(href) {
  return new Promise(res => {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href; l.onload = res;
    document.head.appendChild(l);
  });
}

function $id(id) { return document.getElementById(id); }

// ===== BOOTSTRAP =====
async function bootstrap() {
  try {
    await Promise.all([
      loadScript(MAPLIBRE_JS),
      loadCSS(MAPLIBRE_CSS),
      loadScript(PAPAPARSE)
    ]);

    const [citiesResp, csvResp] = await Promise.all([
      fetch('assets/cities.json'),
      fetch(DATA_URL)
    ]);

    cities = await citiesResp.json();
    const csvText = await csvResp.text();

    await new Promise(res => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: r => { clients = r.data; res(); }
      });
    });

    updateStats();
    initMap();
  } catch (err) {
    console.error('Map failed to load:', err);
    showFallback();
  }
}

// ===== STATS =====
function updateStats() {
  const total    = clients.length;
  const fromSet  = new Set(clients.map(r => r.city_from?.trim()).filter(Boolean));
  const uniSet   = new Set(clients.map(r => r.university?.trim()).filter(Boolean));
  const years    = clients.map(r => parseInt(r.year)).filter(n => !isNaN(n));
  const span     = years.length > 1 ? Math.max(...years) - Math.min(...years) + 1 : 1;

  $id('stat-students').textContent = total;
  $id('stat-cities').textContent   = fromSet.size;
  $id('stat-unis').textContent     = uniSet.size || '—';
  $id('stat-years').textContent    = span + (span === 1 ? ' год' : span < 5 ? ' года' : ' лет');
}

// ===== GEOJSON =====
function buildGeoJSON(field) {
  const counts   = {};
  const unknowns = new Set();

  clients.forEach(r => {
    const city = r[field]?.trim();
    if (!city) return;
    if (!cities[city]) { unknowns.add(city); return; }
    counts[city] = (counts[city] || 0) + 1;
  });

  if (unknowns.size) {
    console.warn('[map] Cities missing from cities.json (add coordinates):', [...unknowns]);
  }

  return {
    type: 'FeatureCollection',
    features: Object.entries(counts).map(([city, count]) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [cities[city][1], cities[city][0]]
      },
      properties: { city, count }
    }))
  };
}

// ===== MAP =====
function initMap() {
  const map = new maplibregl.Map({
    container: 'map',
    style: MAP_STYLE,
    center: [42, 47],
    zoom: 2.2,
    cooperativeGestures: true,
    attributionControl: { compact: true }
  });

  mapInst = map;
  $id('map-loading')?.remove();

  map.on('load', () => {
    const fromGJ = buildGeoJSON('city_from');
    const toGJ   = buildGeoJSON('city_to');

    addSource(map, 'from', fromGJ);
    addSource(map, 'to',   toGJ);

    addLayers(map, 'from', COLORS.terra);
    addLayers(map, 'to',   COLORS.ochre);

    // Sync with current tab state (handles click-before-load race)
    setVisible(map, 'from', activeLayer === 'from');
    setVisible(map, 'to',   activeLayer === 'to');

    addInteraction(map, 'from', 'from-dot', 'откуда приехал');
    addInteraction(map, 'to',   'to-dot',   'куда поступил');

    const allFeatures = [...fromGJ.features, ...toGJ.features];
    if (allFeatures.length) fitBounds(map, allFeatures);
  });
}

function addSource(map, key, gj) {
  map.addSource(key, {
    type: 'geojson',
    data: gj,
    cluster: true,
    clusterMaxZoom: 8,
    clusterRadius: 52,
    clusterProperties: {
      sum: ['+', ['get', 'count']]
    }
  });
}

function addLayers(map, key, color) {
  map.addLayer({
    id: `${key}-cluster`,
    type: 'circle',
    source: key,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': color,
      'circle-opacity': 0.9,
      'circle-stroke-color': COLORS.cream,
      'circle-stroke-width': 2.5,
      'circle-radius': [
        'step', ['get', 'sum'],
        18,   5,
        24,  15,
        30,  40,
        36
      ]
    }
  });

  map.addLayer({
    id: `${key}-cluster-label`,
    type: 'symbol',
    source: key,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'sum'],
      'text-font': ['Noto Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 13,
      'text-allow-overlap': true
    },
    paint: { 'text-color': COLORS.cream }
  });

  map.addLayer({
    id: `${key}-dot`,
    type: 'circle',
    source: key,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': color,
      'circle-opacity': 0.88,
      'circle-stroke-color': COLORS.cream,
      'circle-stroke-width': 2,
      'circle-radius': [
        'interpolate', ['linear'], ['get', 'count'],
        1,  8,
        5, 14,
        20, 22
      ]
    }
  });
}

function setVisible(map, key, show) {
  const v = show ? 'visible' : 'none';
  [`${key}-cluster`, `${key}-cluster-label`, `${key}-dot`].forEach(id => {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', v);
  });
}

function addInteraction(map, key, dotLayerId, directionLabel) {
  map.on('click', dotLayerId, e => {
    const props = e.features[0].properties;
    new maplibregl.Popup({ offset: 12, closeButton: false, maxWidth: '200px' })
      .setLngLat(e.features[0].geometry.coordinates.slice())
      .setHTML(
        `<strong>${props.city}</strong><br>` +
        `${props.count} студент${plural(props.count)} — ${directionLabel}`
      )
      .addTo(map);
  });

  map.on('click', `${key}-cluster`, e => {
    const f = e.features[0];
    map.getSource(key).getClusterExpansionZoom(
      f.properties.cluster_id,
      (err, zoom) => {
        if (!err) map.easeTo({ center: f.geometry.coordinates, zoom: zoom + 0.5 });
      }
    );
  });

  const setCursor = cur => () => { map.getCanvas().style.cursor = cur; };
  map.on('mouseenter', dotLayerId,       setCursor('pointer'));
  map.on('mouseleave', dotLayerId,       setCursor(''));
  map.on('mouseenter', `${key}-cluster`, setCursor('pointer'));
  map.on('mouseleave', `${key}-cluster`, setCursor(''));
}

function plural(n) {
  if (n % 10 === 1 && n % 100 !== 11) return '';
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'а';
  return 'ов';
}

function fitBounds(map, features) {
  const lngs = features.map(f => f.geometry.coordinates[0]);
  const lats  = features.map(f => f.geometry.coordinates[1]);
  map.fitBounds(
    [
      [Math.min(...lngs) - 3, Math.min(...lats) - 3],
      [Math.max(...lngs) + 3, Math.max(...lats) + 3]
    ],
    { padding: 48, maxZoom: 5, duration: 800 }
  );
}

// ===== FALLBACK =====
function showFallback() {
  if (mapEl) mapEl.style.display = 'none';
  if (fallbackEl) {
    fallbackEl.style.display = '';
    if (clients) {
      const counts = {};
      clients.forEach(r => {
        const c = r.city_from?.trim();
        if (c) counts[c] = (counts[c] || 0) + 1;
      });
      const listEl = $id('fallback-list');
      if (listEl) {
        listEl.innerHTML = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(([city, n]) => `<li>${city} — ${n}</li>`)
          .join('');
      }
    }
  }
}

// ===== LAYER TABS =====
document.querySelectorAll('[data-map-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-map-tab]').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    activeLayer = btn.dataset.mapTab;

    if (mapInst) {
      setVisible(mapInst, 'from', activeLayer === 'from');
      setVisible(mapInst, 'to',   activeLayer === 'to');
    }
  });
});

// ===== LAZY INIT =====
const mapObs = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    mapObs.disconnect();
    bootstrap();
  }
}, { rootMargin: '300px' });

if (mapEl) mapObs.observe(mapEl);
