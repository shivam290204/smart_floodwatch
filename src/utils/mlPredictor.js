/**
 * Machine Learning Integration Module
 * Connects to trained flood prediction models
 */

class MLPredictor {
  constructor() {
    this.modelEndpoint = process.env.REACT_APP_ML_ENDPOINT || 'http://localhost:5000/predict';
    this.cache = new Map();
    this.cacheTimeout = 300000;
  }

  async predictFloodRisk(features) {
    const cacheKey = JSON.stringify(features);

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const featureVector = this.prepareFeatures(features);

      const response = await fetch(this.modelEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_ML_API_KEY}`
        },
        body: JSON.stringify({
          features: featureVector,
          timestamp: new Date().toISOString(),
          location: features.location
        })
      });

      if (!response.ok) throw new Error('ML model request failed');

      const prediction = await response.json();

      this.cache.set(cacheKey, {
        data: prediction,
        timestamp: Date.now()
      });

      return prediction;
    } catch (error) {
      return this.getFallbackPrediction(features);
    }
  }

  prepareFeatures(features) {
    return {
      rainfall_intensity: this.normalize(features.rainfall, 0, 100),
      drainage_capacity: this.normalize(features.drainageDeficit, 0, 100),
      historical_complaints: this.normalize(features.complaints, 0, 100),
      elevation: features.elevation || 0,
      soil_permeability: features.soilPermeability || 0.5,
      traffic_density: this.normalize(features.trafficDensity || 0, 0, 100),
      time_of_day: this.getTimeOfDay(),
      day_of_year: new Date().getDayOfYear?.() || new Date().getDay()
    };
  }

  normalize(value, min, max) {
    return (value - min) / (max - min);
  }

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 0.25;
    if (hour >= 12 && hour < 18) return 0.5;
    if (hour >= 18 && hour < 24) return 0.75;
    return 0;
  }

  getFallbackPrediction(features) {
    const riskScore = features.rainfall * 0.5 + features.drainageDeficit * 0.3 + features.complaints * 0.2;

    return {
      risk_score: riskScore,
      flood_probability: riskScore / 100,
      confidence: 0.6,
      estimated_depth: riskScore > 70 ? 'High (>30cm)' : riskScore > 40 ? 'Medium (15-30cm)' : 'Low (<15cm)',
      recommendations: this.generateFallbackRecommendations(riskScore)
    };
  }

  generateFallbackRecommendations(riskScore) {
    if (riskScore > 70) {
      return ['Immediate drain clearance required', 'Deploy emergency pumps', 'Issue public flood warnings'];
    }
    if (riskScore > 40) {
      return ['Schedule drain inspection', 'Prepare pump deployment', 'Monitor rainfall patterns'];
    }
    return ['Routine maintenance schedule', 'Continue normal monitoring'];
  }

  async submitFeedback(predictionId, actualOutcome, userFeedback) {
    try {
      await fetch(`${this.modelEndpoint}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prediction_id: predictionId,
          actual_outcome: actualOutcome,
          feedback: userFeedback,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
    }
  }
}

export default new MLPredictor();
