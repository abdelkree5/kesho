# SecureCourse Pro Admin Dashboard

A professional Next.js admin portal for SecureCourse Pro.

## Features

- Admin login with JWT authentication
- Dashboard stats overview
- Generate activation codes
- Create courses
- Add videos to courses
- Responsive sidebar navigation
- Tailwind CSS styling
- Axios API integration with token handling

## Setup

1. Open `admin-dashboard` folder
2. Run `npm install`
3. Start the dashboard with `npm run dev`
4. Visit `http://localhost:3000`

## Backend API

The dashboard expects the backend API at `http://localhost:8000` by default.

If you need to use a different URL, create a `.env.local` file in `admin-dashboard` with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Notes

- Admin login uses the existing backend `POST /auth/login` endpoint.
- The backend currently supports admin creation and code generation through `/admin/*` routes.
- Course and video listing uses existing endpoints available from the backend.
