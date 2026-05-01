// ─────────────────────────────────────────────────────────
// Data Service — Health Records, Predictions, Alerts (REST API)
// ─────────────────────────────────────────────────────────

import api from './api';

// ══════════════════════════════════════════════════════════
// HEALTH RECORDS
// ══════════════════════════════════════════════════════════

export const saveHealthRecord = async (userId, healthData) => {
  const response = await api.post('/health-records', healthData);
  return response.data;
};

export const getHealthRecords = async (userId) => {
  const response = await api.get('/health-records');
  return response.data;
};

// ══════════════════════════════════════════════════════════
// PREDICTIONS
// ══════════════════════════════════════════════════════════

export const savePrediction = async (userId, predictionData) => {
  const response = await api.post('/predictions', predictionData);
  return response.data;
};

export const getLatestPrediction = async (userId) => {
  const response = await api.get('/predictions/latest');
  return response.data;
};

export const getAllPredictions = async (userId) => {
  const response = await api.get('/predictions');
  return response.data;
};

// ══════════════════════════════════════════════════════════
// MOTHER DASHBOARD DATA
// ══════════════════════════════════════════════════════════

export const getMotherDashboard = async (userId) => {
  const response = await api.get('/dashboard/mother');
  return response.data;
};

// ══════════════════════════════════════════════════════════
// ALERTS
// ══════════════════════════════════════════════════════════

export const saveAlert = async (alertData) => {
  const response = await api.post('/alerts', alertData);
  return response.data;
};

export const acknowledgeAlert = async (alertId) => {
  const response = await api.put(`/alerts/${alertId}/acknowledge`);
  return response.data;
};

export const getAlertsForMother = async (userId) => {
  const response = await api.get('/alerts');
  return response.data;
};

// ══════════════════════════════════════════════════════════
// ASHA WORKER — Dashboard & Patient Detail
// ══════════════════════════════════════════════════════════

export const getAshaDashboard = async () => {
  const [mothersRes, alertsRes] = await Promise.all([
    api.get('/admin/mothers'),
    api.get('/admin/alerts')
  ]);

  const mothers = mothersRes.data.mothers || [];
  const pendingAlerts = alertsRes.data.alerts || [];

  const riskOrder = { high: 0, medium: 1, low: 2, unknown: 3 };
  const patients = mothers
    .map(m => ({
      id: m.userId || m.id || m._id,
      name: m.name || 'Unknown',
      phone: m.phone || '',
      village: m.village || '',
      district: m.district || '',
      riskLevel: m.currentRiskLevel || 'unknown',
      currentTrimester: m.currentTrimester,
      latestRiskScore: m.latestRiskScore,
      urgency: m.urgency,
      totalPredictions: m.totalPredictions || 0
    }))
    .sort((a, b) => (riskOrder[a.riskLevel] ?? 3) - (riskOrder[b.riskLevel] ?? 3));

  const stats = {
    total: patients.length,
    highRisk: patients.filter(p => p.riskLevel === 'high').length,
    mediumRisk: patients.filter(p => p.riskLevel === 'medium').length,
    lowRisk: patients.filter(p => p.riskLevel === 'low').length,
    pendingAlerts: pendingAlerts.length,
    criticalAlerts: pendingAlerts.filter(a => a.severity === 'critical').length
  };

  return { patients, pendingAlerts, stats };
};

export const getPatientDetail = async (userId) => {
  const response = await api.get(`/admin/patient/${userId}`);
  return response.data;
};

// ══════════════════════════════════════════════════════════
// VISIT LOGS
// ══════════════════════════════════════════════════════════

export const logVisit = async (visitData) => {
  const response = await api.post('/visits', visitData);
  return response.data;
};

// ══════════════════════════════════════════════════════════
// HELPERS (kept client-side — no DB needed)
// ══════════════════════════════════════════════════════════

export function getNutritionTips(trimester) {
  const tips = {
    1: [
      { icon: '🥬', title: 'Folic Acid Foods', desc: 'Eat spinach, lentils, and fortified cereals daily' },
      { icon: '🥛', title: 'Calcium Rich', desc: 'Include milk, yogurt, and cheese in your diet' },
      { icon: '🍊', title: 'Vitamin C', desc: 'Citrus fruits help absorb iron better' },
      { icon: '💧', title: 'Stay Hydrated', desc: 'Drink 8-10 glasses of water daily' }
    ],
    2: [
      { icon: '🥩', title: 'Iron Rich Foods', desc: 'Lean meat, beans, and dark leafy greens' },
      { icon: '🐟', title: 'Omega-3', desc: 'Fish for baby brain development' },
      { icon: '🥚', title: 'Protein', desc: 'Eggs, legumes, and dairy for baby growth' },
      { icon: '🌾', title: 'Whole Grains', desc: 'Brown rice and whole wheat for energy' }
    ],
    3: [
      { icon: '🦴', title: 'Calcium & Vitamin D', desc: 'For baby bone development in final weeks' },
      { icon: '🥜', title: 'Healthy Fats', desc: 'Nuts and seeds for brain development' },
      { icon: '🍌', title: 'Potassium', desc: 'Bananas help prevent leg cramps' },
      { icon: '🥗', title: 'Small Frequent Meals', desc: 'Eat 5-6 small meals to manage heartburn' }
    ]
  };
  return tips[trimester] || tips[1];
}

export function getHealthTips(riskLevel) {
  const tips = {
    low: ['Continue regular antenatal checkups every 4 weeks', 'Practice light prenatal yoga or walking 30 min daily', 'Get 8 hours of sleep, sleep on your left side', 'Avoid stress - practice deep breathing exercises'],
    medium: ['Schedule doctor visit within 2-3 days', 'Monitor blood pressure daily if possible', 'Avoid heavy lifting and strenuous activities', 'Keep emergency contacts readily available'],
    high: ['Seek immediate medical attention', 'Do not delay - contact your ASHA worker now', 'Go to nearest PHC or hospital today', 'Have someone accompany you at all times'],
    unknown: ['Complete your first health assessment to get personalized tips', 'Register with your ASHA worker', 'Schedule your first antenatal checkup']
  };
  return tips[riskLevel] || tips['unknown'];
}
