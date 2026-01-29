# BOQ Task Management - Backend API

Professional NestJS backend API with Prisma ORM and PostgreSQL for Badar Expo Solutions event management system.

## 🚀 Tech Stack

- **Framework:** NestJS 10
- **Database:** PostgreSQL
- **ORM:** Prisma 5
- **Authentication:** JWT (Passport)
- **Language:** TypeScript
- **Validation:** class-validator

## 📋 Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

## 🛠️ Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/GhufranNaseer/BOQ-Backend.git
cd BOQ-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

**Create PostgreSQL Database:**

```sql
CREATE DATABASE boq_db;
```

### 4. Environment Configuration

Create `.env.development` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boq_db"
JWT_SECRET="development-secret-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
SEED_ADMIN_EMAIL="admin@badarexpo.com"
SEED_ADMIN_PASSWORD="Admin@123"
SEED_TECH_PASSWORD="Tech@123"
SEED_LOGISTICS_PASSWORD="Logistics@123"
SEED_OPERATIONS_PASSWORD="Operations@123"
SEED_HR_PASSWORD="Hr@123"
```

### 5. Run Prisma Migrations

```bash
npm run prisma:migrate
```

### 6. Seed Database

```bash
npm run prisma:seed
```

This creates:
- Admin user
- 4 Departments (Technical, Logistics, Operations, HR)
- Department users

### 7. Start Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Verify Build

After building, check that `dist/src/main.js` exists:

```bash
ls dist/src/main.js
```

## 🌍 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT signing | ✅ | 64+ character random string |
| `JWT_EXPIRES_IN` | JWT expiration time | ✅ | `7d` |
| `PORT` | Server port | ✅ | `3000` |
| `NODE_ENV` | Environment mode | ✅ | `development` or `production` |
| `FRONTEND_URL` | CORS whitelist (comma-separated) | ✅ | `https://yourdomain.com` |
| `SEED_*_PASSWORD` | Initial user passwords | ✅ | Strong passwords |

See `.env.production.example` for production template.

## 🚢 Hostinger Deployment

### Prerequisites

- Hostinger account with Node.js App hosting
- PostgreSQL database access
- Domain/subdomain configured

### Deployment Steps

#### Step 1: Create PostgreSQL Database

1. Log in to Hostinger
2. Navigate to: Databases → PostgreSQL
3. Create database: `boq_production`
4. Save connection details

**Construct DATABASE_URL:**
```
postgresql://<username>:<password>@<host>:5432/boq_production?sslmode=require
```

#### Step 2: Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Save this 128-character string for environment variables.

#### Step 3: Create Node.js App

1. Navigate to: Hosting → Node.js Apps
2. Click "Create Application"
3. Application name: `BOQ Backend API`
4. Node.js version: 18.x or higher

#### Step 4: Git Import

- Repository URL: `https://github.com/GhufranNaseer/BOQ-Backend.git`
- Branch: `main`
- Application root: `/`

#### Step 5: Build & Start Commands

**Build Command:**
```bash
npm install && npm run build && npx prisma generate
```

**Start Command:**
```bash
node dist/main.js
```

> **Important:** The start command uses `node dist/src/main` (NOT `dist/main`)
> **Important:** The start command should be `node dist/main.js` (or use `npm start`).

#### Step 6: Environment Variables

Add these in Hostinger Environment Variables:

```env
DATABASE_URL=postgresql://user:pass@host:5432/boq_production?sslmode=require
JWT_SECRET=<your-128-character-secret>
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://boq.yourdomain.com
SEED_ADMIN_EMAIL=admin@badarexpo.com
SEED_ADMIN_PASSWORD=<strong-password>
SEED_TECH_PASSWORD=<strong-password>
SEED_LOGISTICS_PASSWORD=<strong-password>
SEED_OPERATIONS_PASSWORD=<strong-password>
SEED_HR_PASSWORD=<strong-password>
```

#### Step 7: Deploy

1. Click "Deploy"
2. Monitor build logs
3. Check for "🚀 BOQ Backend API running on..." message

#### Step 8: Configure Domain

1. Set up subdomain: `api.boq.yourdomain.com`
2. Point to Node.js app
3. Wait for DNS propagation (5-30 minutes)

#### Step 9: Verify Deployment

Test the API:

```bash
curl https://api.boq.yourdomain.com/api
```

#### Step 10: Update CORS

After frontend deployment, update `FRONTEND_URL` to actual frontend domain and restart.

## 📁 Project Structure

```
src/
├── assignments/       # Task assignment module
├── auth/             # Authentication & authorization
│   ├── decorators/   # Custom decorators
│   ├── guards/       # Auth guards
│   └── strategies/   # Passport strategies
├── common/           # Shared utilities
│   ├── filters/      # Exception filters
│   └── interceptors/ # Request interceptors
├── departments/      # Department management
├── events/           # Event management
├── prisma/           # Prisma service
├── tasks/            # Task management
│   └── csv-parser   # CSV upload handling
├── users/            # User management
└── main.ts          # Application entry point

prisma/
├── migrations/       # Database migrations
├── schema.prisma    # Prisma schema
└── seed.ts          # Database seeding
```

## 🔑 API Endpoints

All endpoints are prefixed with `/api`

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Events (Admin)
- `GET /api/events` - List all events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `DELETE /api/events/:id` - Delete event

### Tasks (Admin)
- `POST /api/tasks/upload-csv` - Upload BOQ CSV
- `GET /api/tasks/event/:eventId` - Get tasks by event

### Assignments (Admin)
- `POST /api/assignments` - Create assignment
- `GET /api/assignments/user/:userId` - Get user assignments

### Departments
- `GET /api/departments` - List departments

### Users (Admin)
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user details

## 🧪 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start development server
 with watch mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Run production build |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:deploy` | Deploy migrations (production) |
| `npm run prisma:seed` | Seed database with initial data |
| `npm test` | Run unit tests |
| `npm run lint` | Run ESLint |

## 🔧 Database Management

### Create Migration

```bash
npm run prisma:migrate
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

### View Database

```bash
npx prisma studio
```

## 🐛 Troubleshooting

### Build Fails on Hostinger

**Issue:** Build command fails  
**Solution:** Verify build command includes `npx prisma generate`

### Migration Fails

**Issue:** `prisma migrate deploy` fails  
**Solution:** Check DATABASE_URL and ensure database exists

### "Cannot find module 'dist/main'" Error

**Issue:** Start command looking for wrong file  
**Solution:** Use `node dist/src/main` NOT `node dist/main`

### Prisma Client Not Found

**Issue:** `@prisma/client` not found  
**Solution:** Run `npx prisma generate` after build

### CORS Errors

**Issue:** Frontend cannot connect  
**Solution:** Update `FRONTEND_URL` and restart app

### Connection Refused

**Issue:** Cannot connect to database  
**Solution:** Verify DATABASE_URL and check Hostinger PostgreSQL settings

## 🔐 Security Best Practices

1. ✅ Use strong JWT_SECRET (min 64 characters)
2. ✅ Change all default passwords immediately
3. ✅ Use `sslmode=require` for database connections
4. ✅ Never commit `.env` files
5. ✅ Use environment-specific configurations
6. ✅ Regularly update dependencies

## 📞 Support

For issues or questions:
- Check [Frontend Repository](https://github.com/GhufranNaseer/BOQ-Frontend)
- Review Hostinger application logs
- Verify database connection
- Check environment variables

## 📄 License

Private - Badar Expo Solutions

---

**Related Repositories:**
- [Frontend Application](https://github.com/GhufranNaseer/BOQ-Frontend)
