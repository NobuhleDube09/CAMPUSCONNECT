document.addEventListener('DOMContentLoaded', () => {
  // REMOVED: Auth.requireGuest(); - This was causing the auto-redirect
  
  // Optional: Show a message if already logged in, but don't auto-redirect
  if (Auth.isLoggedIn()) {
    // You can optionally show a banner, but let the user decide
    const formMsg = document.getElementById('formMsg');
    if (formMsg) {
      formMsg.textContent = 'You are already logged in. Log out first to use a different account.';
      formMsg.className = 'form-msg info';
      formMsg.style.display = 'block';
    }
  }

  const form      = document.getElementById('loginForm');
  const formMsg   = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  const showMsg = (msg, type) => {
    formMsg.textContent  = msg;
    formMsg.className    = `form-msg ${type}`;
    formMsg.style.display = 'block';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
      await Auth.signIn(form.email.value.trim(), form.password.value);
      const profile = await Auth.getProfile(true);
      
      if (profile && !profile.is_verified) {
        await Auth.signOut();
        const email = encodeURIComponent(form.email.value.trim());
        window.location.href = `/pages/get-started.html?step=verify&email=${email}`;
        return;
      }
      
      // Redirect based on user type
      if (profile?.account_type === 'seller' || profile?.user_type === 'provider') {
        window.location.href = '/pages/provider-dashboard.html';
      } 
      else if (profile?.is_admin) {
        window.location.href = '/pages/admin.html';
      } 
      else {
        window.location.href = '/pages/dashboard.html';
      }
      
    } catch (err) {
      showMsg(err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  });
});