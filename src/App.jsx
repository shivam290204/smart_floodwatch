import { useState, useEffect } from 'react';
import { MapProvider } from './context/MapContext';
import { DataProvider, useDataContext } from './context/DataContext';
import FloodMap from './components/FloodMap';
import Dashboard from './components/Dashboard';
import AlertSystem from './components/AlertSystem';
import DecisionTrace from './components/DecisionTrace';
import RainfallTrendAnalysis from './components/RainfallTrendAnalysis';
import HistoricalComparison from './components/HistoricalComparison';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LiveAlertBanner from './components/LiveAlertBanner';
import ReportWaterlogging from './components/ReportWaterlogging';
import EmergencyResources from './components/EmergencyResources';
import EmergencyOperationsDashboard from './components/EmergencyOperationsDashboard';
import HotspotsInsights from './components/HotspotsInsightsRedesigned';
import HowItWorks from './components/HowItWorks';
import NewsTab from './components/NewsTab';
import './index.css';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedWard, setSelectedWard] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeReports, setActiveReports] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 300000);

    // Load active reports count from localStorage
    const reports = JSON.parse(localStorage.getItem('waterlogReports') || '[]');
    setActiveReports(reports.length);

    return () => clearInterval(interval);
  }, []);

  const handleReportSubmit = () => {
    const reports = JSON.parse(localStorage.getItem('waterlogReports') || '[]');
    setActiveReports(reports.length);
  };

  return (
    <DataProvider>
      <MapProvider>
        <AppContent 
          alerts={alerts}
          setAlerts={setAlerts}
          lastUpdate={lastUpdate}
          selectedWard={selectedWard}
          setSelectedWard={setSelectedWard}
          currentView={currentView}
          setCurrentView={setCurrentView}
          activeReports={activeReports}
          handleReportSubmit={handleReportSubmit}
        />
      </MapProvider>
    </DataProvider>
  );
}

function AppContent({ alerts, setAlerts, lastUpdate, selectedWard, setSelectedWard, currentView, setCurrentView, activeReports, handleReportSubmit }) {
  const { selectedMonth } = useDataContext();

  const Navigation = () => (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-1">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'news', label: 'News & Alerts' },
            { id: 'hotspots', label: 'Hotspots & Insights' },
            { id: 'how-it-works', label: 'How It Works' }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all relative ${
                currentView === view.id
                  ? 'text-blue-700 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {view.label}
              {currentView === view.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-700"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'news':
        return <NewsTab />;
      case 'hotspots':
        return <HotspotsInsights onNavigateToEmergency={() => setCurrentView('emergency-ops')} />;
      case 'how-it-works':
        return <HowItWorks />;
      case 'emergency-ops':
        return <EmergencyOperationsDashboard onBack={() => setCurrentView('dashboard')} />;
      default:
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Delhi Flood Risk Map
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      Real-time Monitoring
                    </span>
                  </h2>
                  <FloodMap onWardSelect={setSelectedWard} />
                </div>

                <div className="mt-6">
                  <EmergencyResources onNavigateToOps={() => setCurrentView('emergency-ops')} />
                </div>

                <div className="mt-6">
                  <DecisionTrace ward={selectedWard} />
                </div>

                <div className="mt-6">
                  <AlertSystem alerts={alerts} setAlerts={setAlerts} activeReports={activeReports} />
                </div>

                <div className="mt-6">
                  <RainfallTrendAnalysis selectedMonth={selectedMonth} />
                </div>

                <div className="mt-6">
                  <HistoricalComparison />
                </div>
              </div>

              <div>
                <Dashboard />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lastUpdate={lastUpdate} />
      {currentView === 'dashboard' && (
        <HeroSection 
          onReportSubmit={handleReportSubmit}
          onEmergencyResourcesClick={() => setCurrentView('emergency-ops')}
        />
      )}
      <LiveAlertBanner />
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        {renderView()}
      </main>

      <footer className="mt-8 bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-6 text-center text-gray-600 text-sm">
          <p className="font-semibold">Jal Nivaran v2.0 | Delhi Municipal Corporation Decision Support System</p>
          <p className="mt-1">Data Sources: IMD, Delhi PWD, MCD | Last Updated: {lastUpdate.toLocaleTimeString()}</p>
          <p className="mt-2 text-xs text-gray-500">© 2026 Government of NCT Delhi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
