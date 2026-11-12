# دیاگرام معماری

~~~mermaid
flowchart TD
    A[Client / Frontend] -->|HTTP JSON| B[REST API]
    B --> C[Authentication & Validation]
    C --> D[Users Controller]
    C --> E[Tasks Controller]
    D --> F[Users Service]
    E --> G[Tasks Service]
    F --> H[(Database)]
    G --> H
    H --> I[Users Table]
    H --> J[Tasks Table]
    J -->|userId foreign key| I
    D -->|JSON Response| A
    E -->|JSON Response| A
~~~

## شرح جریان
1. کلاینت درخواست HTTP را با بدنه یا هدرهای لازم ارسال می‌کند.
2. لایه API درخواست را دریافت می‌کند؛ احراز هویت و اعتبارسنجی انجام می‌شود.
3. درخواست به کنترلر Users یا Tasks می‌رسد.
4. سرویس مربوطه منطق برنامه را اجرا و با پایگاه داده تعامل می‌کند.
5. پاسخ JSON همراه با Status Code مناسب به کلاینت بازگردانده می‌شود.

## رابطه پایگاه داده

Users (1) ---- (N) Tasks

ستون Tasks.userId کلید خارجی به Users.id است.
