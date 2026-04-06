# 🚀 SecureCourse Pro - دليل التشغيل

## ✅ الخادم (Backend)
- **البورت**: `localhost:8000`
- **Swagger Docs**: `localhost:8000/docs`
- **الحالة**: ✅ يعمل الآن

---

## 📱 تشغيل تطبيق Flutter

### 1️⃣ تثبيت المكتبات
```bash
cd mobile
flutter pub get
```

### 2️⃣ تشغيل التطبيق
```bash
# على الـ Emulator
flutter run

# على جهاز حقيقي
flutter run -d <device_id>
```

---

## 🔧 الميزات:

### ✅ الأمان
- ✓ منع لقطات الشاشة
- ✓ جهاز واحد لكل حساب
- ✓ JWT Authentication

### ✅ الألقاء
- ✓ Register/Login
- ✓ Activation Code
- ✓ Course List
- ✓ Video Player

### ✅ الموارد
- ✓ API Service
- ✓ Secure Storage
- ✓ Device Info

---

## 🧪 اختبر الـ API

### Register
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "device_id": "device123",
    "device_info": "Test Device"
  }'
```

### Login
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com&password=Password123&device_id=device123"
```

### Get Courses
```bash
curl -X GET "http://localhost:8000/courses/" \
  -H "Authorization: Bearer <access_token>"
```

---

## 📊 Admin Endpoints

### Create Course
```bash
curl -X POST "http://localhost:8000/admin/courses" \
  -H "Content-Type: application/json" \
  -d '{"title": "Flutter Mastery", "description": "Learn Flutter"}'
```

### Generate Activation Codes
```bash
curl -X POST "http://localhost:8000/admin/codes/generate" \
  -H "Content-Type: application/json" \
  -d '{"course_id": 1, "count": 10}'
```

### Get Stats
```bash
curl "http://localhost:8000/admin/stats"
```

---

## 🐛 مشاكل شائعة

### البورت 8000 مشغول
```bash
Get-Process | Where-Object {$_.Name -like "*python*"} | Stop-Process -Force
```

### مشاكل Flutter
```bash
flutter clean
flutter pub get
flutter run
```

---

## 🎯 الخطوات القادمة

1. ✅ ثبت المكتبات
2. ✅ شغل الخادم
3. ✅ اختبر الـ API
4. ✅ شغل التطبيق على الـ Emulator
5. ✅ اختبر جميع الـ Screens

---

**كل حاجة جاهزة! استمتع! 🎉**
