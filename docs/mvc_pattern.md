# Model-View-Controller (MVC) Pattern

This document explains the Model-View-Controller architecture of the **Online Complaint Registration** application.

---

## 1. MVC Architecture Overview

The system strictly follows the MVC pattern to separate data representation, user interfaces, and routing logic:

```
        ┌────────────────────────────────────────────────────────┐
        │                          VIEW                          │
        │             (React.js User Interfaces)                │
        └──────────────────────────┬─────────────────────────────┘
                                   │
                    1. Send REST Requests (Axios)
                                   ▼
        ┌────────────────────────────────────────────────────────┐
        │                       CONTROLLER                       │
        │                  (Express API Routes)                  │
        └──────────────────────────┬─────────────────────────────┘
                                   │
                    2. Query & Modify (Mongoose)
                                   ▼
        ┌────────────────────────────────────────────────────────┐
        │                         MODEL                          │
        │               (MongoDB Data Schemas)                   │
        └────────────────────────────────────────────────────────┘
```

---

## 2. Architectural Layers

### 🗃️ 1. Models (Mongoose Schemas)
Located in `backend/models/`. These modules define the data structure, data validation rules, and business constraints for the database.
* **`User.js`**: Defines fields for user credentials, roles, and profiles.
* **`Complaint.js`**: Defines fields for lodging complaints (Address, City, State, Pin Code, comments, statuses, etc.).
* **`Assignment.js`**: Defines mappings for matching agents to specific complaints.
* **`Message.js`**: Defines fields for chat message records.

---

### 💻 2. Views (React.js Components & Pages)
Located in `frontend/src/`. This represents the presentation layer that the user interacts with.
* **Pages**: Landing page, Login page, Register page, User Dashboard, Lodge Complaint form, Agent Dashboard, Admin dashboard, and Complaint details/chat view.
* **Components**: Shared visual UI blocks like Navbar, Sidebar, status trackers, and cards.
* **Context**: `AuthContext.jsx` manages user state and sessions.

---

### ⚙️ 3. Controllers (Express Routes & Middleware)
Located in `backend/routes/` and `backend/middleware/`. This is the business logic layer that coordinates user actions and database transactions.
* **Auth Controller (`auth.js`)**: Processes login and registration, hashes passwords, generates JWT tokens, and validates user roles.
* **Complaint Controller (`complaints.js`)**: Processes lodging complaints, retrieving lists, searching, and managing cases.
* **Assignment Controller**: Allows admins to assign agents/officers to open complaints.
* **Message Controller**: Handles fetching and posting of support chat messages.
* **Auth Middleware (`authMiddleware.js`)**: Validates JSON Web Tokens to protect routes from unauthenticated users.
