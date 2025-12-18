import React from 'react';

const Hero = ({ profile }) => {
  if (!profile) {
    return null;
  }

  return (
    <header className="hero" id="home">
      <div className="hero-ornaments">
        <span className="hero-bubble bubble-1"></span>
        <span className="hero-bubble bubble-2"></span>
        <span className="hero-bubble bubble-3"></span>
      </div>
      <div className="hero-grid">
        <div className="hero-content">
          <p className="eyebrow">Hello, I'm</p>
          <h1>{profile.name}</h1>
          <p className="subtitle">{profile.subtitle}</p>
          <div className="hero-actions">
            <a className="btn primary" href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/resume/download`} target="_blank" rel="noopener noreferrer">Resume</a>
            <a className="btn ghost" href="#contact">Contact Me</a>
          </div>
          <div className="hero-meta">
            <a className="hero-meta-item" href={`mailto:${profile.email}`} aria-label="Email">
              <span className="hero-meta-icon" aria-hidden="true" style={{ display: 'flex' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg>
              </span>
              <span>{profile.email}</span>
            </a>
            <a className="hero-meta-item" href={`tel:${profile.phone}`} aria-label="Phone">
              <span className="hero-meta-icon" aria-hidden="true" style={{ display: 'flex' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#34A853" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
              </span>
              <span>{profile.phone}</span>
            </a>
            <a className="hero-meta-item" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <span className="hero-meta-icon" aria-hidden="true" style={{ display: 'flex' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </span>
              <span>GitHub</span>
            </a>
            <a className="hero-meta-item" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <span className="hero-meta-icon" aria-hidden="true" style={{ display: 'flex' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#0077b5" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </span>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
        <figure className="hero-photo">
          <img
            src={profile.photo?.startsWith('http') ? profile.photo : `${(process.env.REACT_APP_API_URL || 'http://localhost:5000').replace('/api', '')}${profile.photo}`}
            alt={`Portrait of ${profile.name}`}
          />
        </figure>
      </div>
    </header>
  );
};

export default Hero;







