# Future Work and Improvements

This document outlines potential enhancements to GreenGrid grouped by area.
Some are small UX touches; others are research extensions that could form the
basis for further academic work.

## 1. Functional Enhancements

User-facing features that would round out the platform.

### 1.1 Order history
Currently users can place orders but cannot see past ones. A `/orders` page
backed by a new `GET /api/orders` endpoint would list each order with status,
total, items, and shipping address.

### 1.2 User profile management
A `/profile` page where users can update their name, phone, address, and
password. Currently editable only via the database.

### 1.3 Product reviews and ratings
Allow users to rate products they have purchased and leave text reviews.
Requires a `reviews` table linked to `users`, `products`, and `orders` (so only
verified buyers can review).

### 1.4 Wishlist / Saved items
A "save for later" feature so users can bookmark products without adding to
cart. Useful for high-ticket items like solar panels where users research over
multiple sessions.

### 1.5 Email notifications
Send order confirmation, shipping update, and delivery emails. Requires an
email service (SendGrid, Amazon SES, or local SMTP) and a background task
queue (Celery) so the request flow is not blocked.

### 1.6 Coupon codes and discounts
A `coupons` table and a coupon application step in checkout. Could support
percentage off, fixed amount off, or free shipping.

### 1.7 Multi-address management
Save multiple shipping addresses per user (home, office, etc.) and let the
user pick at checkout instead of typing every time.

### 1.8 Recently viewed products
Track product views and surface them on the home page or sidebar to encourage
return visits.

### 1.9 Search suggestions / autocomplete
Live suggestions as the user types in the search bar. Could use a lightweight
in-memory index or a search service like Meilisearch / Typesense.

## 2. Energy Module Extensions

These are the most interesting future work directions because they create
real research questions.

### 2.1 Real meter integration
Replace simulated readings with actual smart-meter data via MQTT or a vendor
API. Would require an ingestion service that subscribes to meter topics and
writes to the `meter_readings` table.

### 2.2 Anomaly detection
Flag unusual consumption patterns (e.g., sudden spike at 3 AM may indicate a
faulty appliance). Could use simple statistical methods (z-score) or trained
models (isolation forest, LSTM).

### 2.3 Usage forecasting
Predict next-month usage based on past 6-12 months of data. Useful for budget
planning. Time-series models like ARIMA or Prophet are good candidates.

### 2.4 Tariff plan optimisation
Compare the user's actual usage profile against alternate tariff plans (peak
vs off-peak, time-of-use, slab-based) and recommend the cheapest. This is a
genuinely valuable feature in markets with multiple tariff options.

### 2.5 Solar generation tracking
For users who have installed solar panels, track generation alongside
consumption. Show net export to grid and savings.

### 2.6 Comparative benchmarking
Anonymously compare a user's usage with similar households (size, location,
appliances). Engagement-driving and useful for sustainability awareness.

### 2.7 Energy-shopping correlation
Suggest products that would reduce a user's specific high-consumption hours.
For example, if a user has high evening peaks, recommend a solar battery or
LED upgrades. This is the core value proposition of combining the two
modules and is currently unexplored in the implementation.

## 3. Admin Module

Marked optional in the original specification.

### 3.1 Product management
Admin pages to create, edit, soft-delete, and bulk-import products.

### 3.2 Order management
List all orders with filters (status, date, user). Update order status from
pending → confirmed → shipped → delivered. Cancel and refund flow.

### 3.3 Inventory management
Low-stock alerts, reorder thresholds, and supplier tracking.

### 3.4 Sales and revenue dashboard
Top-selling products, revenue per category, daily/monthly trends. Charts on
the admin landing page.

### 3.5 User management
List users, view their orders, promote to admin, deactivate accounts.

## 4. Technical / Architectural

Improvements to how the system is built and operated.

### 4.1 Real payment gateway
Replace mocked COD with Razorpay or Stripe integration. Would also require
order state machine refinement (paid, refunded, etc.).

### 4.2 Image uploads
Currently uses placeholder URLs. Add upload to S3 or Cloudinary, with admin
UI to manage product images.

### 4.3 Database migrations
Switch from `Base.metadata.create_all` to Alembic so schema changes are
versioned.

### 4.4 Caching layer
Redis for product listings (high read, low write) and meter aggregations.
Would reduce database load substantially.

### 4.5 Background tasks
Celery + Redis for email sending, scheduled meter aggregation, and report
generation. Currently the request handler does everything.

### 4.6 Pagination
The product list endpoint currently returns all matching rows. With more
products, it should paginate.

### 4.7 Rate limiting
Protect public endpoints (login, register, products) with per-IP rate
limiting using slowapi or a reverse proxy like nginx.

### 4.8 Containerisation
Dockerfiles for backend and frontend, plus a `docker-compose.yml` for
one-command local startup including MySQL.

### 4.9 CI/CD pipeline
Automated tests + linting on every push, deploy to staging on merge.

### 4.10 Test coverage
Currently no automated tests. Add pytest for backend (unit + integration with
a test database) and Vitest + React Testing Library for frontend.

### 4.11 Error tracking
Integrate Sentry or similar for runtime error visibility.

## 5. Security Improvements

For taking the project closer to production-ready.

### 5.1 Refresh tokens
Currently only access tokens. A short-lived access token + long-lived
refresh token pattern would let users stay logged in without sending
credentials repeatedly while keeping access tokens easy to invalidate.

### 5.2 Email verification on signup
Confirmation link sent to the registered email. Stops trivial spam accounts.

### 5.3 Password reset flow
"Forgot password" with secure token-based reset.

### 5.4 Two-factor authentication
TOTP-based 2FA for users who want it.

### 5.5 CSRF protection
Currently relies on the Authorization header which is somewhat CSRF-resistant
but could be tightened with explicit CSRF tokens for any cookie-based auth
introduced later.

### 5.6 Strict CORS in production
Currently allows any header and method. Production deployment should restrict
both to what is actually used.

### 5.7 Audit logs
Track sensitive actions (login attempts, password changes, admin operations)
to a separate log table.

### 5.8 Bcrypt cost factor review
Currently using bcrypt defaults; review the cost factor for the deployment
environment.

## 6. UX / UI Polish

### 6.1 Toast notifications
Replace inline error messages with auto-dismissing toasts in a corner.
Cleaner UX for add-to-cart confirmations, errors, etc.

### 6.2 Loading skeletons everywhere
Most pages have them; verify all do.

### 6.3 Accessibility
Keyboard navigation testing, ARIA labels audit, contrast ratio checks. Aim
for WCAG AA compliance.

### 6.4 Internationalisation (i18n)
External strings, translations to Hindi and other Indian languages — useful
given the Indian-context branding (₹, INR pricing, Indian brands).

### 6.5 Better empty states
Illustrations or stronger calls to action for empty cart, no search results,
no orders yet.

### 6.6 Onboarding tutorial
Quick walkthrough for first-time users explaining the dashboard widgets.

## 7. Scalability

For if the platform actually attracted users.

### 7.1 Database read replicas
Most reads (product listing, meter readings) can hit a replica.

### 7.2 CDN for static assets
Frontend bundle and product images served via Cloudflare or similar.

### 7.3 Async API endpoints
FastAPI supports async; some endpoints (especially aggregation queries) could
benefit.

### 7.4 Real-time updates
WebSocket push for live meter data on the dashboard, instead of refresh-only.

### 7.5 Event-driven order processing
Pub-sub between order creation and downstream side effects (stock deduction,
email, payment) so each can scale independently.

## 8. Research Extensions

Directions that could form the basis of further academic work.

### 8.1 Behaviour-change study
Quantify whether users who see their dashboard regularly actually change
their consumption patterns over a 3-6 month window. This is a real research
question with measurable hypotheses.

### 8.2 Energy-shopping correlation study
Test whether contextual product recommendations driven by usage patterns
(e.g., "your evening peak is high; here are LED bulbs") drive higher
conversion than generic featured products.

### 8.3 Tariff optimisation modelling
Develop a recommendation model for plan switching that accounts for usage
shape, not just total kWh. Compare against rule-based heuristics.

### 8.4 Carbon-impact decision support
Show the lifetime carbon impact of each shopping decision (a solar panel saves
X kg over 25 years). Test whether this changes purchase behaviour.

### 8.5 Anomaly-driven appliance health insights
Use anomaly detection on consumption to identify failing appliances before
they break (e.g., a fridge drawing 2x normal). Validate with controlled
experiments.

## Closing note

The current implementation is a working MVP that demonstrates the architecture
and the dual-module concept. The improvements above are not all needed — they
are options to consider depending on which direction this project would move
in: a production product, a deeper research dissertation, or a portfolio
piece.
