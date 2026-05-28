// ========== STORAGE KEYS ==========
const STORAGE_KEYS = {
  PROFILE: 'cc_profile',
  BOOKINGS: 'campus_seeker_bookings',
  REVIEWS_WRITTEN: 'campus_seeker_reviews',
  THEME: 'campus_theme'
};

// ========== DEFAULT DATA ==========
let userData = {
  name: '',
  email: '',
  faculty: '',
  university: '',
  year: '',
  bio: '',
  interests: '',
  avatar: null,
  rank: 'Campus Member',
  bookingsCount: 0,
  reviewsCount: 0
};

let bookingsData = [];
let reviewsWrittenData = [];

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
  
  const dateElement = document.getElementById('currentDate');
  if (dateElement) {
    dateElement.innerHTML = now.toLocaleDateString('en-US', options).toUpperCase();
  }

  const realHours = now.getHours();
  let displayHours = realHours % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = realHours >= 12 ? 'PM' : 'AM';

  const timeElement = document.getElementById('currentTime');
  if (timeElement) {
    timeElement.innerHTML = `${displayHours}:${minutes} ${ampm}`;
  }

  let greeting = 'Good evening';
  if (realHours < 12) greeting = 'Good morning';
  else if (realHours < 18) greeting = 'Good afternoon';

  const displayName = userData.name || 'Student';
  const greetingElement = document.getElementById('greetingText');
  if (greetingElement) {
    greetingElement.innerHTML = `${greeting}, ${displayName}! 👋`;
  }
}

// ========== LOAD USER DATA ==========
async function loadUserData() {
  try {
    let profile = null;
    
    if (window.Auth && window.Auth.isLoggedIn()) {
      profile = await window.Auth.getProfile(true);
    }
    
    if (!profile) {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) profile = JSON.parse(saved);
    }
    
    if (profile) {
      userData.name = profile.name || profile.email?.split('@')[0] || 'Student';
      userData.email = profile.email || '';
      userData.faculty = profile.faculty || 'Not specified';
      userData.university = profile.university || '';
      userData.rank = profile.rank_title || 'Campus Member';
      userData.avatar = profile.avatar_url || null;
      userData.year = profile.year_of_study || '3';
      userData.bio = profile.bio || '';
      userData.interests = profile.interests || '';
      
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userData));
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
  
  const savedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  if (savedBookings) bookingsData = JSON.parse(savedBookings);
  
  const savedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS_WRITTEN);
  if (savedReviews) reviewsWrittenData = JSON.parse(savedReviews);
  
  userData.bookingsCount = bookingsData.length;
  userData.reviewsCount = reviewsWrittenData.length;
  
  updateUI();
  updateDateTime();
}

function saveUserData() {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userData));
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookingsData));
  localStorage.setItem(STORAGE_KEYS.REVIEWS_WRITTEN, JSON.stringify(reviewsWrittenData));
  updateUI();
  showToast('✅ Settings saved successfully!');
}

function updateUI() {
  // Update sidebar
  const sidebarName = document.getElementById('sidebarName');
  const sidebarRank = document.getElementById('sidebarRank');
  const profileName = document.getElementById('profileName');
  const profileBadge = document.getElementById('profileBadge');
  const profileFaculty = document.getElementById('profileFaculty');
  
  if (sidebarName) sidebarName.innerHTML = userData.name;
  if (sidebarRank) sidebarRank.innerHTML = userData.rank;
  if (profileName) profileName.innerHTML = userData.name;
  if (profileBadge) profileBadge.innerHTML = userData.rank;
  if (profileFaculty) profileFaculty.innerHTML = `${userData.faculty} · ${userData.university}`;
  
  // Update settings form
  const settingsName = document.getElementById('settingsName');
  const settingsEmail = document.getElementById('settingsEmail');
  const settingsFaculty = document.getElementById('settingsFaculty');
  const settingsUniversity = document.getElementById('settingsUniversity');
  const settingsYear = document.getElementById('settingsYear');
  const settingsBio = document.getElementById('settingsBio');
  const settingsInterests = document.getElementById('settingsInterests');
  
  if (settingsName) settingsName.value = userData.name;
  if (settingsEmail) settingsEmail.value = userData.email;
  if (settingsFaculty) settingsFaculty.value = userData.faculty;
  if (settingsUniversity) settingsUniversity.value = userData.university;
  if (settingsYear) settingsYear.value = userData.year;
  if (settingsBio) settingsBio.value = userData.bio;
  if (settingsInterests) settingsInterests.value = userData.interests;
  
  // Update avatar
  updateAvatar();
  updateBookingsDisplay();
  updateReviewsDisplay();
}

function updateAvatar() {
  const avatarImg = document.getElementById('avatarImg');
  const avatarText = document.getElementById('avatarText');
  const sidebarAvatar = document.getElementById('sidebarAvatar');
  const profileAvatar = document.getElementById('profileAvatar');
  
  if (userData.avatar) {
    if (avatarImg) {
      avatarImg.src = userData.avatar;
      avatarImg.style.display = 'block';
    }
    if (avatarText) avatarText.style.display = 'none';
    if (sidebarAvatar) sidebarAvatar.innerHTML = '<img src="' + userData.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:12px">';
    if (profileAvatar) profileAvatar.innerHTML = '<img src="' + userData.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:24px">';
  } else {
    if (avatarImg) avatarImg.style.display = 'none';
    if (avatarText) avatarText.style.display = 'flex';
    if (sidebarAvatar) sidebarAvatar.innerHTML = userData.name?.charAt(0) || 'S';
    if (profileAvatar) profileAvatar.innerHTML = userData.name?.charAt(0) || 'S';
  }
}

function updateBookingsDisplay() {
  const overviewContainer = document.getElementById('bookingsListContainer');
  const fullBookingsContainer = document.getElementById('bookingsFullContainer');
  
  const emptyBookingsHTML = `
    <div class="empty-state">
      <i class="fas fa-calendar-alt"></i>
      <p>No bookings yet. Start exploring services!</p>
      <button class="browse-btn" onclick="switchToPanel('browse')">Browse services →</button>
    </div>`;
  
  if (overviewContainer) {
    if (bookingsData.length === 0) {
      overviewContainer.innerHTML = emptyBookingsHTML;
    } else {
      overviewContainer.innerHTML = bookingsData.slice(0, 3).map(booking => `
        <div class="booking-item">
          <div class="booking-info">
            <h4>${escapeHtml(booking.service)}</h4>
            <div class="booking-meta">
              <span><i class="fas fa-user"></i> ${escapeHtml(booking.provider)}</span>
              <span><i class="fas fa-calendar"></i> ${booking.date}</span>
            </div>
          </div>
          <span class="booking-status status-${booking.status}">${booking.status}</span>
        </div>
      `).join('');
    }
  }
  
  if (fullBookingsContainer) {
    if (bookingsData.length === 0) {
      fullBookingsContainer.innerHTML = emptyBookingsHTML;
    } else {
      fullBookingsContainer.innerHTML = bookingsData.map(booking => `
        <div class="booking-item">
          <div class="booking-info">
            <h4>${escapeHtml(booking.service)}</h4>
            <div class="booking-meta">
              <span><i class="fas fa-user"></i> ${escapeHtml(booking.provider)}</span>
              <span><i class="fas fa-calendar"></i> ${booking.date}</span>
            </div>
          </div>
          <span class="booking-status status-${booking.status}">${booking.status}</span>
        </div>
      `).join('');
    }
  }
}

function updateReviewsDisplay() {
  const reviewsContainer = document.getElementById('reviewsListContainer');
  const fullReviewsContainer = document.getElementById('reviewsFullContainer');
  
  const emptyReviewsHTML = `
    <div class="empty-state">
      <i class="fas fa-pen"></i>
      <p>No reviews yet. After booking a service, leave a review!</p>
    </div>`;
  
  if (reviewsContainer) {
    if (reviewsWrittenData.length === 0) {
      reviewsContainer.innerHTML = emptyReviewsHTML;
    } else {
      reviewsContainer.innerHTML = reviewsWrittenData.slice(0, 3).map(review => `
        <div class="booking-item">
          <div class="booking-info">
            <h4>${escapeHtml(review.service)}</h4>
            <div class="booking-meta">
              <span><i class="fas fa-star" style="color: #f59e0b;"></i> ${review.rating}/5</span>
            </div>
            <p style="font-size: 12px; margin-top: 8px;">"${escapeHtml(review.comment).substring(0, 100)}${review.comment.length > 100 ? '...' : ''}"</p>
          </div>
        </div>
      `).join('');
    }
  }
  
  if (fullReviewsContainer) {
    if (reviewsWrittenData.length === 0) {
      fullReviewsContainer.innerHTML = emptyReviewsHTML;
    } else {
      fullReviewsContainer.innerHTML = reviewsWrittenData.map(review => `
        <div class="booking-item">
          <div class="booking-info">
            <h4>${escapeHtml(review.service)}</h4>
            <div class="booking-meta">
              <span><i class="fas fa-star" style="color: #f59e0b;"></i> ${review.rating}/5</span>
              <span><i class="fas fa-user"></i> ${escapeHtml(review.provider)}</span>
              <span><i class="fas fa-calendar"></i> ${review.date}</span>
            </div>
            <p style="font-size: 13px; margin-top: 8px;">"${escapeHtml(review.comment)}"</p>
          </div>
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
    case 'bookings':
      data = bookingsData;
      filename = 'my_bookings';
      break;
    case 'reviewsWritten':
      data = reviewsWrittenData;
      filename = 'my_reviews';
      break;
    default:
      data = [];
      filename = 'export';
  }
  
  if (data.length === 0) {
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
    userData.university = document.getElementById('settingsUniversity')?.value || userData.university;
    userData.year = document.getElementById('settingsYear')?.value || userData.year;
    userData.bio = document.getElementById('settingsBio')?.value || userData.bio;
    userData.interests = document.getElementById('settingsInterests')?.value || userData.interests;
    
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
      if (document.getElementById('currentPassword')) document.getElementById('currentPassword').value = '';
      if (document.getElementById('newPassword')) document.getElementById('newPassword').value = '';
      if (document.getElementById('confirmPassword')) document.getElementById('confirmPassword').value = '';
    }
    
    saveUserData();
  });
}

// ========== THEME TOGGLE ==========
function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    if (themeLabel) themeLabel.innerHTML = 'Dark mode';
    localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
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
  
  // Initialize panels when switched to
  if (panelId === 'browse') {
    setTimeout(() => initBrowse(), 100);
  }
  if (panelId === 'inbox') {
    setTimeout(() => initInbox(), 100);
  }
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const page = item.getAttribute('data-page');
    if (page === 'logout') {
      localStorage.removeItem('cc_session');
      localStorage.removeItem('cc_user');
      localStorage.removeItem('cc_profile');
      showToast('🚪 Logging out...');
      setTimeout(() => {
        window.location.href = '/pages/login.html';
      }, 1000);
    } else {
      switchToPanel(page);
    }
  });
});

window.switchToPanel = switchToPanel;
window.exportData = exportData;
window.showToast = showToast;

// ========== MOBILE MENU ==========
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open');
  });
}

// ========== BROWSE FUNCTIONALITY ==========
const BROWSE_CATEGORIES = [
  { label: 'Tutoring', icon: '📚' },
  { label: 'Creative Arts', icon: '🎨' },
  { label: 'Tech Support', icon: '💻' },
  { label: 'Food & Baking', icon: '🍞' },
  { label: 'Photography', icon: '📸' },
  { label: 'Hair & Beauty', icon: '💄' },
  { label: 'Music', icon: '🎵' },
  { label: 'Fitness', icon: '🏋️' },
  { label: 'Writing', icon: '✍️' },
  { label: 'Other', icon: '✨' }
];

let browseInitialized = false;

async function initBrowse() {
  if (browseInitialized) return;
  browseInitialized = true;
  
  const grid = document.getElementById('listingsGrid');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const categoryPills = document.getElementById('categoryPills');
  
  if (!grid) return;
  
  let activeCategory = '';
  let debounceTimer;
  
  if (categoryPills) {
    categoryPills.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.className = 'b-cat-pill active';
    allBtn.dataset.cat = '';
    allBtn.textContent = 'All Categories';
    allBtn.style.cssText = 'padding: 6px 14px; border-radius: 20px; border: 1px solid #e2e8f0; background: #f97316; color: white; cursor: pointer;';
    categoryPills.appendChild(allBtn);
    
    BROWSE_CATEGORIES.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = 'b-cat-pill';
      btn.dataset.cat = c.label;
      btn.textContent = c.label;
      btn.style.cssText = 'padding: 6px 14px; border-radius: 20px; border: 1px solid #e2e8f0; background: white; cursor: pointer;';
      categoryPills.appendChild(btn);
    });
    
    categoryPills.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      activeCategory = btn.dataset.cat;
      categoryPills.querySelectorAll('[data-cat]').forEach((p) => {
        if (p.dataset.cat === activeCategory) {
          p.style.background = '#f97316';
          p.style.color = 'white';
        } else {
          p.style.background = 'white';
          p.style.color = '#4b5563';
        }
      });
      load();
    });
  }
  
  const resultsCount = document.getElementById('resultsCount');
  
  const load = async () => {
    if (grid) grid.innerHTML = '<div class="loading-wrap" style="text-align: center; padding: 40px;"><div class="spinner"></div></div>';
    if (resultsCount) resultsCount.innerHTML = '&nbsp;';
    
    const params = new URLSearchParams();
    const q = searchInput ? searchInput.value.trim() : '';
    if (q) params.set('q', q);
    if (activeCategory) params.set('category', activeCategory);
    const sort = sortSelect ? sortSelect.value : 'newest';
    if (sort === 'price_asc') params.set('sort', 'lowest-price');
    else if (sort === 'price_desc') params.set('sort', 'price_asc');
    else if (sort === 'rating') params.set('sort', 'top-rated');
    
    try {
      const response = await fetch(`/api/listings?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const listings = data.listings || [];
      
      if (listings.length) {
        if (grid) {
          grid.innerHTML = listings.map(listing => `
            <div class="listing-card" onclick="window.location='/pages/listing.html?id=${listing.id}'" style="background: white; border-radius: 16px; overflow: hidden; cursor: pointer; border: 1px solid #e2e8f0;">
              <div class="listing-img-wrap" style="height: 180px; background: linear-gradient(135deg, #e6fff4, #d1fae5); overflow: hidden;">
                ${listing.images && listing.images[0] 
                  ? `<img src="${listing.images[0]}" alt="${escapeHtml(listing.title)}" style="width: 100%; height: 100%; object-fit: cover;">`
                  : `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 48px;">📦</div>`
                }
              </div>
              <div class="listing-body" style="padding: 16px;">
                <h3 style="font-weight: 700; margin-bottom: 8px;">${escapeHtml(listing.title)}</h3>
                <p style="color: #6b7280; font-size: 13px; margin-bottom: 12px;">${escapeHtml(listing.description ? listing.description.substring(0, 80) : '')}${listing.description && listing.description.length > 80 ? '...' : ''}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 12px;">
                  <span style="font-size: 12px; color: #6b7280;">👤 ${escapeHtml(listing.seller?.name || 'Student')}</span>
                  <span style="font-weight: 800; color: #f97316;">R${listing.price || 0}</span>
                </div>
              </div>
            </div>
          `).join('');
        }
        if (resultsCount) resultsCount.innerHTML = `<strong>${listings.length}</strong> service${listings.length !== 1 ? 's' : ''} found`;
      } else {
        if (grid) {
          grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px;"><div style="font-size: 48px;">🔍</div><h3>No services found</h3></div>`;
        }
        if (resultsCount) resultsCount.innerHTML = '0 services found';
      }
    } catch (err) {
      console.error('Error loading listings:', err);
      if (grid) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px;"><div style="font-size: 48px;">⚠️</div><h3>Error loading services</h3><p>${err.message}</p></div>`;
      }
    }
  };
  
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(load, 400);
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', load);
  }
  
  await load();
}
// ========== INBOX FUNCTIONALITY ==========
let currentConversationId = null;
let messageSubscription = null;
let allConversations = [];

async function initInbox() {
  const conversationsList = document.getElementById('conversationsListContainer');
  if (!conversationsList) return;
  
  await loadConversations();
}

async function loadConversations() {
  const container = document.getElementById('conversationsListContainer');
  if (!container) return;
  
  try {
    const token = window.Auth?.accessToken;
    if (!token) {
      container.innerHTML = '<div class="empty-state" style="padding: 40px; text-align: center;"><p>Please log in to see messages</p></div>';
      return;
    }
    
    const response = await fetch('/api/chat/conversations', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to load conversations');
    
    const data = await response.json();
    allConversations = data.conversations || [];
    
    if (allConversations.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 40px; text-align: center;">
          <i class="fas fa-comments" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i>
          <p>No conversations yet</p>
          <p style="font-size: 12px;">Message a seller to start chatting</p>
        </div>`;
      return;
    }
    
    container.innerHTML = allConversations.map(conv => `
      <div class="conversation-item" data-conv-id="${conv.id}">
        <div class="conversation-avatar">
          ${conv.other_user?.name ? conv.other_user.name.charAt(0).toUpperCase() : '?'}
        </div>
        <div class="conversation-info">
          <div class="conversation-name">${escapeHtml(conv.other_user?.name || 'User')}</div>
          <div class="conversation-preview">${escapeHtml(conv.last_message || 'No messages yet')}</div>
        </div>
        <div class="conversation-time">${formatTime(conv.created_at)}</div>
      </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.conversation-item').forEach(item => {
      item.addEventListener('click', () => {
        const convId = item.dataset.convId;
        openConversation(convId);
      });
    });
    
  } catch (error) {
    console.error('Error loading conversations:', error);
    container.innerHTML = '<div class="empty-state" style="padding: 40px; text-align: center;"><p>Error loading conversations</p></div>';
  }
}

async function openConversation(conversationId) {
  currentConversationId = conversationId;
  
  // Update active state
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.convId === conversationId) {
      item.classList.add('active');
    }
  });
  
  const conversation = allConversations.find(c => c.id === conversationId);
  const otherUser = conversation?.other_user;
  
  const chatThread = document.getElementById('chatThread');
  if (!chatThread) return;
  
  chatThread.innerHTML = `
    <div class="chat-thread-header">
      <button class="back-btn" onclick="closeChatThread()">← Back</button>
      <div class="conversation-avatar" style="width: 40px; height: 40px; font-size: 16px;">
        ${otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : '?'}
      </div>
      <div>
        <div class="conversation-name" style="margin-bottom: 0;">${escapeHtml(otherUser?.name || 'User')}</div>
        <div style="font-size: 11px; color: #6b7280;">Seller</div>
      </div>
    </div>
    <div id="chatMessages" class="chat-messages-container" style="flex: 1; overflow-y: auto; padding: 20px;">
      <div class="loading-wrap"><div class="spinner"></div></div>
    </div>
    <div class="chat-input-area">
      <input type="text" id="messageInput" placeholder="Type a message..." onkeypress="if(event.key==='Enter') sendMessage()">
      <button onclick="sendMessage()">Send</button>
    </div>
  `;
  
  await loadMessages(conversationId);
  subscribeToMessages(conversationId);
}

async function loadMessages(conversationId) {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return;
  
  try {
    const token = window.Auth?.accessToken;
    const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to load messages');
    
    const data = await response.json();
    const messages = data.messages || [];
    const currentUser = JSON.parse(localStorage.getItem('cc_user') || '{}');
    
    if (messages.length === 0) {
      messagesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <i class="fas fa-comment-dots" style="font-size: 32px; opacity: 0.5;"></i>
          <p style="margin-top: 12px;">No messages yet</p>
          <p style="font-size: 12px;">Send a message to start the conversation</p>
        </div>`;
      return;
    }
    
    messagesContainer.innerHTML = messages.map(msg => `
      <div class="message-item ${msg.sender_id === currentUser?.id ? 'sent' : 'received'}">
        <div class="message-bubble">
          ${escapeHtml(msg.content)}
          <div class="message-time">${formatTime(msg.created_at)}</div>
        </div>
      </div>
    `).join('');
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
  } catch (error) {
    console.error('Error loading messages:', error);
    messagesContainer.innerHTML = '<div style="text-align: center; padding: 40px;"><p>Error loading messages</p></div>';
  }
}

async function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input?.value.trim();
  
  if (!message || !currentConversationId) return;
  
  input.value = '';
  input.disabled = true;
  
  try {
    const token = window.Auth?.accessToken;
    const response = await fetch(`/api/chat/conversations/${currentConversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: message })
    });
    
    if (!response.ok) throw new Error('Failed to send message');
    
    await loadMessages(currentConversationId);
    
  } catch (error) {
    console.error('Error sending message:', error);
    showToast('Failed to send message', true);
  } finally {
    input.disabled = false;
    input.focus();
  }
}

function subscribeToMessages(conversationId) {
  // Unsubscribe from previous channel
  if (messageSubscription) {
    window.sbClient?.removeChannel(messageSubscription);
  }
  
  if (!window.sbClient) return;
  
  messageSubscription = window.sbClient
    .channel(`conv-${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    }, (payload) => {
      // New message received, reload messages
      loadMessages(conversationId);
      // Also update conversation list
      loadConversations();
    })
    .subscribe();
}

function closeChatThread() {
  // Unsubscribe from messages
  if (messageSubscription) {
    window.sbClient?.removeChannel(messageSubscription);
    messageSubscription = null;
  }
  
  currentConversationId = null;
  
  const chatThread = document.getElementById('chatThread');
  if (chatThread) {
    chatThread.innerHTML = `
      <div class="chat-empty-state" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
        <div style="width: 64px; height: 64px; background: #fef3c7; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <i class="fas fa-envelope" style="font-size: 28px; color: #f97316;"></i>
        </div>
        <h3 style="font-weight: 700;">Your messages</h3>
        <p style="color: #6b7280; text-align: center; max-width: 280px;">Select a conversation to start chatting with a seller</p>
      </div>
    `;
  }
}

function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

// Make functions available globally
window.sendMessage = sendMessage;
window.closeChatThread = closeChatThread;

// ========== INITIALIZE ==========
setInterval(updateDateTime, 1000);

(async function() {
  await loadUserData();
  
  if (document.getElementById('browse-panel')?.classList.contains('active')) {
    setTimeout(() => initBrowse(), 100);
  }
})();