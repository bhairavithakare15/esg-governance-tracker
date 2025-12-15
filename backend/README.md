# ESG Tracker Backend API

Express.js REST API for ESG Governance Tracking System.

## Setup

### Prerequisites
- Node.js 16+
- PostgreSQL 12+

### Installation
```bash
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

### Database Setup
```bash
# Create database
createdb esg_tracker

# Run migrations
npm run migrate

# Load seed data
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard/summary` - Dashboard metrics
- `GET /api/dashboard/trends` - Historical trends

### ESG Criteria
- `GET /api/esg-criteria` - List criteria
- `POST /api/esg-criteria` - Create criteria (Admin)
- `PUT /api/esg-criteria/:id` - Update criteria (Admin)
- `DELETE /api/esg-criteria/:id` - Delete criteria (Admin)

### Assessments
- `GET /api/assessments` - List assessments
- `POST /api/assessments` - Create assessment
- `GET /api/assessments/:id` - Get assessment
- `PUT /api/assessments/:id/submit` - Submit assessment

### Scores
- `POST /api/assessments/:id/scores` - Submit scores
- `GET /api/assessments/:id/scores` - Get scores
- `POST /api/assessments/:id/calculate` - Calculate ESG score

### Gap Analysis
- `GET /api/assessments/:id/gap-analysis` - Get gap analysis

### Reports
- `POST /api/assessments/:id/generate-report` - Generate report
- `GET /api/reports/:id/download` - Download report

### Organization
- `GET /api/organization` - Get organization info
- `PUT /api/organization` - Update organization (Admin)
- `GET /api/organization/users` - List users (Admin)
- `POST /api/organization/users` - Create user (Admin)

## Testing
```bash
npm test
npm test -- --coverage
```

## Development
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Production
```bash
NODE_ENV=production npm start
```

## Deployment

See main project README for deployment instructions.