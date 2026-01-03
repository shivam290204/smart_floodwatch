const HowItWorks = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-3">How FloodSight Works</h1>
        <p className="text-xl text-blue-100">
          A data-driven decision support system for flood risk management in Delhi NCT
        </p>
      </div>

      {/* Data Sources */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span> Data Sources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-3xl mb-2">🌧️</div>
            <h3 className="font-bold text-gray-900 mb-2">India Meteorological Department (IMD)</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 120+ years of historical rainfall data</li>
              <li>• Real-time weather monitoring</li>
              <li>• Seasonal trend analysis</li>
              <li>• Precipitation forecasts</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-3xl mb-2">🏗️</div>
            <h3 className="font-bold text-gray-900 mb-2">Municipal Corporation of Delhi (MCD)</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ward-level infrastructure data</li>
              <li>• Drainage system capacity</li>
              <li>• Historical waterlogging reports</li>
              <li>• Citizen complaint logs</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-3xl mb-2">💧</div>
            <h3 className="font-bold text-gray-900 mb-2">Public Works Department (PWD)</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Storm drain network maps</li>
              <li>• Pump station locations</li>
              <li>• Maintenance schedules</li>
              <li>• Infrastructure age/condition</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-gray-900 mb-2">Citizen Reports</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ground-level waterlogging reports</li>
              <li>• Real-time severity assessment</li>
              <li>• Location-specific complaints</li>
              <li>• Community feedback</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Risk Calculation Logic */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>🧮</span> Risk Calculation Logic
        </h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4">
          <h3 className="font-bold text-blue-900 mb-3 text-lg">Risk Index Formula</h3>
          <div className="bg-white rounded p-4 font-mono text-sm mb-3">
            Risk Index = (0.4 × Rainfall) + (0.4 × Drainage Deficit) + (0.2 × Complaints)
          </div>
          <div className="text-sm text-blue-800 space-y-1">
            <div><strong>Rainfall (40%):</strong> Current rainfall vs historical average</div>
            <div><strong>Drainage Deficit (40%):</strong> System capacity shortfall</div>
            <div><strong>Complaints (20%):</strong> Citizen-reported incidents</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700 mb-1">0-39</div>
            <div className="font-semibold text-green-800">Low Risk</div>
            <div className="text-xs text-green-600 mt-1">Routine monitoring</div>
          </div>
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-700 mb-1">40-69</div>
            <div className="font-semibold text-orange-800">Medium Risk</div>
            <div className="text-xs text-orange-600 mt-1">Preemptive deployment</div>
          </div>
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-700 mb-1">70-100</div>
            <div className="font-semibold text-red-800">High Risk</div>
            <div className="text-xs text-red-600 mt-1">Immediate response</div>
          </div>
        </div>
      </div>

      {/* Decision Workflow */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>🔄</span> Decision Workflow
        </h2>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: 'Data Collection',
              description: 'System aggregates real-time data from IMD, MCD, PWD, and citizen reports every 5 minutes.',
              icon: '📥'
            },
            {
              step: 2,
              title: 'Risk Assessment',
              description: 'ML-powered algorithm calculates ward-level risk indices using historical patterns and current conditions.',
              icon: '🧠'
            },
            {
              step: 3,
              title: 'Alert Generation',
              description: 'High-risk wards trigger automatic alerts to MCD control room and emergency response teams.',
              icon: '🚨'
            },
            {
              step: 4,
              title: 'Resource Dispatch',
              description: 'Decision support system recommends pump deployment, team allocation, and evacuation protocols.',
              icon: '⚙️'
            },
            {
              step: 5,
              title: 'Scenario Planning',
              description: 'What-if analysis helps predict flood timelines and test resource allocation strategies.',
              icon: '🎯'
            },
            {
              step: 6,
              title: 'Post-Event Review',
              description: 'Historical comparison analyzes response effectiveness and identifies infrastructure improvements.',
              icon: '📊'
            }
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 flex-shrink-0">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span>{item.icon}</span>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>⚙️</span> Technical Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Frontend Technologies</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• React.js for interactive UI</li>
              <li>• Leaflet for GIS mapping</li>
              <li>• Chart.js for data visualization</li>
              <li>• Tailwind CSS for responsive design</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Data Processing</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• GeoJSON for spatial data</li>
              <li>• CSV parsing for historical rainfall</li>
              <li>• LocalStorage for citizen reports</li>
              <li>• Rule-based ML predictions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-sm text-yellow-800">
        <strong>⚠️ Prototype System:</strong> This is a decision-support prototype designed for demonstration purposes. 
        Actual deployment requires integration with live government databases, authentication systems, and API endpoints.
      </div>
    </div>
  );
};

export default HowItWorks;
