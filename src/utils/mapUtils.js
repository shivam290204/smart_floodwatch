export function getWardColor(score) {
  if (score > 80) return "#f59e0b";
  if (score > 60) return "#fbbf24";
  if (score > 40) return "#fde68a";
  return "#a7f3d0";
}
