StockAlert - Auto Parts Inventory System

Building in Public | Real-world app for my father's auto parts business in Abidjan, Côte d'Ivoire


PROJECT OVERVIEW
What: Offline-first inventory management system for small auto parts vendors
Why: My father can't read well, needs visual + simple interface to track stock
For: Small business owners in markets who lose money from poor stock tracking
Tech: React + IndexedDB (no backend needed for now, works offline)

WHAT WORKS (Current Features)
Core Functionality

- Add products (name, initial stock, min stock alert, up to 4 images)
- View all products in grid layout
- Stock management:
- Quick +1/-1 buttons (fast daily transactions)
- Bulk add/remove (when restocking large quantities)
- Visual low stock alerts (red border when stock ≤ minStock)
- Delete products

For Image Handling

- Take photos with camera (only compatible with mobile)
- Choose from gallery
- Store up to 4 angles per product
- Click to zoom images

For Data Storage

- Persistent storage with IndexedDB (data survives refresh/close)
- Offline-first (works without internet)

UI/UX

- Modern gradient design (purple theme)
- Professional Lucide icons (no emojis)
- Mobile-responsive
- Loading states
- French language (for Ivorian market)


KNOWN BUGS
Critical (Blocks Usage)

Image Display Error

Error: "Cannot read properties of undefined (reading '0')"
Cause: Some products have undefined images array
Location: App.js line ~383 (product mapping)
Fix: Add safety check product.images || []


Bulk Edit Broken (Vendu/Reçu buttons)

Error: "selectedProduct is not a function"
Cause: Calling selectedProduct() instead of setSelectedProduct()
Location: App.js line ~306
Fix: Replace function call with state setter


Multiple Images Crash

When adding 2nd image to product with 1 image, app crashes
Related to Bug #1 (undefined images handling)



Minor (Annoying but not blocking)

None currently


ROADMAP - Next Features
Phase 1: Critical Fixes (This Week)

 Fix image undefined bugs
 Fix bulk edit (Vendu/Reçu)
 Refactor code into clean structure

Phase 2: Essential Features (Next 2 Weeks)

 Pricing System

Cost Price (CP - what he buys at)
Selling Price (SP - what he sells at)
Auto-calculate profit per unit
Show total inventory value
Show potential revenue


 Multi-Image Upload

Select 4 images at once (instead of one by one)
Maintain current single-upload option


 Search & Filter

Search products by name
Filter: All / Low Stock / Normal Stock
Sort by: Name, Stock Level, Date Added



Phase 3: Analytics (Week 3-4)

 Sales Dashboard

Daily sales count
Best-selling products (top 5)
Weekly/monthly trends
Simple bar charts (using Recharts)


 Transaction History

Log every stock change (timestamp, product, quantity, type)
View history per product
Filter by date range



Phase 4: Advanced (Month 2)

 Export/Import

Export inventory to Excel/CSV
Backup data as JSON
Import products from spreadsheet


 Supplier Management

Add supplier per product
Track reorder info
Supplier contact details


 Print Features

Print inventory list
Print low stock report
Generate product labels



Phase 5: Deployment (Month 2-3)

 PWA (installable on phone)
 Push notifications for low stock
 Deploy to Vercel (free hosting)
 Custom domain (optional)
 Cloud sync (optional - multi-device)


BACKEND EDITION
Timeline: Feb 17 → Feb 28 = 11 days

PHASE 6: BACKEND & SYNC
Week 1: Core Backend
Day 1-2: Supabase Setup

Create free Supabase account
Set up database tables (products, transactions)
Configure authentication (simple PIN system for your dad)

Day 3-4: Sync Logic

Keep IndexedDB for offline
Add background sync when online
Auto-backup every change to cloud

Day 5-6: Multi-User Foundation

Add user roles (Owner, Worker)
Each user gets login
All changes tracked with "who did what"

Day 7: Testing

Test sync on your phone
Test on two devices at once
Make sure offline still works

Week 2 (Feb 24-28): Polish & Deploy
Day 8-9: Data Recovery

Add "Restore from Cloud" button
Import/export between devices
Backup history (last 30 days of changes)

Day 10: Final Testing

Your father tests on his phone
You test losing/reinstalling app
Verify all data comes back

Day 11: Deploy & Document

Push to production
Write simple guide for your dad
BUILD IN PUBLIC POST 


CODE STRUCTURE 
Current State
src/
├── App.js (700+ lines - TOO BIG!)
├── App.css (all styles)
├── components/
│   ├── LoadingScreen.jsx
│   └── ProductCard.jsx
├── hooks/
│   └── useProducts.js
└── utils/
    └── db.js
Problems:

App.js is a monolith (forms, modals, logic all mixed)
Hard to find specific code
Difficult to reuse components
No clear separation of concerns


📁 TARGET STRUCTURE (Clean - "Onion Layers")
src/
├── 📄 PROJECT.md              ← This file (your roadmap)
├── App.js                     ← THIN (just composition)
│
├── components/
│   ├── layout/                ← Page structure
│   │   ├── Header.jsx
│   │   ├── Container.jsx
│   │   └── EmptyState.jsx
│   │
│   ├── product/               ← Product features
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   └── ProductImageGallery.jsx
│   │
│   ├── modals/                ← All popups
│   │   ├── AddProductModal.jsx
│   │   ├── BulkEditModal.jsx
│   │   └── ImageEditorModal.jsx
│   │
│   └── common/                ← Reusable UI
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Modal.jsx
│       └── LoadingScreen.jsx
│
├── hooks/                     ← Business logic
│   ├── useProducts.js         ← CRUD operations
│   ├── useImageUpload.js      ← Image handling
│   └── useLocalStorage.js     ← Future: settings
│
├── utils/                     ← Pure functions
│   ├── db.js                  ← IndexedDB wrapper
│   ├── validation.js          ← Form validation
│   ├── formatters.js          ← Currency, dates
│   └── constants.js           ← Config values
│
└── styles/
    ├── App.css                ← Global styles
    └── variables.css          ← Design tokens

Benefits:

- Know exactly where everything is
- Easy to reuse components
- Easy to test individual pieces
- Easy for others to understand
- Faster development


LEARNING LOG
Session 1 - Initial Build
Date: [Start Date]
Time: ~8 hours
What I Built:

Basic React app structure
Product CRUD operations
Image upload system
IndexedDB integration

What I Learned:

IndexedDB basics (objectStore, keyPath)
FileReader API for image conversion
React state management for forms
Lucide icons for professional UI

Struggles:

IndexedDB "keyPath did not yield value" errors
Understanding async/await with database operations
Managing multiple modals state
Image array handling


Session 2 - Bug Discovery & Strategy
Date: [Today's Date]
Time: 2 hours
What I Did:

Tested all features thoroughly
Documented 3 critical bugs
Realized code structure needs refactor
Decided to build in public

What I Learned:

Importance of defensive programming (null checks)
Reading error messages systematically
Value of documentation
How professional developers actually work (they use AI too!)

Mindset Shift:

Stopped comparing myself to "perfect" developers
Understood debugging is 80% of the job
Realized building something REAL > perfect syntax knowledge
Committed to consistency over perfection

Key Insight:

"The skill isn't knowing everything - it's knowing how to find answers and persist through frustration."


Session 3 - [Next Session]
Date: [Fill when you start]
Time: [Track it]
Goal: Fix 3 critical bugs
What I Did:
What I Learned:
Struggles:

TIME TRACKING
Total Time Invested: ~10 hours
Time Breakdown:

Initial setup: 1 hour
Core features: 6 hours
Bug hunting: 1 hour
Strategy/documentation: 2 hours

Estimated Remaining:

Bug fixes: 1 hour
Refactor: 2 hours
Price feature: 2 hours
Analytics: 4 hours
Deployment: 2 hours
Total to MVP: ~11 more hours

Realistic Schedule:

15 mins/day = 44 days
30 mins/day = 22 days
1 hour/day = 11 days
2 hours/weekend = 6 weekends


BUILD IN PUBLIC - Content Strategy
Platforms:

Primary: Twitter/X (web3 community)
Secondary: LinkedIn (professional network)

Posting Schedule:

Mon/Wed/Fri: StockAlert progress updates
Tue/Thu: Web3 content (articles, insights, threads)
Sat/Sun: Weekly reflection + learning

Content Mix:

60% Building StockAlert (code updates, screenshots, learnings)
30% Web3 insights (keeps audience engaged)
10% Personal (struggles, wins, philosophy)

Post Templates:
Progress Update:
Day X of building StockAlert 📦

Today: [Feature/Fix]
Time: [X mins]
Learning: [One key insight]

Tomorrow: [Next goal]

Building a real-world inventory app for my dad's auto parts shop in Abidjan 🇨🇮

#BuildInPublic #ReactJS #WebDev
Bug Fix:
Just spent 2 hours debugging this error: "[error message]"

The fix? [Simple explanation]

Reminder: Even senior devs Google everything. 
Persistence > perfection.

#100DaysOfCode #WebDev
Feature Ship:
✅ New feature shipped: [Feature name]

What it does: [User benefit]
What I learned: [Technical learning]

[Screenshot/Demo]

Building StockAlert for small businesses in Africa 🇨🇮

#BuildInPublic #ReactJS
Web3 Thread (Non-coding days):
🧵 Thread: [Web3 Topic]

[Your insights/analysis]

Also building an inventory app for small businesses in Africa. 
Progress updates 👇

#Web3 #BuildInPublic

SUCCESS METRICS
Technical Goals:

 Zero critical bugs
 All features work offline
 App loads in <2 seconds
 Works on Android phones (target device)

Usage Goals (Once deployed):

 My father uses it daily for 1 week
 He understands the UI without explanation
 Saves him 30+ mins/day vs manual tracking
 Prevents at least 1 stockout

Build in Public Goals:

 Post 3x/week consistently for 4 weeks
 Get 10+ meaningful engagements
 Help 1 other builder with similar problem
 Connect with 5 web3 developers


COMMITMENT CONTRACT
I commit to:

- Minimum 15 minutes/day of coding
- Post progress 3x/week
- Update this doc every session
- No perfectionism - ship messy but working
- Finish even when frustrated

My success is deploying the app for my father and people who deal with stock in their business.
I am not building for either perfect code or viral posts.
I just want to ship it.

RESOURCES
Documentation:

React Docs
IndexedDB API
Lucide Icons

Learning:

This conversation (debugging philosophy)
Stack Overflow (when stuck)
Claude.ai (AI pair programming)

Inspiration:

My father (the actual user)
Small business owners in Abidjan market primarily
Other #BuildInPublic stories


NEXT SESSION PLAN
When: [Your next coding session]
Duration: 30-60 mins
Goals:

Fix image undefined bug (15 mins)
Fix selectedProduct function error (10 mins)
Test all features again (10 mins)
First public post (5 mins)

Prep:

 Open VS Code
 Open browser console (F12)
 Have this doc open
 Phone ready for testing


💬 NOTES TO SELF

When frustrated: Take 5 min break, come back
When stuck: Google first, then ask Claude
When comparing: Remember - you're building something REAL
When tired: 15 mins > 0 mins
When perfect: Done > perfect

I'm not tryna be the best developer.
This is about helping your father run his business better.
That's worth shipping messy code for.

