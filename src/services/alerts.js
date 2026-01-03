export function calculateWardAlerts(hotspots) {
  return hotspots
    .filter((h) => h.riskScore >= 70)
    .map((h, idx) => ({
      id: idx + 1,
      title: `${h.name} exceeds threshold`,
      severity: h.riskScore > 85 ? "High" : "Medium",
    }));
}
