/**
 * SOSSidebar.jsx - Emergency contact and ward information sidebar with Hindi translation
 * Features: Ward-specific MCD helpline, hospital info, Hindi/English toggle, real-time alerts
 */

import React, { useState, useEffect } from 'react';
import { wardData, getWardById } from '../data/wardData';

const translations = {
  en: {
    title: 'Emergency SOS',
    selectedWard: 'Selected Ward',
    noWard: 'Select a ward on the map',
    mcdControl: 'MCD Control Room',
    hospital: 'Nearest Hospital',
    distance: 'Distance',
    phone: 'Phone',
    callNow: 'Call Now',
    directionsTo: 'Directions to',
    safetyTips: 'Safety Tips',
    emergencyServices: 'Emergency Services',
    floodingIn: 'Flooding in',
    waterLevel: 'Water Level',
    checkStatus: 'Check Status',
    reportIncident: 'Report Incident',
    viewMap: 'View Map',
    language: 'Language',
    hindi: 'हिंदी',
    english: 'English',
    alert: 'Alert',
    normalConditions: 'Normal conditions',
    wateringStreets: 'Watering streets',
    cloggedDrains: 'Clogged drains',
    activeFlooding: 'Active flooding',
    severeFlooding: 'Severe flooding',
  },
  hi: {
    title: 'आपातकालीन एसओएस',
    selectedWard: 'चयनित वार्ड',
    noWard: 'मानचित्र पर एक वार्ड चुनें',
    mcdControl: 'एमसीडी नियंत्रण कक्ष',
    hospital: 'निकटतम अस्पताल',
    distance: 'दूरी',
    phone: 'फोन',
    callNow: 'अभी कॉल करें',
    directionsTo: 'के लिए दिशाएं',
    safetyTips: 'सुरक्षा सुझाव',
    emergencyServices: 'आपातकालीन सेवाएं',
    floodingIn: 'में बाढ़',
    waterLevel: 'जल स्तर',
    checkStatus: 'स्थिति जांचें',
    reportIncident: 'घटना की रिपोर्ट करें',
    viewMap: 'मानचित्र देखें',
    language: 'भाषा',
    hindi: 'हिंदी',
    english: 'English',
    alert: 'सतर्कता',
    normalConditions: 'सामान्य स्थितियां',
    wateringStreets: 'सड़कों की सफाई',
    cloggadDrains: 'अवरुद्ध नालियां',
    activeFlooding: 'सक्रिय बाढ़',
    severeFlooding: 'गंभीर बाढ़',
  }
};

function SOSSidebar({ selectedWardId = null, onCallHelpline = null, onReportIncident = null }) {
  const [language, setLanguage] = useState('en');
  const [selectedWard, setSelectedWard] = useState(null);
  const [alertStatus, setAlertStatus] = useState('normal');
  const t = translations[language];

  useEffect(() => {
    if (selectedWardId) {
      const ward = getWardById(selectedWardId);
      setSelectedWard(ward);
      // Simulate changing alert status
      setAlertStatus(Math.random() > 0.6 ? 'flooding' : 'normal');
    }
  }, [selectedWardId]);

  const handleCallHelpline = (phoneNumber) => {
    // In a real app, this would initiate a phone call
    // For web, we'll show a confirmation
    const message = language === 'en' 
      ? `Open dialer for ${phoneNumber}?` 
      : `${phoneNumber} के लिए डायलर खोलें?`;
    
    if (window.confirm(message)) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const getAlertColor = () => {
    const colors = {
      normal: 'bg-green-100 border-green-400 text-green-800',
      watering: 'bg-blue-100 border-blue-400 text-blue-800',
      clogged: 'bg-yellow-100 border-yellow-400 text-yellow-800',
      flooding: 'bg-orange-100 border-orange-400 text-orange-800',
      severe: 'bg-red-100 border-red-400 text-red-800'
    };
    return colors[alertStatus] || colors.normal;
  };

  const getAlertText = () => {
    const alerts = {
      normal: t.normalConditions,
      watering: t.wateringStreets,
      clogged: t.cloggadDrains,
      flooding: t.activeFlooding,
      severe: t.severeFlooding
    };
    return alerts[alertStatus] || alerts.normal;
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl overflow-y-auto z-30">
      {/* Header */}
      <div className="sticky top-0 bg-blue-950 p-6 border-b-4 border-yellow-400">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🆘</span>
            {t.title}
          </h1>
          {/* Language Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-sm font-bold transition ${
                language === 'en' 
                  ? 'bg-yellow-400 text-blue-900' 
                  : 'bg-blue-700 text-white hover:bg-blue-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded text-sm font-bold transition ${
                language === 'hi' 
                  ? 'bg-yellow-400 text-blue-900' 
                  : 'bg-blue-700 text-white hover:bg-blue-600'
              }`}
            >
              HI
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Ward Selection Status */}
        <div className="bg-blue-800 rounded-lg p-4 border-l-4 border-yellow-400">
          <h3 className="font-bold text-sm text-yellow-300 mb-2">{t.selectedWard}</h3>
          {selectedWard ? (
            <p className="text-xl font-bold text-white">{selectedWard.name}</p>
          ) : (
            <p className="text-gray-300 text-sm italic">{t.noWard}</p>
          )}
        </div>

        {selectedWard && (
          <>
            {/* Alert Status Card */}
            <div className={`rounded-lg p-4 border-2 ${getAlertColor()} font-bold`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {alertStatus === 'severe' ? '🔴' : alertStatus === 'flooding' ? '🟠' : alertStatus === 'clogged' ? '🟡' : '🟢'}
                </span>
                <span>{t.alert}</span>
              </div>
              <p className="text-lg font-bold">{getAlertText()}</p>
            </div>

            {/* MCD Control Room */}
            <div className="bg-blue-700 rounded-lg p-4 border-l-4 border-red-400">
              <h3 className="font-bold text-yellow-300 mb-3 flex items-center gap-2">
                <span className="text-xl">📞</span>
                {t.mcdControl}
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-300 mb-1">{t.phone}</p>
                  <p className="text-2xl font-bold text-yellow-300">{selectedWard.helplineNumber}</p>
                </div>
                <button
                  onClick={() => handleCallHelpline(selectedWard.helplineNumber.replace(/-/g, ''))}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg flex items-center justify-center gap-2 text-lg"
                >
                  <span>📲</span>
                  {t.callNow}
                </button>
              </div>
            </div>

            {/* Nearest Hospital */}
            <div className="bg-blue-700 rounded-lg p-4 border-l-4 border-green-400">
              <h3 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                <span className="text-xl">🏥</span>
                {t.hospital}
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-300 mb-1 font-semibold">{selectedWard.nearestHospital}</p>
                  <p className="text-sm text-gray-400 mb-3">{t.distance}: <span className="text-green-300 font-bold">As mentioned</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">{t.phone}</p>
                  <p className="text-xl font-bold text-green-300">{selectedWard.hospitalPhone}</p>
                </div>
                <button
                  onClick={() => handleCallHelpline(selectedWard.hospitalPhone.replace(/-/g, ''))}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg flex items-center justify-center gap-2 text-lg"
                >
                  <span>📲</span>
                  {t.callNow}
                </button>
                <button
                  onClick={() => {
                    const mapsUrl = `https://maps.google.com/?q=${selectedWard.coordinates[0]},${selectedWard.coordinates[1]}`;
                    window.open(mapsUrl, '_blank');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <span>🗺️</span>
                  {t.directionsTo} {selectedWard.nearestHospital.split(' - ')[0]}
                </button>
              </div>
            </div>

            {/* Ward Info Card */}
            <div className="bg-blue-700 rounded-lg p-4 border-l-4 border-cyan-400">
              <h3 className="font-bold text-cyan-300 mb-3 flex items-center gap-2">
                <span className="text-xl">📍</span>
                Ward Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Area:</span>
                  <span className="font-bold text-white">{selectedWard.area_sqkm} sq km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Population Density:</span>
                  <span className="font-bold text-white">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Drainage Status:</span>
                  <span className={`font-bold ${
                    selectedWard.drainageCapacity > 60 ? 'text-green-300' :
                    selectedWard.drainageCapacity > 40 ? 'text-yellow-300' : 'text-red-300'
                  }`}>
                    {selectedWard.drainageCapacity}% Capacity
                  </span>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-blue-700 rounded-lg p-4 border-l-4 border-purple-400">
              <h3 className="font-bold text-purple-300 mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                {t.safetyTips}
              </h3>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Avoid waterlogged areas and moving water</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Do not touch downed electrical lines</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Listen to official emergency broadcasts</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Keep emergency numbers saved</span>
                </li>
              </ul>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onReportIncident}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <span>📝</span>
                {t.reportIncident}
              </button>
              <button
                onClick={() => window.location.href = '/map'}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <span>🗺️</span>
                {t.viewMap}
              </button>
            </div>
          </>
        )}

        {/* Empty State Message */}
        {!selectedWard && (
          <div className="bg-blue-700 rounded-lg p-6 text-center border-2 border-dashed border-blue-600">
            <p className="text-2xl mb-3">👆</p>
            <p className="text-gray-200 font-medium">{t.noWard}</p>
            <p className="text-sm text-gray-400 mt-2">Click on any ward polygon to get emergency contacts and safety information</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-blue-950 p-4 border-t-4 border-yellow-400 text-center text-xs text-gray-300">
        <p>🚨 {language === 'en' ? 'Emergency Services Available 24/7' : '🚨 आपातकालीन सेवाएं 24/7 उपलब्ध'}</p>
      </div>
    </div>
  );
}

export default SOSSidebar;
