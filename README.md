# 🌟 Elkaavie Platform

Fullstack application for room management with 3 integrated components:
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

## 🚀 Key Features

- Multi-role authentication (User & Admin)
- Content management (CRUD operations)
- Protected API endpoints
- Responsive web interface
- Mobile admin panel

## 📂 Folder Structure

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

## 🖥 Local Setup

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

Create `.env` file in backend folder:
```
DB_DATABASE=elkaavie
DB_USERNAME=root
DB_PASSWORD=
APP_KEY=
SANCTUM_STATEFUL_DOMAINS=localhost:8080
```

## 👨💻 Author
- GitHub: [@hashiifabdillah](https://github.com/hashiifab)
- LinkedIn: [Hashiif Abdillah](https://www.linkedin.com/in/hashiif-abdillah-665373297/)