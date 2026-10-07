/**
 * AI Job Portal - Dynamic Interactive Resume Builder & Live PDF Preview
 * Supports real-time rendering, dynamic repeater sections, template switching, and print/download.
 */

const ResumeBuilder = {
  activeTemplate: 'modern',

  // Default state
  data: {
    fullName: 'Rahul Sharma',
    professionalTitle: 'Full Stack Java & Frontend Developer',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/rahulsharma-dev',
    github: 'github.com/rahul-fullstack',
    objective: 'Results-driven software engineer with 2+ years of experience designing and deploying scalable Java Spring Boot microservices and dynamic React web applications. Proven track record in optimizing REST APIs and collaborating in agile teams.',
    skills: 'Java, Spring Boot, React, JavaScript (ES6+), HTML5, CSS3, SQL, PostgreSQL, Docker, Git, RESTful APIs, Microservices, JUnit',
    education: [
      {
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'National Institute of Technology (NIT), Warangal',
        year: '2019 - 2023',
        score: 'CGPA: 8.7 / 10'
      }
    ],
    experience: [
      {
        role: 'Software Engineer',
        company: 'CloudSphere Systems',
        period: '2023 - Present',
        description: 'Developed and maintained 10+ Spring Boot microservices handling over 500K daily API requests with 99.9% uptime.\nIntegrated Kafka message streams for asynchronous order processing.\nImplemented automated unit testing with JUnit and Mockito, increasing test coverage from 62% to 88%.'
      },
      {
        role: 'Junior Frontend Developer Intern',
        company: 'CreativeWave Digital',
        period: '2022 - 2023',
        description: 'Engineered responsive single-page interfaces using React and TailwindCSS.\nCollaborated closely with UX designers to translate wireframes into performant, accessible code.'
      }
    ],
    projects: [
      {
        title: 'AI Smart Recruitment & Job Portal',
        tech: 'HTML5, CSS3, Vanilla JavaScript, LocalStorage',
        link: 'https://ai-job-portal.demo',
        description: 'Built a full-featured job portal with skill gap analysis, automated AI candidate-job matching algorithms, and an interactive resume builder.'
      },
      {
        title: 'Enterprise Microservices E-Commerce API',
        tech: 'Java 17, Spring Boot, PostgreSQL, Docker, Redis',
        link: 'https://github.com/rahul-fullstack/ecommerce-core',
        description: 'Architected distributed backend with JWT token authentication, Redis caching for fast catalog search, and automated Stripe webhooks.'
      }
    ],
    certifications: [
      {
        title: 'Oracle Certified Professional: Java SE 17 Developer',
        issuer: 'Oracle University',
        year: '2023'
      },
      {
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        year: '2024'
      }
    ]
  },

  init() {
    this.loadSavedData();
    this.populateForm();
    this.bindEvents();
    this.renderPreview();
  },

  loadSavedData() {
    const saved = Storage.get(STORAGE_KEYS.RESUME_DATA);
    if (saved) {
      this.data = saved;
    } else {
      // Sync with current user profile if available
      const user = Auth.getCurrentUser();
      if (user && user.role === 'candidate') {
        this.data.fullName = user.name || this.data.fullName;
        this.data.email = user.email || this.data.email;
        this.data.phone = user.phone || this.data.phone;
        this.data.location = user.location || this.data.location;
        this.data.professionalTitle = user.title || this.data.professionalTitle;
        if (user.skills && user.skills.length > 0) {
          this.data.skills = user.skills.join(', ');
        }
      }
    }
  },

  saveData() {
    Storage.set(STORAGE_KEYS.RESUME_DATA, this.data);
  },

  bindEvents() {
    // Basic inputs live listeners
    const fields = ['fullName', 'professionalTitle', 'email', 'phone', 'location', 'linkedin', 'github', 'objective', 'skills'];
    fields.forEach(field => {
      const el = document.getElementById('res_' + field);
      if (el) {
        el.addEventListener('input', (e) => {
          this.data[field] = e.target.value;
          this.saveData();
          this.renderPreview();
        });
      }
    });

    // Template switcher
    const templateSelect = document.getElementById('resumeTemplateSelect');
    if (templateSelect) {
      templateSelect.addEventListener('change', (e) => {
        this.activeTemplate = e.target.value;
        this.renderPreview();
      });
    }
  },

  populateForm() {
    const fields = ['fullName', 'professionalTitle', 'email', 'phone', 'location', 'linkedin', 'github', 'objective', 'skills'];
    fields.forEach(field => {
      const el = document.getElementById('res_' + field);
      if (el && this.data[field]) {
        el.value = this.data[field];
      }
    });

    this.renderExperienceInputs();
    this.renderEducationInputs();
    this.renderProjectsInputs();
    this.renderCertificationInputs();
  },

  // Experience Repeater
  renderExperienceInputs() {
    const container = document.getElementById('experienceRepeater');
    if (!container) return;

    container.innerHTML = this.data.experience.map((exp, idx) => `
      <div class="repeater-item" data-idx="${idx}">
        <div class="flex-between mb-2">
          <strong class="text-sm">Experience #${idx + 1}</strong>
          <button type="button" class="btn btn-ghost btn-xs text-danger" onclick="ResumeBuilder.removeExperience(${idx})">✕ Remove</button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Job Title / Role</label>
            <input type="text" class="form-input" value="${exp.role}" oninput="ResumeBuilder.updateExp(${idx}, 'role', this.value)" />
          </div>
          <div class="form-group">
            <label class="form-label">Company Name</label>
            <input type="text" class="form-input" value="${exp.company}" oninput="ResumeBuilder.updateExp(${idx}, 'company', this.value)" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Employment Period</label>
          <input type="text" class="form-input" value="${exp.period}" placeholder="e.g. June 2023 - Present" oninput="ResumeBuilder.updateExp(${idx}, 'period', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">Key Responsibilities / Impact (New line per point)</label>
          <textarea class="form-input" rows="3" oninput="ResumeBuilder.updateExp(${idx}, 'description', this.value)">${exp.description}</textarea>
        </div>
      </div>
    `).join('');
  },

  addExperience() {
    this.data.experience.push({
      role: 'Software Developer',
      company: 'Tech Solutions',
      period: '2022 - 2023',
      description: 'Built scalable backend modules and resolved critical defects.'
    });
    this.saveData();
    this.renderExperienceInputs();
    this.renderPreview();
  },

  updateExp(idx, field, val) {
    if (this.data.experience[idx]) {
      this.data.experience[idx][field] = val;
      this.saveData();
      this.renderPreview();
    }
  },

  removeExperience(idx) {
    this.data.experience.splice(idx, 1);
    this.saveData();
    this.renderExperienceInputs();
    this.renderPreview();
  },

  // Education Repeater
  renderEducationInputs() {
    const container = document.getElementById('educationRepeater');
    if (!container) return;

    container.innerHTML = this.data.education.map((edu, idx) => `
      <div class="repeater-item" data-idx="${idx}">
        <div class="flex-between mb-2">
          <strong class="text-sm">Education #${idx + 1}</strong>
          <button type="button" class="btn btn-ghost btn-xs text-danger" onclick="ResumeBuilder.removeEducation(${idx})">✕ Remove</button>
        </div>
        <div class="form-group">
          <label class="form-label">Degree / Qualification</label>
          <input type="text" class="form-input" value="${edu.degree}" oninput="ResumeBuilder.updateEdu(${idx}, 'degree', this.value)" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">School / College / University</label>
            <input type="text" class="form-input" value="${edu.institution}" oninput="ResumeBuilder.updateEdu(${idx}, 'institution', this.value)" />
          </div>
          <div class="form-group">
            <label class="form-label">Year / Duration</label>
            <input type="text" class="form-input" value="${edu.year}" oninput="ResumeBuilder.updateEdu(${idx}, 'year', this.value)" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Grade / CGPA / Percentage</label>
          <input type="text" class="form-input" value="${edu.score}" oninput="ResumeBuilder.updateEdu(${idx}, 'score', this.value)" />
        </div>
      </div>
    `).join('');
  },

  addEducation() {
    this.data.education.push({
      degree: 'Higher Secondary Certificate (12th)',
      institution: 'Delhi Public School',
      year: '2017 - 2019',
      score: '92%'
    });
    this.saveData();
    this.renderEducationInputs();
    this.renderPreview();
  },

  updateEdu(idx, field, val) {
    if (this.data.education[idx]) {
      this.data.education[idx][field] = val;
      this.saveData();
      this.renderPreview();
    }
  },

  removeEducation(idx) {
    this.data.education.splice(idx, 1);
    this.saveData();
    this.renderEducationInputs();
    this.renderPreview();
  },

  // Projects Repeater
  renderProjectsInputs() {
    const container = document.getElementById('projectsRepeater');
    if (!container) return;

    container.innerHTML = this.data.projects.map((proj, idx) => `
      <div class="repeater-item" data-idx="${idx}">
        <div class="flex-between mb-2">
          <strong class="text-sm">Project #${idx + 1}</strong>
          <button type="button" class="btn btn-ghost btn-xs text-danger" onclick="ResumeBuilder.removeProject(${idx})">✕ Remove</button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Project Title</label>
            <input type="text" class="form-input" value="${proj.title}" oninput="ResumeBuilder.updateProj(${idx}, 'title', this.value)" />
          </div>
          <div class="form-group">
            <label class="form-label">Tech Stack</label>
            <input type="text" class="form-input" value="${proj.tech}" oninput="ResumeBuilder.updateProj(${idx}, 'tech', this.value)" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Project Link / Repo</label>
          <input type="text" class="form-input" value="${proj.link}" oninput="ResumeBuilder.updateProj(${idx}, 'link', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">Description & Highlights</label>
          <textarea class="form-input" rows="2" oninput="ResumeBuilder.updateProj(${idx}, 'description', this.value)">${proj.description}</textarea>
        </div>
      </div>
    `).join('');
  },

  addProject() {
    this.data.projects.push({
      title: 'Real-time Chat App',
      tech: 'JavaScript, WebSockets, Node.js',
      link: 'https://github.com/example/chat',
      description: 'Implemented real-time bidirectional messaging with room support.'
    });
    this.saveData();
    this.renderProjectsInputs();
    this.renderPreview();
  },

  updateProj(idx, field, val) {
    if (this.data.projects[idx]) {
      this.data.projects[idx][field] = val;
      this.saveData();
      this.renderPreview();
    }
  },

  removeProject(idx) {
    this.data.projects.splice(idx, 1);
    this.saveData();
    this.renderProjectsInputs();
    this.renderPreview();
  },

  // Certification Repeater
  renderCertificationInputs() {
    const container = document.getElementById('certificationsRepeater');
    if (!container) return;

    container.innerHTML = this.data.certifications.map((cert, idx) => `
      <div class="repeater-item" data-idx="${idx}">
        <div class="flex-between mb-2">
          <strong class="text-sm">Certificate #${idx + 1}</strong>
          <button type="button" class="btn btn-ghost btn-xs text-danger" onclick="ResumeBuilder.removeCertification(${idx})">✕ Remove</button>
        </div>
        <div class="form-group">
          <label class="form-label">Certification Title</label>
          <input type="text" class="form-input" value="${cert.title}" oninput="ResumeBuilder.updateCert(${idx}, 'title', this.value)" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Issuing Body</label>
            <input type="text" class="form-input" value="${cert.issuer}" oninput="ResumeBuilder.updateCert(${idx}, 'issuer', this.value)" />
          </div>
          <div class="form-group">
            <label class="form-label">Year</label>
            <input type="text" class="form-input" value="${cert.year}" oninput="ResumeBuilder.updateCert(${idx}, 'year', this.value)" />
          </div>
        </div>
      </div>
    `).join('');
  },

  addCertification() {
    this.data.certifications.push({
      title: 'Full Stack Java Developer Specialist',
      issuer: 'Coursera / Duke University',
      year: '2023'
    });
    this.saveData();
    this.renderCertificationInputs();
    this.renderPreview();
  },

  updateCert(idx, field, val) {
    if (this.data.certifications[idx]) {
      this.data.certifications[idx][field] = val;
      this.saveData();
      this.renderPreview();
    }
  },

  removeCertification(idx) {
    this.data.certifications.splice(idx, 1);
    this.saveData();
    this.renderCertificationInputs();
    this.renderPreview();
  },

  // Render Dynamic Live Resume Preview
  renderPreview() {
    const paper = document.getElementById('resumePaper');
    if (!paper) return;

    paper.className = `resume-sheet template-${this.activeTemplate}`;

    const {
      fullName, professionalTitle, email, phone, location, linkedin, github,
      objective, skills, education, experience, projects, certifications
    } = this.data;

    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);

    paper.innerHTML = `
      <div class="resume-header">
        <h1 class="resume-name">${fullName || 'Your Full Name'}</h1>
        <div class="resume-role">${professionalTitle || 'Professional Title'}</div>
        <div class="resume-contacts">
          ${email ? `<span>✉ ${email}</span>` : ''}
          ${phone ? `<span>📱 ${phone}</span>` : ''}
          ${location ? `<span>📍 ${location}</span>` : ''}
          ${linkedin ? `<span>🔗 ${linkedin}</span>` : ''}
          ${github ? `<span>💻 ${github}</span>` : ''}
        </div>
      </div>

      ${objective ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Career Objective</h2>
          <p class="resume-objective-text">${objective}</p>
        </div>
      ` : ''}

      ${skillsArray.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Technical Skills & Competencies</h2>
          <div class="resume-skills-cloud">
            ${skillsArray.map(skill => `<span class="res-skill-badge">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${experience.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Professional Experience</h2>
          <div class="resume-list">
            ${experience.map(exp => `
              <div class="resume-item">
                <div class="flex-between">
                  <div class="resume-item-title font-bold">${exp.role}</div>
                  <div class="resume-item-date text-muted">${exp.period}</div>
                </div>
                <div class="resume-item-sub font-medium">${exp.company}</div>
                <ul class="resume-bullet-list">
                  ${exp.description.split('\n').filter(l => l.trim().length > 0).map(line => `<li>${line}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${projects.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Key Engineering Projects</h2>
          <div class="resume-list">
            ${projects.map(proj => `
              <div class="resume-item">
                <div class="flex-between">
                  <div class="resume-item-title font-bold">${proj.title}</div>
                  ${proj.link ? `<div class="resume-item-link">${proj.link}</div>` : ''}
                </div>
                <div class="resume-tech-pill font-semibold text-xs">Tech: ${proj.tech}</div>
                <p class="resume-item-desc">${proj.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${education.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Education</h2>
          <div class="resume-list">
            ${education.map(edu => `
              <div class="resume-item">
                <div class="flex-between">
                  <div class="resume-item-title font-bold">${edu.degree}</div>
                  <div class="resume-item-date text-muted">${edu.year}</div>
                </div>
                <div class="flex-between">
                  <div class="resume-item-sub">${edu.institution}</div>
                  <div class="resume-item-score text-success font-semibold">${edu.score}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${certifications.length > 0 ? `
        <div class="resume-section">
          <h2 class="resume-section-title">Certifications & Honors</h2>
          <div class="resume-list">
            ${certifications.map(c => `
              <div class="resume-item flex-between">
                <div>
                  <strong class="resume-item-title">${c.title}</strong>
                  <span class="text-muted"> — ${c.issuer}</span>
                </div>
                <span class="resume-item-date text-muted">${c.year}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  },

  syncToProfile() {
    const user = Auth.getCurrentUser();
    if (!user) {
      showToast('Please log in first to sync with your candidate profile.', 'warning');
      AuthModal.open('login', 'candidate');
      return;
    }

    user.name = this.data.fullName || user.name;
    user.title = this.data.professionalTitle || user.title;
    user.phone = this.data.phone || user.phone;
    user.location = this.data.location || user.location;
    
    const skillsList = this.data.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (skillsList.length > 0) {
      user.skills = skillsList;
    }

    Storage.saveUser(user);
    showToast('Your candidate profile & skills have been updated from your resume!', 'success');
  },

  printResume() {
    window.print();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ResumeBuilder.init();
});
