# Citizen Complaint Management System

Citizen Complaint Management System is a full-stack web application that allows citizens to report public issues (such as potholes, damaged roads, faulty streetlights, garbage overflow, and water leaks) directly to local authorities. It is built using Java Spring Boot on the backend and React (Vite) on the frontend.

The system uses Google Gemini AI to automatically assign the complaint to the right department based on the description, detects duplicate reports in the same area, stores photo evidence using Cloudinary, and verifies user mobile numbers with SMS OTP.

---

## How It Works

- A citizen signs in with an OTP-verified phone number, selects their area, describes the issue, and uploads a photo.
- Gemini AI reads the problem description, automatically assigns it to the appropriate department (such as Roads, Water, Electricity, or Sanitation), and groups nearby duplicate reports into a single incident.
- The complaint is assigned to the on-duty field officer responsible for that department and area.
- The officer inspects the site, updates the status to `IN_PROGRESS`, and marks it `RESOLVED` with work notes once completed.
- The citizen tracks live progress and officer updates directly from their personal dashboard.
- The admin monitors real-time statistics, tracking total complaints, department performance, and resolution rates across all areas.

---

## User Roles

- **Citizen**: Submits complaints with photos and location details, tracks live progress, and reads officer updates.
- **Officer**: Views complaints assigned to their department and area, inspects the site, updates status (`PENDING` -> `IN_PROGRESS` -> `RESOLVED`), and submits work remarks.
- **Admin**: Monitors live dashboard statistics (total complaints, resolution rates, and department performance), assigns tasks, and manages accounts and areas.

---

## Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS
- Axios
- Lucide React

### Backend
- Java 17 and Spring Boot 3.4
- Spring Security (JWT & Cookies)
- Spring Data JPA
- Google Gemini AI
- Lombok

### Database & Cloud Services
- PostgreSQL (Neon Cloud)
- Cloudinary
- 2Factor.in SMS API
