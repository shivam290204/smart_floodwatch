import wards from "../data/wards.geojson";
import hotspots from "../data/hotspots.json";
import rainfall from "../data/rainfall.json";

export function loadMockData() {
  const enrichedHotspots = hotspots.map((h) => ({
    ...h,
    trend: h.trend || (Math.random() > 0.5 ? "rising" : "falling"),
  }));

  return {
    wards,
    hotspots: enrichedHotspots,
    rainfall,
  };
}
