import { CRITERIA } from '../../data/mockData';

export default function ESGCriteria() {
  return (
    <div className="section">
      <div className="title">ESG Criteria – Mock Dataset</div>
      <table>
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Criteria</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {CRITERIA.map((c, i) => (
            <tr key={i}>
              <td>{c.dim}</td>
              <td>{c.name}</td>
              <td>{c.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}