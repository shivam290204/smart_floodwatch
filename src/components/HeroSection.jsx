import React from 'react';
import ReportWaterlogging from './ReportWaterlogging';

const HeroSection = ({ onReportSubmit, onEmergencyResourcesClick }) => {
  return (
    <div className="relative bg-blue-900 text-white overflow-hidden border-b-4 border-yellow-500">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070')",
          opacity: 0.45
        }}
      ></div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-blue-900/55"></div>

      <div className="relative container mx-auto px-6 py-16">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 uppercase tracking-wide">
            Water-logging Management & Response System
          </h2>
          <p className="text-xl md:text-2xl text-yellow-400 mb-6 font-bold">
            जल-जमाव प्रबंधन और प्रतिक्रिया प्रणाली
          </p>
          
          <div className="mb-6 border-l-4 border-yellow-500 pl-4">
            <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-wide">DELHI JAL NIVARAN PORTAL</h3>
            <p className="text-lg text-gray-300 font-bold">दिल्ली जल निवारण पोर्टल</p>
          </div>
          
          <p className="text-lg text-gray-200 mb-8 max-w-2xl leading-relaxed font-semibold">
            Real-time alerts, resources, and coordination for effective
            water-logging response and management across Delhi.
          </p>

          <div className="flex flex-wrap gap-4">
            <ReportWaterlogging onReportSubmit={onReportSubmit} />
            <button 
              onClick={onEmergencyResourcesClick}
              className="px-8 py-4 bg-white text-blue-900 font-bold border-2 border-blue-900 hover:bg-gray-100 transition-colors uppercase tracking-wide">
              Emergency Resources
            </button>
          </div>
        </div>

        {/* Live Ticker */}
        <div className="absolute bottom-6 right-6 bg-red-700 text-white px-4 py-2 border-2 border-red-900 flex items-center gap-2">
          <span className="font-bold uppercase tracking-wide">LIVE ALERT:</span>
          <span className="ml-2 text-sm font-bold uppercase">Flood Warning: Yamuna level at 205.33m (Danger Mark)</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
