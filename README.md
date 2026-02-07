# 🛡️ Women and Family Protection Management System
### 📍 Barangay 183 Villamor, Pasay City

<div align="center">
  <img src="https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/500239037_671974392308023_7855615069596178046_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=TEverAfJPtEQ7kNvwE8HiAS&_nc_oc=AdkFDw3f60SaRrO1vx4gvZq3N_FhBM7xxajmw37QGbTwI3I3RGMwT2qweLZL3F9TCnyuueCg5CcLv-fBV0mkXwT6&_nc_zt=23&_nc_ht=scontent.fmnl4-2.fna&_nc_gid=kBfWXX5jJfGbK7n94FDcoQ&oh=00_Afu9Sq-2DlCsgDmFgP1-poo1HgzqMdyZ4-u2pslOJJq5-g&oe=698D45C7" width="100px" height="100px" />
  <img src="https://scontent.fmnl4-3.fna.fbcdn.net/v/t39.30808-6/316528967_473338041561875_6339995951810963287_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=UCo2j1FiTLYQ7kNvwEhM6Zc&_nc_oc=AdnPMxka_UUncLSCaEb1TjtYwDjcj-EJcSfUnR8-ekHRMKxMqc4UkQKQ5VpyxwSVmboq6lprkP4MJG4H8gkOjCXz&_nc_zt=23&_nc_ht=scontent.fmnl4-3.fna&_nc_gid=EXc9gamKErfJaKeYJ1lSdQ&oh=00_AfsGS1jng4liU9wYOXSEQM-aym3eNFFqT5m9_DwXsM7Grg&oe=698D2D56" width="100px" height="100px" />
  <br />
  <h1><b>PROTECTING WOMEN & CHILDREN</b></h1>
  <p><i>Para sa mga kababaihan at kabataan na nangangailangan ng proteksyon.</i></p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active_Capstone-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Security-Data_Privacy_Compliant-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Coverage-Barangay_183-yellow?style=for-the-badge" />
</div>

---

## 🚨 Emergency Hotlines (Live Marquee)
> [!IMPORTANT]
> **BRGY EMERGENCY:** `0917-XXX-XXXX` | **VAWC HOTLINE:** `0918-XXX-XXXX`

---

## 🏛️ Accredited Organizations
*These groups are managed dynamically via the Admin Panel CRUD system.*

| Organization | Leadership | Status |
| :--- | :--- | :--- |
| **KALIPI** | President: TBA | ✅ Accredited |
| **SOLO PARENT** | President: TBA | ✅ Accredited |
| **ERPAT** | President: TBA | ✅ Accredited |
| **VCO** | President: TBA | ✅ Accredited |

---

## 🛠️ System Architecture (The Logic)

This project is built using **SOLID Principles** and **OOP (Object-Oriented Programming)** to ensure a maintainable and scalable codebase for the LGU.



### 🔹 Key Technical Implementation:
1. **RBAC (Role-Based Access Control):** Custom middleware to separate Admin, Committee Heads, and Residents.
2. **Case Lifecycle Logic:** Automated state transitions: 
   `NEW` ➡️ `ON-GOING` ➡️ `RESOLVED/REFERRED`.
3. **Data Archiving Strategy:** Implementation of **Soft Deletes** in MySQL to ensure legal records are never truly purged, maintaining a 100% audit trail.
4. **Dynamic CRUD:** Administrators can add new Organizations and Announcements without touching the source code.

---

## 📊 Analytics Dashboard Preview
The system provides real-time "Backtrack Statistics" (e.g., January to February trends) for:
- **Total Reported Cases** (VAWC & CPP)
- **Membership Growth Rates**
- **Program Engagement Analytics**

---

## 💻 Tech Stack
- **Frontend:** React.js, Inertia.js, Tailwind CSS, Shadcn/UI
- **Backend:** Laravel 10 (PHP 8.2)
- **Database:** MySQL
- **AI:** Python-based Chatbot (Manual Implementation)

---

<div align="center">
  <sub>Developed for the betterment of Barangay 183 Villamor Community.</sub>
</div>
