  // ========== STORAGE KEYS ==========
  const STORAGE_KEYS = {
    SERVICES: 'campus_services',
    BOOKINGS: 'campus_seeker_bookings',
    THEME: 'campus_theme'
  };

  // ========== DEFAULT SERVICES DATA (will be saved to localStorage) ==========
  const defaultServices = [
    {
      id: 1,
      title: "Logo & Brand Identity Design",
      description: "I create modern, professional logos and full brand identity packages that help your business stand out.",
      category: "Creative Arts",
      price: 450,
      seller: "Qwabe Mbona",
      sellerId: "user_qm",
      rating: 5.0,
      reviews: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Social Media Content Creation",
      description: "Struggling with content? I design branded posts, Reels covers, and engaging social media graphics.",
      category: "Creative Arts",
      price: 600,
      seller: "Qwabe Mbona",
      sellerId: "user_qm",
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "CV & Cover Letter Writing",
      description: "ATS-optimised CVs and compelling cover letters tailored to your target industry and job roles.",
      category: "Writing",
      price: 280,
      seller: "Qwabe Mbona",
      sellerId: "user_qm",
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      title: "Python & Data Analysis Help",
      description: "Need help with Python assignments, data science projects, or coding interviews? I've got you covered.",
      category: "Tech Support",
      price: 300,
      seller: "Tumi Nkosi",
      sellerId: "user_tn",
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      title: "Math Tutoring (High School & Uni)",
      description: "Experienced tutor for Algebra, Calculus, Statistics. Online or in-person sessions available.",
      category: "Tutoring",
      price: 350,
      seller: "Thabo Mokoena",
      sellerId: "user_tm",
      rating: 4.8,
      reviews: 12,
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      title: "Professional Headshot Photography",
      description: "High-quality portrait photography for LinkedIn, portfolios, and personal branding.",
      category: "Photography",
      price: 500,
      seller: "Zara Patel",
      sellerId: "user_zp",
      rating: 4.9,
      reviews: 8,
      createdAt: new Date().toISOString()
    }
  ];

  // ========== LOAD SERVICES FROM LOCALSTORAGE ==========
  let services = [];

  function loadServices() {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (saved) {
      services = JSON.parse(saved);
    } else {
      services = [...defaultServices];
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    }
  }

  function saveServices() {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }

  // Add a new service (for testing)
  function addService(service) {
    service.id = Date.now();
    service.createdAt = new Date().toISOString();
    services.push(service);
    saveServices();
    renderServices();
    showToast('✨ New service listed successfully!');
  }

  // ========== BOOKING FUNCTION ==========
  function bookService(serviceId, serviceTitle, sellerName, price) {
    let bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || [];
    
    const newBooking = {
      id: Date.now(),
      serviceId: serviceId,
      service: serviceTitle,
      provider: sellerName,
      price: price,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'pending',
      bookedAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    showToast(`✅ Booking request sent to ${sellerName}! Check your dashboard.`);
  }

  // ========== FILTER AND SORT ==========
  let currentCategory = 'all';
  let currentSearch = '';
  let currentSort = 'latest';

  function filterAndSortServices() {
    let filtered = [...services];

    // Filter by category
    if (currentCategory !== 'all') {
      filtered = filtered.filter(service => service.category === currentCategory);
    }

    // Filter by search
    if (currentSearch) {
      const searchLower = currentSearch.toLowerCase();
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.seller.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    switch (currentSort) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }

  // ========== RENDER SERVICES ==========
  function renderServices() {
    const filtered = filterAndSortServices();
    const grid = document.getElementById('servicesGrid');
    const countSpan = document.getElementById('serviceCount');
    
    countSpan.textContent = filtered.length;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>No services found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(service => `
      <div class="service-card" data-id="${service.id}">
        <div class="card-image">
          <i class="fas fa-${getCategoryIcon(service.category)}"></i>
          <span class="category-badge">${service.category}</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">${escapeHtml(service.title)}</h3>
          <p class="card-desc">${escapeHtml(service.description.substring(0, 100))}${service.description.length > 100 ? '...' : ''}</p>
          <div class="seller-info">
            <div class="seller-avatar">${getInitials(service.seller)}</div>
            <div class="seller-details">
              <div class="seller-name">${escapeHtml(service.seller)}</div>
              <div class="seller-rating">
                <i class="fas fa-star"></i>
                <span>${service.rating.toFixed(1)} (${service.reviews})</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="price">R${service.price}</div>
            <button class="book-btn" data-id="${service.id}" data-title="${escapeHtml(service.title)}" data-seller="${escapeHtml(service.seller)}" data-price="${service.price}">Book now</button>
          </div>
        </div>
      </div>
    `).join('');

    // Add event listeners to book buttons
    document.querySelectorAll('.book-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const title = btn.dataset.title;
        const seller = btn.dataset.seller;
        const price = parseInt(btn.dataset.price);
        bookService(id, title, seller, price);
      });
    });

    // Add click to card for details view
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('book-btn')) {
          const id = card.dataset.id;
          showToast(`Viewing service details - Coming soon!`);
        }
      });
    });
  }

  function getCategoryIcon(category) {
    const icons = {
      'Tutoring': 'book',
      'Creative Arts': 'palette',
      'Tech Support': 'laptop-code',
      'Food & Baking': 'cake',
      'Photography': 'camera',
      'Hair & Beauty': 'cut',
      'Music': 'music',
      'Fitness': 'dumbbell',
      'Writing': 'pen-fancy',
      'Other': 'ellipsis-h'
    };
    return icons[category] || 'tag';
  }

  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ========== THEME TOGGLE ==========
  function setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
      const themeBtn = document.getElementById('themeToggleBtn');
      if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
      const themeBtn = document.getElementById('themeToggleBtn');
      if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    setTheme(isDark ? 'light' : 'dark');
  });

  // ========== TOAST FUNCTION ==========
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ========== EVENT LISTENERS ==========
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderServices();
  });

  document.getElementById('sortSelect')?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderServices();
  });

  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.cat;
      renderServices();
    });
  });

  // Mobile menu
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Sidebar navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page === 'browse') {
        showToast('You are already on Browse page');
      } else if (page === 'list-service') {
        showToast('✨ List a service - Coming soon!');
      } else if (page === 'dashboard') {
        window.location.href = 'dashboard-seeker.html';
      } else {
        showToast(`${page} - Coming soon!`);
      }
    });
  });

  // List service button
  document.getElementById('listServiceBtn')?.addEventListener('click', () => {
    showToast('✨ List a service - Coming soon!');
  });

  // ========== INITIALIZE ==========
  loadServices();
  loadTheme();
  renderServices();