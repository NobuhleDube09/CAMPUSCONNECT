// CampusConnect homepage button and interaction handler
// Keeps homepage buttons working without redesigning the page.

(function () {
  const ROOT_PAGES = '/pages';
  const LOGIN_PAGE = ROOT_PAGES + '/login.html';
  const DASHBOARD_PAGE = ROOT_PAGES + '/dashboard.html';
  const GET_STARTED_BUY = ROOT_PAGES + '/get-started.html?role=buy';
  const GET_STARTED_SELL = ROOT_PAGES + '/get-started.html?role=sell';

  const selectors = {
    loginBtn: '#loginBtn',
    mobileLoginBtn: '#mobileLoginBtn',
    loginLink: '#loginLink',
    seekServiceCard: '#seekServiceCard',
    seekServiceBtn: '#seekServiceBtn',
    offerSkillsCard: '#offerSkillsCard',
    offerSkillsBtn: '#offerSkillsBtn',
    mobileMenuBtn: '#mobileMenuBtn',
    mobileMenu: '#mobileMenu'
  };

  const getElement = (selector) => document.querySelector(selector);
  const getElements = (selector) => Array.from(document.querySelectorAll(selector));
  const isLoggedIn = () => localStorage.getItem('cc_session') === 'true';

  const goTo = (url) => {
    if (!url) return;
    window.location.href = url;
  };

  const updateLoginActions = () => {
    const destination = isLoggedIn() ? DASHBOARD_PAGE : LOGIN_PAGE;
    const label = isLoggedIn() ? 'Dashboard' : 'Log in';
    const loginButtons = [selectors.loginBtn, selectors.mobileLoginBtn].map(getElement).filter(Boolean);

    loginButtons.forEach((button) => {
      button.textContent = label;
      button.onclick = () => goTo(destination);
    });

    const bottomLogin = getElement(selectors.loginLink);
    if (bottomLogin) {
      bottomLogin.textContent = isLoggedIn() ? 'Dashboard →' : 'Log in →';
      bottomLogin.onclick = (event) => {
        event.preventDefault();
        goTo(destination);
      };
    }
  };

  const addClick = (selector, callback) => {
    const el = getElement(selector);
    if (!el) return;
    el.addEventListener('click', callback);
  };

  const addCardAction = (cardSelector, buttonSelector, url, intent) => {
    const card = getElement(cardSelector);
    const button = getElement(buttonSelector);
    const action = () => {
      localStorage.setItem('cc_user_intent', intent);
      goTo(url);
    };

    if (card) {
      card.addEventListener('click', action);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          action();
        }
      });
      card.tabIndex = 0;
    }
    if (button) {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        action();
      });
    }
  };

  const setupNavigation = () => {
    getElements('.nav-links a[data-page], .mobile-menu a[data-page]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const page = link.dataset.page;
        const lookup = {
          about: 'aboutSection',
          'how-it-works': 'howItWorksSection',
          stories: 'testimonialSection'
        };
        const sectionId = lookup[page];
        if (sectionId) {
          const section = document.getElementById(sectionId);
          if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const mobileMenu = getElement(selectors.mobileMenu);
        if (mobileMenu) mobileMenu.style.display = 'none';
      });
    });
  };

  const setupMobileMenu = () => {
    const button = getElement(selectors.mobileMenuBtn);
    const mobileMenu = getElement(selectors.mobileMenu);
    if (!button || !mobileMenu) return;

    button.addEventListener('click', () => {
      mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    getElements('.mobile-menu a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
      });
    });
  };

  const animateNumber = (element, target) => {
    if (!element) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 50));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(interval);
      } else {
        element.textContent = current.toLocaleString();
      }
    }, 25);
  };

  const setupStats = () => {
    const stats = [
      { id: 'stat1', value: 12000 },
      { id: 'stat2', value: 4800 },
      { id: 'stat3', value: 35 }
    ];
    stats.forEach((stat) => animateNumber(getElement(`#${stat.id}`), stat.value));
  };

  const setupTestimonials = () => {
    const testimonials = [
      {
        text: '“I made R4 500 in my first month selling design work on CampusConnect. It changed how I pay for res.”',
        name: 'Thabo Mokoena',
        title: 'Graphic Design, UJ • Verified Seller'
      },
      {
        text: '“Found a tutor for my coding exam in under 2 hours. The platform is super easy to use!”',
        name: 'Lerato Sithole',
        title: 'Computer Science, Wits • Verified Buyer'
      },
      {
        text: '“As a photography student, I\'ve earned over R8,000 doing grad shoots. Best decision ever!”',
        name: 'Michael Ndlovu',
        title: 'Photography, TUT • Top Seller'
      }
    ];

    let currentIndex = 0;
    const textEl = getElement('#testimonialText');
    const nameEl = getElement('#testimonialName');
    const titleEl = getElement('#testimonialTitle');
    const prevBtn = getElement('#prevTestimonial');
    const nextBtn = getElement('#nextTestimonial');

    const render = (index) => {
      const testimonial = testimonials[index];
      if (!testimonial) return;
      if (textEl) textEl.textContent = testimonial.text;
      if (nameEl) nameEl.textContent = testimonial.name;
      if (titleEl) titleEl.textContent = testimonial.title;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        render(currentIndex);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        render(currentIndex);
      });
    }

    render(currentIndex);
  };

  const init = () => {
    updateLoginActions();
    addCardAction(selectors.seekServiceCard, selectors.seekServiceBtn, GET_STARTED_BUY, 'buyer');
    addCardAction(selectors.offerSkillsCard, selectors.offerSkillsBtn, GET_STARTED_SELL, 'seller');
    setupNavigation();
    setupMobileMenu();
    setupStats();
    setupTestimonials();
  };

  document.addEventListener('DOMContentLoaded', init);
})();
