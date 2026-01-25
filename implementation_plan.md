# Implementation Plan - DKC Books & Courses

## 1. Setup & Configuration
- [ ] Install necessary dependencies (`mongoose`, `next-auth`, `bcryptjs`, `framer-motion`, `lucide-react`, `react-hook-form`, `zod`, `sonner`, `clsx`, `tailwind-merge`).
- [ ] Setup Environment Variables (`.env.local`) for MongoDB URI, NextAuth Secret.
- [ ] Configure Database Connection (`lib/db.ts`).
- [ ] Setup Authentication (NextAuth v5 or v4).
- [ ] Define Mongoose Models:
    - User (name, email, password, role, image, courses, orders)
    - Product (Book/Course) (title, description, price, category, type, image, fileUrl/lessons, etc.)
    - Order (user, items, total, status)

## 2. Design System & UI Components
- [ ] Create basic utility functions (`lib/utils.ts` for clsx/tailwind-merge).
- [ ] Create UI Components (Atomic):
    - `Button` (Variants: default, outline, ghost)
    - `Input`, `Textarea`, `Select`
    - `Card` (Product Card)
    - `Modal` / `Dialog`
    - `Navbar` (Responsive, with Auth state)
    - `Footer`
- [ ] Setup Toast notifications (Sonner).

## 3. Core Features - Backend API
- [ ] API Route: `GET/POST /api/products` (Books & Courses)
- [ ] API Route: `GET /api/products/[id]`
- [ ] API Route: `POST /api/auth/register`
- [ ] API Route: `POST /api/orders` (Mock payment processing)

## 4. Feature Implementation - Frontend
### Public Pages
- [ ] `page.tsx` (Home): Hero section, featured books/courses.
- [ ] `shop/page.tsx`: Browse all with filters (Client side filtering for MVP or Server Search).
- [ ] `shop/[id]/page.tsx`: Product details.

### User Section
- [ ] `auth/login/page.tsx`
- [ ] `auth/register/page.tsx`
- [ ] `dashboard/page.tsx`: User profile, purchased items.

### Admin Section
- [ ] `admin/dashboard/page.tsx`: Stats.
- [ ] `admin/products/page.tsx`: Manage books/courses (CRUD).
- [ ] `admin/users/page.tsx`: View users.
- [ ] `admin/orders/page.tsx`: View orders.

## 5. Polish & SEO
- [ ] Add metadata (titles, descriptions).
- [ ] Animations (Framer Motion).
- [ ] Responsiveness check.
