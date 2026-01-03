import React from 'react';

const AlertSystem = ({ alerts = [], setAlerts = () => {}, activeReports = 0 }) => {
  const dismissAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase text-gray-500 tracking-[0.15em]">Notifications</p>
          <h2 className="text-lg font-semibold text-gray-800">Alert System</h2>
        </div>
        <div className="flex gap-2 items-center">
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
            {activeReports} Citizen Reports
          </span>
          <span className="text-xs text-emerald-600">Live</span>
        </div>
      </div>

      <div className="space-y-2">
        {alerts.length === 0 && (
          <div className="text-sm text-gray-500">No active alerts.</div>
        )}
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border border-gray-200 rounded-lg px-3 py-2 bg-white flex items-start justify-between"
          >
            <div>
              <div className="text-sm font-medium text-gray-800">{alert.title}</div>
              <div className="text-xs text-gray-500">{alert.time}</div>
            </div>
            <button
              className="text-xs text-gray-400 hover:text-gray-600"
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
