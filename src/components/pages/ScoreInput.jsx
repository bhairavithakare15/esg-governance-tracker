import { useState } from 'react';
import { CRITERIA } from '../../data/mockData';
import { calculateESGScores } from '../../utils/calculations';

export default function ScoreInput({ scores, setScores, results, setResults, setReports }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleScoreChange = (idx, val) => {
    const numVal = parseFloat(val) || 0;
    if (numVal >= 1 && numVal <= 10) {
      setScores(prev => ({ ...prev, [idx]: numVal }));
    } else if (numVal === 0 || val === '') {
      setScores(prev => ({ ...prev, [idx]: 0 }));
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    setMessage('');

    const hasScores = Object.values(scores).some(s => s > 0);
    if (!hasScores) {
      setMessage('❌ Please enter at least one score');
      setMessageType('error');
      setLoading(false);
      return;
    }

    console.log('=== CALCULATION START ===');
    console.log('Input Scores:', scores);
    console.log('Criteria:', CRITERIA);

    const newResults = calculateESGScores(scores, CRITERIA);
    
    console.log('Calculated Results:', newResults);
    console.log('=== CALCULATION END ===');

    setResults(newResults);
    setReports(newResults.total);

    setMessage(`✅ Calculated! E: ${newResults.E}%, S: ${newResults.S}%, G: ${newResults.G}%, Total: ${newResults.total}%`);
    setMessageType('success');

    try {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      console.log('💾 Saving to database...', { userId: user.id, scores, results: newResults });

      const response = await fetch('http://localhost:5000/api/scores/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          scores: scores,
          results: newResults
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Score calculated and saved! E: ${newResults.E}%, S: ${newResults.S}%, G: ${newResults.G}%, Total: ${newResults.total}%`);
        setMessageType('success');
      } else {
        setMessage(`⚠️ Calculated but save failed: ${data.message}`);
        setMessageType('error');
      }

    } catch (error) {
      console.error('❌ Save error:', error);
      setMessage(`⚠️ Calculated but could not save to database`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="title">Score Input</div>
      <p>Enter scores between 1–10 for each ESG criteria. Scores will be automatically saved.</p>
      
      <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        marginBottom: '15px',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>Debug Info:</strong> Current Results - E: {results.E}, S: {results.S}, G: {results.G}, Total: {results.total}
      </div>

      <div>
        {CRITERIA.map((c, i) => (
          <div key={i} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              {c.dim} – {c.name} (Weight: {c.weight})
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={scores[i] || ''}
              onChange={(e) => handleScoreChange(i, e.target.value)}
              placeholder="1 to 10"
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              Current: {scores[i] || 0}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleCalculate}
        disabled={loading}
        style={{
          background: loading ? '#ccc' : '#2b579a',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '6px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          marginTop: '15px',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? '⏳ Calculating & Saving...' : '📊 Calculate & Save ESG Score'}
      </button>

      {message && (
        <div style={{
          marginTop: '15px',
          padding: '12px',
          background: messageType === 'success' ? '#e6ffe6' : '#ffe6e6',
          color: messageType === 'success' ? '#5cb85c' : '#d9534f',
          borderRadius: '6px',
          fontSize: '14px',
          border: messageType === 'success' ? '1px solid #5cb85c' : '1px solid #ffcccc'
        }}>
          {message}
        </div>
      )}

      <div className="output-box" style={{ marginTop: '20px' }}>
        <div className="title">Output</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Dimension</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Score</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Environmental</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: '600' }}>{results.E}</td>
              <td style={{
                padding: '10px',
                border: '1px solid #ddd',
                color: results.E < 40 ? '#d9534f' : results.E < 70 ? '#f0ad4e' : '#5cb85c',
                fontWeight: '600'
              }}>
                {results.E < 40 ? '🔴 High Risk' : results.E < 70 ? '🟡 Moderate' : '🟢 Good'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Social</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: '600' }}>{results.S}</td>
              <td style={{
                padding: '10px',
                border: '1px solid #ddd',
                color: results.S < 40 ? '#d9534f' : results.S < 70 ? '#f0ad4e' : '#5cb85c',
                fontWeight: '600'
              }}>
                {results.S < 40 ? '🔴 High Risk' : results.S < 70 ? '🟡 Moderate' : '🟢 Good'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Governance</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: '600' }}>{results.G}</td>
              <td style={{
                padding: '10px',
                border: '1px solid #ddd',
                color: results.G < 40 ? '#d9534f' : results.G < 70 ? '#f0ad4e' : '#5cb85c',
                fontWeight: '600'
              }}>
                {results.G < 40 ? '🔴 High Risk' : results.G < 70 ? '🟡 Moderate' : '🟢 Good'}
              </td>
            </tr>
            <tr style={{ background: '#d9e1f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total ESG Score</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: '600', fontSize: '18px' }}>{results.total}</th>
              <th style={{
                padding: '10px',
                border: '1px solid #ddd',
                color: results.total < 40 ? '#d9534f' : results.total < 70 ? '#f0ad4e' : '#5cb85c',
                fontWeight: '600'
              }}>
                {results.total < 40 ? '🔴 High Risk' : results.total < 70 ? '🟡 Moderate' : '🟢 Good'}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}