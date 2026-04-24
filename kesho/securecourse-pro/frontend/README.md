# SecureCourse Pro — Frontend

## 🚀 تشغيل محلياً

```bash
# 1. ادخل على المجلد
cd securecourse-frontend

# 2. ثبّت الحزم
npm install

# 3. شغّل التطبيق
npm run dev

# افتح المتصفح على:
# http://localhost:5173
```

## 🔐 تسجيل الدخول

- أي إيميل + أي باسورد = مستخدم عادي
- إيميل يحتوي على "admin" = أدمن (يظهر إعدادات الدفع في القائمة)

## ☁️ الرفع على Vercel

```bash
# 1. ثبّت Vercel CLI
npm install -g vercel

# 2. ابنِ المشروع
npm run build

# 3. ارفعه
vercel

# 4. أضف المتغير في Vercel Dashboard:
# VITE_API_URL = https://progekt-production.up.railway.app
```

أو ارفع على Vercel من GitHub مباشرة:
1. ارفع المشروع على GitHub
2. روح vercel.com → New Project → اختار الـ repo
3. في Environment Variables أضف: VITE_API_URL
4. اضغط Deploy ✅

## 📁 هيكل المشروع

```
src/
├── pages/
│   ├── Login.jsx        ← صفحة الدخول
│   ├── Register.jsx     ← صفحة التسجيل
│   ├── Dashboard.jsx    ← الداشبورد + الشارتات
│   ├── Courses.jsx      ← الكورسات
│   ├── Payment.jsx      ← طرق الدفع
│   ├── AdminPayment.jsx ← إعدادات الدفع (أدمن)
│   ├── Settings.jsx     ← الإعدادات
│   └── Pricing.jsx      ← صفحة الأسعار
├── components/
│   └── DashboardLayout.jsx ← الـ Sidebar + Navbar
├── services/
│   └── api.js           ← كل API calls
├── store/
│   └── index.js         ← Zustand (Auth + Theme)
└── App.jsx              ← الـ Routes
```
