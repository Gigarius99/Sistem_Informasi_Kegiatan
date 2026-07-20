# Sistem Informasi Daftar Kegiatan Kantor

Aplikasi web **production-ready** untuk mengelola dan memantau agenda kegiatan pimpinan kantor secara digital. Dibangun dengan Next.js 15 App Router, PostgreSQL (Neon.tech), dan NextAuth v5.

---

## 🚀 Fitur Utama

- ✅ **Autentikasi** — Login dengan username & password (NextAuth v5 + bcrypt)
- ✅ **Role-Based Access Control** — Admin (CRUD) dan Atasan (read-only)
- ✅ **Dashboard** — Statistik kegiatan (hari ini, minggu ini, bulan ini, total)
- ✅ **CRUD Kegiatan** — Tambah, lihat, edit, hapus kegiatan (Admin)
- ✅ **Pencarian & Filter** — Cari berdasarkan judul, lokasi, dresscode + filter tanggal
- ✅ **Export Excel** — Export .xlsx dengan format & styling profesional (ExcelJS)
- ✅ **Riwayat Aktivitas** — Audit log CREATE/UPDATE/DELETE
- ✅ **Dark/Light Mode** — Toggle tema gelap/terang
- ✅ **Responsif** — Desktop, tablet, dan mobile
- ✅ **Tanggal Indonesia** — Format "Selasa, 14 Juli 2026" otomatis

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Server Components |
| Database | PostgreSQL (Neon.tech Serverless) + Prisma ORM |
| Auth | NextAuth v5 (Auth.js) + bcryptjs |
| Export | ExcelJS |
| Testing | Jest + Playwright |
| Deploy | Vercel (utama) + Cloudflare Pages (alternatif) |

---

## 🌐 Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Neon.tech     │    │     Vercel      │    │   Cloudflare    │
│   PostgreSQL    │◄──►│  (Full-stack    │    │   Pages (CDN/   │
│   Serverless    │    │   Next.js)      │    │   alternatif)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📋 Prasyarat

- Node.js 20+
- npm 11+
- Akun [Neon.tech](https://neon.tech) (database)
- Akun [Vercel](https://vercel.com) (deployment)

---

## 🔧 Instalasi Lokal

### 1. Clone dan Install

```bash
cd kegiatan-kantor
npm install
```

### 2. Konfigurasi Environment

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Database Neon.tech (dengan connection pooling)
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connection_limit=1"

# Direct URL untuk migration (tanpa pooling)
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth (generate dengan: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Jalankan Migration

```bash
# Development (membuat migration baru)
npm run db:migrate:dev

# Production (deploy migration yang sudah ada)
npm run db:migrate
```

### 5. Jalankan Seeder

```bash
npm run db:seed
```

Akun default yang dibuat:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Atasan | `atasan` | `atasan123` |

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing

### Unit & Integration Tests (Jest)

```bash
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Install browsers (pertama kali)
npx playwright install

# Pastikan dev server berjalan, lalu:
npm run test:e2e

# Dengan UI
npm run test:e2e:ui
```

---

## 🚀 Deployment

### A. Deploy ke Vercel (Direkomendasikan)

1. **Push ke GitHub**
2. **Import project di Vercel Dashboard**
3. **Tambahkan Environment Variables:**
   - `DATABASE_URL` — Connection pooling URL dari Neon.tech
   - `DIRECT_URL` — Direct URL dari Neon.tech
   - `NEXTAUTH_SECRET` — Random string (min 32 karakter)
   - `NEXTAUTH_URL` — URL deployment Vercel (auto-filled)
4. **Deploy!**

```bash
# Atau via CLI
npx vercel --prod
```

### B. Deploy ke Cloudflare Pages

> ⚠️ **Catatan:** Fitur Export Excel tidak tersedia di Cloudflare Pages (butuh Node.js runtime). Gunakan Vercel untuk fitur lengkap.

1. **Install adapter:**
   ```bash
   npm install -D @cloudflare/next-on-pages
   ```

2. **Build untuk Cloudflare:**
   ```bash
   npx @cloudflare/next-on-pages
   ```

3. **Deploy:**
   ```bash
   npx wrangler pages deploy .vercel/output/static
   ```

### C. Deploy dengan Docker (VPS/Self-hosted)

```bash
# Clone dan configure .env
cp .env.example .env
# Edit .env dengan kredensial production Anda

# Build dan run dengan Docker Compose
docker-compose up -d

# Jalankan migration
docker exec kegiatan-kantor-app npx prisma migrate deploy

# Jalankan seed (opsional)
docker exec kegiatan-kantor-app npm run db:seed
```

---

## 📁 Struktur Project

```
kegiatan-kantor/
├── app/                      # Next.js App Router
│   ├── (auth)/login/         # Halaman login
│   ├── (dashboard)/          # Halaman dashboard (protected)
│   │   ├── dashboard/        # Dashboard utama
│   │   ├── kegiatan/         # Daftar, tambah, edit kegiatan
│   │   ├── riwayat/          # Audit log (Admin)
│   │   └── export/           # Export Excel (Admin)
│   └── api/                  # API Routes
│       ├── auth/             # NextAuth handler
│       ├── activities/       # CRUD API
│       ├── export/excel/     # Export API
│       └── health/           # Health check
├── components/               # React components
│   ├── auth/                 # Login form
│   ├── dashboard/            # Stats cards
│   ├── kegiatan/             # Activity components
│   ├── riwayat/              # Audit log table
│   ├── export/               # Export form
│   └── shared/               # Sidebar, Navbar, ThemeToggle
├── lib/                      # Utilities
│   ├── auth.ts               # NextAuth config
│   ├── db.ts                 # Prisma + Neon adapter
│   ├── utils.ts              # Date formatting, helpers
│   ├── validations.ts        # Zod schemas
│   └── export.ts             # ExcelJS logic
├── prisma/                   # Database
│   ├── schema.prisma         # Schema
│   ├── migrations/           # SQL migrations
│   └── seed.ts               # Seed data
├── types/                    # TypeScript types
├── __tests__/                # Unit & component tests
├── e2e/                      # Playwright E2E tests
├── middleware.ts             # RBAC middleware
├── vercel.json               # Vercel config
├── wrangler.toml             # Cloudflare config
├── Dockerfile                # Docker build
├── docker-compose.yml        # Docker Compose
└── .env.example              # Environment template
```

---

## 🔐 Keamanan

- Password di-hash dengan **bcryptjs** (rounds: 12)
- Session JWT dengan **NextAuth v5**
- **RBAC Middleware** — melindungi semua rute sensitif
- **XSS Protection** — headers di next.config.ts
- **SQL Injection Protection** — Prisma ORM
- **CSRF Protection** — NextAuth built-in
- **Input Sanitization** — Zod validation

---

## 📊 Database Schema

### users
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | TEXT | Primary key (cuid) |
| name | TEXT | Nama lengkap |
| username | TEXT | Username unik |
| password | TEXT | bcrypt hash |
| role | Enum | ADMIN / ATASAN |

### activities
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | TEXT | Primary key (cuid) |
| title | TEXT | Judul kegiatan |
| activity_date | TIMESTAMP | Tanggal kegiatan |
| location | TEXT | Lokasi utama |
| transit_location | TEXT? | Lokasi transit (opsional) |
| dresscode | TEXT | Kode pakaian |
| invitation_time | TEXT | Jam undangan (HH:MM) |
| description | TEXT? | Keterangan (opsional) |
| created_by | TEXT | FK → users.id |

### activity_logs
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | TEXT | Primary key |
| user_id | TEXT | FK → users.id |
| activity_id | TEXT | FK → activities.id |
| action | Enum | CREATE/UPDATE/DELETE_ACTIVITY |

---

## 🔗 API Endpoints

| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| GET | /api/health | Public | Health check |
| POST | /api/auth/[...nextauth] | Public | Login/Logout |
| GET | /api/activities | Admin+Atasan | List kegiatan |
| POST | /api/activities | Admin | Tambah kegiatan |
| GET | /api/activities/:id | Admin+Atasan | Detail kegiatan |
| PUT | /api/activities/:id | Admin | Edit kegiatan |
| DELETE | /api/activities/:id | Admin | Hapus kegiatan |
| GET | /api/export/excel | Admin | Export Excel |

---

## 📝 Changelog

### v1.0.0
- Initial release
- CRUD kegiatan dengan validasi lengkap
- Role-based access (Admin & Atasan)
- Export Excel dengan ExcelJS
- Dashboard statistik
- Dark/Light mode
- Deployment: Vercel + Neon.tech + Cloudflare Pages

---

## 📞 Dukungan

Hubungi administrator sistem jika mengalami kendala dalam menggunakan aplikasi ini.

&copy; 2026 Sistem Informasi Daftar Kegiatan Kantor. All rights reserved.
