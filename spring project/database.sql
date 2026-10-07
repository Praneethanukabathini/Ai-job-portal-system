-- =======================================================
-- AI Job Portal System - Database Schema & Seed Data
-- Compatible with MySQL 8+, PostgreSQL, and H2 In-Memory DB
-- Demo Account Passwords: 12345
-- =======================================================

DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS job_skills;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS resumes;
DROP TABLE IF EXISTS candidate_skills;
DROP TABLE IF EXISTS candidate_profiles;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Handles Candidate & Recruiter Accounts)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL DEFAULT '12345',
    role VARCHAR(20) NOT NULL CHECK (role IN ('candidate', 'recruiter')),
    phone VARCHAR(20),
    location VARCHAR(100) DEFAULT 'Bengaluru',
    title VARCHAR(150),
    company VARCHAR(150),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Candidate Profiles Table (Education, Experience, Preferences)
CREATE TABLE candidate_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    education VARCHAR(255),
    experience VARCHAR(50),
    preferred_role VARCHAR(100),
    preferred_location VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Candidate Skills Table
CREATE TABLE candidate_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Jobs Table (Job Vacancies posted by Recruiters)
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    salary_min DECIMAL(5, 2) NOT NULL,
    salary_max DECIMAL(5, 2) NOT NULL,
    salary_display VARCHAR(50) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    job_type VARCHAR(50) NOT NULL DEFAULT 'Full-time',
    work_mode VARCHAR(50) NOT NULL DEFAULT 'Hybrid',
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT,
    benefits TEXT,
    posted_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Job Required Skills Table
CREATE TABLE job_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    skill_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- 6. Applications Table (Application Pipeline & AI Matching Score)
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Applied' 
        CHECK (status IN ('Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected')),
    match_score INT DEFAULT 85,
    notes TEXT,
    applied_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Resumes Table
CREATE TABLE resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    professional_title VARCHAR(150),
    email VARCHAR(150),
    phone VARCHAR(20),
    location VARCHAR(100),
    objective TEXT,
    skills TEXT,
    template_name VARCHAR(50) DEFAULT 'modern',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =======================================================
-- SEED DATA INSERTIONS (Default Password: 12345)
-- =======================================================

-- Insert Seed Users
INSERT INTO users (id, name, email, password, role, phone, location, title, company, bio) VALUES
(1, 'Rahul Sharma', 'rahul.sharma@example.com', '12345', 'candidate', '+91 98765 43210', 'Bengaluru, Karnataka', 'Full Stack Java & Frontend Developer', NULL, 'Passionate developer skilled in building scalable applications with Spring Boot and modern frontend frameworks.'),
(2, 'Priya Nair', 'priya.hr@techcorp.in', '12345', 'recruiter', '+91 98111 22334', 'Bengaluru, Karnataka', 'Head of Talent Acquisition', 'TechCorp India', 'Looking for high-impact engineering talents across India for AI and cloud solutions.');

-- Insert Candidate Profile
INSERT INTO candidate_profiles (user_id, education, experience, preferred_role, preferred_location) VALUES
(1, 'B.Tech in Computer Science, NIT Warangal (2023)', '2 Years', 'Java Developer', 'Bengaluru');

-- Insert Candidate Skills for Rahul
INSERT INTO candidate_skills (user_id, skill_name) VALUES
(1, 'Java'),
(1, 'Spring Boot'),
(1, 'React'),
(1, 'JavaScript'),
(1, 'HTML5'),
(1, 'CSS3'),
(1, 'SQL'),
(1, 'Git'),
(1, 'REST APIs');

-- Insert Sample Tech Jobs (Realistic Indian Tech Roles in ₹ LPA)
INSERT INTO jobs (id, recruiter_id, title, company, location, salary_min, salary_max, salary_display, experience, job_type, work_mode, category, description, posted_date) VALUES
(1, 2, 'Frontend Developer', 'InnovateX Technologies', 'Bengaluru', 8.00, 14.00, '₹8 - 14 LPA', '2-4 Years', 'Full-time', 'Hybrid', 'Software Development', 'Seeking an enthusiastic Frontend Developer proficient in React, modern JavaScript, and responsive CSS.', '2026-03-28'),
(2, 2, 'Python Developer', 'NexaTech Solutions', 'Hyderabad', 7.00, 13.00, '₹7 - 13 LPA', '1-3 Years', 'Full-time', 'Hybrid', 'Software Development', 'Join our backend team developing microservices and data pipelines using Python, FastAPI, and PostgreSQL.', '2026-03-30'),
(3, 2, 'Java Developer (Full Stack)', 'Tata Digital Labs', 'Pune', 10.00, 18.00, '₹10 - 18 LPA', '3-5 Years', 'Full-time', 'Full-time', 'Software Development', 'Tata Digital is looking for an experienced Java Developer with strong expertise in Spring Boot and Microservices.', '2026-04-01'),
(4, 2, 'Data Analyst', 'AnalyticsPulse India', 'Chennai', 6.00, 11.00, '₹6 - 11 LPA', '1-3 Years', 'Full-time', 'On-site', 'AI & Data Science', 'Extract business insights from large-scale datasets, build automated PowerBI dashboards, and execute statistical exploratory data analyses.', '2026-03-25'),
(5, 2, 'VLSI Design Engineer', 'SiliconCraft India', 'Bengaluru', 12.00, 22.00, '₹12 - 22 LPA', '2-5 Years', 'Full-time', 'On-site', 'Core Engineering', 'Lead RTL design, logic synthesis, and verification for next-generation semiconductor chips.', '2026-03-22'),
(6, 2, 'Software Engineer (Backend)', 'CloudSphere Systems', 'Hyderabad', 14.00, 24.00, '₹14 - 24 LPA', '3-6 Years', 'Full-time', 'Hybrid', 'Software Development', 'Develop mission-critical cloud native services handling millions of concurrent transactions with high availability.', '2026-04-02'),
(7, 2, 'Web Developer', 'CreativeWave Agency', 'Mumbai', 5.00, 9.00, '₹5 - 9 LPA', '0-2 Years', 'Full-time', 'Hybrid', 'Software Development', 'Create modern websites, responsive UI, and marketing portals using HTML5, CSS3, JavaScript, and Node.js.', '2026-03-29');

-- Insert Job Skills
INSERT INTO job_skills (job_id, skill_name) VALUES
(1, 'React'), (1, 'JavaScript'), (1, 'HTML5'), (1, 'CSS3'), (1, 'Git'),
(2, 'Python'), (2, 'FastAPI'), (2, 'PostgreSQL'), (2, 'Docker'),
(3, 'Java'), (3, 'Spring Boot'), (3, 'Microservices'), (3, 'SQL'), (3, 'Hibernate'),
(4, 'SQL'), (4, 'Python'), (4, 'PowerBI'), (4, 'Excel'),
(5, 'Verilog'), (5, 'SystemVerilog'), (5, 'RTL Design'), (5, 'VLSI'),
(6, 'Java'), (6, 'Spring Boot'), (6, 'AWS'), (6, 'Microservices'), (6, 'Docker'),
(7, 'HTML5'), (7, 'CSS3'), (7, 'JavaScript'), (7, 'Node.js');

-- Insert Seed Applications
INSERT INTO applications (job_id, candidate_id, status, match_score, notes, applied_date) VALUES
(3, 1, 'Shortlisted', 88, 'Candidate has strong Spring Boot & Java expertise. Scheduled technical screening.', '2026-04-02'),
(1, 1, 'Interview', 82, 'Technical interview scheduled for Friday at 3:00 PM IST via Google Meet.', '2026-03-30'),
(6, 1, 'Under Review', 75, 'Application received and passed initial automated screening.', '2026-04-03');

-- Verification Query
SELECT 
    a.id AS application_id,
    u.name AS candidate_name,
    j.title AS job_title,
    j.company AS company_name,
    a.status AS application_status,
    a.match_score AS ai_match_percentage
FROM applications a
JOIN users u ON a.candidate_id = u.id
JOIN jobs j ON a.job_id = j.id;
