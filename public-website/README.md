# CarePlus Public Website

Public-facing clinic website — separate from the admin dashboard (`frontend/`).

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Axios
- React Router DOM

## Pages

- **Home** — Hero, doctor section, testimonials, contact CTA
- **About Doctor** — Profile, qualifications, expertise
- **Treatments** — Services offered
- **Contact** — Clinic info and hours
- **Book Appointment** — Public booking form (saves to backend with `PENDING` status)

## Setup

```bash
cd public-website
npm install
npm run dev
```

Runs at **http://localhost:5174** (admin dashboard uses port 5173)

## Backend

Requires Spring Boot API at `http://localhost:8080`

Public endpoint: `POST /api/public/appointment-requests`

## Project Structure

```
public-website/
├── src/
│   ├── components/
│   │   ├── layout/     Header, Footer, PublicLayout
│   │   ├── home/       Hero, DoctorSection, Testimonials, ContactSection
│   │   └── forms/      AppointmentForm
│   ├── pages/          Home, AboutDoctor, Treatments, Contact, BookAppointment
│   ├── services/       appointmentRequestService.js
│   └── routes/         AppRoutes.jsx
```
