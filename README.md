# Manjiri - Smart School Management System for CBSE Principals

## 👨‍💻 Project by: Reva
**Squad:** S73  
**GitHub:** [Your GitHub Username]

---

## 🎯 Project Overview

**Manjiri** is a comprehensive school management system designed specifically for CBSE principals to streamline administrative tasks, enhance communication, and improve operational efficiency.

### Problem Statement

CBSE principals face multiple challenges in their daily operations:
- **Communication Gaps:** Difficulty coordinating with staff, teachers, parents, and CBSE board
- **Academic Tracking:** Manual tracking of syllabus progress, exam reports, and student performance
- **Document Management:** Scattered storage of important reports, notices, and circulars
- **Event Scheduling:** Inefficient calendar management for school activities
- **Data Security:** Need for role-based access to sensitive information

### Solution

Manjiri provides a centralized platform with:

1. **Unified Dashboard**
   - Real-time attendance tracking
   - Performance analytics
   - Quick access to important metrics

2. **Communication Hub**
   - Messaging system for staff and parents
   - Announcement broadcasting
   - Notification management

3. **Academic Tracking**
   - Syllabus completion monitoring
   - Exam report generation
   - Performance analytics

4. **Document Management**
   - Secure cloud storage
   - Categorized filing system (Reports, Notices, Circulars)
   - Easy search and retrieval

5. **Event Calendar**
   - Comprehensive scheduling system
   - Automated reminders
   - Event categorization

6. **Role-Based Security**
   - JWT authentication
   - Permission-based access control
   - Secure data handling

---

## 🛠️ Technical Stack

### Frontend
- **Framework:** React.js
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** CSS3 / Tailwind CSS
- **State Management:** React Hooks (useState, useEffect)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **API Architecture:** RESTful APIs

### Database
- **Database:** MongoDB
- **ODM:** Mongoose
- **Cloud Hosting:** MongoDB Atlas

### Authentication & Security
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Authorization:** Role-based access control

### File Storage
- **Cloud Storage:** Cloudinary
- **Upload Handling:** Multer

### Deployment
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** MongoDB Atlas (Cloud)

---

## 📅 Day-by-Day Development Plan (10 Weeks)

### Week 1: Planning & Design
**Day 1-2:** Research and Requirements Gathering
- Study CBSE principal needs
- Analyze existing school management systems
- Define feature requirements
- Create user personas

**Day 3-4:** UI/UX Design
- Create low-fidelity wireframes in Figma
- Design high-fidelity mockups
- Define color scheme and branding
- Design responsive layouts

**Day 5-7:** Design Refinement
- Gather initial feedback
- Iterate on designs
- Create component library
- Finalize design system

### Week 2: Development Environment Setup
**Day 8-9:** Backend Initialization
- Set up Node.js + Express project structure
- Configure MongoDB Atlas database
- Set up environment variables
- Create basic server architecture

**Day 10-11:** Frontend Initialization
- Initialize React application
- Set up routing structure
- Configure axios for API calls
- Create folder structure

**Day 12-14:** Version Control & Documentation
- Set up GitHub repository with proper structure
- Create comprehensive README
- Set up GitHub Projects for task tracking
- Create initial issues and milestones

### Week 3: Database & Authentication
**Day 15-17:** Database Schema Design
- Design User model (Principal, Teacher, Parent roles)
- Design Document model with relationships
- Design Event model with associations
- Implement database relationships (one-to-many, many-to-many)

**Day 18-21:** Authentication System
- Implement user registration endpoint
- Implement login with JWT generation
- Create authentication middleware
- Implement password hashing with bcrypt
- Test authentication flow end-to-end

### Week 4: Core API Development
**Day 22-24:** Document Management APIs
- Create POST endpoint for document creation
- Create GET endpoint for retrieving documents
- Create PUT endpoint for document updates
- Create DELETE endpoint for document removal

**Day 25-28:** Event Management APIs
- Create CRUD endpoints for events
- Implement event-user associations
- Create filtering and sorting logic
- Test all API endpoints with Postman/Bruno

### Week 5: File Upload & Storage
**Day 29-31:** Cloudinary Integration
- Set up Cloudinary account and credentials
- Configure multer for file handling
- Implement file upload endpoint
- Test file upload with different formats

**Day 32-35:** File Management Features
- Create file download functionality
- Implement file deletion
- Add file size and type validation
- Create file preview system

### Week 6: Frontend - Authentication UI
**Day 36-38:** Login/Register Components
- Create Login component with form validation
- Create Register component with role selection
- Implement JWT token storage
- Create authentication context/provider

**Day 39-42:** Protected Routes
- Implement route protection logic
- Create authentication HOC/hooks
- Add logout functionality
- Handle token expiration

### Week 7: Frontend - Main Features
**Day 43-45:** Dashboard Component
- Create dashboard layout
- Implement statistics display
- Create quick access widgets
- Add data visualization (charts/graphs)

**Day 46-49:** Document Management UI
- Create DocumentList component
- Create DocumentForm for uploads
- Implement file upload interface
- Add document filtering and search

### Week 8: Frontend - Advanced Features
**Day 50-52:** Event Calendar
- Create Event Calendar component
- Implement event creation form
- Add event editing and deletion
- Create event reminders

**Day 53-56:** Update & Delete Functionality
- Implement edit mode for documents
- Add delete confirmation dialogs
- Create update forms for all entities
- Test all CRUD operations in UI

### Week 9: Integration & Deployment
**Day 57-59:** Backend Deployment
- Prepare backend for production
- Deploy to Render
- Configure environment variables
- Test deployed APIs

**Day 60-63:** Frontend Deployment
- Build production React app
- Deploy to Vercel
- Connect to deployed backend
- Test complete application flow

### Week 10: Testing & Documentation
**Day 64-66:** Testing & Bug Fixes
- End-to-end testing of all features
- Fix identified bugs
- Optimize performance
- Test on different devices/browsers

**Day 67-70:** Documentation & Presentation
- Update README with setup instructions
- Create API documentation
- Record demo video
- Prepare presentation slides

---

## 📂 Project Structure