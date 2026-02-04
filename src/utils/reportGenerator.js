import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateExecutiveSummary = (userData, results, recommendations) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Header
  doc.setFillColor(45, 87, 154);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('ESG Executive Summary', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
  
  // Company Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Company Information', 14, 55);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Company: ${userData?.companyName || 'N/A'}`, 14, 65);
  doc.text(`Email: ${userData?.email || 'N/A'}`, 14, 72);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 79);
  
  // ESG Scores
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('ESG Performance Scores', 14, 95);
  
  // Scores table
  doc.autoTable({
    startY: 100,
    head: [['Dimension', 'Score', 'Status']],
    body: [
      ['Environmental (E)', `${results.E}%`, getStatus(results.E)],
      ['Social (S)', `${results.S}%`, getStatus(results.S)],
      ['Governance (G)', `${results.G}%`, getStatus(results.G)],
      ['Overall ESG Score', `${results.total}%`, getStatus(results.total)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [45, 87, 154], textColor: 255 },
    styles: { fontSize: 11 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'center', fontStyle: 'bold' },
      2: { halign: 'center' }
    }
  });
  
  // Score interpretation
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Performance Analysis', 14, finalY);
  
  finalY += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  const analysis = getPerformanceAnalysis(results);
  const splitAnalysis = doc.splitTextToSize(analysis, pageWidth - 28);
  doc.text(splitAnalysis, 14, finalY);
  
  finalY += (splitAnalysis.length * 6) + 10;
  
  // Recommendations
  if (finalY > pageHeight - 60) {
    doc.addPage();
    finalY = 20;
  }
  
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Strategic Recommendations', 14, finalY);
  
  finalY += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  if (recommendations && recommendations.length > 0) {
    recommendations.forEach((rec, index) => {
      if (finalY > pageHeight - 20) {
        doc.addPage();
        finalY = 20;
      }
      const recText = `${index + 1}. ${rec}`;
      const splitRec = doc.splitTextToSize(recText, pageWidth - 28);
      doc.text(splitRec, 14, finalY);
      finalY += (splitRec.length * 6) + 3;
    });
  }
  
  // Footer
  const footerY = pageHeight - 15;
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text('ESG Governance Tracker - Confidential Report', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Page 1 of ${doc.internal.getNumberOfPages()}`, pageWidth - 20, footerY, { align: 'right' });
  
  // Save
  doc.save(`ESG_Executive_Summary_${userData?.companyName || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generatePerformanceMetrics = (userData, results) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFillColor(22, 163, 74);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('Performance Metrics Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`${userData?.companyName || 'Company'} - ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
  
  // Detailed Metrics
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Detailed ESG Metrics', 14, 55);
  
  // Environmental Metrics
  doc.setFontSize(14);
  doc.setTextColor(22, 163, 74);
  doc.text('Environmental Performance', 14, 70);
  
  doc.autoTable({
    startY: 75,
    head: [['Metric', 'Score', 'Weight', 'Contribution']],
    body: [
      ['Carbon Emissions Management', `${results.E}%`, '30%', `${(results.E * 0.3 / 100).toFixed(1)}%`],
      ['Water Usage Efficiency', `${results.E}%`, '20%', `${(results.E * 0.2 / 100).toFixed(1)}%`]
    ],
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74] }
  });
  
  // Social Metrics
  let finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('Social Performance', 14, finalY);
  
  doc.autoTable({
    startY: finalY + 5,
    head: [['Metric', 'Score', 'Weight', 'Contribution']],
    body: [
      ['Employee Welfare', `${results.S}%`, '25%', `${(results.S * 0.25 / 100).toFixed(1)}%`],
      ['Community Impact', `${results.S}%`, '15%', `${(results.S * 0.15 / 100).toFixed(1)}%`]
    ],
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });
  
  // Governance Metrics
  finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setTextColor(168, 85, 247);
  doc.text('Governance Performance', 14, finalY);
  
  doc.autoTable({
    startY: finalY + 5,
    head: [['Metric', 'Score', 'Weight', 'Contribution']],
    body: [
      ['Board Diversity', `${results.G}%`, '10%', `${(results.G * 0.1 / 100).toFixed(1)}%`],
      ['Ethics Compliance', `${results.G}%`, '20%', `${(results.G * 0.2 / 100).toFixed(1)}%`]
    ],
    theme: 'striped',
    headStyles: { fillColor: [168, 85, 247] }
  });
  
  doc.save(`ESG_Performance_Metrics_${userData?.companyName || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateRiskAssessment = (userData, results) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFillColor(234, 88, 12);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('ESG Risk Assessment', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`${userData?.companyName || 'Company'} - ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
  
  // Risk Analysis
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Risk Level Analysis', 14, 55);
  
  const risks = [
    {
      category: 'Environmental',
      score: results.E,
      level: getRiskLevel(results.E),
      mitigation: 'Implement carbon reduction strategies and water conservation programs'
    },
    {
      category: 'Social',
      score: results.S,
      level: getRiskLevel(results.S),
      mitigation: 'Enhance employee welfare programs and community engagement initiatives'
    },
    {
      category: 'Governance',
      score: results.G,
      level: getRiskLevel(results.G),
      mitigation: 'Strengthen board diversity and ethics compliance frameworks'
    }
  ];
  
  doc.autoTable({
    startY: 60,
    head: [['Category', 'Score', 'Risk Level', 'Priority']],
    body: risks.map(r => [r.category, `${r.score}%`, r.level, getPriority(r.score)]),
    theme: 'grid',
    headStyles: { fillColor: [234, 88, 12] },
    columnStyles: {
      2: { halign: 'center' },
      3: { halign: 'center', fontStyle: 'bold' }
    }
  });
  
  // Mitigation Strategies
  let finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Mitigation Strategies', 14, finalY);
  
  finalY += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  risks.forEach((risk, index) => {
    const text = `${index + 1}. ${risk.category}: ${risk.mitigation}`;
    const splitText = doc.splitTextToSize(text, pageWidth - 28);
    doc.text(splitText, 14, finalY);
    finalY += (splitText.length * 6) + 5;
  });
  
  doc.save(`ESG_Risk_Assessment_${userData?.companyName || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateActionPlan = (userData, results, recommendations) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFillColor(168, 85, 247);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('ESG Action Plan', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`${userData?.companyName || 'Company'} - ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
  
  // Action Items
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Priority Action Items', 14, 55);
  
  const actions = [
    { action: 'Conduct carbon footprint assessment', timeline: 'Q1 2026', priority: 'High', owner: 'Sustainability Team' },
    { action: 'Implement employee wellness program', timeline: 'Q1-Q2 2026', priority: 'Medium', owner: 'HR Department' },
    { action: 'Establish ethics committee', timeline: 'Q2 2026', priority: 'High', owner: 'Board of Directors' },
    { action: 'Deploy ESG training modules', timeline: 'Q2-Q3 2026', priority: 'Medium', owner: 'All Departments' }
  ];
  
  doc.autoTable({
    startY: 60,
    head: [['Action Item', 'Timeline', 'Priority', 'Owner']],
    body: actions.map(a => [a.action, a.timeline, a.priority, a.owner]),
    theme: 'grid',
    headStyles: { fillColor: [168, 85, 247] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 80 },
      2: { halign: 'center', fontStyle: 'bold' }
    }
  });
  
  // Recommendations
  let finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Strategic Recommendations', 14, finalY);
  
  finalY += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  if (recommendations && recommendations.length > 0) {
    recommendations.forEach((rec, index) => {
      const text = `${index + 1}. ${rec}`;
      const splitText = doc.splitTextToSize(text, pageWidth - 28);
      doc.text(splitText, 14, finalY);
      finalY += (splitText.length * 6) + 5;
    });
  }
  
  doc.save(`ESG_Action_Plan_${userData?.companyName || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Helper functions
function getStatus(score) {
  if (score >= 80) return '✓ Excellent';
  if (score >= 60) return '◐ Good';
  if (score >= 40) return '◑ Fair';
  return '✗ Needs Improvement';
}

function getRiskLevel(score) {
  if (score >= 70) return 'Low Risk';
  if (score >= 40) return 'Medium Risk';
  return 'High Risk';
}

function getPriority(score) {
  if (score < 40) return 'Critical';
  if (score < 70) return 'High';
  return 'Low';
}

function getPerformanceAnalysis(results) {
  const overall = results.total;
  
  if (overall >= 80) {
    return `Excellent ESG performance with a total score of ${overall}%. Your organization demonstrates strong commitment to environmental, social, and governance practices. Continue maintaining these high standards and focus on continuous improvement.`;
  } else if (overall >= 60) {
    return `Good ESG performance with a total score of ${overall}%. Your organization shows solid ESG practices with room for improvement. Focus on areas with lower scores to enhance overall performance.`;
  } else if (overall >= 40) {
    return `Fair ESG performance with a total score of ${overall}%. Your organization has established basic ESG practices but significant improvements are needed. Prioritize implementation of comprehensive ESG strategies.`;
  } else {
    return `ESG performance needs significant improvement with a total score of ${overall}%. Immediate action is required to establish fundamental ESG practices and governance frameworks. Consider engaging ESG consultants for guidance.`;
  }
}