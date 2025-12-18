import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const toggleNav = () => setIsOpen(!isOpen);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const y = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('adminInfo');
    setIsOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <nav className="nav">
      <div className="logo">Kishore</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="nav-toggle" onClick={toggleNav} aria-label="toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li><a href="#home" onClick={(e) => handleLinkClick(e, '#home')}>Home</a></li>
        <li><a href="#about" onClick={(e) => handleLinkClick(e, '#about')}>About</a></li>
        <li><a href="#skills" onClick={(e) => handleLinkClick(e, '#skills')}>Skills</a></li>
        <li><a href="#interests" onClick={(e) => handleLinkClick(e, '#interests')}>Interests</a></li>
        <li><a href="#certifications" onClick={(e) => handleLinkClick(e, '#certifications')}>Certifications</a></li>
        <li><a href="#projects" onClick={(e) => handleLinkClick(e, '#projects')}>Projects</a></li>
        <li><a href="#education" onClick={(e) => handleLinkClick(e, '#education')}>Education</a></li>
        <li><a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>Contact</a></li>
        {token ? (
          <li><a href="/" onClick={handleLogout}>Logout</a></li>
        ) : (
          <li><a href="/admin" onClick={() => setIsOpen(false)}>Admin</a></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

