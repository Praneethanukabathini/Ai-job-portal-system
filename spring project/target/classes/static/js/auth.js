/**
 * AI Job Portal - Authentication & Session Controller
 * Handles user login, registration, role-switching, demo credentials, and navbar state.
 */

const Auth = {
  getCurrentUser() {
    return Storage.getCurrentUser();
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  isCandidate() {
    const user = this.getCurrentUser();
    return user && user.role === 'candidate';
  },

  isRecruiter() {
    const user = this.getCurrentUser();
    return user && user.role === 'recruiter';
  },

  /**
   * Log in user with email & password
   */
  login(email, password, role) {
    const users = Storage.getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find(u => 
      u.email.toLowerCase() === normalizedEmail && 
      u.password === password &&
      (!role || u.role === role)
    );

    if (user) {
      Storage.setCurrentUser(user);
      this.updateNavbarAuth();
      showToast(`Welcome back, ${user.name}! Successfully logged in.`, 'success');
      return { success: true, user };
    } else {
      return { success: false, message: 'Invalid email, password, or role selected.' };
    }
  },

  /**
   * Register a new candidate
   */
  registerCandidate(data) {
    const users = Storage.getUsers();
    const exists = users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase());

    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: 'user_cand_' + Date.now(),
      role: 'candidate',
      email: data.email.trim().toLowerCase(),
      password: data.password || '12345',
      name: data.name.trim(),
      title: data.title || 'Aspiring Software Professional',
      phone: data.phone || '+91 98765 00000',
      location: data.location || 'Bengaluru',
      education: data.education || 'B.Tech / Graduate',
      experience: data.experience || 'Fresher (0-1 Yrs)',
      skills: data.skills && data.skills.length ? data.skills : ['Java', 'JavaScript', 'HTML5', 'CSS3', 'SQL'],
      preferredRole: data.preferredRole || 'Software Engineer',
      preferredLocation: data.location || 'Bengaluru',
      bio: data.bio || 'Motivated professional ready to contribute to high-impact projects.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80'
    };

    Storage.saveUser(newUser);
    Storage.setCurrentUser(newUser);
    this.updateNavbarAuth();
    showToast(`Account created! Welcome to AI Job Portal, ${newUser.name}.`, 'success');
    return { success: true, user: newUser };
  },

  /**
   * Register a new recruiter
   */
  registerRecruiter(data) {
    const users = Storage.getUsers();
    const exists = users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase());

    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: 'user_rec_' + Date.now(),
      role: 'recruiter',
      email: data.email.trim().toLowerCase(),
      password: data.password || '12345',
      name: data.name.trim(),
      title: data.title || 'Technical Recruiter',
      company: data.company.trim(),
      phone: data.phone || '+91 98000 11111',
      location: data.location || 'Bengaluru',
      companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&h=120&q=80',
      bio: `Recruiting top talent for ${data.company}.`
    };

    Storage.saveUser(newUser);
    Storage.setCurrentUser(newUser);
    this.updateNavbarAuth();
    showToast(`Recruiter account registered for ${newUser.company}!`, 'success');
    return { success: true, user: newUser };
  },

  /**
   * Logout user and refresh relevant page state
   */
  logout() {
    const user = this.getCurrentUser();
    const name = user ? user.name : 'User';
    Storage.clearCurrentUser();
    this.updateNavbarAuth();
    showToast(`You have been logged out, ${name}.`, 'info');
    
    // If currently on dashboard, redirect back to home or reload
    if (window.location.pathname.includes('dashboard')) {
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  },

  /**
   * Synchronize top navigation bar with logged-in user state
   */
  updateNavbarAuth() {
    const navAuthContainer = document.getElementById('navAuthActions');
    if (!navAuthContainer) return;

    const currentUser = this.getCurrentUser();

    if (currentUser) {
      const isCand = currentUser.role === 'candidate';
      const roleLabel = isCand ? 'Candidate' : 'Recruiter';
      const badgeClass = isCand ? 'badge-candidate' : 'badge-recruiter';
      const dashboardUrl = 'dashboard.html';

      navAuthContainer.innerHTML = `
        <div class="user-profile-menu">
          <a href="${dashboardUrl}" class="nav-user-info" title="Go to Dashboard">
            <span class="user-avatar-circle">${currentUser.name.charAt(0).toUpperCase()}</span>
            <div class="user-meta">
              <span class="user-name">${currentUser.name}</span>
              <span class="user-role-badge ${badgeClass}">${roleLabel}</span>
            </div>
          </a>
          <a href="${dashboardUrl}" class="btn btn-outline btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </a>
          <button id="navLogoutBtn" class="btn btn-ghost btn-sm" title="Log Out" onclick="Auth.logout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      `;
    } else {
      navAuthContainer.innerHTML = `
        <button class="btn btn-outline btn-sm" onclick="AuthModal.open('login', 'candidate')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          Sign In
        </button>
        <button class="btn btn-primary btn-sm" onclick="AuthModal.open('register', 'candidate')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          Register Free
        </button>
      `;
    }
  }
};

// ==========================================
// Auth Modal Controller
// ==========================================

const AuthModal = {
  activeMode: 'login', // 'login' or 'register'
  activeRole: 'candidate', // 'candidate' or 'recruiter'

  open(mode = 'login', role = 'candidate') {
    this.activeMode = mode;
    this.activeRole = role;

    const modal = document.getElementById('authModal');
    if (!modal) return;

    this.renderForm();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  setRole(role) {
    this.activeRole = role;
    this.renderForm();
  },

  setMode(mode) {
    this.activeMode = mode;
    this.renderForm();
  },

  quickDemoLogin(role) {
    if (role === 'candidate') {
      const emailInput = document.getElementById('authEmail');
      const passInput = document.getElementById('authPassword');
      if (emailInput && passInput) {
        emailInput.value = 'rahul.sharma@example.com';
        passInput.value = '12345';
      }
      const res = Auth.login('rahul.sharma@example.com', '12345', 'candidate');
      if (res.success) {
        AuthModal.close();
        if (window.location.pathname.includes('dashboard')) {
          window.location.reload();
        } else {
          // re-render jobs or recommendations if on index.html
          if (typeof App !== 'undefined' && App.renderAll) App.renderAll();
        }
      }
    } else {
      const emailInput = document.getElementById('authEmail');
      const passInput = document.getElementById('authPassword');
      if (emailInput && passInput) {
        emailInput.value = 'priya.hr@techcorp.in';
        passInput.value = '12345';
      }
      const res = Auth.login('priya.hr@techcorp.in', '12345', 'recruiter');
      if (res.success) {
        AuthModal.close();
        if (window.location.pathname.includes('dashboard')) {
          window.location.reload();
        } else {
          if (typeof App !== 'undefined' && App.renderAll) App.renderAll();
        }
      }
    }
  },

  renderForm() {
    const modalBody = document.getElementById('authModalContent');
    if (!modalBody) return;

    const isLogin = this.activeMode === 'login';
    const isCand = this.activeRole === 'candidate';

    modalBody.innerHTML = `
      <div class="auth-modal-header">
        <div class="auth-role-tabs">
          <button class="role-tab ${isCand ? 'active' : ''}" onclick="AuthModal.setRole('candidate')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Job Seeker / Candidate
          </button>
          <button class="role-tab ${!isCand ? 'active' : ''}" onclick="AuthModal.setRole('recruiter')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            Employer / Recruiter
          </button>
        </div>
        <button class="modal-close-btn" onclick="AuthModal.close()" title="Close">&times;</button>
      </div>

      <div class="auth-modal-title">
        <h3>${isLogin ? 'Welcome Back' : 'Create Your Account'}</h3>
        <p class="text-muted">
          ${isCand 
            ? (isLogin ? 'Access AI Job Matches, Skill Gap Analysis & Applications' : 'Start your journey with smart AI skill matching & resume builder') 
            : (isLogin ? 'Post jobs, search candidates & manage applicant pipelines' : 'Hire high-caliber talent with AI-assisted candidate screening')
          }
        </p>
      </div>

      <!-- Quick Demo Login Credentials Card -->
      <div class="demo-login-box">
        <div class="demo-box-header">
          <span class="badge badge-accent">Demo Access (Password: 12345)</span>
          <span class="text-xs text-muted">Click to sign in instantly</span>
        </div>
        <div class="demo-box-buttons">
          <button type="button" class="btn btn-outline btn-xs" onclick="AuthModal.quickDemoLogin('candidate')">
            ⚡ Quick Login as Candidate (Rahul)
          </button>
          <button type="button" class="btn btn-outline btn-xs" onclick="AuthModal.quickDemoLogin('recruiter')">
            ⚡ Quick Login as Recruiter (Priya)
          </button>
        </div>
      </div>

      <form id="authMainForm" onsubmit="AuthModal.handleSubmit(event)">
        ${!isLogin ? `
          <div class="form-group">
            <label class="form-label" for="regName">Full Name *</label>
            <input type="text" id="regName" class="form-input" placeholder="e.g. Ananya Sen" required />
          </div>

          ${!isCand ? `
            <div class="form-group">
              <label class="form-label" for="regCompany">Company Name *</label>
              <input type="text" id="regCompany" class="form-input" placeholder="e.g. Infosys, TCS, Razorpay" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="regJobTitle">Your Job Title *</label>
              <input type="text" id="regJobTitle" class="form-input" placeholder="e.g. HR Manager / Lead Recruiter" required />
            </div>
          ` : `
            <div class="form-group">
              <label class="form-label" for="regTitle">Current Role / Degree *</label>
              <input type="text" id="regTitle" class="form-input" placeholder="e.g. Java Developer / B.Tech CSE" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="regSkills">Key Skills (Comma separated) *</label>
              <input type="text" id="regSkills" class="form-input" placeholder="e.g. Java, Spring Boot, React, SQL" required />
            </div>
          `}

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="regLocation">Location *</label>
              <select id="regLocation" class="form-input" required>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="regPhone">Phone Number</label>
              <input type="tel" id="regPhone" class="form-input" placeholder="+91 98765 43210" />
            </div>
          </div>
        ` : ''}

        <div class="form-group">
          <label class="form-label" for="authEmail">Email Address *</label>
          <input 
            type="email" 
            id="authEmail" 
            class="form-input" 
            placeholder="${isCand ? 'rahul.sharma@example.com' : 'priya.hr@techcorp.in'}" 
            required 
          />
        </div>

        <div class="form-group">
          <div class="flex-between">
            <label class="form-label" for="authPassword">Password *</label>
            ${isLogin ? '<span class="text-xs text-primary">Default password: 12345</span>' : ''}
          </div>
          <input 
            type="password" 
            id="authPassword" 
            class="form-input" 
            placeholder="Enter password" 
            value="${isLogin ? '12345' : ''}" 
            required 
          />
        </div>

        <div id="authErrorMessage" class="auth-error-msg" style="display:none;"></div>

        <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 1rem;">
          ${isLogin ? `Sign In as ${isCand ? 'Candidate' : 'Recruiter'}` : `Create ${isCand ? 'Candidate' : 'Recruiter'} Account`}
        </button>
      </form>

      <div class="auth-modal-footer">
        ${isLogin ? `
          <p>Don't have an account? <a href="javascript:void(0)" onclick="AuthModal.setMode('register')" class="text-primary font-bold">Register Now</a></p>
        ` : `
          <p>Already have an account? <a href="javascript:void(0)" onclick="AuthModal.setMode('login')" class="text-primary font-bold">Sign In</a></p>
        `}
      </div>
    `;
  },

  handleSubmit(e) {
    e.preventDefault();
    const errorBox = document.getElementById('authErrorMessage');
    if (errorBox) errorBox.style.display = 'none';

    if (this.activeMode === 'login') {
      const email = document.getElementById('authEmail').value;
      const pass = document.getElementById('authPassword').value;
      const res = Auth.login(email, pass, this.activeRole);

      if (res.success) {
        this.close();
        if (window.location.pathname.includes('dashboard')) {
          window.location.reload();
        } else {
          if (typeof App !== 'undefined' && App.renderAll) App.renderAll();
        }
      } else {
        if (errorBox) {
          errorBox.textContent = res.message;
          errorBox.style.display = 'block';
        }
      }
    } else {
      // Register
      const email = document.getElementById('authEmail').value;
      const pass = document.getElementById('authPassword').value;
      const name = document.getElementById('regName').value;
      const location = document.getElementById('regLocation').value;
      const phone = document.getElementById('regPhone').value;

      if (this.activeRole === 'candidate') {
        const title = document.getElementById('regTitle').value;
        const skillsRaw = document.getElementById('regSkills').value;
        const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);

        const res = Auth.registerCandidate({
          email,
          password: pass,
          name,
          title,
          location,
          phone,
          skills
        });

        if (res.success) {
          this.close();
          if (typeof App !== 'undefined' && App.renderAll) App.renderAll();
        } else {
          if (errorBox) {
            errorBox.textContent = res.message;
            errorBox.style.display = 'block';
          }
        }
      } else {
        // Recruiter
        const company = document.getElementById('regCompany').value;
        const title = document.getElementById('regJobTitle').value;

        const res = Auth.registerRecruiter({
          email,
          password: pass,
          name,
          company,
          title,
          location,
          phone
        });

        if (res.success) {
          this.close();
          if (typeof App !== 'undefined' && App.renderAll) App.renderAll();
        } else {
          if (errorBox) {
            errorBox.textContent = res.message;
            errorBox.style.display = 'block';
          }
        }
      }
    }
  }
};

// ==========================================
// Toast Notification Utility
// ==========================================

function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else if (type === 'error') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
  } else {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  }

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, duration);
}

// Global Theme Management
const Theme = {
  init() {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this.updateToggleIcon(saved);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
    this.updateToggleIcon(next);
  },

  updateToggleIcon(theme) {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    if (theme === 'dark') {
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      `;
      btn.setAttribute('title', 'Switch to Light Mode');
    } else {
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      `;
      btn.setAttribute('title', 'Switch to Dark Mode');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Auth.updateNavbarAuth();
});
