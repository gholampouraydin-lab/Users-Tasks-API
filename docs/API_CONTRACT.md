# قرارداد API (مطابق پیاده‌سازی)

پایه مسیرها: `/api` — قالب داده: JSON.

## منابع
- **User**: `id`, `name`, `email`, `passwordHash` (فقط در پایگاه داده)
- **Task**: `id`, `title`, `description`, `status`, `userId`, `createdAt`, `updatedAt`

هر کاربر می‌تواند چند وظیفه داشته باشد (One-to-Many). هر وظیفه به مالک خود تعلق دارد.

## Endpointها

| Method | Endpoint | احراز هویت | پاسخ موفق |
|---|---|---|---|
| GET | `/health` | خیر | 200 |
| POST | `/api/auth/register` | خیر | 201 |
| POST | `/api/auth/login` | خیر | 200 |
| GET | `/api/auth/me` | Bearer JWT | 200 |
| GET | `/api/users` | Bearer JWT | 200 |
| GET | `/api/users/{id}` | Bearer JWT؛ فقط پروفایل خود | 200 |
| PUT | `/api/users/{id}` | Bearer JWT؛ فقط پروفایل خود | 200 |
| DELETE | `/api/users/{id}` | Bearer JWT؛ فقط حساب خود | 204 |
| GET | `/api/tasks` | Bearer JWT | 200 |
| GET | `/api/tasks/{id}` | Bearer JWT؛ فقط وظیفه خود | 200 |
| POST | `/api/tasks` | Bearer JWT | 201 |
| PUT | `/api/tasks/{id}` | Bearer JWT؛ فقط وظیفه خود | 200 |
| DELETE | `/api/tasks/{id}` | Bearer JWT؛ فقط وظیفه خود | 204 |
| GET | `/api/tasks/user/{userId}` | Bearer JWT؛ فقط وظایف خود | 200 |

## ساخت کاربر

**POST /api/auth/register**

~~~json
{
  "name": "Ali",
  "email": "ali@example.com",
  "password": "StrongPass123"
}
~~~

پاسخ `201 Created` شامل `user` و `token` است. رمز عبور در پاسخ بازگردانده نمی‌شود. حداقل طول رمز عبور ۸ کاراکتر است.

## ورود

**POST /api/auth/login**

~~~json
{
  "email": "ali@example.com",
  "password": "StrongPass123"
}
~~~

پاسخ `200 OK` شامل کاربر عمومی و JWT است.

## ساخت وظیفه

**POST /api/tasks** — نیازمند هدر `Authorization: Bearer <token>`

~~~json
{
  "title": "Learn REST API",
  "description": "Practice endpoints",
  "status": "pending"
}
~~~

شناسه مالک از JWT گرفته می‌شود و کلاینت نمی‌تواند وظیفه را به کاربر دیگری نسبت دهد.

وضعیت‌های مجاز: `pending`, `in_progress`, `completed`.

## Status Codeها

| کد | معنی | نمونه |
|---|---|---|
| 200 | OK | دریافت یا ویرایش موفق |
| 201 | Created | ثبت‌نام یا ایجاد وظیفه |
| 204 | No Content | حذف موفق |
| 400 | Bad Request | ورودی نامعتبر یا فیلد الزامی مفقود |
| 401 | Unauthorized | توکن مفقود/نامعتبر یا ورود ناموفق |
| 403 | Forbidden | تلاش برای دسترسی به منبع کاربر دیگر |
| 404 | Not Found | کاربر، وظیفه یا مسیر پیدا نشد |
| 409 | Conflict | ایمیل تکراری |
| 500 | Internal Server Error | خطای پیش‌بینی‌نشده سرور |

## اعتبارسنجی و امنیت
- ایمیل باید معتبر و یکتا باشد.
- رمز عبور با bcrypt هش می‌شود.
- JWT برای مسیرهای محافظت‌شده لازم است.
- کاربر فقط وظایف خودش را می‌بیند، ویرایش می‌کند یا حذف می‌کند.
- حذف کاربر، وظایف او را نیز به‌واسطه کلید خارجی و `ON DELETE CASCADE` حذف می‌کند.
