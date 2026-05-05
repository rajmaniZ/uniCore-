# uniCore (CampusOS)

## Overview

uniCore is a centralized, role-based academic management platform designed to digitize and streamline campus operations. It provides a unified interface for students, teachers, department heads (HODs), and administrators to manage academic workflows such as attendance, assignments, subjects, communication, and analytics.

The system replaces fragmented tools with a structured, scalable platform that improves efficiency, transparency, and control.

---

## Problem Statement

Most educational institutions face operational challenges due to:

- Fragmented tools (WhatsApp, email, spreadsheets, manual registers)
- Lack of structured academic workflows
- Manual attendance and assignment tracking
- Poor visibility into student performance
- Inefficient communication between stakeholders
- No proper role-based data access
- Difficulty managing multiple institutions

These issues lead to time loss, data inconsistency, and poor decision-making.

---

## Proposed Solution

uniCore introduces a centralized, role-based system that integrates all academic activities into one platform.

### Key Objectives

- Centralize academic data
- Enforce secure role-based access
- Improve communication
- Automate routine tasks
- Enable data-driven insights
- Support multi-college scalability

---

## System Architecture (Conceptual)

Frontend (React)
↓
State Management (Hooks / Context)
↓
Mock Data Layer (Simulated Backend)
↓
Role-Based UI Rendering (RBAC)

---

## Development Approach

### 1. Problem Analysis

We identified key inefficiencies in traditional systems:
- Scattered data
- Lack of structure
- Manual operations

### 2. Modular Design

We divided the system into modules:

- Authentication
- Dashboard
- Subjects
- Classes
- Assignments
- Attendance
- Join Requests
- Analytics

### 3. Role-Based Architecture

We designed UI and data access based on roles:

- Super Admin
- College Admin
- HOD
- Teacher
- Student

Each role has controlled access and a customized dashboard.

### 4. Component-Based UI

Reusable components were created:

- Sidebar
- Topbar
- Cards
- Tables
- Charts
- Lists

### 5. Dynamic Data Handling

- Used React state (useState)
- Updated UI dynamically
- Simulated backend behavior

### 6. UI/UX Design

- Dashboard-first layout
- Glassmorphism design
- Dual theme (Light/Dark)
- Responsive grid

---

## Tech Stack

### Frontend
- React.js
- React Router DOM

### Styling
- CSS Modules
- Custom design system

### State Management
- React Hooks
- Context API (optional)

### Data Layer
- Mock Data (JavaScript objects)

### UI Enhancements
- Recharts / Chart.js
- React Icons

---

## Key Features

### 1. Role-Based Access Control (RBAC)

| Role | Access |
|------|--------|
| Super Admin | All colleges |
| College Admin | One college |
| HOD | Department |
| Teacher | Assigned classes |
| Student | Personal data |

---

### 2. Dashboard System

- Role-based dashboards
- Stats overview
- Activity tracking
- Performance analytics

---

### 3. Subject Management

Each subject includes:

- Assignments
- Notes
- Previous classes
- Syllabus
- Progress tracking

---

### 4. Join Request System

Flow:
1. User submits request
2. Admin reviews
3. Approve or reject
4. User added to system

---

### 5. Attendance System

- Teachers mark attendance
- Stored per class and subject
- Students view history

---

### 6. Assignment System

- Teachers create assignments
- Students submit work
- Status tracking
- Marks and feedback

---

### 7. Communication System

- Class-based communication
- Subject-based announcements
- Role-based visibility

---

### 8. Analytics & Reports

- Attendance graphs
- Performance tracking
- Activity insights

---

### 9. Multi-College Support

- Supports multiple institutions
- Data isolation per college
- Scalable architecture

---

## Role-Wise Usage

### Student
- View subjects and notes
- Submit assignments
- Track attendance

### Teacher
- Manage classes
- Mark attendance
- Create assignments

### HOD
- Monitor department
- Analyze performance

### College Admin
- Manage users
- Approve requests
- View reports

### Super Admin
- Manage all colleges
- Full system control

---

## Editable vs Restricted Data

### Non-Editable
- Email
- Username
- College Code
- Roll Number / Employee ID

### Editable
- Phone
- Address
- Profile image

---

## Project Structure

src/
│
├── components/
├── pages/
├── mockData/
├── context/
└── styles/

---

## How to Run

1. Clone repository  
git clone <repo-url>

2. Install dependencies  
npm install

3. Run project  
npm run dev

---

## How It Works

1. User logs in  
2. Role is identified  
3. Dashboard loads accordingly  
4. Data fetched from mockData  
5. UI updates dynamically  

---

## Stakeholder Benefits

### Students
- Organized learning
- Easy access to materials

### Teachers
- Efficient class management
- Reduced manual work

### Admins
- Centralized control
- Better monitoring

### Institutions
- Scalable system
- Digital transformation

---

## Future Enhancements

- Backend integration
- Database support
- Real-time chat
- AI-based insights
- Mobile application

---

## Learning Outcomes

- RBAC implementation
- Scalable frontend architecture
- Dynamic UI development
- Real-world system design

---

## Conclusion

uniCore transforms traditional academic management into a structured, scalable, and efficient digital platform, improving communication, organization, and performance across institutions.

---

## Author

Developed as part of an academic project for building a modern campus management system.a

