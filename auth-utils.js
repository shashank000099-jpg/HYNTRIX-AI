// ════ SUPABASE CONFIG ════
const SUPABASE_URL = 'https://lxfnfzigwznfyblabsew.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4Zm5memlnd3puZnlibGFic2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODc5NTAsImV4cCI6MjA5Mjg2Mzk1MH0.lKWjmXWzFyP6DreMfhEu2p3w3JhH9LoHL8-3MGcqufQ';
const SUPABASE_REDIRECT_URL = 'https://hyntrixai.com/auth/callback';
const SUPABASE_RESET_REDIRECT = 'https://hyntrixai.com/reset-password';

// For development/localhost
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  const protocol = window.location.protocol;
  const host = window.location.host;
  window.SUPABASE_REDIRECT_URL = `${protocol}//${host}/auth/callback`;
  window.SUPABASE_RESET_REDIRECT = `${protocol}//${host}/reset-password`;
}

// ════ AUTH STATE ════
let authState = null;
let currentSession = null;

// ════ FETCH WITH AUTH ════
async function authFetch(path, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${token || SUPABASE_KEY}`
  };
  
  if (method === 'POST') headers['Prefer'] = 'return=minimal';
  
  const options = {
    method,
    headers
  };
  
  if (body) options.body = JSON.stringify(body);
  
  try {
    const response = await fetch(SUPABASE_URL + path, options);
    let data = null;
    
    try {
      data = await response.json();
    } catch (e) {
      // Some endpoints return no JSON
    }
    
    if (!response.ok) {
      const errorMsg = data?.message || data?.error_description || data?.msg || data?.error || 'Request failed';
      throw new Error(errorMsg);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

// ════ SIGNUP ════
async function signUp(email, password, fullName) {
  const data = await authFetch('/auth/v1/signup', 'POST', {
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: window.SUPABASE_REDIRECT_URL || SUPABASE_REDIRECT_URL
    }
  });
  
  if (data?.user) {
    currentSession = {
      user: data.user,
      session: data.session,
      access_token: data.access_token
    };
    return {
      user: data.user,
      session: data.session,
      needsConfirmation: !data.session // If no session, email confirmation is required
    };
  }
  
  throw new Error('Signup failed');
}

// ════ LOGIN ════
async function signIn(email, password) {
  const data = await authFetch('/auth/v1/token?grant_type=password', 'POST', {
    email,
    password
  });
  
  if (data?.access_token) {
    currentSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user
    };
    
    // Get full user profile
    const userProfile = await authFetch('/auth/v1/user', 'GET', null, data.access_token);
    if (userProfile) {
      currentSession.user = userProfile;
    }
    
    return currentSession;
  }
  
  throw new Error('Invalid credentials');
}

// ════ LOGOUT ════
async function signOut(token = null) {
  try {
    if (token) {
      await authFetch('/auth/v1/logout', 'POST', {}, token);
    }
  } catch (e) {
    // Ignore errors on logout
  }
  
  currentSession = null;
  clearAuthStorage();
}

// ════ GET CURRENT SESSION ════
async function getCurrentSession(token = null) {
  try {
    const useToken = token || getStoredToken();
    if (!useToken) return null;
    
    const userProfile = await authFetch('/auth/v1/user', 'GET', null, useToken);
    if (userProfile) {
      currentSession = {
        user: userProfile,
        access_token: useToken
      };
      return currentSession;
    }
  } catch (error) {
    clearAuthStorage();
    return null;
  }
}

// ════ VERIFY OTP (for email confirmation) ════
async function verifyOtp(email, token, type = 'email') {
  const data = await authFetch('/auth/v1/verify', 'POST', {
    type,
    email,
    token
  });
  
  return data;
}

// ════ REQUEST PASSWORD RESET ════
async function requestPasswordReset(email) {
  const data = await authFetch('/auth/v1/recover', 'POST', {
    email,
    redirectTo: window.SUPABASE_RESET_REDIRECT || SUPABASE_RESET_REDIRECT
  });
  
  return data;
}

// ════ RESET PASSWORD ════
async function resetPassword(accessToken, newPassword) {
  const data = await authFetch('/auth/v1/user', 'PUT', {
    password: newPassword
  }, accessToken);
  
  return data;
}

// ════ STORAGE MANAGEMENT ════
function saveAuthSession(session) {
  if (session?.access_token) {
    localStorage.setItem('hx_auth_token', session.access_token);
    if (session.refresh_token) {
      localStorage.setItem('hx_refresh_token', session.refresh_token);
    }
  }
  if (session?.user) {
    localStorage.setItem('hx_user', JSON.stringify(session.user));
  }
  currentSession = session;
}

function getStoredToken() {
  return localStorage.getItem('hx_auth_token');
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('hx_user'));
  } catch {
    return null;
  }
}

function clearAuthStorage() {
  localStorage.removeItem('hx_auth_token');
  localStorage.removeItem('hx_refresh_token');
  localStorage.removeItem('hx_user');
}

// ════ RESTORE SESSION ════
async function restoreSession() {
  const token = getStoredToken();
  if (token) {
    try {
      return await getCurrentSession(token);
    } catch (error) {
      clearAuthStorage();
      return null;
    }
  }
  return null;
}

// ════ UI UTILITIES ════
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = '⚠ ' + message;
    el.classList.add('show');
  }
}

function clearError(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.classList.remove('show');
    el.textContent = '';
  }
}

function clearAllErrors() {
  document.querySelectorAll('.fe').forEach(e => e.classList.remove('show'));
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = (type === 'error' ? '✗ ' : '✓ ') + message;
  toast.className = 'show ' + (type || 'success');
  
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.className = '';
  }, 3500);
}

function setLoading(buttonId, spinId, isLoading) {
  const btn = document.getElementById(buttonId);
  const spin = document.getElementById(spinId);
  const txt = document.getElementById(buttonId.replace('-btn', '-btxt'));
  
  if (btn) btn.disabled = isLoading;
  if (spin) spin.style.display = isLoading ? 'block' : 'none';
  if (txt) txt.style.opacity = isLoading ? '0.4' : '1';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ════ ROUTE PROTECTION ════
async function requireAuth() {
  const session = await restoreSession();
  if (!session) {
    window.location.href = '/login';
    return null;
  }
  return session;
}

// ════ REDIRECT TO DASHBOARD IF LOGGED IN ════
async function redirectIfLoggedIn() {
  const session = await restoreSession();
  if (session) {
    window.location.href = '/dashboard';
  }
}

// ════ SETUP GREETING ════
function setupGreeting(userName) {
  const hour = new Date().getHours();
  let timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  let timeIcon = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  const firstName = (userName || 'Commander').split(' ')[0];
  
  const greetName = document.getElementById('greet-name');
  if (greetName) {
    greetName.textContent = firstName;
  }
  
  const greetHello = document.getElementById('greet-hello');
  if (greetHello) {
    greetHello.innerHTML = `${timeGreet}, <span class="greet-name">${firstName}</span> ${timeIcon}`;
  }

  const greetSub = document.getElementById('greet-sub');
  if (greetSub) {
    greetSub.textContent = 'Your AI command center is fully operational. Hyntrix is armed, connected, and waiting for your first command.';
  }

  const greetTime = document.getElementById('greet-time');
  if (greetTime) {
    const now = new Date();
    greetTime.textContent = '⏰ ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  burstParticles();
}

function burstParticles() {
  const container = document.getElementById('burst-container');
  if (!container) return;
  
  const colors = ['#1A8CFF', '#00D4FF', '#60C0FF', '#ffffff'];
  for (let i = 0; i < 12; i++) {
    const dot = document.createElement('div');
    dot.className = 'burst-dot';
    const angle = (i / 12) * 360;
    const dist = 30 + Math.random() * 40;
    
    dot.style.cssText = `
      background: ${colors[i % colors.length]};
      left: 50%; top: 50%;
      animation: burst-${i} .8s ease-out ${i * 0.04}s both;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes burst-${i} {
        0% { opacity:1; transform: translate(-50%, -50%) translate(0,0) scale(1); }
        100% { opacity:0; transform: translate(-50%, -50%) translate(${Math.cos(angle * Math.PI / 180) * dist}px, ${Math.sin(angle * Math.PI / 180) * dist}px) scale(0); }
      }
    `;
    document.head.appendChild(style);
    container.appendChild(dot);
    setTimeout(() => dot.remove(), 900);
  }
}
