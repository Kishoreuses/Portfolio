import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { fallbackSkills } from '../data/fallback';

const Skills = () => {
  const [skills, setSkills] = useState(fallbackSkills);
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await api.getSkills();
        if (data && data.length > 0) {
          setSkills(data);
        } else {
          setSkills(fallbackSkills);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkills(fallbackSkills);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    if (skills.length === 0) return;

    const move = (animate = true) => {
      if (!trackRef.current) return;
      const first = trackRef.current.querySelector(':scope > *');
      if (!first) return;
      const rect = first.getBoundingClientRect();
      const cardWidth = rect.width;
      const gap = 10;
      const offset = -(index * (cardWidth + gap));
      trackRef.current.style.transition = animate ? 'transform 420ms ease' : 'none';
      trackRef.current.style.transform = `translateX(${offset}px)`;
    };

    const next = () => {
      setIndex(prev => {
        const newIndex = prev + 1;
        if (newIndex >= skills.length) {
          setTimeout(() => setIndex(0), 430);
          return skills.length;
        }
        return newIndex;
      });
    };

    timerRef.current = setInterval(next, 2600);
    move();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [skills, index]);

  const handlePrev = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIndex(prev => (prev <= 0 ? skills.length - 1 : prev - 1));
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1 >= skills.length ? 0 : prev + 1));
    }, 2600);
  };

  const handleNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIndex(prev => (prev + 1 >= skills.length ? 0 : prev + 1));
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1 >= skills.length ? 0 : prev + 1));
    }, 2600);
  };

  const handleMouseEnter = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleMouseLeave = () => {
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1 >= skills.length ? 0 : prev + 1));
    }, 2600);
  };

  if (skills.length === 0) return null;

  return (
    <section id="skills" className="section skills">
      <div className="section-title">
        <h2>Skills</h2>
        <p>Tools & technologies</p>
      </div>
      <div className="skills-marquee">
        <button className="skill-btn prev" onClick={handlePrev} aria-label="Previous skill">‹</button>
        <div className="skill-window" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="skill-track" ref={trackRef}>
            {skills.map((skill, i) => (
              <article key={skill._id || i} className="skill-card">
                <img src={skill.logo} alt={`${skill.name} logo`} />
                <p className="skill-name">{skill.name}</p>
              </article>
            ))}
            {skills.map((skill, i) => (
              <article key={`dup-${skill._id || i}`} className="skill-card">
                <img src={skill.logo} alt={`${skill.name} logo`} />
                <p className="skill-name">{skill.name}</p>
              </article>
            ))}
          </div>
        </div>
        <button className="skill-btn next" onClick={handleNext} aria-label="Next skill">›</button>
      </div>
    </section>
  );
};

export default Skills;

