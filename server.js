const express = require('express');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

// Validate Supabase environment variables strictly at startup
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
let supabase = null;
let supabaseConfigured = false;

if (!SUPABASE_URL || !SUPABASE_URL.startsWith('https://')) {
  console.error('Error: SUPABASE_URL is missing or invalid. Please add a valid SUPABASE_URL in your .env file, e.g. https://xxxx.supabase.co');
} else if (!SUPABASE_SERVICE_ROLE) {
  console.error('Error: SUPABASE_SERVICE_ROLE is missing in your .env file. Please add it securely.');
} else {
  // Initialize Supabase client only if both are valid
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  supabaseConfigured = true;
}

// Minimal input validation helper
function isValidEmail(email) {
  return typeof email === 'string' && email.includes('@');
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

// POST /signup route for user registration
app.post('/signup', async (req, res) => {
  if (!supabaseConfigured) {
    return res.status(503).json({ error: 'Supabase not configured' });
  }

  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  // Use Supabase admin createUser without auto-confirm
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ user: data.user });
});

// POST /login route for user authentication
app.post('/login', async (req, res) => {
  if (!supabaseConfigured) {
    return res.status(503).json({ error: 'Supabase not configured' });
  }

  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ session: data.session });
});

// Please keep your existing routes below unchanged and add new routes above

app.use(express.static(__dirname));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});