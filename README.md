# Eduvos Mbombela — Academic Support & Tutoring Platform

A full-featured React frontend for the Eduvos Mbombela academic tutoring platform.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Set your Django backend URL in .env
VITE_API_BASE_URL=http://localhost:8000

# 4. Start development server
npm run dev
```

App runs at: **http://localhost:3000**

---

## 📁 Project Structure

```
eduvos-platform/
├── public/
├── src/
│   ├── main.jsx                         # App entry point
│   ├── App.jsx                          # Root component & portal router
│   ├── styles/
│   │   └── global.css                   # Design system & Eduvos branding
│   │
│   ├── services/                        # ← ALL API calls live here
│   │   ├── authService.js               # /api/auth/ endpoints
│   │   ├── tutorService.js              # /api/tutors/ endpoints
│   │   ├── bookingService.js            # /api/bookings/ endpoints
│   │   ├── messagingService.js          # /api/messages/ endpoints
│   │   └── adminService.js             # /api/admin/ + /api/ratings/ endpoints
│   │
│   └── components/
│       ├── LandingPage.jsx              # Public landing page
│       │
│       ├── shared/                      # Reusable components
│       │   ├── UIComponents.jsx         # Modal, Badge, StarRating, StatCard...
│       │   ├── Sidebar.jsx              # Shared sidebar navigation
│       │   └── AuthPage.jsx             # Shared login/register page
│       │
│       ├── StudentPortal/
│       │   ├── StudentPortal.jsx        # Portal shell & routing
│       │   ├── StudentDashboard.jsx     # Dashboard overview
│       │   ├── TutorSearch.jsx          # Search & filter tutors
│       │   ├── TutorProfile.jsx         # Tutor detail + booking modal
│       │   ├── StudentBookings.jsx      # Booking management + messages
│       │   └── StudentMessages.jsx      # (re-export)
│       │
│       ├── TutorPortal/
│       │   ├── TutorPortal.jsx          # Portal shell & routing
│       │   ├── TutorDashboard.jsx       # Dashboard + bookings + availability + messages
│       │   ├── TutorBookings.jsx        # (re-export)
│       │   ├── TutorProfileManager.jsx  # (re-export)
│       │   ├── TutorAvailability.jsx    # (re-export)
│       │   └── TutorMessages.jsx        # (re-export)
│       │
│       └── AdminDashboard/
│           ├── AdminDashboard.jsx       # Dashboard shell & routing
│           ├── AdminOverview.jsx        # Stats & activity feed
│           ├── AdminUsers.jsx           # User management table
│           ├── AdminBookings.jsx        # All bookings + AdminReports
│           └── AdminReports.jsx         # (re-export)
│
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#003366` | Primary brand — headers, sidebar, buttons |
| `--sky` | `#00AEEF` | Accent — CTAs, badges, links |
| `--font-display` | Playfair Display | Headings, titles |
| `--font-body` | DM Sans | All body text |

---

## 🔌 Django API Endpoints

All API calls are located in `src/services/`. Comments in each file indicate exactly where each call maps to.

### Auth — `authService.js`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register student or tutor |
| POST | `/api/auth/login/` | Login, returns JWT tokens |
| POST | `/api/auth/logout/` | Invalidate refresh token |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET | `/api/auth/me/` | Get current user |
| PATCH | `/api/auth/change-password/` | Change password |

### Tutors — `tutorService.js`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tutors/` | List/search tutors (filters: subject, grade, location) |
| GET | `/api/tutors/:id/` | Get tutor profile |
| GET | `/api/tutors/me/` | Get own profile (tutor) |
| POST | `/api/tutors/` | Create tutor profile |
| PATCH | `/api/tutors/:id/` | Update tutor profile |
| PATCH | `/api/tutors/:id/availability/` | Update availability slots |
| GET | `/api/tutors/:id/ratings/` | Get tutor ratings |

### Bookings — `bookingService.js`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/` | List bookings (filtered by user role) |
| GET | `/api/bookings/:id/` | Get single booking |
| POST | `/api/bookings/` | Create booking request |
| PATCH | `/api/bookings/:id/` | Update status (accepted/rejected/cancelled) |
| DELETE | `/api/bookings/:id/` | Cancel booking |

### Messaging — `messagingService.js`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/conversations/` | List conversations |
| GET | `/api/messages/?conversation_id=:id` | Get messages |
| POST | `/api/messages/` | Send message |
| PATCH | `/api/messages/:id/read/` | Mark as read |

### Ratings — `adminService.js`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ratings/` | Submit rating & review |
| GET | `/api/ratings/?tutor_id=:id` | Get tutor ratings |

### Admin — `adminService.js`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/reports/` | Platform analytics |
| GET | `/api/admin/users/` | List all users |
| PATCH | `/api/admin/users/:id/` | Update user status |
| DELETE | `/api/admin/users/:id/` | Delete user |
| GET | `/api/admin/bookings/` | List all bookings |

---

## 🔧 Connecting to Django Backend

1. Ensure Django has `CORS_ALLOWED_ORIGINS` set to `http://localhost:3000`
2. Install `django-cors-headers` and add to `INSTALLED_APPS`
3. Set `REST_FRAMEWORK` to use JWT authentication (`djangorestframework-simplejwt`)
4. Update `.env` with your backend URL

### Django settings snippet:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-production-domain.com",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

---

## 🏗️ Build for Production

```bash
npm run build
# Output in /dist — serve with any static file server or Django's staticfiles
```

---

## 📦 Dependencies

- **React 18** — UI framework
- **Vite 5** — Build tool & dev server
- **Google Fonts** — Playfair Display + DM Sans (loaded via CSS)
- No additional UI libraries — 100% custom Eduvos-branded components

---

## 🎓 Portals

| Portal | Access | Route |
|--------|--------|-------|
| Landing Page | Public | `/` |
| Student Portal | Student login | Student dashboard → Search → Book |
| Tutor Portal | Tutor login | Manage profile → Bookings → Availability |
| Admin Dashboard | Admin credentials | Users → Bookings → Reports |
