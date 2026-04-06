# 🎉 SecureCourse Pro - التطبيق شغال!

## ✅ الـ Backend شغال الآن

الخادم يشتغل على: **http://localhost:8000**

### الـ API Endpoints المتاحة:
- 📚 `/docs` - Swagger UI (الواجهة التفاعلية)
- 📖 `/redoc` - ReDoc (documentation)
- 🔐 `/auth/register` - التسجيل
- 🔓 `/auth/login` - تسجيل الدخول
- 🎁 `/courses/activate` - تفعيل الكود
- 🎬 `/courses/` - قائمة الكورسات
- 🎥 `/videos/{id}/stream` - دفق الفيديو

---

## 🚀 لتشغيل تطبيق الـ Mobile:

### 1️⃣ **للـ Android**
```bash
cd mobile
flutter pub get
flutter run
```

### 2️⃣ **بأجهزة المحاكاة**
من Android Studio أو:
```bash
flutter emulators --launch Pixel_6_API_30
cd mobile
flutter run
```

---

## 🧪 اختبار سريع للـ API

### أولاً: التسجيل
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "device_id": "device123456",
    "device_info": "Test Device"
  }'
```

### ثانياً: تسجيل الدخول
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=TestPassword123&device_id=device123456"
```

### ثالثاً: الحصول على الكورسات المتاحة
```bash
curl -X GET "http://localhost:8000/courses/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 إنشاء كود تفعيل

```bash
curl -X POST "http://localhost:8000/admin/codes/generate" \
  -H "Content-Type: application/json" \
  -d '{"course_id": 1, "count": 10}'
```

---

## 🌐 هل تريد تشغيل على جهازك الحقيقي؟

### للـ Device الحقيقي:
1. غير `API_BASE_URL` في `mobile/.env`
2. استخدم IP عنوان جهاز الخادم
   ```env
   API_BASE_URL=http://YOUR_IP:8000
   ```

---

## 📱 شاشات التطبيق الموجودة:
✅ Splash Screen  
✅ Login/Register  
✅ Activation Code Entry  
✅ Course List  
✅ Video List & Player  
✅ Profile & Device Info  

---

## 🔒 الأمان المطبق:
🛡️ منع لقطات الشاشة  
🔐 جهاز واحد لكل حساب  
🎥 فيديوهات محمية  
🔑 JWT Tokens  
⏱️ تحديث رموز الوصول التلقائي  

---

## 📝 الملفات المهمة:
- `backend/main.py` - نقطة البداية
- `mobile/lib/main.dart` - تطبيق Flutter
- `docs/setup.md` - التعليمات الكاملة
- `docs/deployment.md` - دليل الإطلاق

استمتع بالنظام! 🎉