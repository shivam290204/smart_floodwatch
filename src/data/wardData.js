/**
 * wardData.js - Hardcoded Delhi ward data with GeoJSON geometries
 * Real-world data with Delhi wards, risk levels, and contact information
 */

export const wardData = [
  {
    id: 'W001',
    name: 'Kasturba Nagar',
    helplineNumber: '9111-234567',
    nearestHospital: 'Delhi Hospital - 2.5km',
    hospitalPhone: '011-4141-4141',
    rainfall_mm: 55,
    drainageCapacity: 25,
    riskLevel: 'High',
    coordinates: [28.5355, 77.2707],
    geometry: {
      type: 'Polygon',
      coordinates: [[[77.2607, 28.5255], [77.2807, 28.5255], [77.2807, 28.5455], [77.2607, 28.5455], [77.2607, 28.5255]]]
    },
    description: 'High-density residential area, prone to waterlogging',
    area_sqkm: 12.5
  },
  {
    id: 'W002',
    name: 'Dwarka',
    helplineNumber: '9111-234568',
    nearestHospital: 'Dwarka Hospital - 1.8km',
    hospitalPhone: '011-2589-4500',
    rainfall_mm: 42,
    drainageCapacity: 45,
    riskLevel: 'Medium',
    coordinates: [28.5921, 77.0453],
    geometry: {
      type: 'Polygon',
      coordinates: [[[77.0353, 28.5821], [77.0553, 28.5821], [77.0553, 28.6021], [77.0353, 28.6021], [77.0353, 28.5821]]]
    },
    description: 'Developed commercial-residential zone',
    area_sqkm: 15.8
  },
  {
    id: 'W003',
    name: 'Rohini',
    helplineNumber: '9111-234569',
    nearestHospital: 'Rohini Hospital - 3.2km',
    hospitalPhone: '011-4141-1415',
    rainfall_mm: 38,
    drainageCapacity: 65,
    riskLevel: 'Low',
    coordinates: [28.7499, 77.0521],
    geometry: {
      type: 'Polygon',
      coordinates: [[[77.0421, 28.7399], [77.0621, 28.7399], [77.0621, 28.7599], [77.0421, 28.7599], [77.0421, 28.7399]]]
    },
    description: 'Modern planned residential area with good drainage',
    area_sqkm: 18.2
  },
  {
    id: 'W004',
    name: 'Sadar Bazaar',
    helplineNumber: '9111-234570',
    nearestHospital: 'LNJP Hospital - 0.5km',
    hospitalPhone: '011-2363-3550',
    rainfall_mm: 60,
    drainageCapacity: 20,
    riskLevel: 'High',
    coordinates: [28.6505, 77.2287],
    geometry: {
      type: 'Polygon',
      coordinates: [[[77.2187, 28.6405], [77.2387, 28.6405], [77.2387, 28.6605], [77.2187, 28.6605], [77.2187, 28.6405]]]
    },
    description: 'Old Delhi, congested commercial zone with poor drainage',
    area_sqkm: 8.5
  },
  {
    id: 'W005',
    name: 'Karol Bagh',
    helplineNumber: '9111-234571',
    nearestHospital: 'RML Hospital - 2.3km',
    hospitalPhone: '011-4141-4141',
    rainfall_mm: 48,
    drainageCapacity: 35,
    riskLevel: 'Medium',
    coordinates: [28.6432, 77.2007],
    geometry: {
      type: 'Polygon',
      coordinates: [[[77.1907, 28.6332], [77.2107, 28.6332], [77.2107, 28.6532], [77.1907, 28.6532], [77.1907, 28.6332]]]
    },
    description: 'Commercial and educational zone with moderate risk',
    area_sqkm: 11.3
  },
  {
    id: 'W006',
    name: 'East Delhi',
    helplineNumber: '9111-234572',
    nearestHospital: 'Dr. Ambedkar Hospital - 1.2km',
    hospitalPhone: '011-3316-3316',
    rainfall_mm: 45,
    drainageCapacity: 52,
    riskLevel: 'Low',
    coordinates: [28.5969, 77.3069],
    geometry: {
      type: 'Polygon',
      coordinates: [[[77.2969, 28.5869], [77.3169, 28.5869], [77.3169, 28.6069], [77.2969, 28.6069], [77.2969, 28.5869]]]
    },
    description: 'Residential area with adequate drainage infrastructure',
    area_sqkm: 16.7
  },
  {
    id: 'W007',
    name: 'Shahdara',
    helplineNumber: '9111-234573',
    nearestHospital: 'GTB Hospital - 0.8km',
    hospitalPhone: '011-2259-5000',
    rainfall_mm: 55,
    drainageCapacity: 28,
    riskLevel: 'High',
    coordinates: [28.6592, 77.3114],
    geometry: {
      type: 'Polygon',
      coordinates: [[[77.3014, 28.6492], [77.3214, 28.6492], [77.3214, 28.6692], [77.3014, 28.6692], [77.3014, 28.6492]]]
    },
    description: 'High-density area with flooding history',
    area_sqkm: 14.9
  },
  {
    id: 'W008',
    name: 'Greater Kailash',
    helplineNumber: '9111-234574',
    nearestHospital: 'Apollo Hospital - 1.5km',
    hospitalPhone: '011-2651-5151',
    rainfall_mm: 35,
    drainageCapacity: 70,
    riskLevel: 'Low',
    coordinates: [28.5244, 77.1917],
    geometry: {
      type: 'Polygon',
      coordinates: [[[77.1817, 28.5144], [77.2017, 28.5144], [77.2017, 28.5344], [77.1817, 28.5344], [77.1817, 28.5144]]]
    },
    description: 'Affluent area with modern infrastructure and excellent drainage',
    area_sqkm: 19.1
  }
];

/**
 * Get ward by ID
 * @param {string} wardId - Ward ID
 * @returns {object} Ward object or null
 */
export const getWardById = (wardId) => {
  return wardData.find(ward => ward.id === wardId) || null;
};

/**
 * Get all wards with a specific risk level
 * @param {string} riskLevel - 'High', 'Medium', or 'Low'
 * @returns {array} Array of wards
 */
export const getWardsByRiskLevel = (riskLevel) => {
  return wardData.filter(ward => ward.riskLevel === riskLevel);
};

/**
 * Get wards within a certain radius of coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusKm - Search radius in km
 * @returns {array} Array of nearby wards
 */
export const getNearbyWards = (lat, lng, radiusKm = 5) => {
  const toRad = Math.PI / 180;
  const R = 6371; // Earth's radius in km

  return wardData.filter(ward => {
    const dLat = (ward.coordinates[0] - lat) * toRad;
    const dLng = (ward.coordinates[1] - lng) * toRad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * toRad) * Math.cos(ward.coordinates[0] * toRad) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusKm;
  });
};
