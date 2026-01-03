import React from 'react';
import ReportWaterlogging from './ReportWaterlogging';

const HeroSection = ({ onReportSubmit, onEmergencyResourcesClick }) => {
  return (
    <div className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070')",
          opacity: 0.5
        }}
      ></div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-800/60 to-gray-900/70"></div>

      <div className="relative container mx-auto px-6 py-16">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            Water-logging Management & Response System
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-6">
            जल-जमाव प्रबंधन और प्रतिक्रिया प्रणाली
          </p>
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-blue-300 mb-1">DELHI JAL NIVARAN PORTAL</h3>
            <p className="text-lg text-gray-300">दिल्ली जल निवारण पोर्टल</p>
          </div>
          
          <p className="text-lg text-gray-200 mb-8 max-w-2xl leading-relaxed">
            Real-time alerts, resources, and coordination for effective
            water-logging response and management across Delhi.
          </p>

          <div className="flex flex-wrap gap-4">
            <ReportWaterlogging onReportSubmit={onReportSubmit} />
            <button 
              onClick={onEmergencyResourcesClick}
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl border-2 border-white">
              Emergency Resources
            </button>
          </div>
        </div>

        {/* Live Ticker */}
        <div className="absolute bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
          <span className="font-bold">🔴 LIVE</span>
          <span className="ml-2 text-sm">Flood Warning: Yamuna level at 205.33m (Dang...</span>
          <button className="ml-2 text-white hover:text-gray-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
