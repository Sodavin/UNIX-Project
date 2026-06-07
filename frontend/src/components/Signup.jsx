import React, { useState } from 'react';
import './Auth.css';

function Signup({ setView, setIsLoggedIn, setUserName, setUserEmail }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate signup
    if (name.trim() !== '') {
      setUserName(name);
    }
    if (email.trim() !== '') {
      setUserEmail(email);
    }
    setIsLoggedIn(true);
    setView('home');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        <p>Join UNIX to discover modern fashion.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="john@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="auth-submit-btn">SIGN UP</button>
        </form>

        <div className="auth-switch">
          Already have an account? <span onClick={() => setView('login')}>Login</span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
