import { useEffect, useState } from "react";

export default function useRealTimeData(initialRainfall) {
  const [latestRainfall, setLatestRainfall] = useState(initialRainfall.at(-1)?.value || 0);
  const [alerts, setAlerts] = useState([
    { id: 1, title: "High intensity cell over North", time: "2 min ago", severity: "High" },
    { id: 2, title: "Drainage near Lutyens nearing capacity", time: "10 min ago", severity: "Medium" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatestRainfall((prev) => Number((prev + Math.random() * 1.5 - 0.5).toFixed(1)));
      setAlerts((prev) => [
        {
          id: Date.now(),
          title: "New microcell detected",
          time: "moments ago",
          severity: "Low",
        },
        ...prev.slice(0, 4),
      ]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return { latestRainfall, alerts };
}
