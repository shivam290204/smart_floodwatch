/**
 * Smart FloodWatch Risk Calculation Engine
 * Implements both rule-based and ML-ready risk assessment
 * Based on: Rainfall Intensity, Drainage Deficit, Historical Complaints
 */

export const calculateRiskIndex = (rainfall, drainageDeficit, complaints) => {
  // Normalize inputs to 0-100 scale
  // Rainfall: 0-80mm is considered normal monsoon range
  const rainNorm = Math.min((rainfall / 80) * 100, 100);
  // Drainage: 0-100 is the scale (already normalized)
  const drainNorm = Math.min(drainageDeficit, 100);
  // Complaints: 0-30 is typical range
  const complaintsNorm = Math.min((complaints / 30) * 100, 100);

  // Weighted calculation: Rainfall 40%, Drainage 40%, Complaints 20%
  const index = rainNorm * 0.4 + drainNorm * 0.4 + complaintsNorm * 0.2;
  
  // Add small random terrain factor (0-5 points)
  const terrainFactor = calculateTerrainFactor();
  const adjustedIndex = index + terrainFactor;

  return Math.min(Math.round(adjustedIndex), 100);
};

export const calculateMLRisk = async (wardFeatures) => {
  try {
    const response = await fetch('/api/ml/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wardFeatures)
    });

    const prediction = await response.json();
    return {
      riskScore: prediction.risk_score,
      confidence: prediction.confidence,
      floodProbability: prediction.flood_probability,
      estimatedWaterDepth: prediction.estimated_depth,
      recommendations: prediction.recommendations
    };
  } catch (error) {
    return {
      riskScore: calculateRiskIndex(
        wardFeatures.rainfall,
        wardFeatures.drainageDeficit,
        wardFeatures.complaints
      ),
      confidence: 0.7,
      floodProbability: null,
      estimatedWaterDepth: null,
      recommendations: ['Use rule-based calculation as fallback']
    };
  }
};

export const getRiskCategory = (index) => {
  if (index <= 33) return 'Low';
  if (index <= 66) return 'Medium';
  return 'High';
};

export const getRiskColor = (category) => {
  switch (category) {
    case 'Low': return '#22c55e';
    case 'Medium': return '#eab308';
    case 'High': return '#ef4444';
    default: return '#94a3b8';
  }
};

const calculateTerrainFactor = () => {
  return Math.random() * 5; // 0-5 points instead of 0-20
};

export const generateRiskInsights = (riskData) => {
  const insights = [];

  if (riskData.riskScore > 80) {
    insights.push({
      type: 'critical',
      message: 'Immediate intervention required. Evacuation protocols may be needed.',
      actions: ['Deploy emergency teams', 'Activate pumps', 'Issue public warnings']
    });
  }

  if (riskData.drainageDeficit > 60) {
    insights.push({
      type: 'warning',
      message: 'Drainage capacity severely limited. Clearance operations recommended.',
      actions: ['Schedule drain cleaning', 'Deploy suction machines']
    });
  }

  if (riskData.rainfall > 50) {
    insights.push({
      type: 'alert',
      message: 'Heavy rainfall detected. Monitor closely for flash floods.',
      actions: ['Increase patrol frequency', 'Prepare sandbags']
    });
  }

  return insights;
};

export default {
  calculateRiskIndex,
  calculateMLRisk,
  getRiskCategory,
  getRiskColor,
  generateRiskInsights
};
