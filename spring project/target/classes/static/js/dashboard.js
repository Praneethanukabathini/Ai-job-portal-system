/**
 * AI Job Portal - Unified Candidate & Recruiter Dashboard Controller
 * Handles application lifecycle, recruiter job posting, status workflow, talent search, and profile editing.
 */

const Dashboard = {
  currentTab: 'overview',
  activeRoleView: null, // 'candidate' or 'recruiter'

  init() {
    this.checkAuthentication();
    this.bindEvents();
    this.render();
  },

  checkAuthentication() {
    let currentUser = Auth.getCurrentUser();
    if (!currentUser) {
      // Default to demo candidate for smooth testing if no session exists
      const users = Storage.getUsers();
      currentUser = users.find(u => u.role === 'candidate') || INITIAL_USERS[0];
      Storage.setCurrentUser(currentUser);
      Auth.updateNavbarAuth();
    }
    this.activeRoleView = currentUser.role;
  },

  switchRoleView(targetRole) {
    const users = Storage.getUsers();
    const targetUser = users.find(u => u.role === targetRole);
    if (targetUser) {
      Storage.setCurrentUser(targetUser);
      this.activeRoleView = targetRole;
      this.currentTab = 'overview';
      Auth.updateNavbarAuth();
      showToast(`Switched view to ${targetRole === 'candidate' ? 'Candidate (Rahul)' : 'Recruiter (Priya)'}`, 'info');
      this.render();
    }
  },

  bindEvents() {
    // Tab switching event delegation
    const sidebar = document.getElementById('dashboardSidebar');
    if (sidebar) {
      sidebar.addEventListener('click', (e) => {
        const item = e.target.closest('.sidebar-nav-item');
        if (item) {
          const tab = item.getAttribute('data-tab');
          if (tab) {
            this.switchTab(tab);
          }
        }
      });
    }
  },

  switchTab(tabName) {
    this.currentTab = tabName;
    
    // Update sidebar active classes
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.renderTabContent();
  },

  render() {
    this.renderHeader();
    this.renderSidebar();
    this.renderTabContent();
  },

  renderHeader() {
    const headerContainer = document.getElementById('dashboardHeaderProfile');
    if (!headerContainer) return;

    const user = Auth.getCurrentUser();
    const isCand = this.activeRoleView === 'candidate';

    headerContainer.innerHTML = `
      <div class="dash-user-card">
        <div class="dash-avatar-circle">
          ${user.name.charAt(0).toUpperCase()}
        </div>
        <div class="dash-user-info">
          <h2>Welcome back, ${user.name} <span class="badge ${isCand ? 'badge-candidate' : 'badge-recruiter'}">${isCand ? 'Job Seeker' : 'Recruiter / Employer'}</span></h2>
          <p class="text-muted">
            ${isCand ? `${user.title || 'Developer'} • ${user.location} • ${user.phone}` : `${user.title} at <strong>${user.company}</strong> • ${user.location}`}
          </p>
        </div>
      </div>

      <div class="dash-header-actions">
        <div class="role-switch-pill">
          <span class="text-xs text-muted">Test View:</span>
          <button class="btn btn-xs ${isCand ? 'btn-primary' : 'btn-ghost'}" onclick="Dashboard.switchRoleView('candidate')">Candidate View</button>
          <button class="btn btn-xs ${!isCand ? 'btn-primary' : 'btn-ghost'}" onclick="Dashboard.switchRoleView('recruiter')">Recruiter View</button>
        </div>
        <button class="btn btn-outline btn-sm" onclick="Auth.logout()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </button>
      </div>
    `;
  },

  renderSidebar() {
    const sidebarNav = document.getElementById('dashboardSidebarNav');
    if (!sidebarNav) return;

    const isCand = this.activeRoleView === 'candidate';

    if (isCand) {
      sidebarNav.innerHTML = `
        <div class="sidebar-nav-item ${this.currentTab === 'overview' ? 'active' : ''}" data-tab="overview">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>Dashboard Overview</span>
        </div>
        <div class="sidebar-nav-item ${this.currentTab === 'applications' ? 'active' : ''}" data-tab="applications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span>My Applications & Status</span>
        </div>
        <div class="sidebar-nav-item ${this.currentTab === 'recommendations' ? 'active' : ''}" data-tab="recommendations">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
          <span>AI Recommended Jobs</span>
        </div>
        <div class="sidebar-nav-item ${this.currentTab === 'saved' ? 'active' : ''}" data-tab="saved">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          <span>Saved Jobs</span>
        </div>
        <div class="sidebar-nav-item ${this.currentTab === 'skillgap' ? 'active' : ''}" data-tab="skillgap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span>Skill Gap Analysis</span>
        </div>
        <div class="sidebar-nav-item ${this.currentTab === 'profile' ? 'active' : ''}" data-tab="profile">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Candidate Profile & Skills</span>
        </div>
        <a href="resume-builder.html" class="sidebar-nav-item sidebar-highlight">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
          <span>AI Resume Builder →</span>
        </a>
      `;
    } else {
      // Recruiter Sidebar
      sidebarNav.innerHTML = `
        <div class="sidebar-nav-item ${this.currentTab === 'overview' ? 'active' : ''}" data-tab="overview">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>Recruiter Overview</span>
        </div>
        <div class="sidebar-nav-item ${this.currentTab === 'postjob' ? 'active' : ''}" data-tab="postjob">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          <span>Post New Vacancy</span>
        </div>
        <div class="sidebar-nav-item ${this.currentTab === 'managejobs' ? 'active' : ''}" data-tab="managejobs">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          <span>Manage Posted Jobs</span>
        </div>
        <div class="sidebar-nav-item ${this.currentTab === 'applicants' ? 'active' : ''}" data-tab="applicants">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span>Manage Applicants (${Storage.getApplications().length})</span>
        </div>
        <div class="sidebar-nav-item ${this.currentTab === 'candidatesearch' ? 'active' : ''}" data-tab="candidatesearch">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>Talent Pool Search</span>
        </div>
      `;
    }
  },

  renderTabContent() {
    const mainContainer = document.getElementById('dashboardMainContent');
    if (!mainContainer) return;

    if (this.activeRoleView === 'candidate') {
      switch (this.currentTab) {
        case 'overview':
          this.renderCandidateOverview(mainContainer);
          break;
        case 'applications':
          this.renderCandidateApplications(mainContainer);
          break;
        case 'recommendations':
          this.renderCandidateRecommendations(mainContainer);
          break;
        case 'saved':
          this.renderCandidateSavedJobs(mainContainer);
          break;
        case 'skillgap':
          this.renderCandidateSkillGap(mainContainer);
          break;
        case 'profile':
          this.renderCandidateProfile(mainContainer);
          break;
        default:
          this.renderCandidateOverview(mainContainer);
      }
    } else {
      // Recruiter Views
      switch (this.currentTab) {
        case 'overview':
          this.renderRecruiterOverview(mainContainer);
          break;
        case 'postjob':
          this.renderRecruiterPostJob(mainContainer);
          break;
        case 'managejobs':
          this.renderRecruiterManageJobs(mainContainer);
          break;
        case 'applicants':
          this.renderRecruiterApplicants(mainContainer);
          break;
        case 'candidatesearch':
          this.renderRecruiterCandidateSearch(mainContainer);
          break;
        default:
          this.renderRecruiterOverview(mainContainer);
      }
    }
  },

  // ==========================================
  // CANDIDATE TAB RENDERING
  // ==========================================

  renderCandidateOverview(container) {
    const user = Auth.getCurrentUser();
    const apps = Storage.getApplications().filter(a => a.candidateId === user.id);
    const saved = Storage.getSavedJobs();
    const allJobs = Storage.getJobs();

    const shortlistedCount = apps.filter(a => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length;
    const underReviewCount = apps.filter(a => a.status === 'Under Review' || a.status === 'Applied').length;

    // Top recommended jobs
    const topMatches = allJobs.map(job => ({
      job,
      match: AIMatchingEngine.calculateJobMatch(user, job)
    })).sort((a, b) => b.match.score - a.match.score).slice(0, 3);

    container.innerHTML = `
      <div class="dash-stats-grid">
        <div class="stat-widget">
          <div class="stat-icon icon-blue">📋</div>
          <div>
            <div class="stat-number">${apps.length}</div>
            <div class="stat-label">Total Applied</div>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon icon-yellow">⏳</div>
          <div>
            <div class="stat-number">${underReviewCount}</div>
            <div class="stat-label">In Review</div>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon icon-green">🎯</div>
          <div>
            <div class="stat-number">${shortlistedCount}</div>
            <div class="stat-label">Shortlisted / Interviews</div>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon icon-purple">⭐</div>
          <div>
            <div class="stat-number">${saved.length}</div>
            <div class="stat-label">Saved Jobs</div>
          </div>
        </div>
      </div>

      <div class="dash-section-card mt-4">
        <div class="flex-between mb-3">
          <h3>Recent Applications & Pipeline Status</h3>
          <button class="btn btn-outline btn-xs" onclick="Dashboard.switchTab('applications')">View All Trackers →</button>
        </div>
        ${this.generateApplicationsListHtml(apps.slice(0, 3))}
      </div>

      <div class="dash-section-card mt-4">
        <div class="flex-between mb-3">
          <h3>Top AI Job Recommendations for You</h3>
          <button class="btn btn-outline btn-xs" onclick="Dashboard.switchTab('recommendations')">See All Matches →</button>
        </div>
        <div class="ai-recommendations-grid">
          ${topMatches.map(({ job, match }) => `
            <div class="ai-match-card">
              <div class="ai-match-header">
                <img src="${job.logo}" alt="${job.company}" class="ai-company-logo" onerror="this.src='https://via.placeholder.com/40?text=Job'"/>
                <span class="badge ${match.badgeClass}">${match.score}% ${match.label}</span>
              </div>
              <h4 class="ai-job-title">${job.title}</h4>
              <p class="text-xs text-muted mb-2">${job.company} • ${job.location} • <strong class="text-success">${job.salaryDisplay}</strong></p>
              <div class="ai-progress-wrap mb-2">
                <div class="progress-track"><div class="progress-fill ${match.badgeClass}" style="width: ${match.score}%;"></div></div>
              </div>
              <div class="flex-between mt-3">
                <a href="index.html" class="btn btn-outline btn-xs">View Details</a>
                <button class="btn btn-primary btn-xs" onclick="App.applyToJob('${job.id}')">1-Click Apply</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderCandidateApplications(container) {
    const user = Auth.getCurrentUser();
    const apps = Storage.getApplications().filter(a => a.candidateId === user.id);

    container.innerHTML = `
      <div class="dash-section-card">
        <div class="flex-between mb-4">
          <div>
            <h3>Application Tracking Pipeline</h3>
            <p class="text-muted">Track the live progress of your job applications from submission to selection.</p>
          </div>
          <a href="index.html#jobsSection" class="btn btn-primary btn-sm">Find More Jobs</a>
        </div>

        ${apps.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📁</div>
            <h4>No applications yet</h4>
            <p class="text-muted">Explore AI recommended jobs and submit your first application today!</p>
            <a href="index.html#jobsSection" class="btn btn-primary btn-sm mt-3">Explore Vacancies</a>
          </div>
        ` : this.generateApplicationsListHtml(apps)}
      </div>
    `;
  },

  generateApplicationsListHtml(apps) {
    const allJobs = Storage.getJobs();
    const statusOrder = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

    return `
      <div class="applications-pipeline-list">
        ${apps.map(app => {
          const job = allJobs.find(j => j.id === app.jobId) || {
            title: 'Software Role',
            company: 'Tech Enterprise',
            location: 'India',
            salaryDisplay: 'Competitive'
          };

          const isRejected = app.status === 'Rejected';
          const currentIndex = statusOrder.indexOf(app.status);

          return `
            <div class="app-tracking-card ${isRejected ? 'card-rejected' : ''}">
              <div class="app-card-top flex-between">
                <div>
                  <h4 class="app-job-title">${job.title}</h4>
                  <p class="app-company font-medium text-muted">${job.company} • ${job.location} • <span class="text-success">${job.salaryDisplay}</span></p>
                </div>
                <div class="app-status-badge-wrap">
                  <span class="badge ${this.getStatusBadgeClass(app.status)}">${app.status}</span>
                  <span class="text-xs text-muted block mt-1">Applied: ${app.appliedDate}</span>
                </div>
              </div>

              <!-- Pipeline Progression Stepper -->
              ${!isRejected ? `
                <div class="pipeline-stepper">
                  ${statusOrder.map((step, idx) => {
                    const isCompleted = currentIndex >= idx;
                    const isCurrent = currentIndex === idx;
                    return `
                      <div class="step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                        <div class="step-circle">${isCompleted ? '✓' : idx + 1}</div>
                        <span class="step-label">${step}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <div class="rejection-notice">
                  ⚠️ Status: Application Not Selected. Recruiter feedback: "${app.notes || 'Position filled or candidate profile not aligned at this time.'}"
                </div>
              `}

              ${app.notes && !isRejected ? `
                <div class="app-notes-box">
                  <strong>Recruiter Update:</strong> ${app.notes}
                </div>
              ` : ''}

              <div class="app-card-actions flex-between mt-3">
                <span class="text-xs text-muted">AI Match Score at submission: <strong>${app.matchScore || 85}%</strong></span>
                <button class="btn btn-outline btn-xs" onclick="Dashboard.withdrawApplication('${app.id}')">Withdraw Application</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  getStatusBadgeClass(status) {
    switch (status) {
      case 'Applied': return 'badge-light';
      case 'Under Review': return 'badge-warning';
      case 'Shortlisted': return 'badge-info';
      case 'Interview': return 'badge-primary';
      case 'Selected': return 'badge-success';
      case 'Rejected': return 'badge-danger';
      default: return 'badge-light';
    }
  },

  withdrawApplication(appId) {
    if (confirm('Are you sure you want to withdraw this application?')) {
      let apps = Storage.getApplications();
      apps = apps.filter(a => a.id !== appId);
      Storage.set(STORAGE_KEYS.APPLICATIONS, apps);
      showToast('Application withdrawn successfully.', 'info');
      this.renderTabContent();
    }
  },

  renderCandidateRecommendations(container) {
    const user = Auth.getCurrentUser();
    const allJobs = Storage.getJobs();

    const scoredJobs = allJobs.map(job => ({
      job,
      match: AIMatchingEngine.calculateJobMatch(user, job)
    })).sort((a, b) => b.match.score - a.match.score);

    container.innerHTML = `
      <div class="dash-section-card">
        <div class="mb-4">
          <h3>AI Recommended Roles for Your Profile</h3>
          <p class="text-muted">Ranked in real-time by analyzing your skills: <strong>${(user.skills || []).join(', ')}</strong></p>
        </div>

        <div class="ai-recommendations-grid">
          ${scoredJobs.map(({ job, match }) => `
            <div class="ai-match-card">
              <div class="ai-match-header">
                <img src="${job.logo}" alt="${job.company}" class="ai-company-logo" onerror="this.src='https://via.placeholder.com/40?text=Job'"/>
                <span class="badge ${match.badgeClass}">${match.score}% ${match.label}</span>
              </div>
              <h4 class="ai-job-title">${job.title}</h4>
              <p class="text-xs text-muted mb-2">${job.company} • ${job.location} • <strong class="text-success">${job.salaryDisplay}</strong></p>
              
              <div class="ai-progress-wrap mb-2">
                <div class="flex-between text-xs mb-1">
                  <span>Match Strength</span>
                  <span class="text-primary font-bold">${match.score}%</span>
                </div>
                <div class="progress-track"><div class="progress-fill ${match.badgeClass}" style="width: ${match.score}%;"></div></div>
              </div>

              <div class="text-xs text-muted mb-2">
                <strong>Matching Skills:</strong> ${match.matchingSkills.length > 0 ? match.matchingSkills.slice(0, 3).join(', ') : 'None'}
              </div>

              <div class="flex-between mt-3">
                <a href="index.html" class="btn btn-outline btn-xs">Full Spec</a>
                <button class="btn btn-primary btn-xs" onclick="App.applyToJob('${job.id}')">Apply Now</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderCandidateSavedJobs(container) {
    const savedIds = Storage.getSavedJobs();
    const allJobs = Storage.getJobs();
    const savedJobs = allJobs.filter(j => savedIds.includes(j.id));

    container.innerHTML = `
      <div class="dash-section-card">
        <div class="flex-between mb-4">
          <div>
            <h3>Your Saved Jobs (${savedJobs.length})</h3>
            <p class="text-muted">Bookmarked opportunities you want to apply to or review later.</p>
          </div>
          <a href="index.html#jobsSection" class="btn btn-outline btn-sm">Find More</a>
        </div>

        ${savedJobs.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">⭐</div>
            <h4>No saved jobs</h4>
            <p class="text-muted">Click the heart icon on any job card to save it here for quick access.</p>
          </div>
        ` : `
          <div class="saved-jobs-grid">
            ${savedJobs.map(job => `
              <div class="saved-job-item">
                <div class="flex-start gap-md">
                  <img src="${job.logo}" alt="${job.company}" class="company-logo" onerror="this.src='https://via.placeholder.com/40?text=Job'"/>
                  <div>
                    <h4 class="font-bold">${job.title}</h4>
                    <p class="text-sm text-muted">${job.company} • ${job.location} • <span class="text-success">${job.salaryDisplay}</span></p>
                  </div>
                </div>
                <div class="flex-end gap-sm mt-3">
                  <button class="btn btn-outline btn-xs" onclick="App.toggleSave('${job.id}'); Dashboard.renderTabContent();">Remove</button>
                  <button class="btn btn-primary btn-xs" onclick="App.applyToJob('${job.id}')">Apply Now</button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  renderCandidateSkillGap(container) {
    const user = Auth.getCurrentUser();
    const allJobs = Storage.getJobs();

    container.innerHTML = `
      <div class="dash-section-card">
        <div class="mb-4">
          <h3>Skill Gap Analysis for ${user.name}</h3>
          <p class="text-muted">Select a target industry job to benchmark your skills and discover missing competencies.</p>
        </div>

        <div class="form-group mb-4" style="max-width: 400px;">
          <label class="form-label" for="dashGapRoleSelect">Select Target Benchmark Job:</label>
          <select id="dashGapRoleSelect" class="form-input" onchange="Dashboard.updateDashSkillGap(this.value)">
            ${allJobs.map(j => `<option value="${j.id}">${j.title} - ${j.company} (${j.location})</option>`).join('')}
          </select>
        </div>

        <div id="dashSkillGapTarget"></div>
      </div>
    `;

    if (allJobs.length > 0) {
      this.updateDashSkillGap(allJobs[0].id);
    }
  },

  updateDashSkillGap(jobId) {
    const target = document.getElementById('dashSkillGapTarget');
    if (!target) return;

    const job = Storage.getJobs().find(j => j.id === jobId);
    const user = Auth.getCurrentUser();
    if (!job || !user) return;

    const gap = AIMatchingEngine.analyzeSkillGap(user.skills || [], job.skills);

    target.innerHTML = `
      <div class="gap-analysis-card">
        <div class="gap-card-header">
          <div>
            <h4>Role: <span class="text-primary">${job.title}</span> at ${job.company}</h4>
            <p class="text-muted">Salary: <strong class="text-success">${job.salaryDisplay}</strong> • Experience: ${job.experience}</p>
          </div>
          <div class="gap-score-box">
            <div class="gap-score-num">${gap.score}%</div>
            <div class="gap-score-lbl">Compatibility</div>
          </div>
        </div>

        <div class="gap-analysis-grid">
          <div class="gap-column col-matching">
            <h5>✓ Matching Skills (${gap.matchingSkills.length})</h5>
            <div class="skill-tag-group">
              ${gap.matchingSkills.map(s => `<span class="badge badge-success">✓ ${s}</span>`).join('')}
              ${gap.matchingSkills.length === 0 ? '<span class="text-muted text-xs">No direct matches.</span>' : ''}
            </div>
          </div>

          <div class="gap-column col-missing">
            <h5>⚡ Missing Skills to Master (${gap.missingSkills.length})</h5>
            <div class="skill-tag-group">
              ${gap.missingSkills.map(s => `<span class="badge badge-warning">⚡ ${s}</span>`).join('')}
              ${gap.missingSkills.length === 0 ? '<span class="text-success text-xs">100% Skill coverage!</span>' : ''}
            </div>
          </div>
        </div>

        ${gap.recommendations.length > 0 ? `
          <div class="learning-path-box mt-3">
            <h5>Recommended Learning Path</h5>
            <div class="recommendations-table">
              ${gap.recommendations.map(r => `
                <div class="rec-row">
                  <div class="rec-skill font-bold">${r.skill}</div>
                  <div class="rec-level"><span class="badge badge-light">${r.difficulty}</span></div>
                  <div class="rec-time text-muted">Est. ${r.learningTime}</div>
                  <div class="rec-topic text-primary">${r.resourceTopic}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  renderCandidateProfile(container) {
    const user = Auth.getCurrentUser();
    const skillsList = user.skills || [];

    container.innerHTML = `
      <div class="dash-section-card">
        <div class="mb-4">
          <h3>Candidate Profile & Skill Set</h3>
          <p class="text-muted">Keep your skills and experience up to date to get higher AI matching scores.</p>
        </div>

        <form id="candidateProfileForm" onsubmit="Dashboard.saveCandidateProfile(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="profName">Full Name *</label>
              <input type="text" id="profName" class="form-input" value="${user.name}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="profEmail">Email (Cannot be changed)</label>
              <input type="email" id="profEmail" class="form-input" value="${user.email}" disabled />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="profTitle">Professional Title / Headline *</label>
              <input type="text" id="profTitle" class="form-input" value="${user.title || ''}" placeholder="e.g. Java Developer / Full Stack Engineer" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="profPhone">Phone Number</label>
              <input type="text" id="profPhone" class="form-input" value="${user.phone || ''}" placeholder="+91 98765 43210" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="profLocation">Current Location</label>
              <input type="text" id="profLocation" class="form-input" value="${user.location || 'Bengaluru'}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="profExp">Total Experience</label>
              <input type="text" id="profExp" class="form-input" value="${user.experience || '2 Years'}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="profEducation">Education Details</label>
            <input type="text" id="profEducation" class="form-input" value="${user.education || ''}" placeholder="e.g. B.Tech in CSE, ABC Institute (2023)" />
          </div>

          <!-- Skills Manager Section -->
          <div class="form-group">
            <label class="form-label">My Technical Skills (Used by AI matching algorithm)</label>
            <div class="skill-tag-manager" id="profileSkillsContainer">
              ${skillsList.map(skill => `
                <span class="managed-skill-pill">
                  ${skill}
                  <button type="button" class="btn-remove-skill" onclick="Dashboard.removeSkillTag('${skill}')">&times;</button>
                </span>
              `).join('')}
            </div>
            <div class="flex-start gap-sm mt-2">
              <input type="text" id="newSkillInput" class="form-input" style="max-width: 250px;" placeholder="Add skill (e.g. Docker, AWS)" />
              <button type="button" class="btn btn-outline btn-sm" onclick="Dashboard.addSkillTag()">+ Add Skill</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="profBio">Professional Bio</label>
            <textarea id="profBio" class="form-input" rows="3">${user.bio || ''}</textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-md">Save Profile Changes</button>
        </form>
      </div>
    `;
  },

  addSkillTag() {
    const input = document.getElementById('newSkillInput');
    if (!input || !input.value.trim()) return;

    const skill = input.value.trim();
    const user = Auth.getCurrentUser();
    if (!user.skills) user.skills = [];

    if (!user.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      user.skills.push(skill);
      Storage.saveUser(user);
      input.value = '';
      this.renderCandidateProfile(document.getElementById('dashboardMainContent'));
      showToast(`Skill '${skill}' added!`, 'success');
    }
  },

  removeSkillTag(skill) {
    const user = Auth.getCurrentUser();
    if (user && user.skills) {
      user.skills = user.skills.filter(s => s !== skill);
      Storage.saveUser(user);
      this.renderCandidateProfile(document.getElementById('dashboardMainContent'));
      showToast(`Skill '${skill}' removed.`, 'info');
    }
  },

  saveCandidateProfile(e) {
    e.preventDefault();
    const user = Auth.getCurrentUser();

    user.name = document.getElementById('profName').value.trim();
    user.title = document.getElementById('profTitle').value.trim();
    user.phone = document.getElementById('profPhone').value.trim();
    user.location = document.getElementById('profLocation').value.trim();
    user.experience = document.getElementById('profExp').value.trim();
    user.education = document.getElementById('profEducation').value.trim();
    user.bio = document.getElementById('profBio').value.trim();

    Storage.saveUser(user);
    this.renderHeader();
    showToast('Profile details updated successfully!', 'success');
  },

  // ==========================================
  // RECRUITER TAB RENDERING
  // ==========================================

  renderRecruiterOverview(container) {
    const user = Auth.getCurrentUser();
    const allJobs = Storage.getJobs();
    const myJobs = allJobs.filter(j => j.recruiterId === user.id || j.company.toLowerCase().includes((user.company || '').toLowerCase()));
    const allApps = Storage.getApplications();

    const shortlisted = allApps.filter(a => a.status === 'Shortlisted').length;
    const interviews = allApps.filter(a => a.status === 'Interview').length;

    container.innerHTML = `
      <div class="dash-stats-grid">
        <div class="stat-widget">
          <div class="stat-icon icon-blue">💼</div>
          <div>
            <div class="stat-number">${myJobs.length || allJobs.length}</div>
            <div class="stat-label">Active Job Openings</div>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon icon-purple">👥</div>
          <div>
            <div class="stat-number">${allApps.length}</div>
            <div class="stat-label">Total Applicants</div>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon icon-yellow">⭐</div>
          <div>
            <div class="stat-number">${shortlisted}</div>
            <div class="stat-label">Shortlisted Candidates</div>
          </div>
        </div>
        <div class="stat-widget">
          <div class="stat-icon icon-green">🎤</div>
          <div>
            <div class="stat-number">${interviews}</div>
            <div class="stat-label">Interviews Scheduled</div>
          </div>
        </div>
      </div>

      <div class="dash-section-card mt-4">
        <div class="flex-between mb-3">
          <h3>Recent Candidate Applications</h3>
          <button class="btn btn-outline btn-xs" onclick="Dashboard.switchTab('applicants')">Manage All Candidates →</button>
        </div>
        ${this.generateRecruiterApplicantTableHtml(allApps.slice(0, 4))}
      </div>

      <div class="dash-section-card mt-4">
        <div class="flex-between mb-3">
          <h3>Your Active Job Postings</h3>
          <button class="btn btn-primary btn-xs" onclick="Dashboard.switchTab('postjob')">+ Post New Job</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Applications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${allJobs.slice(0, 5).map(job => {
                const count = allApps.filter(a => a.jobId === job.id).length;
                return `
                  <tr>
                    <td><strong>${job.title}</strong><br><span class="text-xs text-muted">${job.category}</span></td>
                    <td>${job.location}</td>
                    <td class="text-success font-semibold">${job.salaryDisplay}</td>
                    <td><span class="badge badge-light">${count} Candidates</span></td>
                    <td>
                      <button class="btn btn-ghost btn-xs text-primary" onclick="Dashboard.switchTab('managejobs')">Manage</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderRecruiterPostJob(container) {
    const user = Auth.getCurrentUser();

    container.innerHTML = `
      <div class="dash-section-card">
        <div class="mb-4">
          <h3>Post a New Job Vacancy</h3>
          <p class="text-muted">Create a vacancy to reach thousands of AI-matched engineering candidates across India.</p>
        </div>

        <form id="postJobForm" onsubmit="Dashboard.handleJobPost(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="jobPostTitle">Job Title *</label>
              <input type="text" id="jobPostTitle" class="form-input" placeholder="e.g. Senior Java Fullstack Developer" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="jobPostCompany">Company Name *</label>
              <input type="text" id="jobPostCompany" class="form-input" value="${user.company || 'TechCorp India'}" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="jobPostCategory">Category *</label>
              <select id="jobPostCategory" class="form-input" required>
                <option value="Software Development">Software Development</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Core Engineering">Core Engineering (VLSI / Hardware)</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="UI/UX & Product">UI/UX & Product</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="jobPostLocation">Location *</label>
              <select id="jobPostLocation" class="form-input" required>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="jobPostType">Job Type</label>
              <select id="jobPostType" class="form-input">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="jobPostMode">Work Mode</label>
              <select id="jobPostMode" class="form-input">
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="jobPostExperience">Experience Required</label>
              <input type="text" id="jobPostExperience" class="form-input" placeholder="e.g. 2-4 Years / Fresher" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="jobPostMinSalary">Min Salary (₹ LPA)</label>
              <input type="number" id="jobPostMinSalary" class="form-input" placeholder="e.g. 8" min="1" step="0.5" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="jobPostMaxSalary">Max Salary (₹ LPA)</label>
              <input type="number" id="jobPostMaxSalary" class="form-input" placeholder="e.g. 15" min="1" step="0.5" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="jobPostSkills">Required Skills (Comma separated) *</label>
            <input type="text" id="jobPostSkills" class="form-input" placeholder="e.g. Java, Spring Boot, React, SQL, Docker" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="jobPostDesc">Job Description *</label>
            <textarea id="jobPostDesc" class="form-input" rows="4" placeholder="Overview of the position, team culture, and objectives..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="jobPostResp">Key Responsibilities (One per line)</label>
            <textarea id="jobPostResp" class="form-input" rows="3" placeholder="Design scalable backend microservices&#10;Write unit and integration tests&#10;Participate in code reviews"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="jobPostBenefits">Perks & Benefits (One per line)</label>
            <textarea id="jobPostBenefits" class="form-input" rows="2" placeholder="Comprehensive Medical Cover&#10;Flexible Work Schedule&#10;Annual Training Allowance"></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-lg">Publish Job Opening</button>
        </form>
      </div>
    `;
  },

  handleJobPost(e) {
    e.preventDefault();
    const user = Auth.getCurrentUser();

    const title = document.getElementById('jobPostTitle').value.trim();
    const company = document.getElementById('jobPostCompany').value.trim();
    const category = document.getElementById('jobPostCategory').value;
    const location = document.getElementById('jobPostLocation').value;
    const jobType = document.getElementById('jobPostType').value;
    const workMode = document.getElementById('jobPostMode').value;
    const experience = document.getElementById('jobPostExperience').value.trim();
    const minSal = parseFloat(document.getElementById('jobPostMinSalary').value);
    const maxSal = parseFloat(document.getElementById('jobPostMaxSalary').value);
    const skillsRaw = document.getElementById('jobPostSkills').value;
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const description = document.getElementById('jobPostDesc').value.trim();
    const respRaw = document.getElementById('jobPostResp').value;
    const responsibilities = respRaw.split('\n').map(r => r.trim()).filter(r => r.length > 0);
    const benRaw = document.getElementById('jobPostBenefits').value;
    const benefits = benRaw.split('\n').map(b => b.trim()).filter(b => b.length > 0);

    const newJob = {
      id: 'job_' + Date.now(),
      title,
      company,
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=120&h=120&q=80',
      location,
      salaryMin: minSal,
      salaryMax: maxSal,
      salaryDisplay: `₹${minSal} - ${maxSal} LPA`,
      experience,
      jobType,
      workMode,
      category,
      postedDate: new Date().toISOString().split('T')[0],
      recruiterId: user.id,
      description,
      responsibilities: responsibilities.length > 0 ? responsibilities : ['Contribute to agile engineering goals.'],
      skills,
      benefits: benefits.length > 0 ? benefits : ['Health Insurance', 'Performance Bonus']
    };

    Storage.saveJob(newJob);
    showToast(`Job '${newJob.title}' published successfully!`, 'success');
    this.switchTab('managejobs');
  },

  renderRecruiterManageJobs(container) {
    const allJobs = Storage.getJobs();
    const allApps = Storage.getApplications();

    container.innerHTML = `
      <div class="dash-section-card">
        <div class="flex-between mb-4">
          <div>
            <h3>Manage Job Vacancies</h3>
            <p class="text-muted">Review, edit, or remove your company's active listings.</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="Dashboard.switchTab('postjob')">+ New Opening</button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Job Title & Info</th>
                <th>Location</th>
                <th>Experience</th>
                <th>Salary</th>
                <th>Applicants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${allJobs.map(job => {
                const count = allApps.filter(a => a.jobId === job.id).length;
                return `
                  <tr id="manage-job-row-${job.id}">
                    <td>
                      <strong>${job.title}</strong>
                      <div class="text-xs text-muted">${job.company} • ${job.category}</div>
                    </td>
                    <td>${job.location}</td>
                    <td>${job.experience}</td>
                    <td class="text-success font-semibold">${job.salaryDisplay}</td>
                    <td>
                      <span class="badge ${count > 0 ? 'badge-primary' : 'badge-light'}">${count} Applicants</span>
                    </td>
                    <td>
                      <button class="btn btn-outline btn-xs" onclick="Dashboard.deleteJobVacancy('${job.id}')">Delete</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  deleteJobVacancy(jobId) {
    if (confirm('Are you sure you want to delete this job vacancy?')) {
      Storage.deleteJob(jobId);
      showToast('Job listing deleted.', 'info');
      this.renderTabContent();
    }
  },

  renderRecruiterApplicants(container) {
    const allApps = Storage.getApplications();
    const allJobs = Storage.getJobs();

    container.innerHTML = `
      <div class="dash-section-card">
        <div class="flex-between mb-4">
          <div>
            <h3>Candidate Applications (${allApps.length})</h3>
            <p class="text-muted">Review resumes, view AI match compatibility, and update hiring pipeline status.</p>
          </div>
        </div>

        ${allApps.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">👥</div>
            <h4>No applications received yet</h4>
          </div>
        ` : this.generateRecruiterApplicantTableHtml(allApps)}
      </div>
    `;
  },

  generateRecruiterApplicantTableHtml(apps) {
    const allJobs = Storage.getJobs();

    return `
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Applied For</th>
              <th>AI Fit</th>
              <th>Applied Date</th>
              <th>Current Status</th>
              <th>Actions / Decision</th>
            </tr>
          </thead>
          <tbody>
            ${apps.map(app => {
              const job = allJobs.find(j => j.id === app.jobId) || { title: 'Engineer', company: 'Company' };
              const score = app.matchScore || 85;

              return `
                <tr id="app-row-${app.id}">
                  <td>
                    <strong>${app.candidateName}</strong>
                    <div class="text-xs text-muted">${app.candidateEmail}</div>
                    <div class="text-xs text-muted">${app.candidatePhone || ''}</div>
                  </td>
                  <td>
                    <strong>${job.title}</strong>
                    <div class="text-xs text-muted">${job.company}</div>
                  </td>
                  <td>
                    <span class="badge ${score >= 80 ? 'badge-excellent' : score >= 65 ? 'badge-good' : 'badge-moderate'} font-bold">
                      ${score}% Match
                    </span>
                  </td>
                  <td>${app.appliedDate}</td>
                  <td>
                    <span class="badge ${this.getStatusBadgeClass(app.status)}">${app.status}</span>
                  </td>
                  <td>
                    <select class="form-input form-input-sm" onchange="Dashboard.changeApplicantStatus('${app.id}', this.value)">
                      <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
                      <option value="Under Review" ${app.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                      <option value="Shortlisted" ${app.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
                      <option value="Interview" ${app.status === 'Interview' ? 'selected' : ''}>Interview</option>
                      <option value="Selected" ${app.status === 'Selected' ? 'selected' : ''}>Selected</option>
                      <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  changeApplicantStatus(appId, newStatus) {
    let note = prompt(`Enter recruiter feedback note for '${newStatus}' (optional):`, `Profile updated to ${newStatus}.`);
    Storage.updateApplicationStatus(appId, newStatus, note || '');
    showToast(`Applicant status changed to '${newStatus}'.`, 'success');
    this.renderTabContent();
  },

  renderRecruiterCandidateSearch(container) {
    const users = Storage.getUsers().filter(u => u.role === 'candidate');

    container.innerHTML = `
      <div class="dash-section-card">
        <div class="mb-4">
          <h3>Talent Pool Database</h3>
          <p class="text-muted">Search through verified candidates registered on the AI Job Portal.</p>
        </div>

        <div class="talent-search-bar mb-4">
          <input type="text" id="talentSearchInput" class="form-input" placeholder="Search by name, role, or skill (e.g. Java, React, SQL)..." oninput="Dashboard.filterTalentPool(this.value)" />
        </div>

        <div id="talentGrid" class="talent-pool-grid">
          ${this.generateTalentCards(users)}
        </div>
      </div>
    `;
  },

  generateTalentCards(candidates) {
    if (candidates.length === 0) {
      return '<div class="empty-state"><p class="text-muted">No candidates found.</p></div>';
    }

    return candidates.map(cand => `
      <div class="talent-card card-hover">
        <div class="flex-start gap-md mb-3">
          <div class="user-avatar-circle">${cand.name.charAt(0).toUpperCase()}</div>
          <div>
            <h4 class="font-bold">${cand.name}</h4>
            <p class="text-xs text-muted">${cand.title || 'Developer'} • ${cand.location || 'India'}</p>
          </div>
        </div>

        <p class="text-xs text-secondary mb-3">${cand.bio || 'Ready for new engineering opportunities.'}</p>

        <div class="text-xs font-semibold mb-1">Key Skills:</div>
        <div class="skill-tag-group mb-3">
          ${(cand.skills || []).slice(0, 5).map(s => `<span class="badge badge-light text-xs">${s}</span>`).join('')}
        </div>

        <div class="talent-card-footer flex-between">
          <span class="text-xs text-muted">Exp: ${cand.experience || '2 Years'}</span>
          <button class="btn btn-primary btn-xs" onclick="alert('Contact Candidate:\\nEmail: ${cand.email}\\nPhone: ${cand.phone || 'N/A'}')">Contact Candidate</button>
        </div>
      </div>
    `).join('');
  },

  filterTalentPool(query) {
    const q = query.toLowerCase().trim();
    const users = Storage.getUsers().filter(u => u.role === 'candidate');
    const filtered = users.filter(u => {
      const matchName = u.name.toLowerCase().includes(q);
      const matchTitle = (u.title || '').toLowerCase().includes(q);
      const matchSkill = (u.skills || []).some(s => s.toLowerCase().includes(q));
      return matchName || matchTitle || matchSkill;
    });

    const grid = document.getElementById('talentGrid');
    if (grid) {
      grid.innerHTML = this.generateTalentCards(filtered);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Dashboard.init();
});
