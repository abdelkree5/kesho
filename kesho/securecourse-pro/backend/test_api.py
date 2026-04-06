#!/usr/bin/env python3
"""
SecureCourse Pro - Testing Script
اختبر جميع الـ endpoints الرئيسية
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_header(text):
    print(f"\n{Colors.BLUE}{'='*50}{Colors.RESET}")
    print(f"{Colors.BLUE}{text}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*50}{Colors.RESET}")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.RESET}")

def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.RESET}")

def print_info(text):
    print(f"{Colors.YELLOW}→ {text}{Colors.RESET}")

# Test data
test_email = f"test_{datetime.now().timestamp()}@example.com"
test_password = "SecurePassword123!"
test_device_id = "test_device_12345"
test_device_info = "Test Device - Windows"

# Storage for tokens
tokens = {}

def test_register():
    print_header("1️⃣ اختبار التسجيل (Register)")
    
    payload = {
        "email": test_email,
        "password": test_password,
        "device_id": test_device_id,
        "device_info": test_device_info
    }
    
    print_info(f"البريد: {test_email}")
    print_info(f"جهاز: {test_device_id}")
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=payload)
        if response.status_code == 200:
            data = response.json()
            tokens['access'] = data['access_token']
            tokens['refresh'] = data['refresh_token']
            print_success("تم التسجيل بنجاح! ✨")
            print(f"  Token: {data['access_token'][:20]}...")
            return True
        else:
            print_error(f"فشل التسجيل: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print_error(f"خطأ: {str(e)}")
        return False

def test_login():
    print_header("2️⃣ اختبار تسجيل الدخول (Login)")
    
    data = {
        "username": test_email,
        "password": test_password,
        "device_id": test_device_id
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", data=data)
        if response.status_code == 200:
            result = response.json()
            tokens['access'] = result['access_token']
            print_success("تسجيل الدخول نجح! 🔓")
            return True
        else:
            print_error(f"فشل تسجيل الدخول: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"خطأ: {str(e)}")
        return False

def test_get_courses():
    print_header("3️⃣ اختبار الحصول على الكورسات")
    
    headers = {"Authorization": f"Bearer {tokens['access']}"}
    
    try:
        response = requests.get(f"{BASE_URL}/courses/", headers=headers)
        if response.status_code == 200:
            courses = response.json()
            print_success(f"تم جلب {len(courses)} كورس")
            for course in courses:
                print(f"  📚 {course['title']} ({course['videos_count']} فيديوهات)")
            return True
        else:
            print_error(f"فشل جلب الكورسات: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"خطأ: {str(e)}")
        return False

def test_admin_stats():
    print_header("4️⃣ اختبار احصائيات الـ Admin")
    
    try:
        response = requests.get(f"{BASE_URL}/admin/stats")
        if response.status_code == 200:
            stats = response.json()
            print_success("تم جلب الإحصائيات!")
            print(f"  👥 المستخدمين: {stats['users']}")
            print(f"  📚 الكورسات: {stats['courses']}")
            print(f"  🎥 الفيديوهات: {stats['videos']}")
            print(f"  🎁 أكواد التفعيل المستخدمة: {stats['codes_used']}/{stats['codes_total']}")
            return True
        else:
            print_error(f"فشل جلب الإحصائيات: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"خطأ: {str(e)}")
        return False

def test_api_health():
    print_header("🏥 فحص صحة الـ API")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print_success("الـ API يعمل بشكل طبيعي! ✅")
            data = response.json()
            print(f"  الرسالة: {data['message']}")
            return True
        else:
            print_error(f"الـ API لا يستجيب: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("لا يمكن الاتصال بالـ API!")
        print_error("تأكد من تشغيل الخادم: python main.py")
        return False
    except Exception as e:
        print_error(f"خطأ: {str(e)}")
        return False

def main():
    print(f"{Colors.YELLOW}")
    print("""
    ┌─────────────────────────────────────────┐
    │   SecureCourse Pro - API Testing        │
    │   اختبار الـ API الرئيسية               │
    └─────────────────────────────────────────┘
    """)
    print(Colors.RESET)
    
    # Check API health first
    if not test_api_health():
        return
    
    # Run tests
    tests = [
        test_register,
        test_login,
        test_get_courses,
        test_admin_stats
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    # Summary
    print_header("📊 ملخص الاختبارات")
    passed = sum(results)
    total = len(results)
    
    if passed == total:
        print_success(f"نجحت جميع الاختبارات ({total}/{total})! 🎉")
    else:
        print_info(f"نجحت {passed}/{total} اختبارات")

if __name__ == "__main__":
    main()
