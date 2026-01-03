import React from 'react';

const PredictionBox = ({ highRiskCount }) => {
  const getMessage = () => {
    if (highRiskCount === 0) {
      return {
        icon: '✅',
        title: 'Low Risk Scenario',
        message: 'Current conditions indicate minimal flooding risk. Drainage capacity is adequate.',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
      };
    } else if (highRiskCount <= 5) {
      return {
        icon: '⚠️',
        title: 'Moderate Alert',
        message: 'Some areas show elevated risk. Monitor drainage systems in high-risk wards.',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
      };
    } else {
      return {
        icon: '🚨',
        title: 'High Risk Alert',
        message: 'Rainfall exceeds drainage capacity in multiple wards. Deploy emergency response teams.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
      };
    }
  };

  const { icon, title, message, bgColor, borderColor, textColor } = getMessage();

  return (
    <div className={`${bgColor} ${borderColor} border-2 rounded-lg p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className={`font-bold text-sm ${textColor} mb-1`}>{title}</h3>
          <p className="text-xs text-gray-700">{message}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          💡 <strong>Rule:</strong> If (Rainfall × 0.4) + (Drainage Deficit × 0.4) + (Complaints × 0.2) {'>'} 70 → HIGH RISK
        </p>
      </div>
    </div>
  );
};

export default PredictionBox;
