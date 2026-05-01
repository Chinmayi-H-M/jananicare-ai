import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, switchLanguage, t } = useLanguage();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(formData.email, formData.password);
      navigate(user.role === 'asha_worker' ? '/asha-dashboard' : '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Handle API error responses
      const errorMessage = err.response?.data?.error || err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'mother') {
      setFormData({ email: 'priya@demo.com', password: 'demo123' });
    } else {
      setFormData({ email: 'asha@demo.com', password: 'demo123' });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="brand-icon">🌸</span>
          <h1>{t('brandName')}</h1>
          <p>{t('tagline')}</p>
        </div>
        <div className="auth-illustration">
          <div className="illustration-card">
            <div className="illus-icon">🤱</div>
            <h3>Safe Motherhood</h3>
            <p>AI-powered risk detection for every pregnant woman</p>
          </div>
          <div className="illustration-card">
            <div className="illus-icon">👩‍⚕️</div>
            <h3>ASHA Worker Support</h3>
            <p>Real-time monitoring and emergency coordination</p>
          </div>
          <div className="illustration-card">
            <div className="illus-icon">🚨</div>
            <h3>Emergency Alerts</h3>
            <p>Instant notifications for high-risk pregnancies</p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <div className="auth-lang-switcher">
              <button className={`lang-btn ${language === 'en' ? 'active' : ''}`} onClick={() => switchLanguage('en')}>EN</button>
              <button className={`lang-btn ${language === 'kn' ? 'active' : ''}`} onClick={() => switchLanguage('kn')}>ಕನ್ನಡ</button>
            </div>
            <h2>{t('welcomeBack')}</h2>
            <p>{t('signIn')} — JananiCare AI</p>
          </div>

          {/* Demo Buttons */}
          <div className="demo-buttons">
            <p className="demo-label">🎯 Quick Demo Login:</p>
            <div className="demo-btn-row">
              <button className="demo-btn demo-mother" onClick={() => fillDemo('mother')}>
                🤱 Mother Demo
              </button>
              <button className="demo-btn demo-asha" onClick={() => fillDemo('asha')}>
                👩‍⚕️ ASHA Demo
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>{t('email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>{t('password')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="form-input"
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <><span className="btn-spinner"></span> Signing in...</>
              ) : (
                `${t('signIn')} →`
              )}
            </button>
          </form>

          <p className="auth-switch">
            {t('noAccount')} <Link to="/register">{t('createAccount')}</Link>
          </p>

          <div className="auth-back">
            <Link to="/">← {t('backToHome')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
