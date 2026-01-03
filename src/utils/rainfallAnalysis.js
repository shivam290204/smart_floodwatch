export function averageRainfall(series) {
  if (!series.length) return 0;
  return series.reduce((sum, s) => sum + s.value, 0) / series.length;
}

export function maxRainfall(series) {
  if (!series.length) return 0;
  return Math.max(...series.map((s) => s.value));
}
