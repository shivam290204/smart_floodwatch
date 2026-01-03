import { calculateRiskIndex, getRiskCategory } from '../utils/riskCalculator';

const WARDS_URL = '/data/Delhi_Wards.geojson';
const BOUNDARY_URL = '/data/Delhi_Boundary.geojson';
const NORTH_RAIN_URL = '/data/north_rainfall.csv';
const SOUTH_RAIN_URL = '/data/south_rainfall.csv';

const monsoonMonths = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const sampleHotspots = [
  { id: 'H1', location: 'Yamuna Pushta', lat: 28.66, lng: 77.25, severity: 'high', reports: 14, lastIncident: '2026-01-01' },
  { id: 'H2', location: 'Lutyens Zone', lat: 28.61, lng: 77.2, severity: 'medium', reports: 7, lastIncident: '2026-01-01' },
  { id: 'H3', location: 'Dwarka Sector 10', lat: 28.58, lng: 77.05, severity: 'low', reports: 3, lastIncident: '2025-12-31' },
];

let wardCachePromise;
let boundaryCachePromise;
let rainfallStatsPromise;

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
};

const fetchText = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.text();
};

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const parseCsv = (text) => {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(',').map((h) => h.trim());
  return lines
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(',').map((p) => p.trim());
      return headers.reduce((acc, header, idx) => {
        acc[header] = idx === 0 ? toNumber(parts[idx]) : toNumber(parts[idx]);
        return acc;
      }, {});
    });
};

const hashNumber = (input) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 100000;
  }
  return hash;
};

const flattenCoords = (geometry) => {
  if (geometry.type === 'Polygon') return geometry.coordinates.flat();
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flat(2);
  return [];
};

const centroidLatLng = (geometry) => {
  const coords = flattenCoords(geometry).filter((point) => Array.isArray(point) && point.length >= 2);
  if (!coords.length) return { lat: 0, lng: 0 };
  const sum = coords.reduce(
    (acc, [lng, lat]) => ({ lat: acc.lat + lat, lng: acc.lng + lng }),
    { lat: 0, lng: 0 }
  );
  return { lat: sum.lat / coords.length, lng: sum.lng / coords.length };
};

const loadRainfallStats = async () => {
  const [northText, southText] = await Promise.all([
    fetchText(NORTH_RAIN_URL),
    fetchText(SOUTH_RAIN_URL),
  ]);

  const northRows = parseCsv(northText);
  const southRows = parseCsv(southText);

  const addTotals = (rows) =>
    rows.map((row) => {
      const total = monsoonMonths.reduce((sum, month) => sum + toNumber(row[month]), 0);
      return {
        ...row,
        Total: row.Total ? toNumber(row.Total) : total,
      };
    });

  const north = addTotals(northRows);
  const south = addTotals(southRows);
  const latestYear = Math.max(...north.map((r) => r.Year), ...south.map((r) => r.Year));
  const northLatest = north.find((r) => r.Year === latestYear) || north[north.length - 1];
  const southLatest = south.find((r) => r.Year === latestYear) || south[south.length - 1];

  const monsoonAvg = (row) => monsoonMonths.reduce((sum, m) => sum + toNumber(row[m]), 0) / monsoonMonths.length;
  const combinedTrend = monsoonMonths.map(
    (month) => Math.round(((toNumber(northLatest[month]) + toNumber(southLatest[month])) / 2) * 10) / 10
  );

  return {
    latestYear,
    northLatest,
    southLatest,
    monsoonAvgNorth: monsoonAvg(northLatest),
    monsoonAvgSouth: monsoonAvg(southLatest),
    combinedTrend,
    avgTotal: Math.round((toNumber(northLatest.Total) + toNumber(southLatest.Total)) / 2),
  };
};

const loadWardData = async (selectedMonth = 'Jul') => {
  const [geojson, rainfallStats] = await Promise.all([fetchJson(WARDS_URL), fetchRainfallStats()]);
  const thresholdLat = 28.65;

  // Map short month names to CSV column names
  const monthMap = {
    'Jun': 'June',
    'Jul': 'July',
    'Aug': 'Aug',
    'Sep': 'Sept',
    'Oct': 'Oct',
  };
  const csvMonthName = monthMap[selectedMonth] || 'July';

  const wards = geojson.features.map((feature) => {
    const { Ward_No, Ward_Name } = feature.properties;
    const centroid = centroidLatLng(feature.geometry);
    const isNorth = centroid.lat >= thresholdLat;
    
    const northRainfall = toNumber(rainfallStats.northLatest[csvMonthName]) || rainfallStats.monsoonAvgNorth;
    const southRainfall = toNumber(rainfallStats.southLatest[csvMonthName]) || rainfallStats.monsoonAvgSouth;
    const rainfall = Math.round((isNorth ? northRainfall : southRainfall) * 10) / 10;

    const seed = hashNumber(Ward_No || Ward_Name || 'ward');
    const drainageDeficit = 25 + (seed % 60);
    const complaints = 5 + (seed % 20);
    const riskIndex = calculateRiskIndex(rainfall, drainageDeficit, complaints);

    return {
      id: Ward_No,
      geometry: feature.geometry,
      wardName: Ward_Name,
      wardId: Ward_No,
      rainfall,
      drainageDeficit,
      complaints,
      riskIndex,
      riskCategory: getRiskCategory(riskIndex),
      lastUpdated: new Date().toISOString(),
    };
  });

  return wards;
};

const loadBoundary = async () => fetchJson(BOUNDARY_URL);

export async function fetchWardData(selectedMonth = 'Jul') {
  // Clear cache when month changes to force recalculation
  wardCachePromise = loadWardData(selectedMonth);
  return wardCachePromise;
}

export async function fetchBoundary() {
  if (!boundaryCachePromise) boundaryCachePromise = loadBoundary();
  return boundaryCachePromise;
}

export async function fetchHotspots() {
  return sampleHotspots;
}

export async function fetchRainfallStats() {
  if (!rainfallStatsPromise) rainfallStatsPromise = loadRainfallStats();
  return rainfallStatsPromise;
}

export async function fetchDashboardData() {
  const [wards, hotspots, rainfallStats] = await Promise.all([
    fetchWardData(),
    fetchHotspots(),
    fetchRainfallStats(),
  ]);

  const categories = wards.reduce(
    (acc, ward) => {
      const category = ward.riskCategory;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );

  const vulnerableWards = wards
    .sort((a, b) => b.riskIndex - a.riskIndex)
    .slice(0, 5)
    .map((ward) => ({
      wardId: ward.wardId,
      wardName: ward.wardName,
      riskIndex: ward.riskIndex,
      riskCategory: ward.riskCategory,
      rainfall: ward.rainfall,
      drainageDeficit: ward.drainageDeficit,
    }));

  return {
    riskCounts: {
      high: categories.High,
      medium: categories.Medium,
      low: categories.Low,
    },
    totalRainfall: rainfallStats.avgTotal,
    activeHotspots: hotspots.length,
    vulnerableWards,
    rainfallTrend: rainfallStats.combinedTrend,
    complaintsTrend: rainfallStats.combinedTrend.map((v) => Math.round(v / 3 + 5)),
  };
}
