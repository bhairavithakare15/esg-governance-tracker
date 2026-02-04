import pool from '../config/db.js';

// Save ESG Assessment
export const saveAssessment = async (userId, scores, results) => {
  try {
    const result = await pool.query(
      `INSERT INTO esg_assessments 
       (user_id, carbon_emissions, water_usage, employee_welfare, community_impact, board_diversity, ethics_compliance, environmental_score, social_score, governance_score, total_esg_score) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [
        userId,
        scores[0] || 0,
        scores[1] || 0,
        scores[2] || 0,
        scores[3] || 0,
        scores[4] || 0,
        scores[5] || 0,
        results.E,
        results.S,
        results.G,
        results.total
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get all assessments for a user
export const getUserAssessments = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM esg_assessments WHERE user_id = $1 ORDER BY assessment_date DESC',
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get latest assessment for a user
export const getLatestAssessment = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM esg_assessments WHERE user_id = $1 ORDER BY assessment_date DESC LIMIT 1',
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

// Get all assessments (admin view)
export const getAllAssessments = async () => {
  try {
    const result = await pool.query(
      `SELECT 
        a.*, 
        u.company_name, 
        u.email 
      FROM esg_assessments a 
      JOIN users u ON a.user_id = u.id 
      ORDER BY a.assessment_date DESC`
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Log user login
export const logLogin = async (userId, ipAddress = 'local') => {
  try {
    const result = await pool.query(
      'INSERT INTO login_history (user_id, ip_address) VALUES ($1, $2) RETURNING *',
      [userId, ipAddress]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};



