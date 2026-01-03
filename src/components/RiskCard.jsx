const colorMap = {
  red: 'bg-red-50 text-red-700 border-red-100',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-green-50 text-green-700 border-green-100',
};

const RiskCard = ({ title, value, change, color = 'blue', icon }) => {
  return (
    <div className={`border rounded-xl p-3 ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <div className="text-xs font-semibold uppercase tracking-tight text-gray-600 line-clamp-1">{title}</div>
      </div>
      <div className="text-xl font-bold mb-1">{value}</div>
      <div className="text-xs text-gray-600 line-clamp-2">{change}</div>
    </div>
  );
};

export default RiskCard;
