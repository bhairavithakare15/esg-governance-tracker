import { CRITERIA } from '../../data/mockData';

export default function GapAnalysis({ scores }) {
  return (
    <div className="section">
      <div className="title">Gap Analysis</div>
      <p>Gap between your score and ideal score of 5</p>
      <table>
        <thead>
          <tr>
            <th>Area</th>
            <th>Your Score</th>
            <th>Gap</th>
          </tr>
        </thead>
        <tbody>
          {CRITERIA.map((c, i) => {
            const score = scores[i] || 0;
            const gap = (5 - score).toFixed(1);
            return (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{score}</td>
                <td className={gap > 0 ? 'gap-red' : 'gap-green'} style={{ fontWeight: '600' }}>
                  {gap}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}