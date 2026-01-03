import React, { useState } from 'react';

const JurisdictionModal = ({ isOpen, onClose }) => {
  const [selectedZone, setSelectedZone] = useState('');

  // Hardcoded jurisdiction data
  const jurisdictionData = {
    'Ward 42 - Karol Bagh': {
      jurisdiction: 'MCD',
      badge: 'MCD - Local Drainage',
      color: 'orange',
      jeName: 'Amit Sharma',
      phone: '+91-11-2731-2731',
      description: 'Municipal Corporation of Delhi manages local roads and drainage systems within ward boundaries',
      icon: '🏛️'
    },
    'Ring Road - Central': {
      jurisdiction: 'PWD',
      badge: 'PWD - Arterial Roads',
      color: 'blue',
      jeName: 'Vikram Singh',
      phone: '+91-11-2338-9999',
      description: 'Public Works Department handles major arterial roads, flyovers, and inter-ward connectivity',
      icon: '🛣️'
    },
    'Vasant Kunj Parks': {
      jurisdiction: 'DDA',
      badge: 'DDA - Public Spaces',
      color: 'purple',
      jeName: 'Rajesh Kumar',
      phone: '+91-11-2463-4625',
      description: 'Delhi Development Authority manages public parks, green spaces, and civic infrastructure',
      icon: '🌳'
    },
    'Dwarka - Main Road': {
      jurisdiction: 'PWD',
      badge: 'PWD - Arterial Roads',
      color: 'blue',
      jeName: 'Priya Verma',
      phone: '+91-11-2338-8888',
      description: 'Public Works Department manages arterial roads and major thoroughfares',
      icon: '🛣️'
    },
    'New Delhi Municipal Zone': {
      jurisdiction: 'MCD',
      badge: 'MCD - Local Drainage',
      color: 'orange',
      jeName: 'Deepak Patel',
      phone: '+91-11-4036-2020',
      description: 'Municipal Corporation handles internal roads and local drainage infrastructure',
      icon: '🏛️'
    },
    'Aravalli Biodiversity Park': {
      jurisdiction: 'DDA',
      badge: 'DDA - Public Spaces',
      color: 'purple',
      jeName: 'Neha Singh',
      phone: '+91-11-2463-5000',
      description: 'Delhi Development Authority manages protected areas and biodiversity zones',
      icon: '🌳'
    }
  };

  const selected = jurisdictionData[selectedZone];

  const getBadgeColor = (color) => {
    const colors = {
      orange: 'bg-orange-100 text-orange-800 border-orange-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return colors[color] || colors.orange;
  };

  const getCardBorderColor = (color) => {
    const colors = {
      orange: 'border-l-4 border-orange-500',
      blue: 'border-l-4 border-blue-500',
      purple: 'border-l-4 border-purple-500'
    };
    return colors[color] || colors.orange;
  };

  const getHeaderColor = (color) => {
    const colors = {
      orange: 'bg-orange-50',
      blue: 'bg-blue-50',
      purple: 'bg-purple-50'
    };
    return colors[color] || colors.orange;
  };

  if (!isOpen) return null;

  // Close icon SVG
  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  // Map pin icon SVG
  const MapPinIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  // Phone icon SVG
  const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  // User icon SVG
  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  // Alert icon SVG
  const AlertIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPinIcon />
            <h2 className="text-2xl font-bold">Jurisdiction Lookup</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-800 rounded-lg transition"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search/Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Affected Zone/Ward
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition text-gray-900 bg-white"
            >
              <option value="">-- Choose a location --</option>
              {Object.keys(jurisdictionData).map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          {/* Jurisdiction Card */}
          {selected && (
            <div className={`${getCardBorderColor(selected.color)} bg-white rounded-lg p-5 space-y-4`}>
              {/* Badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(selected.color)}`}>
                  {selected.badge}
                </span>
                <span className="text-3xl">{selected.icon}</span>
              </div>

              {/* Jurisdiction Title */}
              <div>
                <h3 className={`text-2xl font-bold ${
                  selected.color === 'orange' ? 'text-orange-700' :
                  selected.color === 'blue' ? 'text-blue-700' :
                  'text-purple-700'
                }`}>
                  {selected.jurisdiction}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {selected.description}
              </p>

              {/* Contact Information */}
              <div className={`${getHeaderColor(selected.color)} rounded-lg p-4 space-y-3`}>
                {/* JE Name */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className={`${
                      selected.color === 'orange' ? 'text-orange-600' :
                      selected.color === 'blue' ? 'text-blue-600' :
                      'text-purple-600'
                    }`}>
                      <UserIcon />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">Junior Engineer</p>
                    <p className="text-sm font-bold text-gray-900">{selected.jeName}</p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className={`${
                      selected.color === 'orange' ? 'text-orange-600' :
                      selected.color === 'blue' ? 'text-blue-600' :
                      'text-purple-600'
                    }`}>
                      <PhoneIcon />
                    </div>
                  </div>
                  <a
                    href={`tel:${selected.phone.replace(/[^0-9+]/g, '')}`}
                    className={`text-sm font-semibold ${
                      selected.color === 'orange' ? 'text-orange-600 hover:text-orange-800' :
                      selected.color === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                      'text-purple-600 hover:text-purple-800'
                    } transition cursor-pointer underline`}
                  >
                    {selected.phone}
                  </a>
                </div>
              </div>

              {/* Info Alert */}
              <div className="flex gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-yellow-600 flex-shrink-0 mt-0.5">
                  <AlertIcon />
                </div>
                <p className="text-xs text-yellow-800">
                  Contact the respective department for emergency response and complaints.
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selected && (
            <div className="text-center py-8">
              <div className="w-12 h-12 text-gray-300 mx-auto mb-3 opacity-50">
                <MapPinIcon />
              </div>
              <p className="text-gray-500 text-sm">Select a zone to view jurisdiction details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JurisdictionModal;
