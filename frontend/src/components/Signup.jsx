import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Auth.css';

function Signup({ setView, setIsLoggedIn, setUserName, setUserEmail }) {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('next') || '/dashboard';
  const signupMessage = redirectTo === '/Checkout' ? 'Please sign up to continue to checkout.' : '';
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const getSignupError = (data, text, response) => {
    if (data) {
      if (typeof data.detail === 'string') return data.detail;
      if (typeof data.error === 'string') return data.error;
      if (typeof data.username === 'string') return data.username;
      if (typeof data.email === 'string') return data.email;
      if (typeof data.password === 'string') return data.password;
      if (Array.isArray(data.username) && data.username.length) return data.username[0];
      if (Array.isArray(data.email) && data.email.length) return data.email[0];
      if (Array.isArray(data.password) && data.password.length) return data.password[0];
      const firstKey = Object.keys(data)[0];
      if (firstKey && Array.isArray(data[firstKey]) && data[firstKey].length) {
        return `${firstKey}: ${data[firstKey][0]}`;
      }
    }
    if (text) return text.split('\n')[0];
    return `Signup failed (${response.status})`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedUsername = username.trim() || email.split('@')[0];
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setError('Name, email, and password are required.');
      return;
    }

    const nameParts = trimmedName.split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ');

    try {
      const response = await fetch(`${API}/api/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          email: trimmedEmail,
          password: trimmedPassword,
          first_name,
          last_name,
        }),
      });

      const text = await response.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = null;
      }

      if (!response.ok) {
        const errorMessage = getSignupError(data, text, response);
        console.error('Signup API error', response.status, errorMessage, data);
        setError(errorMessage);
        return;
      }

      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
      }
      setUserName(trimmedName);
      setUserEmail(trimmedEmail);
      setIsLoggedIn(true);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error('Signup network error', err);
      setError('Unable to reach the server. Please make sure the backend is running.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        {signupMessage && <p className="auth-notice">{signupMessage}</p>}
        <p>Join UNIX to discover modern fashion.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Username</label>
            <input type="text" placeholder="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="john@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="auth-submit-btn">SIGN UP</button>
        </form>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-switch">
          Already have an account? <span onClick={() => {
            const loginUrl = `/login?next=${encodeURIComponent(redirectTo)}`;
            if (typeof setView === 'function') {
              setView('login');
            } else {
              navigate(loginUrl, { replace: true });
            }
          }}>Login</span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
