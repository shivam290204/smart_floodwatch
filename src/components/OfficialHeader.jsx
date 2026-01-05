import { useState } from 'react';
import { Globe, ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const OfficialHeader = ({ lastUpdate }) => {
  const [fontSize, setFontSize] = useState('normal');
  const { language, toggleLanguage } = useLanguage();

  const handleFontResize = (action) => {
    if (action === 'increase' && fontSize !== 'large') {
      setFontSize(fontSize === 'normal' ? 'large' : 'normal');
      document.documentElement.style.fontSize = fontSize === 'normal' ? '18px' : '16px';
    } else if (action === 'decrease' && fontSize !== 'small') {
      setFontSize(fontSize === 'normal' ? 'small' : 'normal');
      document.documentElement.style.fontSize = fontSize === 'normal' ? '14px' : '16px';
    } else if (action === 'reset') {
      setFontSize('normal');
      document.documentElement.style.fontSize = '16px';
    }
  };

  return (
    <header className="w-full">
      {/* 1. Utility Bar (Top Strip) */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-xs">
            {/* Left Side - Government Identity */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Government of NCT of Delhi</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">Govt. of India</span>
            </div>

            {/* Right Side - Accessibility Tools */}
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="#main-content" 
                className="hover:text-blue-400 transition-colors focus:underline"
              >
                Skip to Main Content
              </a>
              <span className="text-gray-400">|</span>
              
              {/* Font Resize Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleFontResize('decrease')}
                  className="hover:text-blue-400 transition-colors px-1"
                  aria-label="Decrease font size"
                  title="Decrease font size"
                >
                  -A
                </button>
                <button
                  onClick={() => handleFontResize('reset')}
                  className="hover:text-blue-400 transition-colors px-1 font-semibold"
                  aria-label="Reset font size"
                  title="Reset font size"
                >
                  A
                </button>
                <button
                  onClick={() => handleFontResize('increase')}
                  className="hover:text-blue-400 transition-colors px-1"
                  aria-label="Increase font size"
                  title="Increase font size"
                >
                  +A
                </button>
              </div>
              
              <span className="text-gray-400">|</span>
              
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                aria-label="Toggle language"
              >
                <Globe className="w-3 h-3" />
                <span>{language === 'en' ? 'English' : 'हिंदी'} / {language === 'en' ? 'हिंदी' : 'English'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Branding Bar (Middle Section) */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left - National Emblem + Branding */}
            <div className="flex items-center gap-4">
              {/* National Emblem */}
              <div className="flex-shrink-0">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png"
                  alt="National Emblem of India"
                  className="h-16 w-auto"
                />
              </div>

              {/* Title and Subtitle */}
              <div className="text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-800 leading-tight">
                  Delhi Jal Nivaran
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Municipal Corporation of Delhi | दिल्ली नगर निगम
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time Flood Management Portal
                </p>
              </div>
            </div>

            {/* Right - G20 Logo */}
            <div className="flex-shrink-0">
              <img
                src="/G20.png"
                alt="G20 India 2023 Logo"
                className="h-14 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* System Status Bar */}
          <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-semibold">System Status: Online</span>
              </span>
              <span className="text-gray-400">|</span>
              <span>Last Updated: {lastUpdate ? lastUpdate.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Emergency Helpline:</span>
              <span className="font-bold text-red-600">1077</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Emergency Ticker (Bottom Strip) */}
      <div className="bg-orange-50 border-b-2 border-orange-200 overflow-hidden">
        <div className="flex items-center">
          {/* Static Label */}
          <div className="flex-shrink-0 bg-red-600 text-white px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-wider">LATEST ALERTS</span>
          </div>

          {/* Scrolling Marquee */}
          <div className="flex-1 overflow-hidden py-2">
            <div className="animate-marquee whitespace-nowrap inline-block">
              <span className="text-sm text-gray-800 font-medium mx-8">
                ⚠️ Orange Alert issued for North-West Delhi - Heavy rainfall expected in next 4 hours
              </span>
              <span className="text-sm text-gray-800 font-medium mx-8">
                🌊 Yamuna Water Level: 205.33m (Steady) - Monitored 24/7
              </span>
              <span className="text-sm text-gray-800 font-medium mx-8">
                📞 Control Room Active: Dial 1077 for Emergency Assistance
              </span>
              <span className="text-sm text-gray-800 font-medium mx-8">
                🚨 3 Mobile Pump Units deployed in high-risk zones
              </span>
              <span className="text-sm text-gray-800 font-medium mx-8">
                ℹ️ Citizens advised to avoid waterlogged areas and report incidents immediately
              </span>
              {/* Duplicate for seamless loop */}
              <span className="text-sm text-gray-800 font-medium mx-8">
                ⚠️ Orange Alert issued for North-West Delhi - Heavy rainfall expected in next 4 hours
              </span>
              <span className="text-sm text-gray-800 font-medium mx-8">
                🌊 Yamuna Water Level: 205.33m (Steady) - Monitored 24/7
              </span>
              <span className="text-sm text-gray-800 font-medium mx-8">
                📞 Control Room Active: Dial 1077 for Emergency Assistance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </header>
  );
};

export default OfficialHeader;
