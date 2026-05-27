document.addEventListener('DOMContentLoaded', () => {
  Auth.requireGuest();

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
        // Account exists but OTP not completed — sign back out and send them to verify
        await Auth.signOut();
        const email = encodeURIComponent(form.email.value.trim());
        window.location.href = `pages/get-started.html?step=verify&email=${email}`;
        return;
      }
      // FIXED: Redirect based on account type
      if (profile?.is_admin) {
        window.location.href = 'pages/admin.html';
      } else if (profile?.account_type === 'seller') {
        // Seller goes to provider dashboard
        window.location.href = 'pages/provider-dashboard.html';
      } else {
        // Buyer goes to seeker dashboard
        window.location.href = 'pages/dashboard.html';
      }
      
    } catch (err) {
      showMsg(err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  });
});
