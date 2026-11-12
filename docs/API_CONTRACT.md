# قرارداد اولیه API (API Contract)

## ۱. منابع پروژه

### User
| فیلد | نوع | توضیح |
|---|---|---|
| id | integer | شناسه یکتا |
| name | string | نام کاربر |
| email | string | ایمیل یکتا |
| passwordHash | string | هش رمز عبور؛ فقط در پایگاه داده |

### Task
| فیلد | نوع | توضیح |
|---|---|---|
| id | integer | شناسه یکتا |
| title | string | عنوان وظیفه |
| description | string | توضیحات |
| status | string | یکی از pending, in_progress, completed |
| userId | integer | شناسه کاربر مالک وظیفه (کلید خارجی) |

## ۲. Endpointهای Users

| Method | Endpoint | کاربرد | پاسخ موفق |
|---|---|---|---|
| GET | /api/users | دریافت فهرست کاربران | 200 OK |
| GET | /api/users/{id} | دریافت یک کاربر | 200 OK |
| POST | /api/users | ساخت کاربر | 201 Created |
| PUT | /api/users/{id} | جایگزینی اطلاعات کاربر | 200 OK |
| DELETE | /api/users/{id} | حذف کاربر | 204 No Content |

## ۳. Endpointهای Tasks

| Method | Endpoint | کاربرد | پاسخ موفق |
|---|---|---|---|
| GET | /api/tasks | دریافت فهرست وظایف | 200 OK |
| GET | /api/tasks/{id} | دریافت یک وظیفه | 200 OK |
| POST | /api/tasks | ساخت وظیفه | 201 Created |
| PUT | /api/tasks/{id} | ویرایش کامل وظیفه | 200 OK |
| DELETE | /api/tasks/{id} | حذف وظیفه | 204 No Content |
| GET | /api/users/{id}/tasks | دریافت وظایف یک کاربر | 200 OK |

## ۴. کدهای وضعیت HTTP

| Status Code | معنی | موارد استفاده |
|---|---|---|
| 200 | OK | دریافت یا ویرایش موفق |
| 201 | Created | ایجاد موفق منبع |
| 204 | No Content | حذف موفق بدون بدنه پاسخ |
| 400 | Bad Request | داده ورودی نامعتبر |
| 401 | Unauthorized | احراز هویت انجام نشده یا نامعتبر |
| 403 | Forbidden | نداشتن مجوز دسترسی |
| 404 | Not Found | کاربر یا وظیفه پیدا نشد |
| 409 | Conflict | ایمیل تکراری یا تعارض داده |
| 500 | Internal Server Error | خطای پیش‌بینی‌نشده سرور |

## ۵. نمونه درخواست و پاسخ

### ساخت کاربر

**Request — POST /api/users**

~~~json
{
  "name": "Ali",
  "email": "ali@example.com",
  "password": "StrongPassword123"
}
~~~

**Response — 201 Created**

~~~json
{
  "id": 1,
  "name": "Ali",
  "email": "ali@example.com"
}
~~~

رمز عبور خام یا هش آن در پاسخ API برگردانده نمی‌شود.

### ساخت وظیفه

**Request — POST /api/tasks**

~~~json
{
  "title": "Learn REST API",
  "description": "Study HTTP methods and status codes",
  "status": "pending",
  "userId": 1
}
~~~

**Response — 201 Created**

~~~json
{
  "id": 101,
  "title": "Learn REST API",
  "description": "Study HTTP methods and status codes",
  "status": "pending",
  "userId": 1
}
~~~

## ۶. قوانین و اعتبارسنجی

- ایمیل هر کاربر باید یکتا و معتبر باشد.
- فیلدهای name, email, password هنگام ساخت کاربر الزامی‌اند.
- عنوان وظیفه (title) و userId الزامی‌اند.
- مقدار status فقط می‌تواند pending, in_progress یا completed باشد.
- userId باید به کاربر موجود اشاره کند.
- کاربر فقط مجاز به مشاهده یا تغییر وظایف متعلق به خودش است (مگر نقش مدیریتی تعریف شود).
- رمز عبور باید با الگوریتم امن و مناسب هش شود.

## ۷. رابطه منابع

رابطه‌ی Users و Tasks از نوع **One-to-Many (یک به چند)** است:
یک User می‌تواند صفر یا چند Task داشته باشد؛ هر Task دقیقاً به یک User تعلق دارد.
