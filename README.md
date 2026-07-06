# Online Complaint Registration System (MERN Stack)

A web application designed with modern, glowing, and radiant aesthetics for filing and tracking utility or service complaints. 

---

## 💻 Part 1: How to Run Locally

### 1. Database Setup (MongoDB Atlas)
1. Go to your **[MongoDB Atlas Console](https://cloud.mongodb.com)**.
2. Under **Security** in the left sidebar, click **Network Access**.
3. Click **Add IP Address** ➔ Select **Allow Access From Anywhere** (or click **Add Current IP Address**) ➔ Click **Confirm**.
4. Ensure the file `server/.env` contains your correct database password formatted like this (especially if it has special characters like `@` which must be URL-encoded as `%40`):
   ```text
   PORT=5000
   MONGO_DB=mongodb+srv://sohankumarsahu402_db_user:sohan%40123@cluster0.v5tentg.mongodb.net/complaint_db?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=complaint_registration_secret_key_987654321
   ```

### 2. Start the Backend Server
Open a terminal in the project root:
```bash
cd server
npm install
npm run dev
```
*The server will run on [http://localhost:5000](http://localhost:5000).*

### 3. Start the Frontend React Client
Open a second terminal in the project root:
```bash
cd frontend
npm install
npm run dev
```
*The client will start on [http://localhost:5173](http://localhost:5173).*

---

## 🚀 Part 2: How to Deploy to the Cloud (Later)

### Step 1: Deploy Backend to Render
1. Create a free account on **[Render.js](https://render.com)**.
2. Click **New +** ➔ Select **Web Service**.
3. Link your GitHub repository (`ONLINE_COMPLAINT_REGISTRATION`).
4. Configure settings:
   * **Root Directory**: `server`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
5. In the **Environment Variables** section, add:
   * `PORT` = `10000` (or leave it to Render's default)
   * `MONGO_DB` = `mongodb+srv://sohankumarsahu402_db_user:sohan%40123@cluster0.v5tentg.mongodb.net/complaint_db?retryWrites=true&w=majority&appName=Cluster0`
   * `JWT_SECRET` = `your_secure_random_key_here`
6. Click **Deploy Web Service**. Render will build and run your backend and give you a live URL (e.g. `https://online-complaint-backend.onrender.com`).

### Step 2: Connect Frontend to the Live Backend
Before deploying the frontend, update the API URL to point to your new live backend:
1. Open the file `frontend/src/context/AuthContext.jsx`.
2. Locate line 7:
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   ```
3. Change it to your Render live backend URL:
   ```javascript
   const API_URL = 'https://online-complaint-backend.onrender.com/api';
   ```
4. Open the file `frontend/src/components/common/ChatWindow.jsx`.
5. Locate line 35:
   ```javascript
   socketRef.current = io('http://localhost:5000');
   ```
6. Change it to your Render live URL (without `/api`):
   ```javascript
   socketRef.current = io('https://online-complaint-backend.onrender.com');
   ```
7. Commit and push these two updates to GitHub:
   ```bash
   git add .
   git commit -m "config: update backend URLs for cloud deployment"
   git push
   ```

### Step 3: Deploy Frontend to Vercel (or Netlify)
#### Option A: Vercel (Recommended)
1. Go to **[Vercel](https://vercel.com)** and log in with your GitHub account.
2. Click **Add New** ➔ **Project** ➔ Import your `ONLINE_COMPLAINT_REGISTRATION` repository.
3. Configure the framework:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
4. Click **Deploy**. Vercel will build and give you a permanent live link!

#### Option B: Netlify
1. Go to **[Netlify](https://netlify.com)** and log in with GitHub.
2. Click **Add new site** ➔ **Import an existing project**.
3. Choose your repository and set:
   * **Base Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Publish Directory**: `dist`
4. Click **Deploy site**.
