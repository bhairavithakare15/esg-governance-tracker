import pool from '../config/db.js';

// Register new user
export const registerUser = async (companyName, email, password) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (company_name, email, password) VALUES ($1, $2, $3) RETURNING id, company_name, email',
      [companyName, email, password]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

// Login user (check credentials)
export const loginUser = async (email, password) => {
  try {
    const result = await pool.query(
      'SELECT id, company_name, email FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT id, company_name, email FROM users ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    throw error;
  }
};