GreenGrid
=========

A smart green energy platform that combines an energy consumption dashboard
with an e-commerce store for green energy products. Built as a B.Tech
final-year project.

Users can:
  - Track their household energy usage with charts (daily, weekly, monthly)
  - See peak vs off-peak split, monthly comparisons, estimated cost,
    carbon footprint
  - Browse and shop products like solar panels, inverters, batteries,
    smart meters, LED lighting, and energy-efficient appliances
  - Place orders with cash-on-delivery checkout


Features
--------

Energy Dashboard
  - Live consumption chart with Daily / Weekly / Monthly toggle
  - Peak vs Off-peak donut chart
  - Current vs Previous month bar comparison
  - Stat cards: usage, estimated cost, carbon footprint,
    month-over-month change
  - Meter info: meter number, connection type, sanctioned load, tariff rate

E-commerce Store
  - Home page with hero, category cards, and Best Deals section
  - Product listing with search, category filter, and sort
    (price asc/desc, name)
  - Product detail with image, full specs, stock status, quantity selector
  - Cart: add / update / remove items, server-side total
  - Checkout with shipping address form, COD payment, order confirmation
  - Stock validation on add and on order placement

Auth
  - JWT-based authentication
  - Register / Login flows
  - Protected routes for cart, checkout, dashboard
  - Auth-aware Navbar (sign-in/up buttons or user name + sign out)

UI
  - Responsive layout (mobile, tablet, desktop)
  - Light / Dark theme toggle (persists in localStorage)
  - Consistent green theme across both modules

===============================================================================
LINUX - INSTALLATION (Ubuntu 22.04+, Debian 12+, Pop!_OS, Linux Mint)
===============================================================================

Tested on Ubuntu 22.04 and 24.04. Commands assume bash and a regular user
with sudo access.

1. System prerequisites
-----------------------

Update package lists and install the basics:

  sudo apt update
  sudo apt install -y git curl build-essential

1.1 Python 3.10+

  python3 --version
  sudo apt install -y python3-pip python3-venv python3-dev

1.2 Node.js 20+ via nvm

The frontend uses Vite 6 which requires Node 18.18+. The Ubuntu apt
version is usually too old, so install via nvm:

  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  source ~/.bashrc
  nvm install 20
  nvm use 20
  node --version

1.3 MySQL 8

  sudo apt install -y mysql-server
  sudo systemctl enable --now mysql
  sudo systemctl status mysql

By default the root user on Ubuntu MySQL uses auth_socket. Set a password
so the backend can connect over TCP:

  sudo mysql

In the MySQL prompt:

  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password_here';
  FLUSH PRIVILEGES;
  EXIT;

Verify:

  mysql -u root -p


2. Create the database
----------------------

  mysql -u root -p

In the MySQL prompt:

  CREATE DATABASE greengrid;
  EXIT;


3. Backend setup
----------------

  cd backend
  python3 -m venv venv
  source venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt

Create a file named .env inside the backend folder with these contents
(replace the password with your MySQL root password and JWT secret with
a random string):

  DB_HOST=localhost
  DB_PORT=3306
  DB_NAME=greengrid
  DB_USER=root
  DB_PASSWORD=your_password_here
  JWT_SECRET=change_this_to_a_random_string
  JWT_EXPIRY_HOURS=24

To generate a strong JWT secret:

  python3 -c "import secrets; print(secrets.token_hex(32))"

Start the backend (auto-creates the tables on first run):

  uvicorn app.main:app --reload --port 8000

Visit http://localhost:8000/docs to confirm. Leave this terminal running.


4. Seed sample data
-------------------

Open a second terminal, activate the venv, and run:

  cd backend
  source venv/bin/activate
  python seed_data.py

For meter readings, first register a user named test@example.com via
http://localhost:5173/register (after starting the frontend in step 5),
then run:

  python seed_meter.py


5. Frontend setup
-----------------

In a third terminal:

  cd frontend
  nvm use 20
  npm install
  npm run dev

Open http://localhost:5173 in your browser.


===============================================================================
LINUX - DAILY RUN
===============================================================================

After install you only need three terminals:

Terminal 1 - MySQL (skip if already running)

  sudo systemctl start mysql

Terminal 2 - Backend

  cd backend
  source venv/bin/activate
  uvicorn app.main:app --reload --port 8000

Terminal 3 - Frontend

  cd frontend
  npm run dev

Open http://localhost:5173.

Stop the app:
  Backend / Frontend: Ctrl + C in each terminal
  MySQL (optional):   sudo systemctl stop mysql


===============================================================================
WINDOWS - INSTALLATION (Windows 10 / 11)
===============================================================================

Use PowerShell for all commands.

1. Install prerequisites
------------------------

Download and install (defaults are fine, check "Add to PATH" where offered):

  Python 3.10+              https://www.python.org/downloads/windows/
  Node.js 20 LTS            https://nodejs.org/
  MySQL 8 Community Server  https://dev.mysql.com/downloads/installer/
                            (set a root password during install - remember it)
  Git                       https://git-scm.com/download/win

Verify in a new PowerShell window:

  python --version
  node --version
  mysql --version
  git --version


2. Create the database
----------------------

  mysql -u root -p

In the MySQL prompt:

  CREATE DATABASE greengrid;
  EXIT;


3. Backend setup
----------------

  cd backend
  python -m venv venv
  venv\Scripts\activate
  pip install --upgrade pip
  pip install -r requirements.txt

Create a file named .env inside the backend folder with these contents
(replace the password with your MySQL root password and JWT secret with
a random string):

  DB_HOST=localhost
  DB_PORT=3306
  DB_NAME=greengrid
  DB_USER=root
  DB_PASSWORD=your_password_here
  JWT_SECRET=change_this_to_a_random_string
  JWT_EXPIRY_HOURS=24

Start the backend (auto-creates the tables on first run):

  uvicorn app.main:app --reload --port 8000

Visit http://localhost:8000/docs to confirm. Leave running.


4. Seed sample data
-------------------

In a second PowerShell:

  cd backend
  venv\Scripts\activate
  python seed_data.py

Register test@example.com / test1234 via http://localhost:5173/register
(after starting the frontend in step 5), then:

  python seed_meter.py


5. Frontend setup
-----------------

In a third PowerShell:

  cd frontend
  npm install
  npm run dev

Open http://localhost:5173.


===============================================================================
WINDOWS - DAILY RUN
===============================================================================

MySQL usually runs as a Windows service automatically. If not:

  net start MySQL80

Terminal 1 - Backend

  cd backend
  venv\Scripts\activate
  uvicorn app.main:app --reload --port 8000

Terminal 2 - Frontend

  cd frontend
  npm run dev

Open http://localhost:5173.

Stop the app:
  Backend / Frontend: Ctrl + C in each PowerShell window
  MySQL (optional):   net stop MySQL80


===============================================================================
DEMO LOGIN
===============================================================================

After running the seed scripts, log in with:

  Email:    test@example.com
  Password: test1234

This account has the meter profile and dashboard data attached.

