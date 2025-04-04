# 🌟 Elkaavie Platform

Aplikasi fullstack untuk manajemen kamar dengan 3 bagian terintegrasi:
- **Backend**: Laravel (PHP)
- **Frontend**: React + TypeScript
- **Admin Panel**: Flutter (Mobile)

## 🛠 Tech Stack

**Backend**:
- Laravel 10
- MySQL
- REST API
- Laravel Sanctum (Authentication)

**Frontend**:
- React 18
- TypeScript
- Tailwind CSS
- Axios

**Admin**:
- Flutter 3
- Dart 3
- Riverpod (State Management)
- Dio (HTTP Client)

## 🚀 Fitur Utama

- Autentikasi multi-role (User & Admin)
- Manajemen konten (CRUD operations)
- API endpoints terproteksi
- Responsive web interface
- Mobile admin panel

## 📂 Struktur Folder

```
elkaavie/
├── backend/      # Laravel (API & Core Logic)
│   ├── app/      
│   ├── config/   
│   └── routes/   
├── frontend/     # React (Web Interface)
│   ├── src/
│   │   ├── pages/
│   │   └── components/
└── admin/        # Flutter (Mobile Admin)
    ├── lib/
    └── test/
```

## 🖥 Menjalankan Lokal

**Backend (Laravel):**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

**Frontend (React):**
```bash
cd frontend
npm install
npm run dev
```

**Admin (Flutter):**
```bash
cd admin
flutter pub get
flutter run
```

## 🔑 Environment Variables

Buat file `.env` di folder backend:
```
DB_DATABASE=elkaavie
DB_USERNAME=root
DB_PASSWORD=
APP_KEY=
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

## 👨💻 Penulis
- GitHub: [@hashiifabdillah](https://github.com/hashiifab)
- LinkedIn: [Hashiif Abdillah](https://www.linkedin.com/in/hashiif-abdillah-665373297/)