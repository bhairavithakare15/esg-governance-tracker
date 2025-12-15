# ESG Governance Tracker

Enterprise-grade ESG Governance Assessment and Tracking System built with React, Node.js, and PostgreSQL.

## Project Overview

A complete ESG (Environmental, Social, Governance) scoring and assessment platform that enables organizations to:
- Track ESG performance across dimensions
- Submit and calculate ESG scores
- Perform gap analysis
- Generate strategic recommendations
- Monitor compliance and trends

## Quick Start

### Prerequisites
- Node.js 16+ (https://nodejs.org/)
- PostgreSQL 12+ (https://www.postgresql.org/)
- Docker & Docker Compose (optional)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run seed
npm run dev
```

Backend runs on: `http://localhost:3001`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## API Documentation

See [Backend README](./backend/README.md) for complete API documentation.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

## Database

See [database schema](./backend/database/schema.sql)

## Development

### Tech Stack
- **Frontend**: React 18, Recharts, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Testing**: Jest, Supertest

### Folder Structure