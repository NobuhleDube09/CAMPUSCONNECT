document.addEventListener('DOMContentLoaded', () => {
  const navigation = [
    { id: 'nav-login', url: '/pages/login.html' },
    { id: 'nav-find-services', url: '/pages/browse.html' },
    { id: 'nav-sell-skills', url: '/pages/register.html' },
    { id: 'nav-how-it-works', url: '/pages/get-started.html' },
    { id: 'nav-success-stories', url: '/pages/leaderboard.html' },
    { id: 'card-find-service', url: '/pages/browse.html' },
    { id: 'card-sell-skills', url: '/pages/register.html' },
    { id: 'hero-find-service', url: '/pages/browse.html' },
    { id: 'hero-sell-skills', url: '/pages/register.html' }
  ];

  const loadPage = (url) => {
    if (!url) return;
    window.location.href = url;
  };

  navigation.forEach((item) => {
    const element = document.getElementById(item.id);
    if (!element) return;

    element.addEventListener('click', () => loadPage(item.url));

    if (element.getAttribute('role') === 'button') {
      element.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          loadPage(item.url);
        }
      });
    }
  });

  const cardButtons = document.querySelectorAll('.card[data-url]');
  cardButtons.forEach((card) => {
    card.addEventListener('click', () => loadPage(card.dataset.url));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        loadPage(card.dataset.url);
      }
    });
  });
});
