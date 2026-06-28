import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePageTitle } from '../../utils/usePageTitle';
import '../css/Auth.css';

function Login({ setView, setIsLoggedIn, setIsAdmin, setUserName, setUserEmail }) {
  usePageTitle('UNIX | Login');
  const navigate = useNavigate();
  const location = useLocation();
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const redirectTo = new URLSearchParams(location.search).get('next') || '/dashboard';
  const loginMessage = redirectTo === '/Checkout' ? 'Please sign in to continue to checkout.' : '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const getLoginError = (data, text, response) => {
    if (data) {
      if (typeof data.detail === 'string') return data.detail;
      if (typeof data.error === 'string') return data.error;
      if (typeof data.username === 'string') return data.username;
      if (typeof data.password === 'string') return data.password;
      const firstKey = Object.keys(data)[0];
      if (firstKey && Array.isArray(data[firstKey]) && data[firstKey].length) {
        return `${firstKey}: ${data[firstKey][0]}`;
      }
    }
    if (text) return text.split('\n')[0];
    return `Login failed (${response.status})`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      setError('Email and password are required.');
      return;
    }

    try {
      const response = await fetch(`${API}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedEmail,
          password: trimmedPassword,
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
        const errorMessage = getLoginError(data, text, response);
        console.error('Login API error', response.status, errorMessage, data);
        setError(errorMessage);
        return;
      }

      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
        window.dispatchEvent(new Event('authChanged'));
      }
      if (data && data.user) {
        setUserName(data.user.username || trimmedEmail.split('@')[0]);
        setUserEmail(data.user.email || trimmedEmail);
        const isAdminUser = Boolean(data.user.is_staff || data.user.is_superuser);
        setIsAdmin(isAdminUser);
      } else {
        setUserName(trimmedEmail.split('@')[0]);
        setUserEmail(trimmedEmail);
        setIsAdmin(false);
      }

      setIsLoggedIn(true);
      const destination = (data && data.user && (data.user.is_staff || data.user.is_superuser)) ? '/admin' : redirectTo;
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Login network error', err);
      setError('Unable to reach the server. Please make sure the backend is running.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        {loginMessage && <p className="auth-notice">{loginMessage}</p>}
        <p>Enter your details to access your account.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username or Email</label>
            <input type="text" placeholder="john@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="auth-submit-btn">LOGIN</button>
        </form>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-switch">
          Don't have an account? <span onClick={() => {
            const signupUrl = `/signup?next=${encodeURIComponent(redirectTo)}`;
            if (typeof setView === 'function') {
              setView('signup');
            } else {
              navigate(signupUrl, { replace: true });
            }
          }}>Sign up</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
