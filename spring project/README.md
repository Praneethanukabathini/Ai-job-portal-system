# AI Job Portal System (Modern Engineering Careers & Smart Matching)

A complete, modern, professional, and responsive **AI Job Portal System** built with **HTML5, CSS3, and Vanilla JavaScript**, backed by dynamic **LocalStorage** state management, and fully architected for **Java Spring Boot & Thymeleaf** full-stack deployment.

---

## 🌟 Quick Start (Runs Instantly in Any Web Browser)

**No build tools or server installation required to test immediately!**
Simply open [`index.html`](file:///c:/Users/nukab/OneDrive/Desktop/spring%20project/index.html) in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari:

1. Double-click **`index.html`** or right-click → **Open with Browser**.
2. Everything is 100% interactive and operational immediately:
   - Search & dynamic filtering across Indian tech jobs (Bengaluru, Hyderabad, Pune, Chennai, Mumbai) with realistic salaries in ₹ LPA.
   - Live AI Job Recommendation & Skill Gap Analysis.
   - Interactive Resume Builder with live A4 preview and Print to PDF.
   - Candidate & Recruiter Dashboards with application pipeline status workflows.

---

## 🔑 Demo Login Credentials (Password: `12345`)

Both login modals and the dedicated [login page](file:///c:/Users/nukab/OneDrive/Desktop/spring%20project/login.html) include **⚡ 1-Click Demo Login** buttons:

| Role | Demo Email | Password | Default Profile / Title |
| :--- | :--- | :--- | :--- |
| **Candidate / Job Seeker** | `rahul.sharma@example.com` | `12345` | Full Stack Java & Frontend Developer (NIT Warangal, 2 Yrs Exp) |
| **Recruiter / Employer** | `priya.hr@techcorp.in` | `12345` | Head of Talent Acquisition at **TechCorp India** |

> **Note:** You can also register brand-new Candidate and Recruiter accounts with your own details. All data is persisted automatically in `localStorage`.

---

## 🚀 Key Features Implemented

### 1. Home Page
- **Modern Navbar**: Sleek AI logo badge, theme toggle (Dark / Light mode), navigation links, and dynamic user session menu.
- **Hero Section**: "Find Your Dream Job with AI", multi-criteria search bar (Job title/keywords, skills, and city dropdown), and popular search chips.
- **Popular Job Categories**: Software Development, AI & Data Science, Core Engineering (VLSI), Cloud & DevOps, UI/UX & Product.
- **Featured Jobs Grid**: High-paying vacancies with dynamic AI match percentage badges.
- **Platform Statistics**: 15,000+ Verified Jobs, 98.4% AI Match Accuracy, 12,500+ Hires in India.
- **Top Hiring Companies**: Verified Indian tech employers (InnovateX, NexaTech, Tata Digital, SiliconCraft).
- **Professional Footer**: Category links, city links, copyright, and demo notes.

### 2. Real-Time Job Search & Dynamic Filtering
- **Zero-Reload Filtering**: Live filtering across:
  - **Keywords**: Matches title, company name, description, or skill tags.
  - **Locations**: Bengaluru, Hyderabad, Pune, Chennai, Mumbai, Remote.
  - **Salary Ranges**: Up to ₹6 LPA, ₹6 - 12 LPA, ₹12 - 20 LPA, ₹20+ LPA.
  - **Experience Levels**: Fresher (0-1 yr), Junior (1-3 yrs), Mid-level (2-4 yrs), Senior (3-5+ yrs).
  - **Work Modes**: Full-time, Hybrid, Remote, On-site.
- **Job Cards**: Company logo, title, compensation in ₹ LPA, experience, badges, skill tags, "Save Job" heart toggle, "View Details" modal, and "Apply Now" button.
- **Job Details Modal**: Full responsibilities, requirements, benefits, and an **instant AI Skill Gap analysis** comparing the job against the logged-in candidate's profile!

### 3. AI Job Recommendation Engine
- Candidate inputs or selects:
  - Technical skills (e.g., Java, Spring Boot, React, SQL, Python, Docker)
  - Education & total experience
  - Preferred role & location
- **Matching Algorithm**:
  - Computes exact match percentages (0% to 100%).
  - Shows color-coded progress bars (Emerald for >=80%, Cyan for >=65%, Amber for >=45%).
  - Classifies fit into: **Excellent Match**, **Good Match**, **Moderate Match**, and **Low Match**.
  - Sorts and displays top-matching jobs with explanations of which skills match.

### 4. Automated Skill Gap Analysis
- Benchmarks candidate skills against any selected vacancy.
- Visual breakdown:
  - **✓ Matching Skills**: Competencies the candidate already possesses.
  - **⚡ Missing Skills Gap**: Crucial skills required to qualify.
  - **AI Recommended Learning Roadmap**: Course topics, difficulty levels (Beginner, Intermediate, Advanced), and estimated time to master.

### 5. Unified Candidate Dashboard
- **Profile & Skills Manager**: Update name, title, contact, bio, education, and add/remove individual technical skill tags.
- **Application Status Pipeline Tracker**:
  - Tracks live application lifecycle:
    `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview` ➔ `Selected` (or `Rejected`).
  - Visual progression stepper with date applied and recruiter feedback notes.
- **Saved Jobs**: Quick bookmark management with 1-click application.
- **Personalized Recommendations**: Instant feed of jobs tailored to profile skills.

### 6. Dynamic Resume Builder with Live PDF Print
- Comprehensive form:
  - Personal Details (Name, Title, Email, Phone, City, LinkedIn, GitHub)
  - Career Objective / Summary
  - Technical Skills
  - Work Experience (Dynamic repeater: role, company, period, bullet points)
  - Engineering Projects (Dynamic repeater: title, tech stack, link, summary)
  - Education (Dynamic repeater: degree, institution, year, CGPA/marks)
  - Certifications (Dynamic repeater: title, issuer, year)
- **Live A4 Paper Preview**: Real-time updates as you type.
- **3 Template Themes**: Modern Tech, Classic Executive, Minimal ATS.
- **"Sync to Profile"**: Automatically updates your candidate account with resume skills.
- **"Print / Save as PDF"**: Formatted with `@media print` CSS for standard clean A4 export without page clutter.

### 7. Recruiter Dashboard & Applicant Tracking System (ATS)
- **Post Vacancy Form**: Publish new job listings with location, salary range (₹ LPA), experience, category, and skills.
- **Manage Jobs**: Review, edit, or delete posted openings with active applicant counts.
- **Applicant Pipeline & Decision Workflow**:
  - View all applicants with their AI match score %.
  - Change candidate statuses directly (`Under Review`, `Shortlisted`, `Interview`, `Selected`, `Rejected`).
  - Add recruiter feedback notes displayed directly on the candidate's dashboard!
- **Talent Pool Search**: Search candidate database by name, title, or skill.
- **Quick Role Switcher**: Top toggle button to switch between Candidate View and Recruiter View instantly.

---

## 🗄️ Relational Database Schema (`database.sql`)

A production-ready SQL script compatible with **MySQL 8+**, **PostgreSQL**, and **H2 Database** is included in [`database.sql`](file:///c:/Users/nukab/OneDrive/Desktop/spring%20project/database.sql):

- `users`: User profiles with roles (`candidate`, `recruiter`) and default password `12345`.
- `candidate_profiles`: Candidate education, experience, and role preferences.
- `candidate_skills`: Relational table mapping skills to candidates.
- `jobs`: Vacancies with salary ranges, categories, requirements, and recruiter associations.
- `job_skills`: Required skill sets per vacancy.
- `applications`: Application lifecycle statuses, match scores, and recruiter feedback.
- `resumes`: Structured candidate resumes with template references.

---

## ☕ Java Full Stack (Spring Boot + Thymeleaf) Setup

For users deploying with Java:

### Prerequisites:
- Java 17 or Java 21+
- Apache Maven

### Project Structure:
```
spring project/
├── pom.xml                                      # Maven configuration
├── database.sql                                 # Relational SQL schema & seed data
├── index.html                                   # Pure frontend home / portal
├── login.html                                   # Dedicated login page
├── dashboard.html                               # Candidate & Recruiter dashboard
├── resume-builder.html                          # Interactive resume builder
├── css/
│   ├── style.css                                # Design system & themes
│   ├── dashboard.css                            # Dashboard & stepper pipeline styles
│   └── resume.css                               # Resume sheets & print CSS
├── js/
│   ├── data.js                                  # Mock data, storage, AI algorithm
│   ├── auth.js                                  # Auth state & session controller
│   ├── app.js                                   # Job search, dynamic filters & modals
│   ├── dashboard.js                             # Unified dashboard controller
│   └── resume.js                                # Resume builder & live preview
└── src/
    └── main/
        ├── java/com/jobportal/
        │   ├── AiJobPortalApplication.java      # Spring Boot main class
        │   ├── controller/
        │   │   └── JobPortalController.java     # Thymeleaf route mappings
        │   ├── model/
        │   │   ├── User.java                    # User JPA entity
        │   │   ├── Job.java                     # Job JPA entity
        │   │   └── Application.java             # Application JPA entity
        │   └── repository/
        │       ├── UserRepository.java
        │       ├── JobRepository.java
        │       └── ApplicationRepository.java
        └── resources/
            ├── application.properties           # Spring Boot & H2 configuration
            ├── database.sql                     # Schema initialized on boot
            ├── static/ (css & js)
            └── templates/ (Thymeleaf templates)
```

### To Run via Maven:
```bash
mvn spring-boot:run
```
Once started, visit:
- **Application URL**: `http://localhost:8080`
- **H2 In-Memory DB Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:jobportal_db`
  - Username: `sa`
  - Password: `12345`

---

## 💻 Technical Standards
- **Vanilla JavaScript**: Clean, modern ES6+ modular code without framework dependencies.
- **CSS3 Design Tokens**: Modern CSS custom properties for instant light/dark theme switching, fluid responsive layouts with Grid and Flexbox, and print media queries.
- **Zero API Errors**: High reliability with local algorithmic computation and deterministic results.
