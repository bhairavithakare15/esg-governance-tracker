import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateCompleteESGReport = (userData, results, recommendations) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Page 1 - Cover Page
  doc.setFillColor(45, 87, 154);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont(undefined, 'bold');
  doc.text('ESG REPORT', pageWidth / 2, 80, { align: 'center' });
  
  doc.setFontSize(20);
  doc.setFont(undefined, 'normal');
  doc.text('Environmental, Social & Governance', pageWidth / 2, 100, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text(userData?.companyName || 'Company Name', pageWidth / 2, 140, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, pageWidth / 2, 160, { align: 'center' });
  
  // Page 2 - ESG Scores
  doc.addPage();
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text('ESG PERFORMANCE SUMMARY', 14, 20);
  
  // Overall Score Box
  doc.setFillColor(45, 87, 154);
  doc.roundedRect(14, 30, pageWidth - 28, 40, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('OVERALL ESG SCORE', pageWidth / 2, 45, { align: 'center' });
  
  doc.setFontSize(36);
  doc.setFont(undefined, 'bold');
  doc.text(`${results.total}%`, pageWidth / 2, 62, { align: 'center' });
  
  // Individual Scores
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Score Breakdown', 14, 85);
  
  doc.autoTable({
    startY: 90,
    head: [['Category', 'Score', 'Status', 'Rating']],
    body: [
      ['Environmental (E)', `${results.E}%`, getStatus(results.E), getRating(results.E)],
      ['Social (S)', `${results.S}%`, getStatus(results.S), getRating(results.S)],
      ['Governance (G)', `${results.G}%`, getStatus(results.G), getRating(results.G)]
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [45, 87, 154],
      fontSize: 12,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 11
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { halign: 'center', fontStyle: 'bold', fontSize: 12 },
      2: { halign: 'center' },
      3: { halign: 'center', fontStyle: 'bold' }
    }
  });
  
  // Performance Analysis
  let yPos = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Performance Analysis', 14, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  const analysis = getAnalysis(results);
  const splitAnalysis = doc.splitTextToSize(analysis, pageWidth - 28);
  doc.text(splitAnalysis, 14, yPos);
  
  // Page 3 - Environmental Details
  doc.addPage();
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(22, 163, 74);
  doc.text('🌍 ENVIRONMENTAL (E)', 14, 20);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(`Score: ${results.E}%`, 14, 35);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  const envText = [
    'Environmental performance measures your organization\'s impact on natural resources and ecosystems.',
    '',
    'Key Areas Assessed:',
    '• Carbon Emissions Management',
    '• Water Usage and Conservation',
    '• Waste Management',
    '• Energy Efficiency',
    '',
    `Current Status: ${getStatus(results.E)}`,
    '',
    'Recommendations:',
    results.E < 70 ? '• Implement carbon reduction strategies' : '• Maintain current practices',
    results.E < 70 ? '• Enhance water conservation programs' : '• Share best practices with industry',
    results.E < 70 ? '• Invest in renewable energy' : '• Set ambitious sustainability targets'
  ];
  
  yPos = 45;
  envText.forEach(line => {
    doc.text(line, 14, yPos);
    yPos += 6;
  });
  
  // Page 4 - Social Details
  doc.addPage();
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('👥 SOCIAL (S)', 14, 20);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(`Score: ${results.S}%`, 14, 35);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  const socialText = [
    'Social performance evaluates your organization\'s relationships with employees, communities, and stakeholders.',
    '',
    'Key Areas Assessed:',
    '• Employee Welfare and Benefits',
    '• Workplace Safety',
    '• Community Engagement',
    '• Diversity and Inclusion',
    '',
    `Current Status: ${getStatus(results.S)}`,
    '',
    'Recommendations:',
    results.S < 70 ? '• Enhance employee welfare programs' : '• Continue community engagement',
    results.S < 70 ? '• Strengthen diversity initiatives' : '• Expand social impact programs',
    results.S < 70 ? '• Improve workplace safety measures' : '• Share success stories publicly'
  ];
  
  yPos = 45;
  socialText.forEach(line => {
    doc.text(line, 14, yPos);
    yPos += 6;
  });
  
  // Page 5 - Governance Details
  doc.addPage();
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(168, 85, 247);
  doc.text('⚖️ GOVERNANCE (G)', 14, 20);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(`Score: ${results.G}%`, 14, 35);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  const govText = [
    'Governance performance assesses your organization\'s leadership, transparency, and ethical practices.',
    '',
    'Key Areas Assessed:',
    '• Board Diversity and Independence',
    '• Ethics and Compliance',
    '• Transparency and Reporting',
    '• Risk Management',
    '',
    `Current Status: ${getStatus(results.G)}`,
    '',
    'Recommendations:',
    results.G < 70 ? '• Strengthen board diversity' : '• Maintain ethical standards',
    results.G < 70 ? '• Enhance compliance frameworks' : '• Publish transparency reports',
    results.G < 70 ? '• Improve risk management' : '• Lead industry best practices'
  ];
  
  yPos = 45;
  govText.forEach(line => {
    doc.text(line, 14, yPos);
    yPos += 6;
  });
  
  // Page 6 - Recommendations
  doc.addPage();
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text('STRATEGIC RECOMMENDATIONS', 14, 20);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  yPos = 35;
  if (recommendations && recommendations.length > 0) {
    recommendations.forEach((rec, index) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }
      const text = `${index + 1}. ${rec}`;
      const splitText = doc.splitTextToSize(text, pageWidth - 28);
      doc.text(splitText, 14, yPos);
      yPos += (splitText.length * 6) + 5;
    });
  } else {
    doc.text('Complete your ESG assessment to receive personalized recommendations.', 14, yPos);
  }
  
  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text('ESG Governance Tracker - Confidential', pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
  }
  
  // Save PDF
  const fileName = `ESG_Complete_Report_${userData?.companyName?.replace(/\s+/g, '_') || 'Company'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Helper Functions
function getStatus(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Improvement';
}

function getRating(score) {
  if (score >= 80) return '⭐⭐⭐⭐⭐';
  if (score >= 60) return '⭐⭐⭐⭐';
  if (score >= 40) return '⭐⭐⭐';
  if (score >= 20) return '⭐⭐';
  return '⭐';
}

function getAnalysis(results) {
  const overall = results.total;
  
  if (overall >= 80) {
    return `Outstanding ESG performance! Your organization demonstrates excellence across Environmental, Social, and Governance dimensions with an overall score of ${overall}%. This places you among industry leaders in sustainable and responsible business practices.`;
  } else if (overall >= 60) {
    return `Solid ESG performance with an overall score of ${overall}%. Your organization shows good practices with opportunities for enhancement. Focus on improving lower-scoring areas to achieve excellence.`;
  } else if (overall >= 40) {
    return `Moderate ESG performance at ${overall}%. While basic practices are in place, significant improvements are needed. Prioritize developing comprehensive ESG strategies and implementing industry best practices.`;
  } else {
    return `ESG performance requires immediate attention with a score of ${overall}%. Urgent action is needed to establish fundamental ESG practices, improve governance, and engage stakeholders effectively.`;
  }
}