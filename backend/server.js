const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'esg_tracker1',
  password: 'postgres123',  // ⬅️ CHANGE THIS to your PostgreSQL password
  port: 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    console.error('Please check:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database "esg_tracker1" exists');
    console.error('3. Password is correct');
  } else {
    console.log('✅ Database connected successfully at', res.rows[0].now);
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { companyName, email, password } = req.body;
  
  console.log('📝 Registration attempt:', { companyName, email });

  try {
    // Validate input
    if (!companyName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }
    // Check if user already exists
    const userCheck = await pool.query(
      'SELECT * FROM companies WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      console.log('⚠️ Email already exists');
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered. Please login instead.' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new company
    const result = await pool.query(
      'INSERT INTO companies (name, email, password, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id, name, email, created_at',
      [companyName, email, hashedPassword]
    );

    console.log('✅ User registered successfully:', result.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Registration successful! You can now login.',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error: ' + error.message 
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login attempt:', { email });

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM companies WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('⚠️ User not found');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.log('⚠️ Invalid password');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    console.log('✅ Login successful:', { id: user.id, email: user.email });

    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        companyName: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error: ' + error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running!',
    database: 'esg_tracker1',
    timestamp: new Date().toISOString()
  });
});

// Get all companies (for testing)
app.get('/api/companies', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM companies ORDER BY created_at DESC');
    res.json({
      success: true,
      count: result.rows.length,
      companies: result.rows
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Save ESG scores endpoint
app.post('/api/scores/save', async (req, res) => {
  const { userId, scores, results } = req.body;
  
  console.log('💾 Save scores request:', { userId, scores, results });

  try {
    // Check if user exists
    const userCheck = await pool.query(
      'SELECT * FROM companies WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Create esg_assessments table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS esg_assessments (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id),
        environmental_score INTEGER,
        social_score INTEGER,
        governance_score INTEGER,
        total_score INTEGER,
        scores_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if assessment already exists for this company
    const existingAssessment = await pool.query(
      'SELECT * FROM esg_assessments WHERE company_id = $1',
      [userId]
    );

    let result;

    if (existingAssessment.rows.length > 0) {
      // Update existing assessment
      result = await pool.query(
        `UPDATE esg_assessments 
         SET environmental_score = $1, 
             social_score = $2, 
             governance_score = $3, 
             total_score = $4,
             scores_data = $5,
             updated_at = CURRENT_TIMESTAMP
         WHERE company_id = $6
         RETURNING *`,
        [
          results.E || 0,
          results.S || 0,
          results.G || 0,
          results.total || 0,
          JSON.stringify(scores),
          userId
        ]
      );
      console.log('✅ Scores updated successfully');
    } else {
      // Insert new assessment
      result = await pool.query(
        `INSERT INTO esg_assessments 
         (company_id, environmental_score, social_score, governance_score, total_score, scores_data, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [
          userId,
          results.E || 0,
          results.S || 0,
          results.G || 0,
          results.total || 0,
          JSON.stringify(scores)
        ]
      );
      console.log('✅ Scores saved successfully');
    }


    res.json({
      success: true,
      message: 'Scores saved successfully!',
      assessment: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Save scores error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error saving scores: ' + error.message 
    });
  }
});

// Get scores for a user
app.get('/api/scores/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM esg_assessments WHERE company_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        message: 'No scores found',
        assessment: null
      });
    }

    res.json({
      success: true,
      assessment: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Get scores error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Save ESG scores endpoint
app.post('/api/scores/save', async (req, res) => {
  const { userId, scores, results } = req.body;
  
  console.log('💾 Save scores request:', { userId, scores, results });

  try {
    // Check if user exists
    const userCheck = await pool.query(
      'SELECT * FROM companies WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Create esg_assessments table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS esg_assessments (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id),
        environmental_score INTEGER,
        social_score INTEGER,
        governance_score INTEGER,
        total_score INTEGER,
        scores_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if assessment already exists for this company
    const existingAssessment = await pool.query(
      'SELECT * FROM esg_assessments WHERE company_id = $1',
      [userId]
    );

    let result;

    if (existingAssessment.rows.length > 0) {
      // Update existing assessment
      result = await pool.query(
        `UPDATE esg_assessments 
         SET environmental_score = $1, 
             social_score = $2, 
             governance_score = $3, 
             total_score = $4,
             scores_data = $5,
             updated_at = CURRENT_TIMESTAMP
         WHERE company_id = $6
         RETURNING *`,
        [
          results.E || 0,
          results.S || 0,
          results.G || 0,
          results.total || 0,
          JSON.stringify(scores),
          userId
        ]
      );
      console.log('✅ Scores updated successfully');
    } else {
      // Insert new assessment
      result = await pool.query(
        `INSERT INTO esg_assessments 
         (company_id, environmental_score, social_score, governance_score, total_score, scores_data)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          userId,
          results.E || 0,
          results.S || 0,
          results.G || 0,
          results.total || 0,
          JSON.stringify(scores)
        ]
      );
      console.log('✅ Scores saved successfully');
    }

    res.json({
      success: true,
      message: 'Scores saved successfully!',
      assessment: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Save scores error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error saving scores: ' + error.message 
    });
  }
});

// Get assessment history for a company
app.get('/api/scores/history/:userId', async (req, res) => {
  const { userId } = req.params;
  
  console.log('📊 Fetching assessment history for user:', userId);

  try {
    const result = await pool.query(
      `SELECT 
        id,
        environmental_score,
        social_score,
        governance_score,
        total_score,
        scores_data,
        created_at,
        updated_at
       FROM esg_assessments 
       WHERE company_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    console.log(`✅ Found ${result.rows.length} assessments`);

    res.json({
      success: true,
      count: result.rows.length,
      assessments: result.rows
    });

  } catch (error) {
    console.error('❌ Get history error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get latest assessment for a company
app.get('/api/scores/latest/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT 
        id,
        environmental_score,
        social_score,
        governance_score,
        total_score,
        scores_data,
        created_at,
        updated_at
       FROM esg_assessments 
       WHERE company_id = $1 
       ORDER BY updated_at DESC 
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        assessment: null,
        message: 'No previous assessment found'
      });
    }

    res.json({
      success: true,
      assessment: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Get latest assessment error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get improvement comparison (latest vs previous)
// Auto-save ESG scores endpoint (NO TABLE CREATION - table must exist)
app.post('/api/scores/save', async (req, res) => {
  const { userId, scores, results } = req.body;
  
  console.log('💾 Auto-save scores request:', { userId, scores, results });

  try {
    // Validate user exists
    const userCheck = await pool.query(
      'SELECT id, name, email FROM companies WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    console.log('✅ User found:', userCheck.rows[0]);

    // Check if assessment already exists for this company
    const existingAssessment = await pool.query(
      'SELECT id FROM esg_assessments WHERE company_id = $1',
      [userId]
    );

    let result;

    if (existingAssessment.rows.length > 0) {
      // Update existing assessment
      console.log('📝 Updating existing assessment...');
      result = await pool.query(
        `UPDATE esg_assessments 
         SET environmental_score = $1, 
             social_score = $2, 
             governance_score = $3, 
             total_score = $4,
             scores_data = $5,
             updated_at = CURRENT_TIMESTAMP
         WHERE company_id = $6
         RETURNING *`,
        [
          Math.round(results.E || 0),
          Math.round(results.S || 0),
          Math.round(results.G || 0),
          Math.round(results.total || 0),
          JSON.stringify(scores),
          userId
        ]
      );
      console.log('✅ Assessment updated:', result.rows[0].id);
    } else {
      // Insert new assessment
      console.log('📝 Creating new assessment...');
      result = await pool.query(
        `INSERT INTO esg_assessments 
         (company_id, environmental_score, social_score, governance_score, total_score, scores_data, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [
          userId,
          Math.round(results.E || 0),
          Math.round(results.S || 0),
          Math.round(results.G || 0),
          Math.round(results.total || 0),
          JSON.stringify(scores)
        ]
      );
      console.log('✅ Assessment created:', result.rows[0].id);
    }

    res.json({
      success: true,
      message: 'Scores saved automatically!',
      assessment: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Save scores error:', error.message);
    console.error('Error details:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error saving scores: ' + error.message 
    });
  }
});
// Start server
app.listen(port, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 ESG Tracker Backend Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Server: http://localhost:${port}`);
  console.log(`💚 Health: http://localhost:${port}/api/health`);
  console.log(`📊 Companies: http://localhost:${port}/api/companies`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});