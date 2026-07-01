// ===== CONFIG =====
// Замените на URL вашего Google Sheets CSV:
// Файл → Поделиться → Опубликовать в интернете → CSV → скопировать ссылку
const DATA_URL     = 'assets/clients.csv';
const ITALY_BOUNDS = [[36.5, 6.5], [47.2, 18.5]];
const COLORS       = { terra: '#B0502F', ochre: '#C9974A', cream: '#FBF9F3' };

// ===== STATE =====
let mapInst     = null;
let activeLayer = 'from';
let groupFrom   = null;
let groupTo     = null;

const mapEl      = document.getElementById('map');
const fallbackEl = document.getElementById('map-fallback');
function $id(id) { return document.getElementById(id); }

// ===== PRELOAD — data fetch starts immediately on page load =====
const dataReady = Promise.all([
  fetch('assets/cities.json').then(r => r.json()),
  fetch(DATA_URL).then(r => r.text())
]);

// ===== BOOTSTRAP =====
async function bootstrap() {
  try {
    const [cities, csvText] = await dataReady;
    const { data: clients } = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    updateStats(clients);
    initMap(clients, cities);
  } catch (err) {
    console.error('Map failed to load:', err);
    showFallback();
  }
}

// ===== STATS =====
function updateStats(clients) {
  const fromSet = new Set(clients.map(r => r.city_from?.trim()).filter(Boolean));
  const uniSet  = new Set(clients.map(r => r.university?.trim()).filter(Boolean));
  const years   = clients.map(r => parseInt(r.year)).filter(n => !isNaN(n));
  const span    = years.length > 1 ? Math.max(...years) - Math.min(...years) + 1 : 1;

  $id('stat-students').textContent = clients.length;
  $id('stat-cities').textContent   = fromSet.size;
  $id('stat-unis').textContent     = uniSet.size || '—';
  $id('stat-years').textContent    = span + (span === 1 ? ' год' : span < 5 ? ' года' : ' лет');
}

// ===== MAP INIT =====
function initMap(clients, cities) {
  // Start at Italy so Carto tiles for Куда view are already loading
  const map = L.map('map', {
    center: [42.5, 12.5],
    zoom: 6,
    zoomControl: true,
    attributionControl: true
  });

  mapInst = map;

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(map);

  groupFrom = buildGroup(clients, cities, 'city_from', COLORS.terra);
  groupTo   = buildGroup(clients, cities, 'city_to',   COLORS.ochre);

  $id('map-loading')?.remove();
  setLayerDesc(activeLayer);

  if (activeLayer === 'to') {
    groupTo.addTo(map);
    map.fitBounds(ITALY_BOUNDS, { padding: [32, 32] });
  } else {
    groupFrom.addTo(map);
    if (groupFrom.getLayers().length) {
      map.fitBounds(groupFrom.getBounds().pad(0.25), { maxZoom: 5 });
    }
  }
}

// ===== CLUSTER GROUP =====
function buildGroup(clients, cities, field, color) {
  const counts   = {};
  const unknowns = new Set();

  clients.forEach(r => {
    const city = r[field]?.trim();
    if (!city) return;
    if (!cities[city]) { unknowns.add(city); return; }
    counts[city] = (counts[city] || 0) + 1;
  });

  if (unknowns.size) {
    console.warn('[map] Cities missing from cities.json:', [...unknowns]);
  }

  const group = L.markerClusterGroup({
    maxClusterRadius: 52,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    animate: false,
    iconCreateFunction(cluster) {
      const sum = cluster.getAllChildMarkers()
        .reduce((acc, m) => acc + m.options.clientCount, 0);
      const s = sum < 5 ? 34 : sum < 15 ? 42 : sum < 40 ? 50 : 58;
      return L.divIcon({
        html: `<div style="
          width:${s}px;height:${s}px;
          background:${color};color:${COLORS.cream};
          border:2.5px solid ${COLORS.cream};border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-family:'Onest',sans-serif;font-size:13px;font-weight:600;
          box-shadow:0 2px 10px rgba(0,0,0,.22);
        ">${sum}</div>`,
        className: '',
        iconSize: [s, s],
        iconAnchor: [s / 2, s / 2]
      });
    }
  });

  Object.entries(counts).forEach(([city, count]) => {
    const [lat, lng] = cities[city];
    const r = count === 1 ? 9 : count < 5 ? 12 : count < 20 ? 16 : 21;
    const marker = L.circleMarker([lat, lng], {
      radius: r,
      fillColor: color,
      fillOpacity: 0.88,
      color: COLORS.cream,
      weight: 2,
      clientCount: count
    });
    marker.bindPopup(
      `<strong>${city}</strong><br>${count} студент${plural(count)}`,
      { closeButton: false, offset: L.point(0, -4) }
    );
    group.addLayer(marker);
  });

  return group;
}

// ===== TABS =====
document.querySelectorAll('[data-map-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.mapTab === activeLayer) return;

    document.querySelectorAll('[data-map-tab]').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    activeLayer = btn.dataset.mapTab;
    setLayerDesc(activeLayer);

    if (!mapInst) return;

    if (activeLayer === 'to') {
      if (groupFrom) mapInst.removeLayer(groupFrom);
      if (groupTo)   groupTo.addTo(mapInst);
      mapInst.fitBounds(ITALY_BOUNDS, { padding: [32, 32] });
    } else {
      if (groupTo)   mapInst.removeLayer(groupTo);
      if (groupFrom) groupFrom.addTo(mapInst);
      if (groupFrom?.getLayers().length) {
        mapInst.fitBounds(groupFrom.getBounds().pad(0.25), { maxZoom: 5 });
      }
    }
  });
});

// ===== HELPERS =====
function setLayerDesc(layer) {
  const el = $id('map-layer-desc');
  if (el) el.textContent = layer === 'from'
    ? 'Города, из которых к нам обратились'
    : 'Города итальянских университетов';
}

function plural(n) {
  if (n % 10 === 1 && n % 100 !== 11) return '';
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'а';
  return 'ов';
}

function showFallback() {
  if (mapEl) mapEl.style.display = 'none';
  if (fallbackEl) fallbackEl.style.display = '';
}

// ===== LAZY INIT =====
const mapObs = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    mapObs.disconnect();
    bootstrap();
  }
}, { rootMargin: '900px' });

if (mapEl) mapObs.observe(mapEl);
