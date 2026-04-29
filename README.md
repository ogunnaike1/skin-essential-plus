# Skin Essential Plus

A luxury, futuristic beauty website built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Offers skin treatments, spa therapy, eyelash sketching, and full skincare solutions — rendered through a glassmorphism-driven, cinematic design system.

---

## ✨ Features

- **Glassmorphism hero carousel** — full viewport, 4 slides, Embla + Autoplay, keyboard + touch accessible, cinematic Ken Burns effect
- **Dynamic navbar** — transparent over hero, blurred solid on scroll (>80px), full mobile drawer
- **Interactive services cards** — gradient border hover, image zoom, icon micro-rotation
- **Why Choose Us** — sticky heading + staggered trust point cards
- **About snippet** — split layout with floating image + live-counter stats
- **Before/After slider** — pointer-draggable comparison with Framer Motion
- **Testimonials carousel** — glassmorphism cards with scale-focus centering
- **Booking CTA** — bold deep-teal banner with floating glow orbs
- **Instagram grid** — 2/3/4-column responsive with hover overlay
- **Contact** — OpenStreetMap iframe + glass contact card
- **Newsletter** — glow focus state, submission feedback
- **Footer** — 4-column layout with socials
- **Accessibility** — keyboard nav, ARIA labels, reduced-motion support
- **Performance** — `next/image` with AVIF/WebP, lazy loading, priority hints, font subsetting

---

## 🎨 Design System

### Colors

| Token   | Hex       | Usage                        |
| ------- | --------- | ---------------------------- |
| `ivory` | `#FCFBFC` | Primary background           |
| `mauve` | `#8A6F88` | Accent, borders, glow        |
| `sage`  | `#4F7288` | Secondary accent             |
| `deep`  | `#47676A` | Primary text, buttons, dark  |

### Typography

- **Display** — Cormorant Garamond (luxury serif headlines)
- **Serif** — Playfair Display (alternate serif)
- **Sans** — Manrope (body, UI)

### Motion

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (cinematic)
- Standard durations: 500ms (UI), 700–900ms (reveal), 6–7s (Ken Burns)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ or 20+
- npm / pnpm / yarn

### Install

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm run start
```

### Type-check

```bash
npm run type-check
```

---

## 📁 Project Structure

```
skin-essential-plus/
├── app/
│   ├── globals.css          # Tailwind + brand utilities
│   ├── layout.tsx           # Root layout with fonts + metadata
│   └── page.tsx             # Homepage composition
├── components/
│   ├── hero/
│   │   └── HeroCarousel.tsx
│   ├── navbar/
│   │   └── Navbar.tsx
│   ├── sections/
│   │   ├── About.tsx
│   │   ├── BeforeAfter.tsx
│   │   ├── BookingCTA.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Instagram.tsx
│   │   ├── Newsletter.tsx
│   │   ├── Services.tsx
│   │   ├── Testimonials.tsx
│   │   └── WhyChooseUs.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── GlassCard.tsx
│       ├── Logo.tsx
│       └── SectionHeading.tsx
├── lib/
│   ├── constants.ts         # Site content, nav, data
│   └── utils.ts             # cn() helper
├── types/
│   └── index.ts             # Shared TypeScript types
├── public/
│   └── images/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🧩 Customization

- **Content** → edit `lib/constants.ts`
- **Colors** → edit `tailwind.config.ts` + `app/globals.css`
- **Fonts** → edit `app/layout.tsx`
- **Images** — Unsplash URLs used as placeholders; swap with your own and add domains to `next.config.ts` `images.remotePatterns`

---

## 📝 Notes

- All components are strictly typed — no `any`.
- Every client component uses the `"use client"` directive.
- `next/image` is used everywhere for automatic optimization.
- The Before/After slider uses pointer events for universal input support.
- `prefers-reduced-motion` is respected globally in `globals.css`.

---

Crafted with intention. ✦

# Skin Essential Plus - Admin System Documentation

## 🎯 Overview
Complete admin dashboard for managing services, products, appointments, and customer bookings with email notifications.

---

## 📁 File Structure Created

```
app/admin/
├── page.tsx                      # Main dashboard
├── services/
│   └── page.tsx                  # Services CRUD
├── products/
│   └── page.tsx                  # Products CRUD (TO BUILD)
├── appointments/
│   └── page.tsx                  # Appointments management (TO BUILD)
└── customers/
    └── page.tsx                  # Customers list (TO BUILD)

components/admin/
├── AdminSidebar.tsx              # ✅ Navigation sidebar
├── AdminHeader.tsx               # ✅ Top header with search
└── AdminLayout.tsx               # ✅ Layout wrapper
```

---

## ✅ Phase 1: COMPLETED - Admin Dashboard Structure

### Files Created:
1. **AdminSidebar.tsx** - Left navigation with links to all admin sections
2. **AdminHeader.tsx** - Top header with search, notifications, and user profile
3. **AdminLayout.tsx** - Layout wrapper for all admin pages
4. **Admin Dashboard** (`app/admin/page.tsx`) - Main overview with stats and quick actions

### Features:
- ✅ Stats cards (Revenue, Appointments, Products, Customers)
- ✅ Recent appointments widget
- ✅ Quick action buttons
- ✅ Responsive design
- ✅ Luxury spa branding (mauve/sage/deep colors)

---

## ✅ Phase 2: IN PROGRESS - Services Management

### File: `app/admin/services/page.tsx`

### Features Completed:
- ✅ Services table with search
- ✅ Add/Edit/Delete buttons
- ✅ Service status (Active/Inactive)
- ✅ Image thumbnails
- ✅ Category badges
- ✅ Price and duration display
- ✅ Available slots counter

### Still To Build:
- [ ] Add Service Modal with form
- [ ] Edit Service Modal with pre-filled data
- [ ] Image upload functionality
- [ ] Database integration (Supabase/Prisma)
- [ ] Form validation

---

## 🔨 Phase 3: TO BUILD - Products Management

### Features Needed:
- [ ] Products table with search and filters
- [ ] Add Product form (name, description, price, images, stock, category)
- [ ] Edit Product functionality
- [ ] Delete Product with confirmation
- [ ] Bulk actions (delete multiple, update stock)
- [ ] Low stock alerts
- [ ] Product variants (sizes, colors if needed)

---

## 📅 Phase 4: TO BUILD - Appointment Booking System

### User-Facing Booking Component:
- [ ] Calendar view with available time slots
- [ ] Service selection
- [ ] Staff member selection
- [ ] Customer information form
- [ ] Booking confirmation
- [ ] Email notification to admin
- [ ] Email confirmation to customer

### Booking Logic:
- [ ] Time slot conflict prevention
- [ ] Double-booking prevention
- [ ] Service duration handling
- [ ] Staff availability checking
- [ ] Buffer time between appointments

### Database Schema Needed:
```typescript
Appointment {
  id: string
  customerId: string
  serviceId: string
  staffId: string
  date: Date
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string?
  createdAt: Date
  updatedAt: Date
}
```

---

## 👥 Phase 5: TO BUILD - Admin Appointments View

### Features Needed:
- [ ] Calendar view of all appointments
- [ ] Daily/Weekly/Monthly views
- [ ] Appointment details panel
- [ ] Status update (confirm, cancel, complete)
- [ ] Customer contact information
- [ ] Appointment notes
- [ ] Reschedule functionality
- [ ] Email customer from admin

---

## 📧 Phase 6: TO BUILD - Email Notifications

### Email Service Setup:
- [ ] Configure Resend or SendGrid
- [ ] Email templates for:
  - [ ] New appointment confirmation (to customer)
  - [ ] New appointment notification (to admin)
  - [ ] Appointment reminder (24 hours before)
  - [ ] Appointment cancellation
  - [ ] Appointment rescheduling

### Email Content:
```
Subject: Appointment Confirmation - Skin Essential Plus

Dear [Customer Name],

Your appointment has been confirmed!

Service: [Service Name]
Date: [Date]
Time: [Time]
Duration: [Duration]
Price: [Price]

Location: Skin Essential Plus
[Address]

If you need to reschedule or cancel, please contact us at:
[Phone] | [Email]

We look forward to seeing you!

Best regards,
Skin Essential Plus Team
```

---

## 🗄️ Database Schema Overview

### Tables Needed:

#### 1. services
```sql
id, name, category, description, price, duration, 
image, available, slotsAvailable, createdAt, updatedAt
```

#### 2. products
```sql
id, name, category, description, price, originalPrice,
image, stock, stockStatus, rating, reviewCount,
tagline, keyIngredient, volume, createdAt, updatedAt
```

#### 3. appointments
```sql
id, customerId, customerName, customerEmail, customerPhone,
serviceId, serviceName, staffId, staffName, date, startTime,
endTime, duration, price, status, notes, createdAt, updatedAt
```

#### 4. customers
```sql
id, name, email, phone, address, dateOfBirth,
totalBookings, totalSpent, createdAt, updatedAt
```

#### 5. staff
```sql
id, name, email, role, specialties, available,
image, bio, createdAt, updatedAt
```

---

## 🚀 Next Steps

1. **Complete Services Management:**
   - Build Add/Edit service modals
   - Implement image upload
   - Connect to database

2. **Build Products Management:**
   - Create products page
   - Build CRUD forms
   - Implement stock management

3. **Build Booking System:**
   - Create booking calendar component
   - Implement time slot logic
   - Prevent double bookings

4. **Setup Email Service:**
   - Configure Resend
   - Create email templates
   - Setup notification triggers

5. **Admin Appointments:**
   - Build calendar view
   - Create appointment details panel
   - Add status management

---

## 🎨 Design System Used

**Colors:**
- Mauve: `#8A6F88`
- Sage: `#4F7288`
- Deep: `#47676A`
- Ivory: `#FCFBFC`

**Tints:**
- Mauve Tint: `#F3EFF3`
- Sage Tint: `#EFF3F5`
- Deep Tint: `#EFF2F2`

**Fonts:**
- Display: EB Garamond (headings)
- Body: Inter (content)

---

## 📋 Features Summary

### ✅ Completed:
- Admin dashboard layout
- Navigation sidebar
- Stats overview
- Services table structure

### 🔨 In Progress:
- Services CRUD operations
- Add/Edit service forms

### 📅 To Build:
- Products management
- Appointment booking (user-facing)
- Appointment management (admin)
- Email notifications
- Customer management
- Staff management
- Database integration

---

**Total Estimated Files:** ~25-30 files
**Current Progress:** ~20% complete
**Next Priority:** Complete services CRUD, then products, then bookings

# 🎉 Admin System - Phase 1 & 2 COMPLETE!

## ✅ What's Been Built

### Phase 1: Admin Dashboard Foundation (100% Complete)
1. ✅ **AdminSidebar.tsx** - Navigation with all sections
2. ✅ **AdminHeader.tsx** - Search, notifications, user profile
3. ✅ **AdminLayout.tsx** - Reusable layout wrapper
4. ✅ **Dashboard Page** - Stats, recent appointments, quick actions

### Phase 2: Services Management with Supabase (100% Complete)
5. ✅ **database-schema.sql** - Complete database schema for all tables
6. ✅ **client.ts** - Supabase client configuration
7. ✅ **types.ts** - TypeScript types for all database tables
8. ✅ **services-api.ts** - Full CRUD API functions for services
9. ✅ **ServiceModal.tsx** - Add/Edit service form with image upload
10. ✅ **ServicesManagement Page** - Complete services table with real Supabase integration

---

## 🗄️ Database Schema Created

### Tables:
- ✅ **services** - Service management
- ✅ **products** - Product catalog
- ✅ **customers** - Customer records
- ✅ **staff** - Staff/employee management
- ✅ **appointments** - Booking system

### Features:
- ✅ UUID primary keys
- ✅ Auto-updating timestamps
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Double-booking prevention constraint
- ✅ Sample data for testing

---

## 📋 Services Management Features

### ✅ Implemented:
- [x] **List Services** - View all services in a table
- [x] **Search** - Filter services by name
- [x] **Add Service** - Create new services with form
- [x] **Edit Service** - Update existing services
- [x] **Delete Service** - Remove services with confirmation
- [x] **Image Upload** - Upload service images to Supabase Storage
- [x] **Toggle Availability** - Enable/disable services
- [x] **Loading States** - Spinner while fetching data
- [x] **Real-time Updates** - Automatically refresh after changes

### Form Fields:
- Service name
- Category dropdown
- Description (textarea)
- Price (₦)
- Duration (minutes)
- Image upload with preview
- Tag
- Location
- Available slots
- Availability toggle

---

## 📦 What's Next (Phases 3-6)

### Phase 3: Products Management
**Status:** 🔨 Ready to build
- Products CRUD (similar to services)
- Stock management
- Product variants
- Low stock alerts

### Phase 4: Appointment Booking (User-Facing)
**Status:** 🔨 Ready to build
- Calendar component
- Time slot selection
- Service selection
- Customer form
- Email confirmation

### Phase 5: Admin Appointments Management
**Status:** 🔨 Ready to build
- Calendar view
- Appointment details
- Status management
- Rescheduling

### Phase 6: Email Notifications
**Status:** 🔨 Ready to build
- Resend/SendGrid integration
- Email templates
- Automatic notifications

---

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
npm install @supabase/ssr  # For server-side rendering
```

### 2. Set Up Supabase
1. Create a new Supabase project
2. Copy the provided SQL schema to Supabase SQL Editor
3. Run the schema to create all tables
4. Create a storage bucket named "images" (make it public)
5. Get your Supabase URL and Anon Key

### 3. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. File Structure
Place files in these locations:
```
lib/supabase/
├── client.ts
├── types.ts
└── services-api.ts

components/admin/
├── AdminSidebar.tsx
├── AdminHeader.tsx
├── AdminLayout.tsx
└── ServiceModal.tsx

app/admin/
├── page.tsx
└── services/
    └── page.tsx
```

### 5. Test the System
1. Navigate to `/admin`
2. Click "Services" in sidebar
3. Click "Add Service" to test creation
4. Upload an image
5. Fill out the form
6. Save and verify it appears in Supabase

---

## 📊 API Functions Available

### Services:
- `getServices()` - Fetch all services
- `getService(id)` - Fetch single service
- `createService(data)` - Create new service
- `updateService(id, data)` - Update service
- `deleteService(id)` - Delete service
- `uploadServiceImage(file, id)` - Upload image

### Coming Soon:
- Products API functions
- Appointments API functions
- Customers API functions
- Staff API functions

---

## 🎨 Design Consistency

All admin pages use the luxury spa brand colors:
- **Mauve:** #8A6F88 (primary actions)
- **Sage:** #4F7288 (success states)
- **Deep:** #47676A (text, borders)
- **Ivory:** #FCFBFC (backgrounds)

Components follow the same design patterns:
- Rounded corners (2xl = 16px)
- Soft transitions (200-300ms)
- Hover states on all interactive elements
- Loading states for async operations

---

## 🔐 Security Notes

### Current Setup:
- Row Level Security (RLS) enabled on all tables
- Public read access for services/products
- Admin write access requires authentication

### TODO:
- Implement proper admin authentication
- Set up protected routes
- Add role-based permissions
- Secure API endpoints

---

## 📝 Next Steps

**Option A:** Continue with Products Management
**Option B:** Jump to Appointment Booking System
**Option C:** Build all remaining phases in sequence

Ready to continue! Which phase would you like me to build next? 🚀

# 📁 Complete File Structure - Skin Essential Plus Admin System

## 🗂️ Full Directory Structure

```
skin-essential-plus/
│
├── app/
│   ├── admin/                          # Admin section (protected routes)
│   │   ├── page.tsx                    # ✅ Dashboard homepage (/admin)
│   │   │
│   │   ├── services/                   # Services management
│   │   │   └── page.tsx                # ✅ Services CRUD page (/admin/services)
│   │   │
│   │   ├── products/                   # Products management
│   │   │   └── page.tsx                # 🔨 TO BUILD (/admin/products)
│   │   │
│   │   ├── appointments/               # Appointments management
│   │   │   └── page.tsx                # 🔨 TO BUILD (/admin/appointments)
│   │   │
│   │   ├── customers/                  # Customers list
│   │   │   └── page.tsx                # 🔨 TO BUILD (/admin/customers)
│   │   │
│   │   └── settings/                   # Admin settings
│   │       └── page.tsx                # 🔨 TO BUILD (/admin/settings)
│   │
│   ├── booking/                        # User-facing booking
│   │   └── page.tsx                    # 🔨 TO BUILD (/booking)
│   │
│   ├── layout.tsx                      # Root layout (existing)
│   └── page.tsx                        # Home page (existing)
│
├── components/
│   ├── admin/                          # Admin-specific components
│   │   ├── AdminSidebar.tsx            # ✅ Left navigation sidebar
│   │   ├── AdminHeader.tsx             # ✅ Top header with search
│   │   ├── AdminLayout.tsx             # ✅ Layout wrapper
│   │   ├── ServiceModal.tsx            # ✅ Add/Edit service form
│   │   ├── ProductModal.tsx            # 🔨 TO BUILD
│   │   ├── AppointmentModal.tsx        # 🔨 TO BUILD
│   │   └── AppointmentCalendar.tsx     # 🔨 TO BUILD
│   │
│   ├── booking/                        # User booking components
│   │   ├── BookingCalendar.tsx         # 🔨 TO BUILD
│   │   ├── ServiceSelector.tsx         # 🔨 TO BUILD
│   │   ├── TimeSlotPicker.tsx          # 🔨 TO BUILD
│   │   └── CustomerForm.tsx            # 🔨 TO BUILD
│   │
│   ├── services/                       # Existing service components
│   │   ├── ServicesGrid.tsx            # ✅ Services display grid
│   │   ├── ServiceCard.tsx             # ✅ Service card component
│   │   └── ...
│   │
│   ├── shop/                           # Existing shop components
│   │   ├── ProductsGrid.tsx            # ✅ Products display grid
│   │   └── ...
│   │
│   ├── ui/                             # Reusable UI components
│   │   ├── Logo.tsx                    # ✅ Brand logo
│   │   └── ...
│   │
│   ├── LoadingScreen.tsx               # ✅ Home page loading screen
│   ├── ClientLayout.tsx                # ✅ Client-side layout wrapper
│   └── ...
│
├── lib/
│   ├── supabase/                       # Supabase integration
│   │   ├── client.ts                   # ✅ Supabase client config
│   │   ├── types.ts                    # ✅ Database TypeScript types
│   │   │
│   │   ├── services-api.ts             # ✅ Services CRUD functions
│   │   ├── products-api.ts             # 🔨 TO BUILD
│   │   ├── appointments-api.ts         # 🔨 TO BUILD
│   │   ├── customers-api.ts            # 🔨 TO BUILD
│   │   └── staff-api.ts                # 🔨 TO BUILD
│   │
│   ├── email/                          # Email service (Resend)
│   │   ├── client.ts                   # 🔨 TO BUILD
│   │   ├── templates.ts                # 🔨 TO BUILD
│   │   └── send-appointment-email.ts   # 🔨 TO BUILD
│   │
│   ├── services-data.ts                # ✅ Services mock data (existing)
│   ├── shop-data.ts                    # ✅ Products mock data (existing)
│   └── utils.ts                        # ✅ Utility functions
│
├── public/
│   └── images/
│       ├── logo.png                    # ✅ Brand logo
│       ├── services/                   # Service images
│       └── products/                   # Product images
│
├── .env.local                          # Environment variables
│   # NEXT_PUBLIC_SUPABASE_URL=
│   # NEXT_PUBLIC_SUPABASE_ANON_KEY=
│   # RESEND_API_KEY=
│
└── supabase/
    └── schema.sql                      # ✅ Database schema
```

---

## 📝 Files Already Created (From Output Folder)

### ✅ Move these files to your project:

#### **Admin Components** (`components/admin/`)
```bash
components/admin/AdminSidebar.tsx       # From: admin-system/AdminSidebar.tsx
components/admin/AdminHeader.tsx        # From: admin-system/AdminHeader.tsx
components/admin/AdminLayout.tsx        # From: admin-system/AdminLayout.tsx
components/admin/ServiceModal.tsx       # From: admin-system/ServiceModal.tsx
```

#### **Admin Pages** (`app/admin/`)
```bash
app/admin/page.tsx                      # From: admin-system/AdminDashboard-page.tsx.txt
app/admin/services/page.tsx             # From: admin-system/ServicesManagement-FINAL.tsx.txt
```

#### **Supabase Integration** (`lib/supabase/`)
```bash
lib/supabase/client.ts                  # From: admin-system/client.ts
lib/supabase/types.ts                   # From: admin-system/types.ts
lib/supabase/services-api.ts            # From: admin-system/services-api.ts
```

#### **Database Schema** (Run in Supabase SQL Editor)
```bash
supabase/schema.sql                     # From: admin-system/database-schema.sql
```

---

## 🔨 Files Still To Build

### **Products Management**
- `app/admin/products/page.tsx`
- `components/admin/ProductModal.tsx`
- `lib/supabase/products-api.ts`

### **Appointments (User Booking)**
- `app/booking/page.tsx`
- `components/booking/BookingCalendar.tsx`
- `components/booking/ServiceSelector.tsx`
- `components/booking/TimeSlotPicker.tsx`
- `components/booking/CustomerForm.tsx`
- `lib/supabase/appointments-api.ts`

### **Admin Appointments Management**
- `app/admin/appointments/page.tsx`
- `components/admin/AppointmentCalendar.tsx`
- `components/admin/AppointmentDetailsPanel.tsx`

### **Email Notifications**
- `lib/email/client.ts`
- `lib/email/templates.ts`
- `lib/email/send-appointment-email.ts`

### **Customers & Staff**
- `app/admin/customers/page.tsx`
- `app/admin/staff/page.tsx`
- `lib/supabase/customers-api.ts`
- `lib/supabase/staff-api.ts`

---

## 📦 Installation Steps

### 1. **Copy Files to Your Project**

```bash
# Navigate to your project
cd skin-essential-plus

# Create necessary directories
mkdir -p app/admin/services
mkdir -p app/admin/products
mkdir -p app/admin/appointments
mkdir -p components/admin
mkdir -p lib/supabase
mkdir -p supabase

# Copy the files from output folder to these locations
```

### 2. **Install Dependencies**

```bash
npm install @supabase/supabase-js
npm install @supabase/ssr
```

### 3. **Set Up Environment Variables**

Create `.env.local` in root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

### 4. **Run Database Schema**

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Copy contents of `database-schema.sql`
4. Run the query
5. Create storage bucket named "images" (public)

### 5. **Test Your Admin Panel**

```bash
npm run dev
# Visit http://localhost:3000/admin
```

---

## 🎯 Current Status

```
✅ COMPLETED (11 files):
├── Admin Dashboard
├── Admin Layout Components (3 files)
├── Services Management (CRUD)
├── Supabase Integration (3 files)
└── Database Schema

🔨 TO BUILD (15+ files):
├── Products Management
├── Appointments Booking (User)
├── Appointments Management (Admin)
├── Email Notifications
└── Customers/Staff Management
```

---

## 🚀 Next Steps

1. **Copy completed files** to their locations
2. **Set up Supabase** project and run schema
3. **Test Services Management** to ensure it works
4. **Build remaining phases** (Products, Appointments, Emails)

Would you like me to:
- **A) Create a quick setup script** to copy all files?
- **B) Continue building Products Management**?
- **C) Build Appointments Booking next**?
- **D) Build everything in sequence**?

Let me know! 🎨