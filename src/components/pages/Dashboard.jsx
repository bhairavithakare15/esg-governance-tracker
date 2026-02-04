import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Award, AlertCircle, Calendar, Building2, History, ArrowUp, ArrowDown, Minus } from 'lucide-react';

export default function ModernDashboard({ results, user }) {
  const [previousAssessment, setPreviousAssessment] = useState(null);
  const [improvement, setImprovement] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const timeOfDay = currentDate.getHours() < 12 ? 'Morning' : currentDate.getHours() < 18 ? 'Afternoon' : 'Evening';
  const isFirstTime = !previousAssessment; // Check if this is first assessment
  
  // Load previous assessment and improvement data
  useEffect(() => {
    const loadImprovementData = async () => {
      if (!user || !user.id) return;

      try {
        const response = await fetch(`http://localhost:5000/api/scores/improvement/${user.id}`);
        const data = await response.json();

        if (data.success && data.hasComparison) {
          setPreviousAssessment(data.previous);
          setImprovement(data.improvement);
        }
      } catch (error) {
        console.error('Error loading improvement data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImprovementData();
  }, [user, results]); // Re-fetch when results change

  const scoreData = [
    {
      label: 'Environmental',
      score: results.E || 0,
      previousScore: previousAssessment?.environmental_score || 0,
      improvement: improvement?.environmental || 0,
      icon: '🌍',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Social',
      score: results.S || 0,
      previousScore: previousAssessment?.social_score || 0,
      improvement: improvement?.social || 0,
      icon: '👥',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Governance',
      score: results.G || 0,
      previousScore: previousAssessment?.governance_score || 0,
      improvement: improvement?.governance || 0,
      icon: '⚖️',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const getScoreStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', icon: Award };
    if (score >= 60) return { label: 'Good', color: 'text-blue-600', icon: TrendingUp };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-600', icon: TrendingDown };
    return { label: 'Needs Improvement', color: 'text-red-600', icon: AlertCircle };
  };

  const totalStatus = getScoreStatus(results.total || 0);
  const StatusIcon = totalStatus.icon;

  const ImprovementIndicator = ({ value }) => {
    if (value > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <ArrowUp className="w-4 h-4" />
          <span className="font-semibold">+{value}</span>
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <ArrowDown className="w-4 h-4" />
          <span className="font-semibold">{value}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-gray-500">
          <Minus className="w-4 h-4" />
          <span className="font-semibold">0</span>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-teal-500 via-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Good {timeOfDay}! 👋</h1>
                  <p className="text-teal-100 text-lg mt-1">
                    {isFirstTime ? 'Welcome' : 'Welcome back'}, {user?.companyName || 'User'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {currentDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <span className="font-medium">Project: ESG Governance Tracker</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/30">
                <p className="text-sm text-teal-100 mb-1">Overall Score</p>
                <p className="text-4xl font-bold">{results.total}%</p>
                {improvement && improvement.total !== 0 && (
                  <div className="mt-2">
                    <ImprovementIndicator value={improvement.total} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Alert */}
      {improvement && improvement.total !== 0 && (
        <div className={`p-6 rounded-2xl shadow-lg border ${
          improvement.total > 0 
            ? 'bg-green-50 border-green-200' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center gap-3">
            {improvement.total > 0 ? (
              <>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900">Great Progress! 🎉</h3>
                  <p className="text-sm text-green-700">
                    Your ESG score improved by {improvement.total} points since your last assessment!
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-orange-900">Attention Needed</h3>
                  <p className="text-sm text-orange-700">
                    Your ESG score decreased by {Math.abs(improvement.total)} points. Review the recommendations below.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* First Time User Welcome Message */}
      {isFirstTime && results.total === 0 && (
        <div className="p-6 rounded-2xl shadow-lg border bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900">Welcome to ESG Tracker! 🌟</h3>
              <p className="text-sm text-blue-700">
                Get started by navigating to "Score Input" to calculate your first ESG assessment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Score Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <StatusIcon className="w-5 h-5" />
              <span className="text-sm font-medium opacity-80">Overall ESG Score</span>
            </div>
            <div className="flex items-end gap-4">
              <div className="text-6xl font-bold">{results.total || 0}</div>
              <div className="text-3xl opacity-60 mb-2">/ 100</div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${totalStatus.color} bg-white/20`}>
                {totalStatus.label}
              </div>
              {previousAssessment && (
                <div className="text-sm text-gray-400">
                  Previous: {previousAssessment.total_score}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-sm font-medium">Completed</span>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {(results.E > 0 || results.S > 0 || results.G > 0) ? '3/3' : '0/3'}
          </div>
          <div className="text-sm text-gray-500 mt-1">Categories</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-sm font-medium">Target</span>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">85</div>
          <div className="text-sm text-gray-500 mt-1">ESG Score Goal</div>
        </div>
      </div>

      {/* ESG Category Scores with Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scoreData.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center text-2xl`}>
                {item.icon}
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${item.textColor} ${item.bgColor}`}>
                  {item.score}%
                </div>
                {improvement && item.improvement !== 0 && (
                  <ImprovementIndicator value={item.improvement} />
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.label}</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className={`h-2.5 rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {item.score >= 80 ? 'Excellent' : 
                 item.score >= 60 ? 'Good' : 
                 item.score >= 40 ? 'Fair' : 
                 'Needs attention'}
              </span>
              {previousAssessment && (
                <span>Prev: {item.previousScore}%</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Insights */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            Performance Insights
          </h3>
          <div className="space-y-3">
            {results.E >= 70 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <p className="font-medium text-gray-900">Strong Environmental Score</p>
                  <p className="text-sm text-gray-600">Your environmental practices are above average</p>
                </div>
              </div>
            )}
            {results.S >= 70 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 text-xl">✓</span>
                <div>
                  <p className="font-medium text-gray-900">Excellent Social Impact</p>
                  <p className="text-sm text-gray-600">Great performance in social responsibility</p>
                </div>
              </div>
            )}
            {results.G >= 70 && (
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-600 text-xl">✓</span>
                <div>
                  <p className="font-medium text-gray-900">Solid Governance</p>
                  <p className="text-sm text-gray-600">Strong corporate governance practices</p>
                </div>
              </div>
            )}
            {results.total === 0 && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-xl">ℹ️</span>
                <div>
                  <p className="font-medium text-gray-900">Get Started</p>
                  <p className="text-sm text-gray-600">Begin by entering your ESG scores in the Score Input page</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Recommended Actions
          </h3>
          <div className="space-y-3">
            {results.E < 70 && results.E > 0 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-orange-600 text-xl">⚡</span>
                <div>
                  <p className="font-medium text-gray-900">Improve Environmental Score</p>
                  <p className="text-sm text-gray-600">Focus on reducing carbon footprint</p>
                </div>
              </div>
            )}
            {results.S < 70 && results.S > 0 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-orange-600 text-xl">⚡</span>
                <div>
                  <p className="font-medium text-gray-900">Enhance Social Programs</p>
                  <p className="text-sm text-gray-600">Strengthen community engagement</p>
                </div>
              </div>
            )}
            {results.G < 70 && results.G > 0 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-orange-600 text-xl">⚡</span>
                <div>
                  <p className="font-medium text-gray-900">Strengthen Governance</p>
                  <p className="text-sm text-gray-600">Review compliance procedures</p>
                </div>
              </div>
            )}
            {results.total === 0 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-blue-600 text-xl">📊</span>
                <div>
                  <p className="font-medium text-gray-900">Complete Your Assessment</p>
                  <p className="text-sm text-gray-600">Navigate to Score Input to begin tracking</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
        <h3 className="text-2xl font-bold mb-2">Ready to Improve?</h3>
        <p className="text-teal-100 mb-6">Access detailed reports and gap analysis to enhance your ESG performance</p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'reports' }))}
            className="px-6 py-3 bg-white text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-colors shadow-lg"
          >
            View Reports
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'gap' }))}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30"
          >
            Gap Analysis
          </button>
        </div>
      </div>
    </div>
  );
}