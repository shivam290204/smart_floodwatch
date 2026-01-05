import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Droplets, 
  AlertTriangle, 
  Phone, 
  Loader2, 
  CheckCircle2, 
  ChevronDown,
  ChevronUp,
  Activity,
  Clock,
  Zap
} from 'lucide-react';

// Initial mock data
const initialWards = [
  {
    id: 1,
    name: "Karol Bagh",
    rainfall_mm: 120,
    drainage_deficit: 80,
    complaints: 45,
    status: 'idle',
    risk_score: 0
  },
  {
    id: 2,
    name: "Rohini Sector 15",
    rainfall_mm: 95,
    drainage_deficit: 65,
    complaints: 32,
    status: 'idle',
    risk_score: 0
  },
  {
    id: 3,
    name: "Dwarka Sector 10",
    rainfall_mm: 78,
    drainage_deficit: 55,
    complaints: 28,
    status: 'idle',
    risk_score: 0
  },
  {
    id: 4,
    name: "Lajpat Nagar",
    rainfall_mm: 110,
    drainage_deficit: 72,
    complaints: 38,
    status: 'idle',
    risk_score: 0
  },
  {
    id: 5,
    name: "Vasant Kunj",
    rainfall_mm: 88,
    drainage_deficit: 60,
    complaints: 25,
    status: 'idle',
    risk_score: 0
  },
  {
    id: 6,
    name: "Mayur Vihar Phase 2",
    rainfall_mm: 102,
    drainage_deficit: 75,
    complaints: 41,
    status: 'idle',
    risk_score: 0
  }
];

// Utility function to calculate priority score (0-100 scale)
const calculatePriority = (ward) => {
  // Formula: (rainfall * 0.5) + (drainage * 0.4) + (complaints * 0.1)
  const rawScore = (ward.rainfall_mm * 0.5) + (ward.drainage_deficit * 0.4) + (ward.complaints * 0.1);
  
  // Normalize to 0-100 scale (assuming max rainfall: 150mm, max drainage: 100%, max complaints: 50)
  const maxScore = (150 * 0.5) + (100 * 0.4) + (50 * 0.1);
  const normalized = (rawScore / maxScore) * 100;
  
  return Math.min(100, Math.max(0, Math.round(normalized)));
};

// Generate AI reasoning based on ward data
const generateAIReasoning = (ward) => {
  const priority = calculatePriority(ward);
  let reasoning = "";
  
  if (ward.status === 'resolved') {
    reasoning = `✅ Situation resolved. Water levels normalized. Drainage capacity restored to ${100 - ward.drainage_deficit}%.`;
  } else if (ward.rainfall_mm > 100 && ward.drainage_deficit > 70) {
    reasoning = `🚨 Critical: High rainfall (${ward.rainfall_mm}mm) detected combined with ${ward.drainage_deficit}% drainage blockage. Immediate intervention advised.`;
  } else if (ward.rainfall_mm > 100) {
    reasoning = `⚠️ Heavy rainfall (${ward.rainfall_mm}mm) exceeding normal capacity. Deploy pumps to prevent waterlogging.`;
  } else if (ward.drainage_deficit > 70) {
    reasoning = `🔧 Drainage system ${ward.drainage_deficit}% compromised. Infrastructure maintenance required urgently.`;
  } else if (ward.complaints > 30) {
    reasoning = `📞 High citizen alerts (${ward.complaints} reports). Public safety teams should investigate immediately.`;
  } else {
    reasoning = `⚡ Moderate risk detected. Monitor closely for next 2 hours. Deploy if conditions worsen.`;
  }
  
  return reasoning;
};

// Priority Badge Component
const PriorityBadge = ({ score }) => {
  const getColor = () => {
    if (score >= 80) return 'bg-red-600 text-white ring-red-300';
    if (score >= 50) return 'bg-orange-600 text-white ring-orange-300';
    return 'bg-green-600 text-white ring-green-300';
  };
  
  const getLabel = () => {
    if (score >= 80) return 'CRITICAL';
    if (score >= 50) return 'HIGH';
    return 'MODERATE';
  };
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getColor()} ring-2`}>
      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
      <span>{getLabel()}</span>
      <span className="text-xs opacity-90">({score})</span>
    </div>
  );
};

// Main Component
const PriorityActionPanel = () => {
  const [wards, setWards] = useState([]);
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Initialize wards with calculated priority scores
  useEffect(() => {
    const wardsWithPriority = initialWards.map(ward => ({
      ...ward,
      risk_score: calculatePriority(ward)
    }));
    setWards(wardsWithPriority);
  }, []);

  // Sort wards by priority (resolved go to bottom)
  const sortedWards = [...wards].sort((a, b) => {
    if (a.status === 'resolved' && b.status !== 'resolved') return 1;
    if (a.status !== 'resolved' && b.status === 'resolved') return -1;
    return b.risk_score - a.risk_score;
  });

  // Toggle AI reasoning expansion
  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Handle deployment simulation
  const handleDeploy = (id) => {
    // Stage 1: Deploying (immediate)
    setWards(prev => prev.map(w => 
      w.id === id ? { ...w, status: 'deploying' } : w
    ));

    // Stage 2: Active (after 2 seconds)
    setTimeout(() => {
      setWards(prev => prev.map(w => 
        w.id === id ? { ...w, status: 'active' } : w
      ));
    }, 2000);

    // Stage 3: Resolved (after 6 seconds total)
    setTimeout(() => {
      setWards(prev => prev.map(w => {
        if (w.id === id) {
          // Reduce risk score by 40 points and drainage deficit by 30%
          const newDrainage = Math.max(0, w.drainage_deficit - 30);
          const updatedWard = {
            ...w,
            status: 'resolved',
            drainage_deficit: newDrainage,
            rainfall_mm: Math.max(0, w.rainfall_mm - 20) // Also reduce rainfall
          };
          // Recalculate priority
          updatedWard.risk_score = Math.max(0, calculatePriority(updatedWard) - 40);
          return updatedWard;
        }
        return w;
      }));
    }, 6000);
  };

  // Check if all wards are resolved
  const allResolved = wards.every(w => w.status === 'resolved');

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Live AI Decision Support</h2>
              <p className="text-sm text-gray-600">Real-time Priority Action Queue</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">System Active</span>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 rounded-full"></div>
      </div>

      {/* Empty State - All Resolved */}
      {allResolved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-400 rounded-xl p-8 text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-900 mb-2">All Systems Nominal</h3>
          <p className="text-green-700">All priority wards have been successfully managed. Monitoring continues.</p>
        </motion.div>
      )}

      {/* Ward Cards */}
      <AnimatePresence mode="popLayout">
        {sortedWards.map((ward, index) => {
          const isExpanded = expandedIds.has(ward.id);
          
          return (
            <motion.div
              key={ward.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: ward.status === 'resolved' ? 0.98 : 1
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                layout: { duration: 0.5, type: "spring" },
                opacity: { duration: 0.3 }
              }}
              className={`mb-4 rounded-xl shadow-lg overflow-hidden transition-all ${
                ward.status === 'resolved' 
                  ? 'bg-green-50 border-2 border-green-300 opacity-75' 
                  : ward.status === 'active'
                  ? 'bg-blue-50 border-2 border-blue-500 ring-2 ring-blue-200'
                  : ward.status === 'deploying'
                  ? 'bg-yellow-50 border-2 border-yellow-400'
                  : ward.risk_score >= 80
                  ? 'bg-red-50 border-2 border-red-400'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Priority Rank */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    ward.status === 'resolved'
                      ? 'bg-green-600 text-white'
                      : index === 0
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Ward Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{ward.name}</h3>
                    <div className="flex items-center gap-2">
                      <PriorityBadge score={ward.risk_score} />
                      {ward.status === 'resolved' && (
                        <span className="text-xs text-green-700 font-semibold">✓ RESOLVED</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Deploy Button */}
                <div className="flex items-center gap-3">
                  {ward.status === 'idle' && (
                    <button
                      onClick={() => handleDeploy(ward.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Zap className="w-5 h-5" />
                      Deploy Team
                    </button>
                  )}
                  
                  {ward.status === 'deploying' && (
                    <button
                      disabled
                      className="bg-yellow-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Dispatching...
                    </button>
                  )}
                  
                  {ward.status === 'active' && (
                    <div className="flex flex-col items-end gap-1">
                      <div className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 animate-pulse" />
                        Operations Active
                      </div>
                      <div className="flex items-center gap-2 text-xs text-blue-700">
                        <Clock className="w-3 h-3" />
                        <span>ETA: 25 mins</span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-48 bg-blue-200 rounded-full h-2 mt-1 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '70%' }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          className="bg-blue-600 h-full rounded-full"
                        />
                      </div>
                    </div>
                  )}
                  
                  {ward.status === 'resolved' && (
                    <div className="bg-green-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Resolved
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body - Metrics */}
              <div className="px-5 pb-3 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                  <Droplets className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-600 font-semibold">Rainfall</div>
                    <div className="text-lg font-bold text-gray-900">{ward.rainfall_mm}mm</div>
                  </div>
                  <TrendingUp className="w-4 h-4 text-red-500 ml-auto" />
                </div>

                <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                  <div>
                    <div className="text-xs text-gray-600 font-semibold">Drainage Deficit</div>
                    <div className="text-lg font-bold text-gray-900">{ward.drainage_deficit}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                  <Phone className="w-8 h-8 text-red-600" />
                  <div>
                    <div className="text-xs text-gray-600 font-semibold">Complaints</div>
                    <div className="text-lg font-bold text-gray-900">{ward.complaints}</div>
                  </div>
                </div>
              </div>

              {/* Card Footer - AI Reasoning (Expandable) */}
              <div className="border-t border-gray-300">
                <button
                  onClick={() => toggleExpand(ward.id)}
                  className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    🤖 <span>AI Reasoning</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-sm text-gray-700 bg-slate-50 leading-relaxed">
                        {generateAIReasoning(ward)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default PriorityActionPanel;
