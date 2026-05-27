document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const formPanel = document.getElementById('formPanel');
  const otpPanel = document.getElementById('otpPanel');
  const formMsg = document.getElementById('formMsg');
  const otpMsg = document.getElementById('otpMsg');
  const submitBtn = document.getElementById('lpSubmit');
  const otpSubmitBtn = document.getElementById('otpSubmit');
  const resendBtn = document.getElementById('resendBtn');
  const togglePw = document.getElementById('togglePw');
  const pwInput = document.getElementById('lpPassword');

  let _email = '', _password = '';

  // Password toggle
  togglePw?.addEventListener('click', () => {
    const isPassword = pwInput.type === 'password';
    pwInput.type = isPassword ? 'text' : 'password';
    togglePw.textContent = isPassword ? 'HIDE' : 'SHOW';
  });

  // Message helpers
  function showMsg(element, msg, type) {
    element.textContent = msg;
    element.className = 'msg-box ' + type;
    element.style.display = 'block';
    setTimeout(() => { element.style.display = 'none'; }, 5000);
  }

  // URL params handling
  const urlParams = new URLSearchParams(window.location.search);
  const urlRole = urlParams.get('role');
  if (urlRole) {
    const sel = document.getElementById('lpRole');
    if (sel) sel.value = urlRole;
  }

  const urlStep = urlParams.get('step');
  const urlEmail = urlParams.get('email');
  if (urlStep === 'verify' && urlEmail) {
    _email = decodeURIComponent(urlEmail).toLowerCase();
    document.getElementById('sentEmail').textContent = _email;
    formPanel.style.display = 'none';
    otpPanel.style.display = 'flex';
    // Auto-resend code
    try {
      const r = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: _email }),
      });
      if (r.ok) {
        showMsg(otpMsg, 'A new verification code was sent to your email.', 'success');
      }
    } catch (_) {}
    document.querySelector('.otp-box')?.focus();
  }

  // Registration submit
  const handleSubmit = async () => {
    const name = document.getElementById('lpName')?.value.trim();
    const email = document.getElementById('lpEmail')?.value.trim();
    const faculty = document.getElementById('lpFaculty')?.value.trim();
    const year = document.getElementById('lpYear')?.value;
    const role = document.getElementById('lpRole')?.value;
    const password = pwInput.value;

    if (!name) { showMsg(formMsg, 'Full name is required.', 'error'); return; }
    if (!email) { showMsg(formMsg, 'Email is required.', 'error'); return; }
    if (!faculty) { showMsg(formMsg, 'Faculty is required.', 'error'); return; }
    if (!year) { showMsg(formMsg, 'Year of study is required.', 'error'); return; }
    if (!role) { showMsg(formMsg, 'Please select how you plan to use CampusConnect.', 'error'); return; }
    if (!password || password.length < 8) { showMsg(formMsg, 'Password must be at least 8 characters.', 'error'); return; }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
          name,
          faculty,
          year_of_study: Number(year),
          account_type: role === 'sell' ? 'seller' : 'buyer',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      _email = email.toLowerCase();
      _password = password;
      document.getElementById('sentEmail').textContent = email;
      formPanel.style.display = 'none';
      otpPanel.style.display = 'flex';
      document.querySelector('.otp-box')?.focus();
    } catch (err) {
      showMsg(formMsg, err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create account →';
    }
  };

  submitBtn?.addEventListener('click', handleSubmit);
  document.querySelectorAll('.lp-input').forEach(inp => {
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });
  });

  // OTP boxes
  const otpBoxes = Array.from(document.querySelectorAll('.otp-box'));
  otpBoxes.forEach((box, i) => {
    box.addEventListener('input', () => {
      box.value = box.value.replace(/\D/g, '').slice(0, 1);
      if (box.value && i < otpBoxes.length - 1) otpBoxes[i + 1].focus();
    });
    box.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !box.value && i > 0) otpBoxes[i - 1].focus();
    });
    box.addEventListener('paste', e => {
      e.preventDefault();
      const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
      digits.split('').forEach((d, idx) => { if (otpBoxes[idx]) otpBoxes[idx].value = d; });
      otpBoxes[Math.min(digits.length, otpBoxes.length - 1)]?.focus();
    });
  });

  // OTP verification
// OTP verification - Update the success redirect
const handleVerify = async () => {
  const code = otpBoxes.map(b => b.value).join('');
  if (code.length < 6) return showMsg(otpMsg, 'Enter all 6 digits.', 'error');

  otpSubmitBtn.disabled = true;
  otpSubmitBtn.textContent = 'Verifying...';

  try {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: _email, code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Verification failed.');

    showMsg(otpMsg, 'Verified! Signing you in...', 'success');

    const { data: authData, error: signInError } = await window.sbClient.auth.signInWithPassword({
      email: _email,
      password: _password,
    });
    if (signInError) throw new Error(signInError.message);

    localStorage.setItem('cc_session', JSON.stringify(authData.session));
    localStorage.setItem('cc_user', JSON.stringify(authData.user));
    
    // ✅ NEW: Get profile to check account type
    const profile = await Auth.getProfile(true);
    
    // ✅ NEW: Redirect based on account type
    if (profile?.account_type === 'seller' || profile?.user_type === 'provider') {
      window.location.href = '/pages/provider-dashboard.html';
    } else {
      window.location.href = '/pages/dashboard.html';
    }
    
  } catch (err) {
    showMsg(otpMsg, err.message, 'error');
  } finally {
    otpSubmitBtn.disabled = false;
    otpSubmitBtn.textContent = 'Verify account';
  }
};
  otpSubmitBtn?.addEventListener('click', handleVerify);

  // Resend OTP
  const handleResend = async () => {
    if (!_email) return;
    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';
    try {
      const r = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: _email }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Could not resend.');
      showMsg(otpMsg, 'New code sent! Check your inbox.', 'success');
      otpBoxes.forEach(b => { b.value = ''; });
      otpBoxes[0]?.focus();
    } catch (err) {
      showMsg(otpMsg, err.message || 'Could not resend. Try again.', 'error');
    }
    resendBtn.disabled = false;
    resendBtn.textContent = "Didn't receive a code? Resend";
  };

  resendBtn?.addEventListener('click', handleResend);
});