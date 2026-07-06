# Project Features List

This document lists and explains the core features of the **Online Complaint Registration** application.

---

## 1. User Registration & Profile Creation

* **Secure Sign-Up**: 
  - Users can sign up securely using their email, phone number, and password.
  - Implements password encryption (bcrypt) to ensure credential confidentiality.
* **Profile Creation**: 
  - Stores comprehensive profile details including name, contact phone number, and account role (`user`, `agent`/`officer`, `admin`) to maintain tracking logs.

---

## 2. Officer Browsing & Complaint Type Filtering

* **Search & Filter Officers/Departments**: 
  - Complainants can browse and search through different departments (e.g., Police, Electricity, Municipal Corporation) to direct their complaints to the correct authorities.
* **Real-Time Status Tracking**: 
  - Users can check live statuses (`Pending`, `In Progress`, `Resolved`, `Rejected`) and look up officer availability states.

---

## 3. Complaint Lodging & Management

* **Easy Complaint Form**: 
  - Citizens can submit a complaint by filling out critical details: Address, City, State, Pin Code, and a Comment describing the issue.
  - Supports attachments (images/documents) to provide visual proof of issues (e.g., pipe leakage, electrical fault).
* **Automated Updates**: 
  - Sends immediate notifications (email or SMS) when a complaint is registered, assigned to an officer, or successfully resolved.

---

## 4. Officer's Dashboard

* **Manage Assigned Complaints**: 
  - Officers/agents can view a list of complaints assigned specifically to them, filterable by date, priority, or region.
* **Action Logging**: 
  - Officers can record progression notes, add operational updates, change complaint statuses, and attach completion reports.

---

## 5. Admin Controls & Verification

* **Officer Approval System**: 
  - Administrators review and authorize agent/officer accounts before they can access and process citizens' complaints, preserving platform integrity.
* **System Monitoring & Governance**: 
  - Provides administrators with system-wide analytics, dispute escalation tools, user moderation, and compliance auditing.
