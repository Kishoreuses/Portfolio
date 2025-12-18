import React from 'react';

const About = ({ profile }) => {
  if (!profile) {
    return null;
  }

  return (
    <section id="about" className="section about">
      <div className="section-title">
        <h2>About Me</h2>
        <p>A quick intro</p>
      </div>
      <div className="about-grid">
        <div className="about-content">
          <p>{profile.about?.paragraph1}</p>
          <p>{profile.about?.paragraph2}</p>
        </div>
        <div className="info-cards">
          <div className="info-card">
            <span className="label">Location</span>
            <span className="value">{profile.location}</span>
          </div>
          <div className="info-card">
            <span className="label">Education</span>
            <span className="value">{profile.education}</span>
          </div>
          <div className="info-card">
            <span className="label">Focus</span>
            <span className="value">{profile.focus}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;















