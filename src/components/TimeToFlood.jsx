import React from 'react';

const TimeToFlood = ({ ward }) => {
  if (!ward) return null;

  // Calculate time to flood
  const drainageCapacity = 100; // mm total capacity
  const remainingBuffer = drainageCapacity - ward.drainageDeficit;
  const rainfallIntensity = ward.rainfall / 24; // Convert daily to hourly (mm/h)

  let timeToFlood = 0;
  let status = 'safe';
  let message = 'No immediate risk';
  let bgColor = 'bg-white';
  let borderColor = 'border-gray-300';
  let borderLeftClass = 'border-l-gray-400';
  let textColor = 'text-gray-800';

  if (rainfallIntensity > 0 && remainingBuffer > 0) {
    timeToFlood = remainingBuffer / rainfallIntensity;
    
    if (timeToFlood < 2) {
      status = 'critical';
      message = 'Immediate action required!';
      bgColor = 'bg-white';
      borderColor = 'border-gray-300';
      borderLeftClass = 'border-l-blue-900';
      textColor = 'text-gray-900';
    } else if (timeToFlood < 6) {
      status = 'warning';
      message = 'Monitor closely';
      bgColor = 'bg-white';
      borderColor = 'border-gray-300';
      borderLeftClass = 'border-l-blue-800';
      textColor = 'text-gray-900';
    } else if (timeToFlood < 12) {
      status = 'caution';
      message = 'Prepare response teams';
      bgColor = 'bg-white';
      borderColor = 'border-gray-300';
      borderLeftClass = 'border-l-blue-700';
      textColor = 'text-gray-900';
    } else {
      status = 'low';
      message = 'Low urgency';
      bgColor = 'bg-white';
      borderColor = 'border-gray-300';
      borderLeftClass = 'border-l-gray-500';
      textColor = 'text-gray-800';
    }
  } else if (remainingBuffer <= 0) {
    status = 'flooded';
    message = 'Capacity exceeded';
    bgColor = 'bg-white';
    borderColor = 'border-gray-300';
    borderLeftClass = 'border-l-blue-900';
    textColor = 'text-gray-900';
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'caution': return '⏱️';
      case 'flooded': return '🌊';
      case 'safe': return '✅';
      default: return '📊';
    }
  };

  return (
    <div className={`${bgColor} border border-gray-300 ${borderLeftClass} border-l-4 p-4 mt-3`}>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="font-bold text-sm uppercase tracking-wide text-gray-900">
          Time-to-Flood Estimate
        </h4>
      </div>

      {rainfallIntensity > 0 && remainingBuffer > 0 ? (
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-bold ${textColor}`}>
              {timeToFlood.toFixed(1)}
            </span>
            <span className="text-base sm:text-lg font-semibold text-gray-700 uppercase">Hours</span>
          </div>
          <p className={`text-xs sm:text-sm mt-2 font-bold uppercase ${textColor}`}>{message}</p>
          
          <div className="mt-3 pt-3 border-t border-gray-300 space-y-1 text-xs sm:text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="uppercase">Remaining Buffer:</span>
              <span className="font-bold">{remainingBuffer.toFixed(1)} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase">Rainfall Rate:</span>
              <span className="font-bold">{rainfallIntensity.toFixed(1)} mm/hr</span>
            </div>
          </div>
        </div>
      ) : remainingBuffer <= 0 ? (
        <div>
          <p className={`text-base sm:text-lg font-bold ${textColor}`}>⚠️ {message}</p>
          <p className="text-xs sm:text-sm mt-2 text-gray-600">
            Drainage capacity fully utilized. Immediate pumping required.
          </p>
        </div>
      ) : (
        <div>
          <p className={`text-base sm:text-lg font-semibold ${textColor}`}>✅ {message}</p>
          <p className="text-xs sm:text-sm mt-2 text-gray-600">
            Current rainfall intensity is minimal. Continue monitoring.
          </p>
        </div>
      )}

      {timeToFlood > 0 && timeToFlood < 6 && (
        <div className="mt-3 bg-white p-2 border border-gray-400 border-l-4 border-l-blue-900">
          <p className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
            ACTION REQUIRED: DEPLOY PUMPS AND CLEAR PRIORITY DRAINS NOW
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeToFlood;
