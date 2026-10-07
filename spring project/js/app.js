/**
 * AI Job Portal - Main Application Logic
 * Manages Job Search, Dynamic Filtering, AI Recommendation Engine, Skill Gap Analysis, and Job Modals.
 */

const App = {
  filters: {
    keyword: '',
    location: '',
    category: '',
    experience: '',
    jobType: '',
    salaryRange: '',
    skill: ''
  },

  activeModalJobId: null,

  init() {
    this.bindEvents();
    this.renderAll();
    this.initCategoryCards();
    this.initAIMatcherForm();
  },

  renderAll() {
    this.renderJobs();
    this.renderFeaturedJobs();
    this.renderAIRecommendations();
    this.renderSkillGapAnalyzer();
  },

  bindEvents() {
    // Search input
    const keywordInput = document.getElementById('searchKeyword');
    if (keywordInput) {
      keywordInput.addEventListener('input', (e) => {
        this.filters.keyword = e.target.value.toLowerCase().trim();
        this.renderJobs();
      });
    }

    // Location filter
    const locationSelect = document.getElementById('filterLocation');
    if (locationSelect) {
      locationSelect.addEventListener('change', (e) => {
        this.filters.location = e.target.value;
        this.renderJobs();
      });
    }

    // Category filter
    const categorySelect = document.getElementById('filterCategory');
    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        this.filters.category = e.target.value;
        this.renderJobs();
      });
    }

    // Experience filter
    const expSelect = document.getElementById('filterExperience');
    if (expSelect) {
      expSelect.addEventListener('change', (e) => {
        this.filters.experience = e.target.value;
        this.renderJobs();
      });
    }

    // Job Type filter
    const typeSelect = document.getElementById('filterJobType');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        this.filters.jobType = e.target.value;
        this.renderJobs();
      });
    }

    // Salary Range filter
    const salarySelect = document.getElementById('filterSalary');
    if (salarySelect) {
      salarySelect.addEventListener('change', (e) => {
        this.filters.salaryRange = e.target.value;
        this.renderJobs();
      });
    }

    // Hero search button
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    if (heroSearchBtn) {
      heroSearchBtn.addEventListener('click', () => {
        const titleInput = document.getElementById('heroJobTitle');
        const locInput = document.getElementById('heroLocation');
        if (titleInput) this.filters.keyword = titleInput.value.toLowerCase().trim();
        if (locInput) this.filters.location = locInput.value;

        // Synchronize with search section inputs
        if (keywordInput && titleInput) keywordInput.value = titleInput.value;
        if (locationSelect && locInput) locationSelect.value = locInput.value;

        const jobSection = document.getElementById('jobsSection');
        if (jobSection) {
          jobSection.scrollIntoView({ behavior: 'smooth' });
        }
        this.renderJobs();
      });
    }

    // Reset filters
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }
  },

  resetFilters() {
    this.filters = {
      keyword: '',
      location: '',
      category: '',
      experience: '',
      jobType: '',
      salaryRange: '',
      skill: ''
    };

    const keywordInput = document.getElementById('searchKeyword');
    const locationSelect = document.getElementById('filterLocation');
    const categorySelect = document.getElementById('filterCategory');
    const expSelect = document.getElementById('filterExperience');
    const typeSelect = document.getElementById('filterJobType');
    const salarySelect = document.getElementById('filterSalary');

    if (keywordInput) keywordInput.value = '';
    if (locationSelect) locationSelect.value = '';
    if (categorySelect) categorySelect.value = '';
    if (expSelect) expSelect.value = '';
    if (typeSelect) typeSelect.value = '';
    if (salarySelect) salarySelect.value = '';

    this.renderJobs();
    showToast('Filters reset to default.', 'info');
  },

  setFilterSkill(skill) {
    this.filters.skill = skill;
    const keywordInput = document.getElementById('searchKeyword');
    if (keywordInput) keywordInput.value = skill;
    this.filters.keyword = skill.toLowerCase();

    const jobSection = document.getElementById('jobsSection');
    if (jobSection) jobSection.scrollIntoView({ behavior: 'smooth' });
    this.renderJobs();
  },

  getFilteredJobs() {
    const allJobs = Storage.getJobs();
    const { keyword, location, category, experience, jobType, salaryRange, skill } = this.filters;

    return allJobs.filter(job => {
      // Keyword match (title, company, description, skills)
      if (keyword) {
        const titleMatch = job.title.toLowerCase().includes(keyword);
        const compMatch = job.company.toLowerCase().includes(keyword);
        const descMatch = job.description.toLowerCase().includes(keyword);
        const skillMatch = job.skills.some(s => s.toLowerCase().includes(keyword));
        if (!titleMatch && !compMatch && !descMatch && !skillMatch) return false;
      }

      // Location match
      if (location && location !== 'All') {
        if (!job.location.toLowerCase().includes(location.toLowerCase())) return false;
      }

      // Category match
      if (category && category !== 'All') {
        if (job.category !== category) return false;
      }

      // Experience match
      if (experience && experience !== 'All') {
        if (!job.experience.includes(experience)) return false;
      }

      // Job Type match
      if (jobType && jobType !== 'All') {
        if (job.jobType !== jobType && job.workMode !== jobType) return false;
      }

      // Salary Range match (in LPA)
      if (salaryRange && salaryRange !== 'All') {
        if (salaryRange === '0-6') {
          if (job.salaryMin > 6) return false;
        } else if (salaryRange === '6-12') {
          if (job.salaryMax < 6 || job.salaryMin > 12) return false;
        } else if (salaryRange === '12-20') {
          if (job.salaryMax < 12 || job.salaryMin > 20) return false;
        } else if (salaryRange === '20+') {
          if (job.salaryMax < 20) return false;
        }
      }

      return true;
    });
  },

  renderJobs() {
    const container = document.getElementById('jobsContainer');
    const countBadge = document.getElementById('jobCountBadge');
    if (!container) return;

    const filteredJobs = this.getFilteredJobs();
    const currentUser = Auth.getCurrentUser();
    const savedJobs = Storage.getSavedJobs();

    if (countBadge) {
      countBadge.textContent = `${filteredJobs.length} Job${filteredJobs.length === 1 ? '' : 's'} Found`;
    }

    if (filteredJobs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No matching jobs found</h3>
          <p class="text-muted">Try adjusting your filters, location, or search keywords.</p>
          <button class="btn btn-outline btn-sm" onclick="App.resetFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredJobs.map(job => {
      const isSaved = savedJobs.includes(job.id);

      // Calculate AI match if user is candidate
      let aiMatchHtml = '';
      if (currentUser && currentUser.role === 'candidate') {
        const matchData = AIMatchingEngine.calculateJobMatch(currentUser, job);
        aiMatchHtml = `
          <div class="job-card-ai-badge ${matchData.badgeClass}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
            <span>${matchData.score}% ${matchData.label}</span>
          </div>
        `;
      }

      // Check if user already applied
      const apps = Storage.getApplications();
      const hasApplied = currentUser && apps.some(a => a.jobId === job.id && a.candidateId === currentUser.id);

      return `
        <div class="job-card card-hover" id="job-card-${job.id}">
          <div class="job-card-header">
            <div class="job-company-info">
              <img src="${job.logo}" alt="${job.company}" class="company-logo" onerror="this.src='https://via.placeholder.com/50?text=Job'"/>
              <div>
                <h4 class="job-title" onclick="App.openJobModal('${job.id}')">${job.title}</h4>
                <p class="company-name">${job.company}</p>
              </div>
            </div>
            <button class="btn-save-job ${isSaved ? 'saved' : ''}" onclick="App.toggleSave('${job.id}')" title="${isSaved ? 'Remove from Saved' : 'Save Job'}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>

          <div class="job-meta-row">
            <span class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${job.location}
            </span>
            <span class="meta-item text-success font-semibold">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v12M8 10h8M8 14h6"></path></svg>
              ${job.salaryDisplay}
            </span>
            <span class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              ${job.experience}
            </span>
            <span class="badge badge-light">${job.jobType}</span>
          </div>

          <p class="job-description-excerpt">${job.description}</p>

          <div class="job-skills-wrap">
            ${job.skills.slice(0, 4).map(skill => `
              <span class="skill-tag" onclick="App.setFilterSkill('${skill}')">${skill}</span>
            `).join('')}
            ${job.skills.length > 4 ? `<span class="skill-tag-more">+${job.skills.length - 4} more</span>` : ''}
          </div>

          <div class="job-card-footer">
            ${aiMatchHtml || `<div></div>`}
            <div class="job-card-actions">
              <button class="btn btn-outline btn-sm" onclick="App.openJobModal('${job.id}')">View Details</button>
              <button class="btn ${hasApplied ? 'btn-success' : 'btn-primary'} btn-sm" onclick="App.applyToJob('${job.id}')">
                ${hasApplied ? '✓ Applied' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderFeaturedJobs() {
    const container = document.getElementById('featuredJobsContainer');
    if (!container) return;

    const allJobs = Storage.getJobs();
    const featured = allJobs.slice(0, 4);
    const currentUser = Auth.getCurrentUser();

    container.innerHTML = featured.map(job => {
      let matchBadge = '';
      if (currentUser && currentUser.role === 'candidate') {
        const matchData = AIMatchingEngine.calculateJobMatch(currentUser, job);
        matchBadge = `<span class="badge ${matchData.badgeClass}">${matchData.score}% Match</span>`;
      }

      return `
        <div class="featured-job-card card-hover" onclick="App.openJobModal('${job.id}')">
          <div class="flex-between">
            <img src="${job.logo}" alt="${job.company}" class="featured-logo" onerror="this.src='https://via.placeholder.com/40?text=Job'"/>
            ${matchBadge || `<span class="badge badge-primary">Featured</span>`}
          </div>
          <h4 class="featured-title">${job.title}</h4>
          <p class="featured-company text-muted">${job.company} • ${job.location}</p>
          <div class="featured-salary font-bold text-success">${job.salaryDisplay}</div>
          <div class="featured-tags">
            ${job.skills.slice(0, 3).map(s => `<span class="mini-tag">${s}</span>`).join('')}
          </div>
        </div>
      `;
    }).join('');
  },

  initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        if (cat) {
          this.filters.category = cat;
          const catSelect = document.getElementById('filterCategory');
          if (catSelect) catSelect.value = cat;
          const section = document.getElementById('jobsSection');
          if (section) section.scrollIntoView({ behavior: 'smooth' });
          this.renderJobs();
        }
      });
    });
  },

  // Toggle Save Job
  toggleSave(jobId) {
    const isNowSaved = Storage.toggleSaveJob(jobId);
    this.renderJobs();
    if (isNowSaved) {
      showToast('Job added to your saved jobs list!', 'success');
    } else {
      showToast('Job removed from saved list.', 'info');
    }
  },

  // Apply to Job
  applyToJob(jobId) {
    const currentUser = Auth.getCurrentUser();

    if (!currentUser) {
      showToast('Please sign in or register to apply for jobs.', 'warning');
      AuthModal.open('login', 'candidate');
      return;
    }

    if (currentUser.role !== 'candidate') {
      showToast('Recruiters cannot apply to jobs. Please switch to a Candidate account.', 'warning');
      return;
    }

    const apps = Storage.getApplications();
    const existing = apps.find(a => a.jobId === jobId && a.candidateId === currentUser.id);

    if (existing) {
      showToast(`You have already applied for this role! Current status: ${existing.status}`, 'info');
      return;
    }

    const job = Storage.getJobs().find(j => j.id === jobId);
    if (!job) return;

    const matchData = AIMatchingEngine.calculateJobMatch(currentUser, job);

    const newApplication = {
      id: 'app_' + Date.now(),
      jobId: job.id,
      candidateId: currentUser.id,
      candidateName: currentUser.name,
      candidateEmail: currentUser.email,
      candidatePhone: currentUser.phone || '+91 98765 43210',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      matchScore: matchData.score,
      notes: 'Application received and registered in AI portal queue.',
      resumeSummary: `${currentUser.title || 'Applicant'} | Skills: ${(currentUser.skills || []).slice(0, 5).join(', ')}`
    };

    Storage.saveApplication(newApplication);
    this.renderJobs();
    if (this.activeModalJobId) this.closeJobModal();
    showToast(`🎉 Application submitted for ${job.title} at ${job.company}!`, 'success');
  },

  // Open Job Details Modal
  openJobModal(jobId) {
    const job = Storage.getJobs().find(j => j.id === jobId);
    if (!job) return;

    this.activeModalJobId = jobId;
    const modal = document.getElementById('jobDetailsModal');
    const content = document.getElementById('jobDetailsContent');
    if (!modal || !content) return;

    const currentUser = Auth.getCurrentUser();
    const savedJobs = Storage.getSavedJobs();
    const isSaved = savedJobs.includes(job.id);
    const apps = Storage.getApplications();
    const existingApp = currentUser ? apps.find(a => a.jobId === job.id && a.candidateId === currentUser.id) : null;

    // AI Match Analysis
    let matchSection = '';
    if (currentUser && currentUser.role === 'candidate') {
      const match = AIMatchingEngine.calculateJobMatch(currentUser, job);
      const gap = AIMatchingEngine.analyzeSkillGap(currentUser.skills, job.skills);

      matchSection = `
        <div class="job-modal-ai-box">
          <div class="ai-box-header">
            <div>
              <span class="ai-box-badge">AI Skill Fit Evaluation</span>
              <h4>Your Match Score: <strong class="text-primary">${match.score}%</strong> (${match.label})</h4>
            </div>
            <div class="score-radial">
              <div class="score-progress" style="background: conic-gradient(var(--primary-color) ${match.score * 3.6}deg, var(--border-color) 0deg);">
                <div class="score-inner">${match.score}%</div>
              </div>
            </div>
          </div>

          <div class="skill-gap-columns">
            <div class="skill-col">
              <h5 class="text-success flex-center-start">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Matching Skills (${gap.matchingSkills.length})
              </h5>
              <div class="skill-tag-group">
                ${gap.matchingSkills.length > 0
          ? gap.matchingSkills.map(s => `<span class="badge badge-success">✓ ${s}</span>`).join('')
          : '<span class="text-muted text-xs">No direct matches. Add skills to your profile!</span>'
        }
              </div>
            </div>

            <div class="skill-col">
              <h5 class="text-warning flex-center-start">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Missing Skills to Learn (${gap.missingSkills.length})
              </h5>
              <div class="skill-tag-group">
                ${gap.missingSkills.length > 0
          ? gap.missingSkills.map(s => `<span class="badge badge-warning">⚡ ${s}</span>`).join('')
          : '<span class="text-success text-xs">Great job! You have all required skills!</span>'
        }
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      matchSection = `
        <div class="job-modal-ai-box ai-box-guest">
          <p>💡 <strong>Sign in as a Candidate</strong> to see your personalized AI match percentage and skill gap analysis for this role!</p>
          <button class="btn btn-outline btn-xs" onclick="AuthModal.open('login', 'candidate')">Sign In to Check Match</button>
        </div>
      `;
    }

    content.innerHTML = `
      <div class="job-modal-header">
        <div class="flex-start gap-md">
          <img src="${job.logo}" alt="${job.company}" class="modal-company-logo" onerror="this.src='https://via.placeholder.com/60?text=Job'"/>
          <div>
            <h3 class="modal-title">${job.title}</h3>
            <p class="modal-company font-semibold">${job.company} • <span class="text-muted">${job.location}</span></p>
          </div>
        </div>
        <button class="modal-close-btn" onclick="App.closeJobModal()">&times;</button>
      </div>

      <div class="job-modal-quick-meta">
        <div class="quick-meta-pill">
          <span class="label">Salary Range</span>
          <span class="val text-success">${job.salaryDisplay}</span>
        </div>
        <div class="quick-meta-pill">
          <span class="label">Experience</span>
          <span class="val">${job.experience}</span>
        </div>
        <div class="quick-meta-pill">
          <span class="label">Job Type</span>
          <span class="val">${job.jobType} (${job.workMode})</span>
        </div>
        <div class="quick-meta-pill">
          <span class="label">Category</span>
          <span class="val">${job.category}</span>
        </div>
      </div>

      ${matchSection}

      <div class="modal-body-section">
        <h4>Job Description</h4>
        <p class="text-secondary">${job.description}</p>
      </div>

      <div class="modal-body-section">
        <h4>Key Responsibilities</h4>
        <ul class="bullet-list">
          ${job.responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-body-section">
        <h4>Required Skills</h4>
        <div class="skill-tag-group">
          ${job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
      </div>

      <div class="modal-body-section">
        <h4>Perks & Benefits</h4>
        <ul class="bullet-list perks-grid">
          ${job.benefits.map(b => `<li>✓ ${b}</li>`).join('')}
        </ul>
      </div>

      <div class="job-modal-footer">
        <div class="flex-start gap-sm">
          <button class="btn btn-outline btn-md" onclick="App.toggleSave('${job.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            ${isSaved ? 'Saved' : 'Save Job'}
          </button>
        </div>
        <div>
          ${existingApp ? `
            <button class="btn btn-success btn-md" disabled>✓ Applied on ${existingApp.appliedDate} (${existingApp.status})</button>
          ` : `
            <button class="btn btn-primary btn-md" onclick="App.applyToJob('${job.id}')">Submit Application Now</button>
          `}
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeJobModal() {
    const modal = document.getElementById('jobDetailsModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      this.activeModalJobId = null;
    }
  },

  // ==========================================
  // AI Recommendation Section Interactive Tool
  // ==========================================

  initAIMatcherForm() {
    const runBtn = document.getElementById('runAIMatchBtn');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        this.runCustomAIMatch();
      });
    }

    // Prefill form if candidate is logged in
    const currentUser = Auth.getCurrentUser();
    if (currentUser && currentUser.role === 'candidate') {
      const skillsInput = document.getElementById('aiCandSkills');
      const roleInput = document.getElementById('aiCandRole');
      const locInput = document.getElementById('aiCandLocation');
      const expInput = document.getElementById('aiCandExp');

      if (skillsInput && currentUser.skills) skillsInput.value = currentUser.skills.join(', ');
      if (roleInput && currentUser.preferredRole) roleInput.value = currentUser.preferredRole;
      if (locInput && currentUser.preferredLocation) locInput.value = currentUser.preferredLocation;
      if (expInput && currentUser.experience) expInput.value = currentUser.experience;
    }
  },

  runCustomAIMatch() {
    const skillsInput = document.getElementById('aiCandSkills');
    const roleInput = document.getElementById('aiCandRole');
    const locInput = document.getElementById('aiCandLocation');
    const expInput = document.getElementById('aiCandExp');

    const skillsRaw = skillsInput ? skillsInput.value : '';
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const preferredRole = roleInput ? roleInput.value.trim() : '';
    const preferredLocation = locInput ? locInput.value.trim() : '';
    const experience = expInput ? expInput.value.trim() : '';

    if (skills.length === 0) {
      showToast('Please enter at least one skill to calculate AI matches.', 'warning');
      return;
    }

    const testProfile = {
      skills,
      preferredRole,
      preferredLocation,
      experience
    };

    // Calculate match for every job
    const allJobs = Storage.getJobs();
    const scoredJobs = allJobs.map(job => {
      const match = AIMatchingEngine.calculateJobMatch(testProfile, job);
      return {
        job,
        match
      };
    });

    // Sort descending by score
    scoredJobs.sort((a, b) => b.match.score - a.match.score);

    this.renderScoredJobsResults(scoredJobs, testProfile);
    showToast(`AI Match computed! Found ${scoredJobs.length} ranked jobs based on your skills.`, 'success');
  },

  renderAIRecommendations() {
    const container = document.getElementById('aiRecommendationsResults');
    if (!container) return;

    const currentUser = Auth.getCurrentUser();
    const allJobs = Storage.getJobs();

    const candidate = (currentUser && currentUser.role === 'candidate')
      ? currentUser
      : {
        skills: ['Java', 'Spring Boot', 'React', 'JavaScript', 'SQL'],
        preferredRole: 'Java Developer',
        preferredLocation: 'Bengaluru'
      };

    const scoredJobs = allJobs.map(job => {
      const match = AIMatchingEngine.calculateJobMatch(candidate, job);
      return { job, match };
    });

    scoredJobs.sort((a, b) => b.match.score - a.match.score);
    this.renderScoredJobsResults(scoredJobs, candidate);
  },

  renderScoredJobsResults(scoredList, profile) {
    const container = document.getElementById('aiRecommendationsResults');
    if (!container) return;

    const topMatches = scoredList.slice(0, 6);

    container.innerHTML = topMatches.map(({ job, match }) => {
      return `
        <div class="ai-match-card card-hover">
          <div class="ai-match-header">
            <img src="${job.logo}" alt="${job.company}" class="ai-company-logo" onerror="this.src='https://via.placeholder.com/40?text=Job'"/>
            <div class="ai-match-score-badge ${match.badgeClass}">
              <strong>${match.score}%</strong>
              <span>${match.label}</span>
            </div>
          </div>

          <h4 class="ai-job-title" onclick="App.openJobModal('${job.id}')">${job.title}</h4>
          <p class="ai-job-company text-muted">${job.company} • ${job.location}</p>
          <p class="ai-job-salary text-success font-semibold">${job.salaryDisplay}</p>

          <!-- Match Progress Bar -->
          <div class="ai-progress-wrap">
            <div class="flex-between text-xs font-semibold mb-1">
              <span>Skill Fit Compatibility</span>
              <span class="text-primary">${match.score}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill ${match.badgeClass}" style="width: ${match.score}%;"></div>
            </div>
          </div>

          <div class="ai-match-skills">
            <div class="text-xs text-muted mb-1">Matching Skills (${match.matchingSkills.length}):</div>
            <div class="skill-tag-group">
              ${match.matchingSkills.slice(0, 3).map(s => `<span class="badge badge-success text-xs">✓ ${s}</span>`).join('')}
              ${match.matchingSkills.length > 3 ? `<span class="text-xs text-muted">+${match.matchingSkills.length - 3}</span>` : ''}
              ${match.matchingSkills.length === 0 ? `<span class="text-xs text-muted">No direct skills matched yet</span>` : ''}
            </div>
          </div>

          <div class="ai-card-footer">
            <button class="btn btn-outline btn-xs" onclick="App.openJobModal('${job.id}')">View Analysis</button>
            <button class="btn btn-primary btn-xs" onclick="App.applyToJob('${job.id}')">Apply Now</button>
          </div>
        </div>
      `;
    }).join('');
  },

  // ==========================================
  // Skill Gap Analyzer Tool
  // ==========================================

  renderSkillGapAnalyzer() {
    const roleSelect = document.getElementById('gapTargetRole');
    if (!roleSelect) return;

    const allJobs = Storage.getJobs();

    // Fill select options with unique job titles
    const uniqueRoles = [...new Set(allJobs.map(j => j.title))];
    roleSelect.innerHTML = uniqueRoles.map(role => `
      <option value="${role}">${role}</option>
    `).join('');

    roleSelect.addEventListener('change', () => {
      this.updateSkillGapView(roleSelect.value);
    });

    // Initial render with first job
    if (uniqueRoles.length > 0) {
      this.updateSkillGapView(uniqueRoles[0]);
    }
  },

  updateSkillGapView(targetRoleTitle) {
    const container = document.getElementById('skillGapDisplay');
    if (!container) return;

    const allJobs = Storage.getJobs();
    const targetJob = allJobs.find(j => j.title === targetRoleTitle) || allJobs[0];

    const currentUser = Auth.getCurrentUser();
    const candidateSkills = (currentUser && currentUser.skills)
      ? currentUser.skills
      : ['Java', 'Spring Boot', 'React', 'JavaScript', 'HTML5', 'CSS3', 'SQL'];

    const gap = AIMatchingEngine.analyzeSkillGap(candidateSkills, targetJob.skills);

    container.innerHTML = `
      <div class="gap-analysis-card">
        <div class="gap-card-header">
          <div>
            <h3>Target Role: <span class="text-primary">${targetJob.title}</span></h3>
            <p class="text-muted">Comparing your current profile skills against industry requirements for <strong>${targetJob.company}</strong> (${targetJob.salaryDisplay}).</p>
          </div>
          <div class="gap-score-box">
            <div class="gap-score-num">${gap.score}%</div>
            <div class="gap-score-lbl">Readiness Score</div>
          </div>
        </div>

        <div class="gap-analysis-grid">
          <!-- Matching Skills -->
          <div class="gap-column col-matching">
            <h4>
              <span class="icon-circle icon-success">✓</span>
              Matching Skills (${gap.matchingSkills.length})
            </h4>
            <p class="text-xs text-muted mb-2">Skills you already possess that qualify you for this role:</p>
            <div class="skill-tag-group">
              ${gap.matchingSkills.length > 0 ? gap.matchingSkills.map(s => `
                <div class="skill-check-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${s}</span>
                </div>
              `).join('') : '<p class="text-sm text-muted">No direct skill matches found.</p>'}
            </div>
          </div>

          <!-- Missing Skills -->
          <div class="gap-column col-missing">
            <h4>
              <span class="icon-circle icon-warning">!</span>
              Missing Skills Gap (${gap.missingSkills.length})
            </h4>
            <p class="text-xs text-muted mb-2">Skills needed to bridge the qualification gap:</p>
            <div class="skill-tag-group">
              ${gap.missingSkills.length > 0 ? gap.missingSkills.map(s => `
                <div class="skill-warn-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <span>${s}</span>
                </div>
              `).join('') : '<p class="text-sm text-success">Outstanding! You match 100% of required skills.</p>'}
            </div>
          </div>
        </div>

        <!-- Recommended Learning Path -->
        ${gap.recommendations.length > 0 ? `
          <div class="learning-path-box">
            <h4>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              AI Recommended Learning Roadmap
            </h4>
            <div class="recommendations-table">
              ${gap.recommendations.map(rec => `
                <div class="rec-row">
                  <div class="rec-skill font-bold">${rec.skill}</div>
                  <div class="rec-level"><span class="badge badge-light">${rec.difficulty}</span></div>
                  <div class="rec-time text-muted">Est. ${rec.learningTime}</div>
                  <div class="rec-topic text-primary">${rec.resourceTopic}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

