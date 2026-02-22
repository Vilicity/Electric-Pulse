// DOM Elements
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('auth-message');
const userInfo = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');
const authContainer = document.getElementById('auth-container');
const mainContent = document.getElementById('main-content');

// Helper function to POST JSON
async function postJSON(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json().catch(() => ({}));
  return { status: response.status, result };
}

// On page load, hide main content if not authenticated (basic control, real auth needed on backend)
window.addEventListener('load', () => {
  loggedOut();
});

// Login / Signup form submit handler
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authMessage.textContent = '';
  const email = emailInput.value;
  const password = passwordInput.value;

  // Try to login first
  const loginResp = await postJSON('/login', { email, password });
  if (loginResp.status === 200) {
    authMessage.textContent = 'Login successful!';
    loggedIn(email);
    return;
  }

  if (loginResp.status === 400) {
    if (loginResp.result.error && loginResp.result.error.includes('Invalid login credentials')) {
      // Only try signup if login error message contains 'Invalid login credentials'
      const signupResp = await postJSON('/signup', { email, password });
      if (signupResp.status === 200) {
        authMessage.textContent = 'Signup successful! Please log in now.';
        return;
      } else {
        authMessage.textContent = `Signup error: ${signupResp.result.error || 'Unknown error'}`;
        return;
      }
    } else {
      // Show login error if other 400 error
      authMessage.textContent = `Login error: ${loginResp.result.error || 'Unknown error'}`;
      return;
    }
  }

  // Show login error for any other status
  authMessage.textContent = `Login error: ${loginResp.result.error || 'Unknown error'}`;
});

// Handle logout
logoutBtn.addEventListener('click', () => {
  loggedOut();
});

// Logged in UI updates
function loggedIn(email) {
  authContainer.hidden = true;
  mainContent.hidden = false;
  logoutBtn.style.display = 'inline-block';
  userInfo.textContent = `Logged in as ${email}`;

  // Load voltage readings for the user
  loadVoltageReadings();
}

// Logged out UI updates
function loggedOut() {
  authContainer.hidden = false;
  mainContent.hidden = true;
  logoutBtn.style.display = 'none';
  userInfo.textContent = '';
}

// The rest of the original dashboard logic below remains untouched (loading and inserting readings)

// Load voltage readings after login
async function loadVoltageReadings() {
  // You will have to connect to the backend to get actual data
  // Here is a placeholder fetch example assuming a GET /readings endpoint

  const response = await fetch('/readings');
  if (!response.ok) {
    console.error('Error loading voltage readings:', response.statusText);
    return;
  }

  const data = await response.json();
  const tbody = document.getElementById('ep-readings-tbody');
  tbody.innerHTML = '';
  data.forEach(reading => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(reading.timestamp).toLocaleString()}</td>
      <td>${reading.voltage}</td>
      <td>${reading.current}</td>
      <td>${reading.power}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Placeholder: after login, you can also insert new voltage reading
async function insertVoltageReading(reading) {
  // Forward this to your backend API if exists
  const response = await fetch('/insert-reading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reading),
  });

  if (!response.ok) {
    console.error('Insert voltage reading error:', response.statusText);
    return null;
  }

  const data = await response.json();
  return data;
}

// Additional code to insert or update readings can be called here after login if needed

