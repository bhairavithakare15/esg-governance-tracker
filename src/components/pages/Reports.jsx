import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Reports({ recommendations, results }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Check if we have valid data
  const hasValidData = results && 
    (results.total > 0 || results.E > 0 || results.S > 0 || results.G > 0);

  // Helper function to get rating based on score
  const getScoreRating = (score) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 60) return { text: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 40) return { text: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <FileText className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold mb-2">ESG Assessment Report</h1>
            <p className="text-blue-100">Complete overview of your Environmental, Social & Governance performance</p>
          </div>
        </div>
      </div>

      {/* Alert if no data */}
      {!hasValidData && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
            <div>
              <h3 className="font-bold text-yellow-900 text-lg">No ESG Data Available</h3>
              <p className="text-yellow-700 mb-3">Please complete your ESG assessment in the Score Input page first.</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'input' }))}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
                Go to Score Input
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Content */}
      {hasValidData && (
        <>
          {/* Company Information */}
          {user && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Company Name</p>
                  <p className="font-semibold text-gray-900">{user.companyName || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Industry</p>
                  <p className="font-semibold text-gray-900">{user.industry || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Contact Email</p>
                  <p className="font-semibold text-gray-900">{user.email || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Report Date</p>
                  <p className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Overall ESG Score */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Overall ESG Score</h2>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl font-bold mb-2">{results.total}%</div>
                <div className="text-xl text-purple-100">{getScoreRating(results.total).text}</div>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Score Breakdown</h2>
            <div className="space-y-4">
              {/* Environmental Score */}
              <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-green-900">Environmental (E)</h3>
                  <span className="text-3xl font-bold text-green-700">{results.E}%</span>
                </div>
                <div className={`inline-block px-4 py-1 rounded-full ${getScoreRating(results.E).bg}`}>
                  <span className={`font-semibold ${getScoreRating(results.E).color}`}>
                    {getScoreRating(results.E).text}
                  </span>
                </div>
                <p className="text-gray-700 mt-3">
                  Measures your organization's impact on natural resources, climate change mitigation, waste management, and ecological footprint.
                </p>
              </div>

              {/* Social Score */}
              <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-blue-900">Social (S)</h3>
                  <span className="text-3xl font-bold text-blue-700">{results.S}%</span>
                </div>
                <div className={`inline-block px-4 py-1 rounded-full ${getScoreRating(results.S).bg}`}>
                  <span className={`font-semibold ${getScoreRating(results.S).color}`}>
                    {getScoreRating(results.S).text}
                  </span>
                </div>
                <p className="text-gray-700 mt-3">
                  Evaluates relationships with employees, suppliers, customers, and communities including labor practices, human rights, and diversity.
                </p>
              </div>

              {/* Governance Score */}
              <div className="p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-purple-900">Governance (G)</h3>
                  <span className="text-3xl font-bold text-purple-700">{results.G}%</span>
                </div>
                <div className={`inline-block px-4 py-1 rounded-full ${getScoreRating(results.G).bg}`}>
                  <span className={`font-semibold ${getScoreRating(results.G).color}`}>
                    {getScoreRating(results.G).text}
                  </span>
                </div>
                <p className="text-gray-700 mt-3">
                  Assesses leadership structure, executive compensation, shareholder rights, business ethics, and transparency practices.
                </p>
              </div>
            </div>
          </div>

          {/* Strategic Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-7 h-7 text-teal-600" />
                Strategic Recommendations
              </h2>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-4 p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 pt-0.5">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Box */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-3">📊 Assessment Summary</h3>
            <p className="text-indigo-100 mb-4">
              Your ESG assessment has been completed successfully. Review your scores above to understand your organization's performance across Environmental, Social, and Governance dimensions.
            </p>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                
              </div>
                
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{results.E}%</div>
                <div className="text-sm text-indigo-200">Environmental</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{results.S}%</div>
                <div className="text-sm text-indigo-200">Social</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{results.G}%</div>
                <div className="text-sm text-indigo-200">Governance</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}



