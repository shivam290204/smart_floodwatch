/**
 * RiskLogic.js - Pure utility functions for flood risk calculation
 * Client-side only, no backend dependencies
 */

/**
 * Calculate flood risk based on rainfall, drainage capacity, and user reports
 * @param {number} rainfall - Current rainfall in mm
 * @param {number} drainageCapacity - Drainage percentage (0-100)
 * @param {number} userReports - Number of flood reports for the ward
 * @returns {string} Risk level: 'High', 'Medium', or 'Low'
 */
export const calculateRisk = (rainfall, drainageCapacity, userReports = 0) => {
  // High Risk: rainfall > 50mm AND drainage < 30%
  if (rainfall > 50 && drainageCapacity < 30) {
    return 'High';
  }

  // Medium Risk: rainfall 30-50mm OR drainage 30-60% with some reports
  if ((rainfall > 30 && rainfall <= 50) || (drainageCapacity >= 30 && drainageCapacity < 60)) {
    if (userReports > 0) {
      return 'Medium';
    }
    return 'Low';
  }

  // Factor in user reports
  if (userReports > 3) {
    return 'Medium';
  }

  return 'Low';
};

/**
 * Get color code for risk level
 * @param {string} riskLevel - 'High', 'Medium', or 'Low'
 * @returns {string} Color code
 */
export const getRiskColor = (riskLevel) => {
  const colors = {
    High: '#ef4444',    // Red
    Medium: '#f97316',  // Orange
    Low: '#22c55e'      // Green
  };
  return colors[riskLevel] || '#6b7280'; // Gray fallback
};

/**
 * Get TailwindCSS classes for risk level styling
 * @param {string} riskLevel - 'High', 'Medium', or 'Low'
 * @returns {string} Tailwind classes
 */
export const getRiskTailwindClass = (riskLevel) => {
  const classes = {
    High: 'bg-red-100 border-red-300 text-red-900',
    Medium: 'bg-orange-100 border-orange-300 text-orange-900',
    Low: 'bg-green-100 border-green-300 text-green-900'
  };
  return classes[riskLevel] || 'bg-gray-100 border-gray-300 text-gray-900';
};

/**
 * Save a flood report to browser localStorage with timestamp
 * @param {object} report - Report object { wardId, wardName, description, latitude, longitude }
 * @returns {array} Updated reports array
 */
export const saveReportToLocal = (report) => {
  const timestamp = new Date().toISOString();
  const reportWithTime = {
    ...report,
    id: `report_${Date.now()}`,
    timestamp
  };

  try {
    const existingReports = JSON.parse(localStorage.getItem('floodReports') || '[]');
    const updatedReports = [reportWithTime, ...existingReports];
    localStorage.setItem('floodReports', JSON.stringify(updatedReports));
    return updatedReports;
  } catch (error) {
    console.error('Error saving report to localStorage:', error);
    return [reportWithTime];
  }
};

/**
 * Retrieve all flood reports from localStorage
 * @returns {array} Array of reports
 */
export const getReportsFromLocal = () => {
  try {
    return JSON.parse(localStorage.getItem('floodReports') || '[]');
  } catch (error) {
    console.error('Error reading reports from localStorage:', error);
    return [];
  }
};

/**
 * Get reports for a specific ward
 * @param {number|string} wardId - Ward ID to filter by
 * @returns {array} Reports for that ward
 */
export const getWardReports = (wardId) => {
  const allReports = getReportsFromLocal();
  return allReports.filter(report => report.wardId === wardId);
};

/**
 * Clear all stored reports from localStorage
 */
export const clearAllReports = () => {
  localStorage.removeItem('floodReports');
};

/**
 * Increment user report count for a ward (simulates real-time update)
 * @param {number|string} wardId - Ward ID
 * @returns {number} Updated report count
 */
export const incrementWardReportCount = (wardId) => {
  const reports = getReportsFromLocal();
  const wardReportCount = reports.filter(r => r.wardId === wardId).length;
  return wardReportCount;
};

/**
 * Calculate route safety based on intersection with high-risk zones
 * @param {array} routeCoordinates - Array of [lat, lng] coordinates along the route
 * @param {array} highRiskZones - Array of ward polygons with High risk
 * @returns {object} { isSafe: boolean, affectedZones: array }
 */
export const checkRouteForFloodZones = (routeCoordinates, highRiskZones) => {
  const affectedZones = [];

  // Simple point-in-polygon check for route against high-risk zones
  routeCoordinates.forEach(point => {
    highRiskZones.forEach(zone => {
      if (isPointInPolygon(point, zone.geometry.coordinates[0])) {
        if (!affectedZones.find(z => z.id === zone.id)) {
          affectedZones.push(zone);
        }
      }
    });
  });

  return {
    isSafe: affectedZones.length === 0,
    affectedZones
  };
};

/**
 * Simple point-in-polygon algorithm (Ray casting)
 * @param {array} point - [lat, lng]
 * @param {array} polygon - Array of [lng, lat] coordinates
 * @returns {boolean} True if point is inside polygon
 */
const isPointInPolygon = (point, polygon) => {
  const [lat, lng] = point;
  let isInside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect = yi > lat !== yj > lat &&
      lng < (xj - xi) * (lat - yi) / (yj - yi) + xi;

    if (intersect) isInside = !isInside;
  }

  return isInside;
};

/**
 * Format timestamp to readable format
 * @param {string} isoString - ISO timestamp string
 * @returns {string} Formatted time (e.g., "2 hours ago")
 */
export const formatReportTime = (isoString) => {
  const reportTime = new Date(isoString);
  const now = new Date();
  const diffMs = now - reportTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return reportTime.toLocaleDateString();
};
