document.addEventListener('DOMContentLoaded', async () => {
  await Auth.requireAuth();
});
const STORAGE_KEYS = {
    PROFILE: 'campus_profile',
    LISTINGS: 'campus_listings',
    ORDERS: 'campus_orders',
    BOOKINGS_MADE: 'campus_bookings_made',
    REVIEWS: 'campus_reviews',
    THEME: 'campus_theme'
  };

 async function loadProfile() {
  const profile = await Auth.getProfile();

  if (!profile) return;

  userData.name = profile.name || '';
  userData.email = profile.email || '';
  userData.faculty = profile.faculty || '';
  
  updateUI();
}

loadProfile();

  // ========== TOAST FUNCTION ==========
  function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
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
    document.getElementById('currentDate').innerHTML = now.toLocaleDateString('en-US', options).toUpperCase();
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    document.getElementById('currentTime').innerHTML = `${hours}:${minutes} ${ampm}`;
    
    const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';
    document.getElementById('greetingText').innerHTML = `${greeting}, ${userData.name}! 👋`;
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();

  // ========== LOAD/SAVE DATA ==========
  function loadUserData() {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      const parsed = JSON.parse(saved);
      userData = { ...userData, ...parsed };
    }
    
    const savedListings = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    if (savedListings) listingsData = JSON.parse(savedListings);
    
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
    document.getElementById('sidebarName').innerHTML = userData.name;
    document.getElementById('profileName').innerHTML = userData.name;
    document.getElementById('profileFaculty').innerHTML = userData.faculty;
    
    // Update stats
    document.getElementById('statListings').innerHTML = listingsData.length;
    document.getElementById('statRating').innerHTML = userData.rating || '—';
    document.getElementById('statXP').innerHTML = userData.xp;
    document.getElementById('cardListings').innerHTML = listingsData.length;
    document.getElementById('cardOrders').innerHTML = userData.orders;
    document.getElementById('cardBookings').innerHTML = userData.bookingsMade;
    
    // Update avatar
    if (userData.avatar) {
      document.getElementById('avatarImg').src = userData.avatar;
      document.getElementById('avatarImg').style.display = 'block';
      document.getElementById('avatarText').style.display = 'none';
      document.getElementById('sidebarAvatar').innerHTML = '<img src="' + userData.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:12px">';
      document.getElementById('profileAvatar').innerHTML = '<img src="' + userData.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:24px">';
    } else {
      document.getElementById('avatarImg').style.display = 'none';
      document.getElementById('avatarText').style.display = 'flex';
      document.getElementById('sidebarAvatar').innerHTML = userData.name.charAt(0);
      document.getElementById('profileAvatar').innerHTML = userData.name.charAt(0);
    }
    
    // Update listings display
    const listingsContainer = document.getElementById('listingsContainer');
    if (listingsContainer && listingsData.length > 0) {
      listingsContainer.innerHTML = listingsData.map(listing => `
        <div class="info-card">
          <h4>📖 ${listing.title}</h4>
          <div class="number">${listing.price}</div>
          <div class="sub">${listing.category} • ${listing.status}</div>
        </div>
      `).join('');
    } else if (listingsContainer) {
      listingsContainer.innerHTML = '<div class="message-empty"><p>No listings yet. Create your first listing!</p></div>';
    }
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
  document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
    document.getElementById('avatarInput').click();
  });
  
  document.getElementById('avatarInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        userData.avatar = ev.target.result;
        updateUI();
        saveUserData();
      };
      reader.readAsDataURL(file);
    }
  });

  // ========== SETTINGS FORM ==========
  document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    userData.name = document.getElementById('settingsName').value;
    userData.email = document.getElementById('settingsEmail').value;
    userData.faculty = document.getElementById('settingsFaculty').value;
    userData.bio = document.getElementById('settingsBio').value;
    userData.skills = document.getElementById('settingsSkills').value;
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const currentPassword = document.getElementById('currentPassword').value;
    
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
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    }
    
    saveUserData();
  });

  // ========== THEME TOGGLE ==========
  function setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
      document.getElementById('themeLabel').innerHTML = 'Dark mode';
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
      document.getElementById('themeLabel').innerHTML = 'Light mode';
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }

  document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    setTheme(isDark ? 'light' : 'dark');
  });

  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) setTheme(savedTheme);
  else setTheme('light');

  // ========== PANEL NAVIGATION ==========
  function switchToPanel(panelId) {
    document.querySelectorAll('.content-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`${panelId}-panel`).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-page') === panelId) {
        item.classList.add('active');
      }
    });
    
    if (window.innerWidth <= 1000) {
      document.getElementById('sidebar').classList.remove('open');
    }
  }

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      if (page === 'logout') {
        showToast('🚪 Logging out...');
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 1000);
      } else {
        switchToPanel(page);
      }
    });
  });

  // ========== NEW LISTING BUTTON ==========
  document.getElementById('newListingBtnHeader')?.addEventListener('click', () => {
    showToast('➕ Create new listing - Feature coming soon!');
  });

  // ========== MOBILE MENU ==========
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // ========== INITIALIZE ==========
  loadUserData();