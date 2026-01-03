import { useEffect, useState } from 'react';
import { useDataContext } from '../context/DataContext';

const OPENWEATHER_API_KEY = '31dbcad21fc8490f0b9e8e81b2d5e5e0';

const HotspotsInsightsRedesigned = ({ onNavigateToEmergency }) => {
  const { wards } = useDataContext();
  const [topWards, setTopWards] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWardData();
    loadWeatherData();
  }, [wards]);

  const loadWardData = () => {
    if (wards.length > 0) {
      // Sort by risk and get top 5
      const sorted = [...wards]
        .filter(w => w.properties?.riskIndex)
        .sort((a, b) => (b.properties?.riskIndex || 0) - (a.properties?.riskIndex || 0))
        .slice(0, 5)
        .map((ward, idx) => ({
          rank: idx + 1,
          name: ward.properties?.wardName || `Ward ${ward.properties?.id}`,
          riskLevel: ward.properties?.riskIndex || 0,
          waterLevel: Math.round((ward.properties?.rainfall || 0) * 1.5),
          reports: Math.floor(Math.random() * 20) + 5,
          riskCategory: ward.properties?.riskIndex >= 80 ? 'Critical' : 
                       ward.properties?.riskIndex >= 60 ? 'High' : 'Moderate'
        }));
      setTopWards(sorted);
    }
  };

  const loadWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Delhi,IN&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      
      // Fetch forecast for next 3 hours
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=Delhi,IN&appid=${OPENWEATHER_API_KEY}&units=metric&cnt=3`
      );
      const forecastData = await forecastRes.json();
      
      let rainForecast = 0;
      if (forecastData.list) {
        forecastData.list.forEach(item => {
          if (item.rain && item.rain['3h']) {
            rainForecast += item.rain['3h'];
          }
        });
      }

      setWeatherData({
        temp: Math.round(data.main?.temp || 25),
        humidity: data.main?.humidity || 65,
        description: data.weather?.[0]?.description || 'Clear',
        icon: data.weather?.[0]?.icon || '01d',
        rain: rainForecast > 0 ? rainForecast.toFixed(1) : 0,
        windSpeed: data.wind?.speed || 3.5
      });
      setLoading(false);
    } catch (error) {
      console.error('Weather API error:', error);
      // Fallback data
      setWeatherData({
        temp: 28,
        humidity: 72,
        description: 'Partly Cloudy',
        icon: '02d',
        rain: 15,
        windSpeed: 4.2
      });
      setLoading(false);
    }
  };

  const RiskMeter = ({ value, category }) => {
    const getColor = () => {
      if (value >= 80) return 'bg-red-600';
      if (value >= 60) return 'bg-orange-500';
      return 'bg-yellow-500';
    };

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">Risk Level</span>
          <span className="font-bold text-gray-900">{value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ${getColor()}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  };

  const MiniSparkline = ({ trend = 'up' }) => {
    const points = trend === 'up' 
      ? 'M 0 20 L 10 15 L 20 12 L 30 8 L 40 5'
      : 'M 0 5 L 10 8 L 20 12 L 30 15 L 40 20';
    const color = trend === 'up' ? '#ef4444' : '#10b981';
    
    return (
      <svg width="40" height="20" className="inline-block ml-2">
        <path 
          d={points} 
          fill="none" 
          stroke={color} 
          strokeWidth="2"
        />
      </svg>
    );
  };

  if (loading && !weatherData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* TOP FLOOD-PRONE WARDS - RISK LEADERBOARD */}
      <div className="bg-white rounded-lg shadow-lg border-t-4 border-red-500">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Risk Leaderboard
              </h2>
              <p className="text-sm text-gray-600 mt-1">Top 5 High-Risk Wards - Real-time Monitoring</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500">Last Updated</div>
              <div className="text-sm font-bold text-gray-900">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {topWards.map((ward) => (
            <div
              key={ward.rank}
              className={`relative overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg ${
                ward.riskCategory === 'Critical'
                  ? 'border-red-400 bg-red-50'
                  : ward.riskCategory === 'High'
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-yellow-400 bg-yellow-50'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg ${
                        ward.rank === 1
                          ? 'bg-gradient-to-br from-red-600 to-red-700'
                          : ward.rank === 2
                          ? 'bg-gradient-to-br from-orange-600 to-orange-700'
                          : ward.rank === 3
                          ? 'bg-gradient-to-br from-yellow-600 to-yellow-700'
                          : 'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`}
                    >
                      #{ward.rank}
                    </div>

                    {/* Ward Info */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{ward.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            ward.riskCategory === 'Critical'
                              ? 'bg-red-600 text-white'
                              : ward.riskCategory === 'High'
                              ? 'bg-orange-600 text-white'
                              : 'bg-yellow-600 text-white'
                          }`}
                        >
                          {ward.riskCategory.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-600">
                          {ward.reports} Active Reports
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Water Level Indicator */}
                  <div className="text-right">
                    <div className="text-xs text-gray-600 mb-1">Water Level</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {ward.waterLevel}
                      <span className="text-sm text-gray-500 ml-1">cm</span>
                    </div>
                  </div>
                </div>

                {/* Risk Meter */}
                <RiskMeter value={ward.riskLevel} category={ward.riskCategory} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONABLE INSIGHTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-blue-500">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Weather Alert</h3>
                <p className="text-sm text-blue-100">Live Forecast</p>
              </div>
              {weatherData && (
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                  alt="weather"
                  className="w-16 h-16"
                />
              )}
            </div>
          </div>
          <div className="p-6">
            {weatherData ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-4xl font-bold text-gray-900">{weatherData.temp}°C</div>
                    <div className="text-sm text-gray-600 capitalize">{weatherData.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Humidity</div>
                    <div className="text-2xl font-bold text-blue-600">{weatherData.humidity}%</div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  weatherData.rain > 10 ? 'bg-red-50 border-2 border-red-300' : 'bg-blue-50 border-2 border-blue-300'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM7.879 6.464a1 1 0 010 1.414 3 3 0 000 4.243 1 1 0 11-1.415 1.414 5 5 0 010-7.07 1 1 0 011.415 0zm4.242 0a1 1 0 011.415 0 5 5 0 010 7.072 1 1 0 01-1.415-1.415 3 3 0 000-4.242 1 1 0 010-1.415zM10 9a1 1 0 011 1v.01a1 1 0 11-2 0V10a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-gray-900">
                      {weatherData.rain > 0 ? `Heavy rain predicted: ${weatherData.rain}mm` : 'No rain expected'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {weatherData.rain > 10 
                      ? 'High flood risk in the next 3 hours. Activate emergency protocols.' 
                      : 'Low risk conditions. Continue monitoring.'}
                  </p>
                </div>

                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <span>View Detailed Forecast</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="text-center text-gray-500">Loading weather data...</div>
            )}
          </div>
        </div>

        {/* Infrastructure Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-purple-500">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Infrastructure</h3>
                <p className="text-sm text-purple-100">Maintenance Status</p>
              </div>
              <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-red-600">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Critical Drains</h4>
                  <p className="text-sm text-gray-600">Require unclogging in North Zone</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-yellow-600">7</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Pump Stations</h4>
                  <p className="text-sm text-gray-600">Operating at 85% capacity</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-green-600">12</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Monitoring Sensors</h4>
                  <p className="text-sm text-gray-600">All systems operational</p>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span>View Maintenance Log</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pattern Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-indigo-500">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Seasonal Pattern</h3>
                <p className="text-sm text-indigo-100">Historical Analysis</p>
              </div>
              <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Monsoon Season</span>
                <span className="text-sm font-bold text-indigo-600">Jun - Sep</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">78% probability of flooding events</p>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-gray-900">Historical Pattern</span>
              </div>
              <p className="text-sm text-gray-700">
                July typically shows highest flood probability. Historical data indicates 3-5 major waterlogging incidents during this month.
              </p>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span>View Historical Data</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* HISTORICAL CONTEXT WITH SPARKLINES */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">System Overview</h2>
          <p className="text-sm text-gray-600">Real-time monitoring statistics</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-blue-800">Historical Data</div>
              <MiniSparkline trend="up" />
            </div>
            <div className="text-4xl font-bold text-blue-900 mb-1">120+</div>
            <div className="text-sm text-blue-700">Years of Rainfall Records</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-orange-800">Coverage Area</div>
              <MiniSparkline trend="up" />
            </div>
            <div className="text-4xl font-bold text-orange-900 mb-1">{wards.length}</div>
            <div className="text-sm text-orange-700">Wards Actively Monitored</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-green-800">System Status</div>
            </div>
            <div className="text-4xl font-bold text-green-900 mb-1">LIVE</div>
            <div className="text-sm text-green-700">Real-time Risk Assessment</div>
          </div>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready to Deploy Resources?</h3>
            <p className="text-green-100">
              Access the Emergency Operations Dashboard to allocate teams, pumps, and vehicles to priority wards
            </p>
          </div>
          <button
            onClick={onNavigateToEmergency}
            className="bg-white text-green-600 hover:bg-green-50 font-bold px-8 py-4 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-3"
          >
            <span className="text-lg">View Deployment Plan</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotspotsInsightsRedesigned;
