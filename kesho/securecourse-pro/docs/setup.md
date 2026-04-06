# SecureCourse Pro - Setup Instructions

## Overview
SecureCourse Pro is a premium protected learning platform with enterprise-level security features.

## Prerequisites
- Python 3.9+
- Flutter 3.0+
- PostgreSQL 13+
- Android Studio (for Android development)

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Database Setup
```bash
# Install PostgreSQL and create database
createdb securecourse

# Run migration
psql -d securecourse -f ../database/migrations/001_initial_schema.sql
```

### 3. Environment Variables
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://user:password@localhost/securecourse
SECRET_KEY=your-super-secret-key-here
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_KEY=your-aws-secret-key
S3_BUCKET=your-s3-bucket
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
```

### 4. Run Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Mobile App Setup

### 1. Install Dependencies
```bash
cd mobile
flutter pub get
```

### 2. Configure Environment
Update `.env` file with your backend URL:
```env
API_BASE_URL=http://10.0.2.2:8000  # For Android emulator
# API_BASE_URL=http://localhost:8000  # For iOS simulator
```

### 3. Security Configuration
- The app is configured to prevent screenshots using FLAG_SECURE
- Video player prevents fullscreen mode
- Device binding ensures one device per account

### 4. Run App
```bash
flutter run
```

## Production Deployment

### Backend Deployment
1. Use a production WSGI server like Gunicorn
2. Set up PostgreSQL with proper security
3. Configure HTTPS with SSL certificates
4. Set up proper environment variables
5. Use a reverse proxy like Nginx

### Mobile App Deployment
1. Build release APK/AAB
2. Configure app signing
3. Set up code obfuscation
4. Deploy to Google Play Store

## Security Features

### Screenshot Protection
- Android: FLAG_SECURE prevents screenshots
- iOS: Prevents screen recording

### Video Protection
- HLS streaming with signed URLs
- URLs expire in 2-5 minutes
- No direct video file access

### Account Security
- Device binding (one device per account)
- JWT tokens with refresh mechanism
- Password hashing with bcrypt

### API Security
- Rate limiting
- Input validation
- Secure headers
- CORS configuration

## Admin Features

### Generate Activation Codes
```bash
curl -X POST "http://localhost:8000/admin/codes/generate" \
  -H "Content-Type: application/json" \
  -d '{"course_id": 1, "count": 10}'
```

### View Statistics
```bash
curl "http://localhost:8000/admin/stats"
```

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Mobile Tests
```bash
cd mobile
flutter test
```

## Monitoring & Logging

The backend includes comprehensive logging for:
- Authentication attempts
- Video access requests
- Activation code usage
- Security violations

## Support

For production deployment and enterprise features, contact the development team.