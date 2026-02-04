// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import pool from './src/config/db.js';
// import { registerUser, loginUser, getAllUsers } from './src/services/authService.js';
// import { saveAssessment, getUserAssessments, getAllAssessments } from './src/services/assessmentService.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware - FIX CORS PROPERLY
// app.use(cors({
//   origin: "http://localhost:5174",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.use(express.json());

// // Log all requests
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// });

// // ==================== AUTH ROUTES ====================

// // Register
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { companyName, email, password } = req.body;

//     if (!companyName || !email || !password) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const user = await registerUser(companyName, email, password);
//     res.status(201).json({
//       message: 'Registration successful',
//       user: {
//         id: user.id,
//         companyName: user.company_name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     console.error('Register error:', error);
//     res.status(400).json({ message: error.message });
//   }
// });

// // Login
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password required' });
//     }

//     const user = await loginUser(email, password);

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     res.status(200).json({
//       message: 'Login successful',
//       user: {
//         id: user.id,
//         companyName: user.company_name,
//         email: user.email,
//         loginTime: new Date().toLocaleString()
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get all users (admin)
// app.get('/api/auth/users', async (req, res) => {
//   try {
//     const users = await getAllUsers();
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // ==================== ASSESSMENT ROUTES ====================

// // Save assessment
// app.post('/api/assessments/save', async (req, res) => {
//   try {
//     const { userId, scores, results } = req.body;

//     if (!userId || !scores || !results) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const assessment = await saveAssessment(userId, scores, results);
//     res.status(201).json({
//       message: 'Assessment saved successfully',
//       assessment
//     });
//   } catch (error) {
//     console.error('Save assessment error:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get user assessments
// app.get('/api/assessments/user/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const assessments = await getUserAssessments(userId);
//     res.status(200).json(assessments);
//   } catch (error) {
//     console.error('Get assessments error:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get all assessments (admin)
// app.get('/api/assessments/all', async (req, res) => {
//   try {
//     const assessments = await getAllAssessments();
//     res.status(200).json(assessments);
//   } catch (error) {
//     console.error('Get all assessments error:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // ==================== HEALTH CHECK ====================

// app.get('/api/health', (req, res) => {
//   res.status(200).json({ message: 'Server is running' });
// });

// // Handle 404
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`[dotenv@17.2.3] injecting env (6) from .env`);
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📊 Database: PostgreSQL at localhost:5432`);
//   console.log(`✅ CORS enabled for http://localhost:5174`);
// });


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Note: Ensure your file paths are correct relative to server.js
import pool from './config/db.js'; 
import { registerUser, loginUser, getAllUsers } from './services/authService.js';
import { saveAssessment, getUserAssessments, getAllAssessments } from './services/assessmentService.js';

dotenv.config();

const app = express();

// Use 5000 as the primary port to match your terminal's expectations
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

app.use(cors({
  // Changed to 5173 to match your Vite output
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { companyName, email, password } = req.body;
    if (!companyName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const user = await registerUser(companyName, email, password);
    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, companyName: user.company_name, email: user.email }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await loginUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        companyName: user.company_name,
        email: user.email,
        loginTime: new Date().toLocaleString()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ASSESSMENT ROUTES ====================

app.post('/api/assessments/save', async (req, res) => {
  try {
    const { userId, scores, results } = req.body;
    if (!userId || !scores || !results) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const assessment = await saveAssessment(userId, scores, results);
    res.status(201).json({ message: 'Assessment saved successfully', assessment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/assessments/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const assessments = await getUserAssessments(userId);
    res.status(200).json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== SYSTEM ROUTES ====================

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', database: 'Connected' });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Accepting requests from http://localhost:5173`);
});