const HowItWorks = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white border border-blue-950 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-3 uppercase tracking-wide">How FloodSight Works</h1>
        <p className="text-sm sm:text-xl text-blue-100 font-semibold uppercase">
          A data-driven decision support system for flood risk management in Delhi NCT
        </p>
      </div>

      {/* Data Sources */}
      <div className="bg-white border border-gray-300 shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
          Data Sources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-300 bg-gray-50 p-4">
            <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm">India Meteorological Department (IMD)</h3>
            <ul className="text-xs font-semibold text-gray-700 space-y-1 uppercase">
              <li>• 120+ years of historical rainfall data</li>
              <li>• Real-time weather monitoring</li>
              <li>• Seasonal trend analysis</li>
              <li>• Precipitation forecasts</li>
            </ul>
          </div>

          <div className="border border-gray-300 bg-gray-50 p-4">
            <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm">Municipal Corporation of Delhi (MCD)</h3>
            <ul className="text-xs font-semibold text-gray-700 space-y-1 uppercase">
              <li>• Ward-level infrastructure data</li>
              <li>• Drainage system capacity</li>
              <li>• Historical waterlogging reports</li>
              <li>• Citizen complaint logs</li>
            </ul>
          </div>

          <div className="border border-gray-300 bg-gray-50 p-4">
            <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm">Public Works Department (PWD)</h3>
            <ul className="text-xs font-semibold text-gray-700 space-y-1 uppercase">
              <li>• Storm drain network maps</li>
              <li>• Pump station locations</li>
              <li>• Maintenance schedules</li>
              <li>• Infrastructure age/condition</li>
            </ul>
          </div>

          <div className="border border-gray-300 bg-gray-50 p-4">
            <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm">Citizen Reports</h3>
            <ul className="text-xs font-semibold text-gray-700 space-y-1 uppercase">
              <li>• Ground-level waterlogging reports</li>
              <li>• Real-time severity assessment</li>
              <li>• Location-specific complaints</li>
              <li>• Community feedback</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Risk Calculation Logic */}
      <div className="bg-white border border-gray-300 shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
          Risk Calculation Logic
        </h2>
        
        <div className="bg-blue-50 border border-blue-300 p-4 sm:p-5 mb-4">
          <h3 className="font-bold text-blue-900 mb-3 text-sm sm:text-lg uppercase">Risk Index Formula</h3>
          <div className="bg-white border border-blue-200 p-3 sm:p-4 font-mono text-xs sm:text-sm mb-3 font-bold">
            RISK INDEX = (0.4 × RAINFALL) + (0.4 × DRAINAGE DEFICIT) + (0.2 × COMPLAINTS)
          </div>
          <div className="text-xs sm:text-sm text-blue-900 space-y-1 font-semibold uppercase">
            <div><strong>Rainfall (40%):</strong> Current rainfall vs historical average</div>
            <div><strong>Drainage Deficit (40%):</strong> System capacity shortfall</div>
            <div><strong>Complaints (20%):</strong> Citizen-reported incidents</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-green-50 border border-green-400 p-4 text-center">
            <div className="text-2xl font-bold text-green-800 mb-1">0-39</div>
            <div className="font-bold text-green-900 uppercase text-sm">Low Risk</div>
            <div className="text-xs font-semibold text-green-700 mt-1 uppercase">Routine monitoring</div>
          </div>
          <div className="bg-orange-50 border border-orange-400 p-4 text-center">
            <div className="text-2xl font-bold text-orange-800 mb-1">40-69</div>
            <div className="font-bold text-orange-900 uppercase text-sm">Medium Risk</div>
            <div className="text-xs font-semibold text-orange-700 mt-1 uppercase">Preemptive deployment</div>
          </div>
          <div className="bg-red-50 border border-red-400 p-4 text-center">
            <div className="text-2xl font-bold text-red-800 mb-1">70-100</div>
            <div className="font-bold text-red-900 uppercase text-sm">High Risk</div>
            <div className="text-xs font-semibold text-red-700 mt-1 uppercase">Immediate response</div>
          </div>
        </div>
      </div>

      {/* System Workflow */}
      <div className="bg-white border border-gray-300 shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
          System Workflow
        </h2>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: 'Data Collection',
              description: 'System aggregates real-time data from IMD, MCD, PWD, and citizen reports every 5 minutes.',
            },
            {
              step: 2,
              title: 'Risk Assessment',
              description: 'ML-powered algorithm calculates ward-level risk indices using historical patterns and current conditions.',
            },
            {
              step: 3,
              title: 'Alert Generation',
              description: 'High-risk wards trigger automatic alerts to MCD control room and emergency response teams.',
            },
            {
              step: 4,
              title: 'Resource Dispatch',
              description: 'Decision support system recommends pump deployment, team allocation, and evacuation protocols.',
            },
            {
              step: 5,
              title: 'Scenario Planning',
              description: 'What-if analysis helps predict flood timelines and test resource allocation strategies.',
            },
            {
              step: 6,
              title: 'Post-Event Review',
              description: 'Historical comparison analyzes response effectiveness and identifies infrastructure improvements.',
            }
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <div className="w-10 h-10 bg-blue-900 border border-blue-950 flex items-center justify-center font-bold text-white flex-shrink-0">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1 uppercase text-sm">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-gray-700 uppercase">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-gray-50 border border-gray-300 shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
          Technical Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white border border-gray-300 p-4">
            <h3 className="font-bold text-gray-900 mb-2 uppercase">Frontend Technologies</h3>
            <ul className="space-y-1 text-gray-700 text-xs font-semibold uppercase">
              <li>• React.js for interactive UI</li>
              <li>• Leaflet for GIS mapping</li>
              <li>• Chart.js for data visualization</li>
              <li>• Tailwind CSS for responsive design</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-300 p-4">
            <h3 className="font-bold text-gray-900 mb-2 uppercase">Data Processing</h3>
            <ul className="space-y-1 text-gray-700 text-xs font-semibold uppercase">
              <li>• GeoJSON for spatial data</li>
              <li>• CSV parsing for historical rainfall</li>
              <li>• LocalStorage for citizen reports</li>
              <li>• Rule-based ML predictions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-600 border-y border-r border-gray-300 p-4 text-xs font-bold text-yellow-900 uppercase">
        <strong>PROTOTYPE SYSTEM:</strong> This is a decision-support prototype designed for demonstration purposes. 
        Actual deployment requires integration with live government databases, authentication systems, and API endpoints.
      </div>
    </div>
  );
};

export default HowItWorks;
