export function calculateESGScores(scores, criteria) {
  let eSum = 0, sSum = 0, gSum = 0;
  let eWeight = 0, sWeight = 0, gWeight = 0;

  criteria.forEach((c, i) => {
    const score = scores[i] || 0;
    const weight = c.weight;

    if (c.dim === 'E') {
      eSum += score * weight;
      eWeight += weight;
    } else if (c.dim === 'S') {
      sSum += score * weight;
      sWeight += weight;
    } else if (c.dim === 'G') {
      gSum += score * weight;
      gWeight += weight;
    }
  });

  // Calculate weighted averages (score out of 10, convert to percentage)
  const E = eWeight > 0 ? Math.round((eSum / eWeight / 10) * 100) : 0;
  const S = sWeight > 0 ? Math.round((sSum / sWeight / 10) * 100) : 0;
  const G = gWeight > 0 ? Math.round((gSum / gWeight / 10) * 100) : 0;
  
  // Total is average of E, S, G
  const total = Math.round((E + S + G) / 3);

  console.log('📊 Calculation:', { scores, eSum, sSum, gSum, eWeight, sWeight, gWeight });
  console.log('📊 Results:', { E, S, G, total });

  return { E, S, G, total };
}

export function getRecommendations(totalScore) {
  if (totalScore >= 80) {
    return [
      'Excellent ESG performance! Maintain current practices.',
      'Consider publishing sustainability reports.',
      'Share best practices with industry peers.',
      'Set ambitious targets for continuous improvement.'
    ];
  } else if (totalScore >= 60) {
    return [
      'Good ESG performance with room for improvement.',
      'Focus on areas with lower scores.',
      'Implement sustainability initiatives.',
      'Engage stakeholders in ESG efforts.'
    ];
  } else if (totalScore >= 40) {
    return [
      'Moderate ESG performance. Improvement needed.',
      'Develop comprehensive ESG strategy.',
      'Allocate resources to priority areas.',
      'Seek expert guidance on ESG practices.'
    ];
  } else {
    return [
      'ESG performance needs significant improvement.',
      'Immediate action required on critical issues.',
      'Establish ESG governance framework.',
      'Consider bringing in ESG consultants.',
      'Prioritize compliance and risk management.'
    ];
  }
}