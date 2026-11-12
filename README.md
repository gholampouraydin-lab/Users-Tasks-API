# Users & Tasks API

یک REST API با Node.js، Express و SQLite برای مدیریت کاربران و وظایف؛ آماده برای اجرای محلی.

## فناوری‌ها
- Node.js 18+
- Express
- SQLite (better-sqlite3)
- bcryptjs برای هش امن رمز عبور
- JSON Web Token برای احراز هویت
- Helmet و CORS

## راه‌اندازی

1. مخزن را Clone کنید:
   ```bash
   git clone https://github.com/gholampouraydin-lab/Users-Tasks-API.git
   cd Users-Tasks-API
   ```
2. وابستگی‌ها را نصب کنید:
   ```bash
   npm install
   ```
3. فایل نمونه تنظیمات را کپی کنید و JWT_SECRET را با یک مقدار تصادفی طولانی (حداقل ۳۲ کاراکتر) جایگزین کنید:
   ```bash
   cp .env.example .env
   ```
4. سرور را اجرا کنید:
   ```bash
   npm start
   ```
   سرور روی http://localhost:3000 اجرا می‌شود. پایگاه داده SQLite به‌صورت خودکار در پوشه data ساخته می‌شود.

برای حالت توسعه: `npm run dev`

## مسیرهای API

| Method | Endpoint | نیاز به Token | توضیح |
|---|---|---:|---|
| GET | /health | خیر | بررسی سلامت سرور |
| POST | /api/auth/register | خیر | ثبت‌نام کاربر |
| POST | /api/auth/login | خیر | ورود و دریافت JWT |
| GET | /api/auth/me | بله | اطلاعات حساب فعلی |
| GET | /api/users | بله | فهرست کاربران |
| GET | /api/users/:id | بله | مشاهده پروفایل خود |
| PUT | /api/users/:id | بله | ویرایش پروفایل خود |
| DELETE | /api/users/:id | بله | حذف حساب خود |
| GET | /api/tasks | بله | فهرست وظایف خود |
| GET | /api/tasks/:id | بله | مشاهده وظیفه خود |
| POST | /api/tasks | بله | ایجاد وظیفه |
| PUT | /api/tasks/:id | بله | ویرایش وظیفه خود |
| DELETE | /api/tasks/:id | بله | حذف وظیفه خود |
| GET | /api/tasks/user/:userId | بله | وظایف کاربر فعلی |

برای مسیرهای محافظت‌شده، هدر زیر را ارسال کنید:
`Authorization: Bearer YOUR_TOKEN`

## نمونه درخواست‌ها

ثبت‌نام:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali","email":"ali@example.com","password":"StrongPass123"}'
```

ساخت وظیفه (توکن را جایگزین کنید):
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Learn REST API","description":"Practice endpoints","status":"pending"}'
```

وضعیت‌های مجاز وظیفه: `pending`, `in_progress`, `completed`.

## ساختار پروژه
- `src/server.js`: نقطه شروع سرور
- `src/app.js`: پیکربندی Express و مسیرها
- `src/db.js`: اتصال و ساخت جداول SQLite
- `src/middleware/auth.js`: اعتبارسنجی JWT
- `src/routes/auth.js`: ثبت‌نام، ورود و پروفایل
- `src/routes/users.js`: عملیات کاربران
- `src/routes/tasks.js`: عملیات وظایف
- `docs/API_CONTRACT.md`: قرارداد API و Status Codeها
- `docs/architecture.md`: دیاگرام معماری
- `openapi.yaml`: مشخصات OpenAPI

## نکات امنیتی
- رمز عبور به کمک bcrypt هش می‌شود و در پاسخ API برگردانده نمی‌شود.
- وظایف فقط برای مالک آن‌ها قابل مشاهده و تغییر هستند.
- فایل .env و پایگاه داده در Git ثبت نمی‌شوند.
- قبل از انتشار، JWT_SECRET قوی و تصادفی تنظیم کنید.

## مستندات فعالیت ۳
- [قرارداد API](docs/API_CONTRACT.md)
- [دیاگرام معماری](docs/architecture.md)
- [OpenAPI](openapi.yaml)
