/**
 * AI Job Portal - Data & LocalStorage Store
 * Contains initial seed data for jobs, users, applications, and storage accessors.
 */

const STORAGE_KEYS = {
  USERS: 'ai_job_portal_users',
  JOBS: 'ai_job_portal_jobs',
  APPLICATIONS: 'ai_job_portal_applications',
  SAVED_JOBS: 'ai_job_portal_saved_jobs',
  CURRENT_USER: 'ai_job_portal_current_user',
  THEME: 'ai_job_portal_theme',
  RESUME_DATA: 'ai_job_portal_resume_data'
};

// Seed Users (Candidate & Recruiter with password '12345')
const INITIAL_USERS = [
  {
    id: 'user_cand_1',
    role: 'candidate',
    email: 'rahul.sharma@example.com',
    password: '12345',
    name: 'Rahul Sharma',
    title: 'Full Stack Java & Frontend Developer',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    education: 'B.Tech in Computer Science, NIT Warangal (2023)',
    experience: '2 Years',
    skills: ['Java', 'Spring Boot', 'JavaScript', 'React', 'HTML5', 'CSS3', 'SQL', 'Git', 'REST APIs'],
    preferredRole: 'Java Developer',
    preferredLocation: 'Bengaluru',
    bio: 'Passionate developer skilled in building robust full-stack applications with Spring Boot and modern frontend frameworks.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 'user_rec_1',
    role: 'recruiter',
    email: 'priya.hr@techcorp.in',
    password: '12345',
    name: 'Priya Nair',
    title: 'Head of Talent Acquisition',
    company: 'TechCorp India',
    phone: '+91 98111 22334',
    location: 'Bengaluru, Karnataka',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=120&h=120&q=80',
    bio: 'Looking for top engineering talent across India for innovative enterprise and AI solutions.'
  }
];

// Seed Jobs with realistic Indian locations and ₹ LPA compensation
const INITIAL_JOBS = [
  {
    id: 'job_1',
    title: 'Frontend Developer',
    company: 'InnovateX Technologies',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Bengaluru',
    salaryMin: 8,
    salaryMax: 14,
    salaryDisplay: '₹8 - 14 LPA',
    experience: '2-4 Years',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    category: 'Software Development',
    postedDate: '2026-03-28',
    recruiterId: 'user_rec_1',
    description: 'We are seeking an enthusiastic Frontend Developer proficient in React, modern JavaScript (ES6+), and responsive CSS to craft pixel-perfect user interfaces.',
    responsibilities: [
      'Build reusable UI components and front-facing features using React and modern CSS.',
      'Collaborate with UX designers and backend engineers to integrate REST APIs.',
      'Optimize web applications for maximum speed and scalability.',
      'Write clean, maintainable, and well-tested code.'
    ],
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'REST APIs', 'TypeScript'],
    benefits: ['Health Insurance (₹5 Lakhs)', 'Flexible Working Hours', 'Annual Learning Allowance', 'Free Cab Service']
  },
  {
    id: 'job_2',
    title: 'Python Developer',
    company: 'NexaTech Solutions',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Hyderabad',
    salaryMin: 7,
    salaryMax: 13,
    salaryDisplay: '₹7 - 13 LPA',
    experience: '1-3 Years',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    category: 'Software Development',
    postedDate: '2026-03-30',
    recruiterId: 'user_rec_1',
    description: 'Join our dynamic backend team developing scalable microservices and data pipelines using Python, FastAPI, and PostgreSQL.',
    responsibilities: [
      'Design, develop, and deploy asynchronous APIs with FastAPI/Django.',
      'Work with relational databases (PostgreSQL/MySQL) and Redis caching.',
      'Implement authentication, security protocols, and CI/CD pipelines.',
      'Collaborate on AI-assisted feature development.'
    ],
    skills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Docker', 'Git', 'REST APIs'],
    benefits: ['Competitive Bonus', 'Work from Home Subsidy', 'Wellness Programs', 'Stock Options']
  },
  {
    id: 'job_3',
    title: 'Java Developer (Full Stack)',
    company: 'Tata Digital Labs',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Pune',
    salaryMin: 10,
    salaryMax: 18,
    salaryDisplay: '₹10 - 18 LPA',
    experience: '3-5 Years',
    jobType: 'Full-time',
    workMode: 'Full-time',
    category: 'Software Development',
    postedDate: '2026-04-01',
    recruiterId: 'user_rec_1',
    description: 'Tata Digital is looking for an experienced Java Developer with strong expertise in Spring Boot, Microservices, and database optimization.',
    responsibilities: [
      'Architect robust enterprise microservices using Java 17+, Spring Boot, and Spring Cloud.',
      'Integrate message brokers like Apache Kafka and RabbitMQ.',
      'Perform database indexing, queries optimization, and JPA hibernate tuning.',
      'Ensure high code quality and test coverage with JUnit and Mockito.'
    ],
    skills: ['Java', 'Spring Boot', 'Microservices', 'SQL', 'Hibernate', 'Docker', 'AWS'],
    benefits: ['Provident Fund & Gratuity', 'Medical Coverage for Family', 'Performance Bonus', 'Child Education Support']
  },
  {
    id: 'job_4',
    title: 'Data Analyst',
    company: 'AnalyticsPulse India',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Chennai',
    salaryMin: 6,
    salaryMax: 11,
    salaryDisplay: '₹6 - 11 LPA',
    experience: '1-3 Years',
    jobType: 'Full-time',
    workMode: 'On-site',
    category: 'AI & Data Science',
    postedDate: '2026-03-25',
    recruiterId: 'user_rec_1',
    description: 'Extract business insights from large-scale datasets, build automated PowerBI dashboards, and execute statistical exploratory data analyses.',
    responsibilities: [
      'Write complex SQL queries to extract, transform, and aggregate data warehouse records.',
      'Design interactive executive dashboards using PowerBI and Tableau.',
      'Perform cohort analyses and customer retention tracking using Python/Pandas.',
      'Present findings and data-driven recommendations to leadership.'
    ],
    skills: ['SQL', 'Python', 'PowerBI', 'Excel', 'Statistics', 'Data Visualization', 'Pandas'],
    benefits: ['Performance Incentive', 'Flexible Work Schedule', 'Health Insurance', 'Certification Reimbursement']
  },
  {
    id: 'job_5',
    title: 'VLSI Design Engineer',
    company: 'SiliconCraft India',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Bengaluru',
    salaryMin: 12,
    salaryMax: 22,
    salaryDisplay: '₹12 - 22 LPA',
    experience: '2-5 Years',
    jobType: 'Full-time',
    workMode: 'On-site',
    category: 'Core Engineering',
    postedDate: '2026-03-22',
    recruiterId: 'user_rec_1',
    description: 'Lead RTL design, logic synthesis, and verification for next-generation semiconductor chips and high-performance computing chipsets.',
    responsibilities: [
      'Develop SystemVerilog and Verilog RTL for digital logic blocks.',
      'Perform functional simulation and UVM-based testbench verification.',
      'Coordinate with physical design engineers for timing closure and clock tree synthesis.',
      'Analyze power, performance, and area (PPA) tradeoffs.'
    ],
    skills: ['Verilog', 'SystemVerilog', 'RTL Design', 'VLSI', 'UVM', 'Static Timing Analysis', 'FPGA'],
    benefits: ['High Joining Bonus', 'Comprehensive Health Plan', 'Patent Incentives', 'Relocation Allowance']
  },
  {
    id: 'job_6',
    title: 'Software Engineer (Backend)',
    company: 'CloudSphere Systems',
    logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Hyderabad',
    salaryMin: 14,
    salaryMax: 24,
    salaryDisplay: '₹14 - 24 LPA',
    experience: '3-6 Years',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    category: 'Software Development',
    postedDate: '2026-04-02',
    recruiterId: 'user_rec_1',
    description: 'Develop mission-critical cloud native services handling millions of concurrent transactions with high availability and low latency.',
    responsibilities: [
      'Write clean, resilient code in Java/Go targeting AWS distributed infrastructure.',
      'Implement event-driven architectures with Kafka and DynamoDB.',
      'Conduct load testing, performance profiling, and fault-tolerance drills.',
      'Participate in design architecture reviews and mentor junior developers.'
    ],
    skills: ['Java', 'Spring Boot', 'AWS', 'Microservices', 'Kafka', 'System Design', 'Docker'],
    benefits: ['Stock Options (ESOPs)', 'Unlimited PTO', 'Comprehensive Health & Dental', 'Gym Stipend']
  },
  {
    id: 'job_7',
    title: 'Web Developer',
    company: 'CreativeWave Agency',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Mumbai',
    salaryMin: 5,
    salaryMax: 9,
    salaryDisplay: '₹5 - 9 LPA',
    experience: '0-2 Years',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    category: 'Software Development',
    postedDate: '2026-03-29',
    recruiterId: 'user_rec_1',
    description: 'Create high-converting landing pages, interactive eCommerce web applications, and marketing web portals using HTML5, CSS3, JavaScript, and Node.js.',
    responsibilities: [
      'Develop modern client websites ensuring 100% cross-browser responsiveness.',
      'Implement subtle animations with GSAP and CSS transitions.',
      'Integrate payment gateways (Razorpay, Stripe) and CMS platforms.',
      'Optimize Core Web Vitals and SEO rankings.'
    ],
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Responsive Design', 'Git', 'WordPress'],
    benefits: ['Mentorship Program', 'Flexible Hours', 'Annual Company Retreat', 'Equipment Allowance']
  },
  {
    id: 'job_8',
    title: 'Machine Learning Engineer',
    company: 'CogniVibe AI',
    logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Bengaluru',
    salaryMin: 16,
    salaryMax: 28,
    salaryDisplay: '₹16 - 28 LPA',
    experience: '2-5 Years',
    jobType: 'Full-time',
    workMode: 'Remote',
    category: 'AI & Data Science',
    postedDate: '2026-03-27',
    recruiterId: 'user_rec_1',
    description: 'Fine-tune large language models, build generative AI pipelines, and deploy production ML inference servers at enterprise scale.',
    responsibilities: [
      'Train, evaluate, and fine-tune PyTorch/HuggingFace transformer architectures.',
      'Build low-latency vector search indices with FAISS, Milvus, and LangChain.',
      'Set up MLOps pipelines with MLflow, Docker, and Kubernetes.',
      'Optimize model quantization for cost-effective GPU execution.'
    ],
    skills: ['Python', 'PyTorch', 'Machine Learning', 'NLP', 'Docker', 'Deep Learning', 'MLOps'],
    benefits: ['100% Remote Policy', 'Latest MacBook Pro', 'AI Conference Sponsorship', 'Medical Cover']
  },
  {
    id: 'job_9',
    title: 'DevOps & Cloud Engineer',
    company: 'InfraScale Technologies',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Pune',
    salaryMin: 9,
    salaryMax: 16,
    salaryDisplay: '₹9 - 16 LPA',
    experience: '2-4 Years',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    category: 'Cloud & DevOps',
    postedDate: '2026-03-26',
    recruiterId: 'user_rec_1',
    description: 'Automate CI/CD pipelines, orchestrate Kubernetes clusters, and manage secure AWS infrastructure as code using Terraform.',
    responsibilities: [
      'Maintain Kubernetes clusters (EKS) and Helm charts for microservices.',
      'Create GitHub Actions and Jenkins automated build/deploy workflows.',
      'Implement Prometheus and Grafana monitoring and alerting suites.',
      'Enforce infrastructure security and compliance practices.'
    ],
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux', 'Python'],
    benefits: ['AWS Certification Reimbursement', 'Work from Home Setup', 'Flexible Hours', 'Bonus']
  },
  {
    id: 'job_10',
    title: 'Junior Java Developer',
    company: 'Zenith Infotech',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Hyderabad',
    salaryMin: 4.5,
    salaryMax: 7.5,
    salaryDisplay: '₹4.5 - 7.5 LPA',
    experience: '0-1 Years',
    jobType: 'Full-time',
    workMode: 'On-site',
    category: 'Software Development',
    postedDate: '2026-04-03',
    recruiterId: 'user_rec_1',
    description: 'Ideal opportunity for enthusiastic freshers or junior engineers with solid Core Java, OOP fundamentals, and SQL database basics.',
    responsibilities: [
      'Write clean, modular Java code under the guidance of senior technical leads.',
      'Assist in building REST API controllers and database repository layers.',
      'Participate in agile sprint ceremonies and code reviews.',
      'Debug and resolve software defects reported in QA test environments.'
    ],
    skills: ['Java', 'Core Java', 'OOP', 'SQL', 'HTML5', 'Git', 'Spring Boot'],
    benefits: ['Structured Mentorship', 'Fast-track Promotion Path', 'Health Insurance', 'Food Coupons']
  }
];

// Seed Applications for demonstration
const INITIAL_APPLICATIONS = [
  {
    id: 'app_1',
    jobId: 'job_3',
    candidateId: 'user_cand_1',
    candidateName: 'Rahul Sharma',
    candidateEmail: 'rahul.sharma@example.com',
    candidatePhone: '+91 98765 43210',
    appliedDate: '2026-04-02',
    status: 'Shortlisted', // Applied, Under Review, Shortlisted, Interview, Selected, Rejected
    matchScore: 88,
    notes: 'Candidate has strong Spring Boot & Java expertise. Scheduled initial screening.',
    resumeSummary: 'Full Stack Java & Frontend Developer with 2 years hands-on experience.'
  },
  {
    id: 'app_2',
    jobId: 'job_1',
    candidateId: 'user_cand_1',
    candidateName: 'Rahul Sharma',
    candidateEmail: 'rahul.sharma@example.com',
    candidatePhone: '+91 98765 43210',
    appliedDate: '2026-03-30',
    status: 'Interview',
    matchScore: 82,
    notes: 'Technical round 1 scheduled for Friday at 3:00 PM IST via Google Meet.',
    resumeSummary: 'Experienced with React, JavaScript, CSS3, and REST API integration.'
  },
  {
    id: 'app_3',
    jobId: 'job_6',
    candidateId: 'user_cand_1',
    candidateName: 'Rahul Sharma',
    candidateEmail: 'rahul.sharma@example.com',
    candidatePhone: '+91 98765 43210',
    appliedDate: '2026-04-03',
    status: 'Under Review',
    matchScore: 75,
    notes: 'Application received and passed automated AI screening.',
    resumeSummary: 'Backend engineering with Spring Boot, Java, and Docker experience.'
  }
];

// Seed Saved Jobs
const INITIAL_SAVED_JOBS = ['job_1', 'job_3', 'job_7'];

// Storage Helper Functions
const Storage = {
  get(key, fallback = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error('Storage get error for', key, e);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error for', key, e);
    }
  },

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.set(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
      this.set(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      this.set(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)) {
      this.set(STORAGE_KEYS.SAVED_JOBS, INITIAL_SAVED_JOBS);
    }
  },

  getUsers() {
    return this.get(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  saveUser(newUser) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === newUser.id);
    if (index >= 0) {
      users[index] = newUser;
    } else {
      users.push(newUser);
    }
    this.set(STORAGE_KEYS.USERS, users);
    
    // If current logged-in user is updated, update session too
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === newUser.id) {
      this.setCurrentUser(newUser);
    }
  },

  getCurrentUser() {
    return this.get(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user) {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  },

  clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getJobs() {
    return this.get(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  },

  saveJob(job) {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.unshift(job);
    }
    this.set(STORAGE_KEYS.JOBS, jobs);
  },

  deleteJob(jobId) {
    let jobs = this.getJobs();
    jobs = jobs.filter(j => j.id !== jobId);
    this.set(STORAGE_KEYS.JOBS, jobs);
  },

  getApplications() {
    return this.get(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  saveApplication(app) {
    const apps = this.getApplications();
    const index = apps.findIndex(a => a.id === app.id);
    if (index >= 0) {
      apps[index] = app;
    } else {
      apps.unshift(app);
    }
    this.set(STORAGE_KEYS.APPLICATIONS, apps);
  },

  updateApplicationStatus(appId, newStatus, notes = '') {
    const apps = this.getApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.status = newStatus;
      if (notes) app.notes = notes;
      this.set(STORAGE_KEYS.APPLICATIONS, apps);
      return true;
    }
    return false;
  },

  getSavedJobs() {
    return this.get(STORAGE_KEYS.SAVED_JOBS, INITIAL_SAVED_JOBS);
  },

  toggleSaveJob(jobId) {
    let saved = this.getSavedJobs();
    const isSaved = saved.includes(jobId);
    if (isSaved) {
      saved = saved.filter(id => id !== jobId);
    } else {
      saved.push(jobId);
    }
    this.set(STORAGE_KEYS.SAVED_JOBS, saved);
    return !isSaved;
  }
};

// Initialize Storage on file load
Storage.init();

// ==========================================
// AI Matching & Skill Gap Analysis Engine
// ==========================================

const AIMatchingEngine = {
  /**
   * Normalizes a skill string for comparison (lowercase, trimmed, stripped of special chars)
   */
  normalizeSkill(skill) {
    return skill.toLowerCase().trim().replace(/[^a-z0-9+#]/g, '');
  },

  /**
   * Calculates detailed skill matching between candidate skills and required job skills
   */
  analyzeSkillGap(candidateSkills = [], jobSkills = []) {
    const normalizedCandidate = candidateSkills.map(s => this.normalizeSkill(s));
    
    const matchingSkills = [];
    const missingSkills = [];

    jobSkills.forEach(reqSkill => {
      const normReq = this.normalizeSkill(reqSkill);
      // Check exact or partial match
      const isMatch = normalizedCandidate.some(candSkill => {
        return candSkill === normReq || candSkill.includes(normReq) || normReq.includes(candSkill);
      });

      if (isMatch) {
        matchingSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    // Learning recommendations for missing skills
    const recommendations = missingSkills.map(skill => {
      return {
        skill: skill,
        difficulty: this.getSkillDifficulty(skill),
        learningTime: this.getEstimatedTime(skill),
        resourceTopic: `Complete Guide to ${skill} with Hands-on Projects`
      };
    });

    const matchRatio = jobSkills.length > 0 ? (matchingSkills.length / jobSkills.length) : 1;
    const score = Math.round(matchRatio * 100);

    return {
      matchingSkills,
      missingSkills,
      recommendations,
      score
    };
  },

  /**
   * Estimates learning difficulty
   */
  getSkillDifficulty(skill) {
    const s = skill.toLowerCase();
    if (s.includes('docker') || s.includes('kubernetes') || s.includes('vlsi') || s.includes('deep learning') || s.includes('system design')) {
      return 'Advanced';
    }
    if (s.includes('react') || s.includes('spring') || s.includes('sql') || s.includes('fastapi') || s.includes('rest')) {
      return 'Intermediate';
    }
    return 'Beginner to Intermediate';
  },

  /**
   * Estimated time to learn
   */
  getEstimatedTime(skill) {
    const s = skill.toLowerCase();
    if (s.includes('kubernetes') || s.includes('system design') || s.includes('vlsi')) return '4 - 6 Weeks';
    if (s.includes('spring') || s.includes('react') || s.includes('docker') || s.includes('fastapi')) return '2 - 3 Weeks';
    return '1 - 2 Weeks';
  },

  /**
   * Calculates overall candidate-to-job match score including skills, experience, and role
   */
  calculateJobMatch(candidate, job) {
    if (!candidate || !candidate.skills || candidate.skills.length === 0) {
      return {
        score: 50,
        label: 'Moderate Match',
        badgeClass: 'badge-moderate',
        matchingSkills: [],
        missingSkills: job.skills || [],
        skillScore: 50
      };
    }

    const gapAnalysis = this.analyzeSkillGap(candidate.skills, job.skills);
    let finalScore = gapAnalysis.score;

    // Bonus for matching preferred role or title
    if (candidate.preferredRole && job.title.toLowerCase().includes(candidate.preferredRole.toLowerCase())) {
      finalScore = Math.min(100, finalScore + 8);
    }

    // Bonus for preferred location
    if (candidate.preferredLocation && job.location.toLowerCase().includes(candidate.preferredLocation.toLowerCase())) {
      finalScore = Math.min(100, finalScore + 5);
    }

    // Determine label and badge class
    let label = 'Low Match';
    let badgeClass = 'badge-low';

    if (finalScore >= 80) {
      label = 'Excellent Match';
      badgeClass = 'badge-excellent';
    } else if (finalScore >= 65) {
      label = 'Good Match';
      badgeClass = 'badge-good';
    } else if (finalScore >= 45) {
      label = 'Moderate Match';
      badgeClass = 'badge-moderate';
    }

    return {
      score: finalScore,
      label,
      badgeClass,
      matchingSkills: gapAnalysis.matchingSkills,
      missingSkills: gapAnalysis.missingSkills,
      recommendations: gapAnalysis.recommendations
    };
  }
};
