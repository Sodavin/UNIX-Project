import React from 'react';
import './Auth.css';

function Login({ setView, setIsLoggedIn }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    setIsLoggedIn(true);
    setView('home');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p>Enter your details to access your account.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="john@example.com" required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="auth-submit-btn">LOGIN</button>
        </form>

        <div className="auth-switch">
          Don't have an account? <span onClick={() => setView('signup')}>Sign up</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
