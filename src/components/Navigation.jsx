export default function Navigation({ currentPage, setCurrentPage }) {
  const pages = [
    { id: 'dash', label: 'Dashboard' },
    { id: 'criteria', label: 'ESG Criteria' },
    { id: 'input', label: 'Score Input' },
    { id: 'gap', label: 'Gap Analysis' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div style={{
      background: '#e6e6e6',
      padding: '10px 30px',
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap'
    }}>
      {pages.map(page => (
        <button
          key={page.id}
          onClick={() => setCurrentPage(page.id)}
          style={{
            background: currentPage === page.id ? '#2b579a' : '#fff',
            color: currentPage === page.id ? '#fff' : '#000',
            border: '1px solid #d0d0d0',
            borderRadius: '4px',
            padding: '8px 14px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: currentPage === page.id ? '600' : '400'
          }}
        >
          {page.label}
        </button>
      ))}
    </div>
  );
}
