import React from 'react';

const PredictionBox = ({ highRiskCount }) => {
  const getMessage = () => {
    if (highRiskCount === 0) {
      return {
        title: 'LOW RISK SCENARIO',
        message: 'Current conditions indicate minimal flooding risk. Drainage capacity is adequate.',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        textColor: 'text-green-900',
      };
    } else if (highRiskCount <= 5) {
      return {
        title: 'MODERATE ALERT',
        message: 'Some areas show elevated risk. Monitor drainage systems in high-risk wards.',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        textColor: 'text-yellow-900',
      };
    } else {
      return {
        title: 'HIGH RISK ALERT',
        message: 'Rainfall exceeds drainage capacity in multiple wards. Deploy emergency response teams.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        textColor: 'text-red-900',
      };
    }
  };

  const { title, message, bgColor, borderColor, textColor } = getMessage();

  return (
    <div className={`${bgColor} ${borderColor} border p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className={`font-bold text-sm ${textColor} mb-1 uppercase tracking-wide`}>{title}</h3>
          <p className="text-xs text-gray-800 font-semibold">{message}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-300">
        <p className="text-xs text-gray-700 font-bold uppercase">
          RULE: IF (RAINFALL × 0.4) + (DRAINAGE DEFICIT × 0.4) + (COMPLAINTS × 0.2) {'>'} 70 → HIGH RISK
        </p>
      </div>
    </div>
  );
};

export default PredictionBox;
