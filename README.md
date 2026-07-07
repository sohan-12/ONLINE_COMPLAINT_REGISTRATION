# 🛡️ Online Complaint Registration System (MERN Stack)

A premium web application designed with modern, glowing, and radiant aesthetics for filing and tracking utility or service complaints. Equipped with real-time support chat, automated priority sorting, and a full-featured administrative control suite.

---

## 🔗 Live Application Links

* **🎨 Live Frontend Portal**: [https://complaint-portal-frontend.onrender.com](https://complaint-portal-frontend.onrender.com)
* **⚙️ Live Backend API**: [https://complaint-backend-qwim.onrender.com](https://complaint-backend-qwim.onrender.com)

---

## ⚡ Core Features

* **Ordinary User (Citizen) Dashboard**: Lodge issues with addresses and pincodes, view current status, and track historical submissions.
* **Support Ticket Chatroom**: Real-time Socket.io communication channels between the lodged citizen and assigned field agents.
* **Admin Control Console**: Route tickets to verified officials, manually update status, and manage the agent database.
* **Auto-Priority Badging**: Automatic high/medium/low priority sorting based on complaint descriptions (e.g. water leakage, waste).
* **Live Search & Filters**: Search complaint backlogs by citizen names, location descriptions, or filter by City and Case Status.
* **Officer Approval Pipeline**: Inspect pending field agent applications with manual **Approve** and **Reject** validation actions.

---

## 📸 Application Screenshots

### 🔑 User Account Registration Dropdown
![User Account Registration](/screenshots/register.png)

### 📋 Citizen Registry Database (Admin View)
![Citizen Registry Database](/screenshots/citizen_registry.png)

### 👮 Manage Field Agents / Approvals (Admin View)
![Manage Field Agents](/screenshots/field_agents.png)

---

## 💻 Running Locally

### 1. Database Setup (MongoDB Atlas)
1. Ensure the file `server/.env` contains your correct database credentials:
   ```text
   PORT=5000
   MONGO_DB=mongodb+srv://sohankumarsahu402_db_user:sohan%40123@cluster0.v5tentg.mongodb.net/complaint_db?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=complaint_registration_secret_key_987654321
   ```

### 2. Run Database Seeders
Seeders are included to quickly populate administrative credentials and mock Indian-named profiles/cases:
* **Seed Admin Account** (`admin@gmail.com` / `admin123`):
  ```bash
  cd server
  node seedAdmin.js
  ```
* **Seed Citizens, Agents, and Complaints**:
  ```bash
  cd server
  node seedData.js
  ```

### 3. Start Backend API Server
```bash
cd server
npm install
npm run dev
```
*API is accessible at [http://localhost:5000](http://localhost:5000).*

### 4. Start React Frontend Client
```bash
cd frontend
npm install
npm run dev
```
*Client starts at [http://localhost:5173](http://localhost:5173).*

---

## 🚀 Cloud Deployment (Render Only)

This project is configured to run fully on **Render** (free tier).

### Step 1: Deploy Backend (Web Service)
1. Click **New +** ➔ **Web Service** on Render.
2. Link this GitHub repository.
3. Configure settings:
   * **Root Directory**: `server`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Set Environment Variables:
   * `MONGO_DB` = `your_mongodb_atlas_uri`
   * `JWT_SECRET` = `your_secret_key`
5. Click **Deploy Web Service** and copy your backend URL.

### Step 2: Update Code for Live Backend Connection
Configure the React code to query your live Render backend URL:
1. In `frontend/src/context/AuthContext.jsx`, change:
   `const API_URL = 'http://localhost:5000/api';` ➔ `https://your-backend.onrender.com/api`
2. In `frontend/src/components/common/ChatWindow.jsx`, change:
   `socketRef.current = io('http://localhost:5000');` ➔ `io('https://your-backend.onrender.com')`
3. Commit and push:
   ```bash
   git add .
   git commit -m "config: link React client to live Render backend API"
   git push
   ```

### Step 3: Deploy Frontend (Static Site)
1. Click **New +** ➔ **Static Site** on Render.
2. Link the same repository.
3. Configure settings:
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Publish Directory**: `dist`
4. Under **Settings** tab, verify **Build Command** is exactly `npm run build` (no typos).
5. Click **Deploy Static Site**. Render will serve your React app on a live HTTPS link!
