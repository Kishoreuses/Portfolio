import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from '../services/api';
import { fallbackEducation } from '../data/fallback';

const Education = () => {
  const [education, setEducation] = useState(fallbackEducation);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const data = await api.getEducation();
        if (data && data.length > 0) {
          setEducation(data);
        } else {
          setEducation(fallbackEducation);
        }
      } catch (error) {
        console.error('Error fetching education:', error);
        setEducation(fallbackEducation);
      }
    };
    fetchEducation();
  }, []);

  if (education.length === 0) return null;

  const levelLogos = {
    msc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4mtbllX145Nn1TG0tg0787skL9pahigj9jA&s',
    hsc: 'https://img.icons8.com/color/96/school-building.png',
    sslc: 'https://img.icons8.com/color/96/school.png',
  };

  const normalize = (value) => (value || '').toLowerCase().replace(/\./g, '').trim();

  const getLogoKey = (edu) => {
    const d = normalize(edu.degree);
    const i = normalize(edu.institution);
    if (d.includes('sslc')) return 'sslc';
    if (d.includes('hsc')) return 'hsc';
    if (d.includes('msc') || i.includes('kongu')) return 'msc';
    return null;
  };

  const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = BASE_URL;
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  const deduped = [];
  const seen = new Set();
  const hscSeen = new Set();

  education.forEach((edu) => {
    const degreeName = normalize(edu.degree);
    const institutionName = normalize(edu.institution);

    // Special handling for HSC duplicates - only keep one HSC entry
    if (degreeName.includes('hsc')) {
      if (hscSeen.has(institutionName)) {
        return; // Skip duplicate HSC entries
      }
      hscSeen.add(institutionName);
    }

    const key = `${degreeName}|${institutionName}`;
    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(edu);
  });

  return (
    <section id="education" className="section education">
      <div className="section-title">
        <h2>Education</h2>
        <p>Academic background</p>
      </div>
      <div className="timeline">
        {deduped.map((edu) => {
          const logoKey = getLogoKey(edu);
          const rawLogo = edu.logo || edu.logoUrl || (logoKey ? levelLogos[logoKey] : null);
          const logoSrc = getFullUrl(rawLogo);
          const fallbackLetter = edu.institution?.charAt(0) || '?';
          return (
            <div key={edu._id || edu.institution} className="timeline-item">
              <span className="dot"></span>
              <div className="edu-card">
                <div className="edu-logo">
                  {logoSrc ? (
                    <img src={logoSrc} alt={`${edu.institution} logo`} />
                  ) : (
                    <div className="edu-logo-fallback">{fallbackLetter}</div>
                  )}
                </div>
                <div className="timeline-content">
                  <h3>{edu.degree}</h3>
                  <p className="edu-meta">{edu.institution} • {edu.period}</p>
                  <p>{edu.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Education;

