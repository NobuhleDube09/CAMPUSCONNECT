// ========== STORAGE KEYS ==========
  const STORAGE_KEYS = {
    PROFILE: 'campus_profile',
    LISTINGS: 'campus_listings',
    ORDERS: 'campus_orders',
    BOOKINGS_MADE: 'campus_bookings_made',
    REVIEWS: 'campus_reviews',
    THEME: 'campus_theme'
  };

  // ========== DEFAULT EMPTY DATA (No hardcoded user data) ==========
  let userData = {
    name: '',
    email: '',
    faculty: '',
    year: '3',
    bio: '',
    skills: '',
    avatar: null,
    listings: 0,
    rating: null,
    xp: 0,
    orders: 0,
    bookingsMade: 0,
    reviews: 0
  };

  let listingsData = [];

  // ========== TOAST FUNCTION ==========
  function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.background = isError ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #f97316, #f43f5e)';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ========== DATE & TIME ==========
  function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateEl = document.getElementById('currentDate');
    if (dateEl) dateEl.innerHTML = now.toLocaleDateString('en-US', options).toUpperCase();
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeEl = document.getElementById('currentTime');
    if (timeEl) timeEl.innerHTML = `${hours}:${minutes} ${ampm}`;
    
    const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';
    const nameToShow = userData.name || 'Seller';
    const greetingEl = document.getElementById('greetingText');
    if (greetingEl) greetingEl.innerHTML = `${greeting}, ${nameToShow}! 👋`;
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();

  // ========== LOAD DATA FROM LOCALSTORAGE ==========
  function loadUserData() {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      const parsed = JSON.parse(saved);
      userData = { ...userData, ...parsed };
    }
    
    const savedListings = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    if (savedListings) listingsData = JSON.parse(savedListings);
    
    // If still empty, try to get from session
    if (!userData.name) {
      const sessionUser = localStorage.getItem('cc_user');
      if (sessionUser) {
        try {
          const parsed = JSON.parse(sessionUser);
          userData.name = parsed.email?.split('@')[0] || 'User';
          userData.email = parsed.email || '';
        } catch(e) {}
      }
    }
    
    updateUI();
  }

  function saveUserData() {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listingsData));
    updateUI();
    showToast('✅ Settings saved successfully!');
  }

  function updateUI() {
    // Update sidebar
    const sidebarName = document.getElementById('sidebarName');
    const profileName = document.getElementById('profileName');
    const profileFaculty = document.getElementById('profileFaculty');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const profileAvatar = document.getElementById('profileAvatar');
    const avatarText = document.getElementById('avatarText');
    
    const displayName = userData.name || 'Seller';
    const initial = displayName.charAt(0).toUpperCase();
    
    if (sidebarName) sidebarName.innerHTML = displayName;
    if (profileName) profileName.innerHTML = displayName;
    if (profileFaculty) profileFaculty.innerHTML = userData.faculty || 'Not specified';
    if (sidebarAvatar) sidebarAvatar.innerHTML = initial;
    if (profileAvatar) profileAvatar.innerHTML = initial;
    
    // Update stats
    const statListings = document.getElementById('statListings');
    const statRating = document.getElementById('statRating');
    const statXP = document.getElementById('statXP');
    const cardListings = document.getElementById('cardListings');
    const cardOrders = document.getElementById('cardOrders');
    const cardBookings = document.getElementById('cardBookings');
    
    if (statListings) statListings.innerHTML = listingsData.length;
    if (statRating) statRating.innerHTML = userData.rating || '—';
    if (statXP) statXP.innerHTML = userData.xp || 0;
    if (cardListings) cardListings.innerHTML = listingsData.length;
    if (cardOrders) cardOrders.innerHTML = userData.orders || 0;
    if (cardBookings) cardBookings.innerHTML = userData.bookingsMade || 0;
    
    // Update settings form
    const settingsName = document.getElementById('settingsName');
    const settingsEmail = document.getElementById('settingsEmail');
    const settingsFaculty = document.getElementById('settingsFaculty');
    const settingsYear = document.getElementById('settingsYear');
    const settingsBio = document.getElementById('settingsBio');
    const settingsSkills = document.getElementById('settingsSkills');
    
    if (settingsName) settingsName.value = userData.name || '';
    if (settingsEmail) settingsEmail.value = userData.email || '';
    if (settingsFaculty) settingsFaculty.value = userData.faculty || '';
    if (settingsYear) settingsYear.value = userData.year || '3';
    if (settingsBio) settingsBio.value = userData.bio || '';
    if (settingsSkills) settingsSkills.value = userData.skills || '';
    
    // Update avatar
    if (userData.avatar) {
      const avatarImg = document.getElementById('avatarImg');
      if (avatarImg) {
        avatarImg.src = userData.avatar;
        avatarImg.style.display = 'block';
      }
      if (avatarText) avatarText.style.display = 'none';
      if (sidebarAvatar) sidebarAvatar.innerHTML = '<img src="' + userData.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:12px">';
      if (profileAvatar) profileAvatar.innerHTML = '<img src="' + userData.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:24px">';
    } else {
      const avatarImg = document.getElementById('avatarImg');
      if (avatarImg) avatarImg.style.display = 'none';
      if (avatarText) avatarText.style.display = 'flex';
      if (avatarText) avatarText.innerHTML = initial;
    }
    
    // Update listings display
    const listingsContainer = document.getElementById('listingsContainer');
    if (listingsContainer) {
      if (listingsData.length === 0) {
        listingsContainer.innerHTML = '<div class="message-empty"><p>No listings yet. Create your first listing!</p></div>';
      } else {
        listingsContainer.innerHTML = listingsData.map(listing => `
          <div class="info-card">
            <h4>📖 ${escapeHtml(listing.title)}</h4>
            <div class="number">${listing.price}</div>
            <div class="sub">${escapeHtml(listing.category)} • ${listing.status || 'Active'}</div>
          </div>
        `).join('');
      }
    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ========== EXPORT FUNCTIONS ==========
  function exportData(type, format) {
    let data = [];
    let filename = '';
    
    switch(type) {
      case 'listings':
        data = listingsData;
        filename = 'my_listings';
        break;
      case 'orders':
        data = [{ message: 'No orders yet' }];
        filename = 'my_orders';
        break;
      case 'bookingsMade':
        data = [{ message: 'No bookings made yet' }];
        filename = 'my_bookings';
        break;
      case 'reviews':
        data = [{ message: 'No reviews yet' }];
        filename = 'my_reviews';
        break;
      default:
        return;
    }
    
    if (data.length === 0 || (data[0] && data[0].message)) {
      showToast('No data to export', true);
      return;
    }
    
    if (format === 'csv') {
      const headers = Object.keys(data[0] || {});
      const csvRows = [headers.join(',')];
      for (const row of data) {
        const values = headers.map(header => JSON.stringify(row[header] || ''));
        csvRows.push(values.join(','));
      }
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`📄 ${filename} exported as CSV!`);
    } else {
      showToast(`📑 PDF export for ${filename} - Coming soon!`);
    }
  }

  // ========== AVATAR UPLOAD ==========
  const uploadBtn = document.getElementById('uploadAvatarBtn');
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      document.getElementById('avatarInput')?.click();
    });
  }
  
  const avatarInput = document.getElementById('avatarInput');
  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          userData.avatar = ev.target.result;
          updateUI();
          saveUserData();
          showToast('Profile picture updated!');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ========== SETTINGS FORM ==========
  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      userData.name = document.getElementById('settingsName')?.value || userData.name;
      userData.email = document.getElementById('settingsEmail')?.value || userData.email;
      userData.faculty = document.getElementById('settingsFaculty')?.value || userData.faculty;
      userData.bio = document.getElementById('settingsBio')?.value || userData.bio;
      userData.skills = document.getElementById('settingsSkills')?.value || userData.skills;
      
      const newPassword = document.getElementById('newPassword')?.value;
      const confirmPassword = document.getElementById('confirmPassword')?.value;
      
      if (newPassword) {
        if (newPassword.length < 6) {
          showToast('Password must be at least 6 characters', true);
          return;
        }
        if (newPassword !== confirmPassword) {
          showToast('Passwords do not match', true);
          return;
        }
        showToast('Password updated successfully!');
        const currentPw = document.getElementById('currentPassword');
        const newPw = document.getElementById('newPassword');
        const confirmPw = document.getElementById('confirmPassword');
        if (currentPw) currentPw.value = '';
        if (newPw) newPw.value = '';
        if (confirmPw) confirmPw.value = '';
      }
      
      saveUserData();
    });
  }

  // ========== THEME TOGGLE ==========
  function setTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    
    if (theme === 'dark') {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      if (themeLabel) themeLabel.innerHTML = 'Dark mode';
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      if (themeLabel) themeLabel.innerHTML = 'Light mode';
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) setTheme(savedTheme);
  else setTheme('light');

  // ========== PANEL NAVIGATION ==========
  function switchToPanel(panelId) {
    document.querySelectorAll('.content-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    const targetPanel = document.getElementById(`${panelId}-panel`);
    if (targetPanel) targetPanel.classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-page') === panelId) {
        item.classList.add('active');
      }
    });
    
    if (window.innerWidth <= 1000) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.remove('open');
    }
  }

  // Make functions globally available
  window.switchToPanel = switchToPanel;
  window.exportData = exportData;
  window.showToast = showToast;

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      if (page === 'logout') {
        showToast('🚪 Logging out...');
        setTimeout(() => {
          localStorage.removeItem('cc_session');
          localStorage.removeItem('cc_user');
          localStorage.removeItem('cc_profile');
          window.location.href = '../index.html';
        }, 1000);
      } else {
        switchToPanel(page);
      }
    });
  });

  // ========== NEW LISTING BUTTON ==========
  const newListingBtn = document.getElementById('newListingBtnHeader');
  if (newListingBtn) {
    newListingBtn.addEventListener('click', () => {
      window.location.href = 'listing-form.html';
    });
  }

  // ========== MOBILE MENU ==========
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.toggle('open');
    });
  }

  // ========== INITIALIZE ==========
  loadUserData();
  updateDateTime();
