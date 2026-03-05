import React from 'react';

const AlertSystem = ({ alerts = [], setAlerts = () => {}, activeReports = 0 }) => {
  const dismissAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-white border border-gray-300 shadow-sm">
      <div className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between border-b border-gray-300">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide">Alert System</h2>
        </div>
        <div className="flex gap-2 items-center">
          <span className="px-2 py-1 bg-orange-600 text-white border border-orange-800 text-xs font-bold uppercase">
            {activeReports} Citizen Reports
          </span>
          <span className="text-xs text-green-400 font-bold uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {alerts.length === 0 && (
          <div className="text-sm text-gray-700 font-semibold uppercase">No active alerts.</div>
        )}
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border border-gray-300 px-3 py-2 bg-gray-50 flex items-start justify-between"
          >
            <div>
              <div className="text-sm font-bold text-gray-900 uppercase">{alert.title}</div>
              <div className="text-xs text-gray-600 font-semibold">{alert.time}</div>
            </div>
            <button
              className="text-xs text-gray-500 hover:text-gray-800 font-bold"
              onClick={() => dismissAlert(alert.id)}
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertSystem;
