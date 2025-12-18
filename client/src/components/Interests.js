import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { fallbackInterests } from '../data/fallback';

const Interests = () => {
  const [interests, setInterests] = useState(fallbackInterests);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const data = await api.getInterests();
        if (data && data.length > 0) {
          setInterests(data);
        } else {
          setInterests(fallbackInterests);
        }
      } catch (error) {
        console.error('Error fetching interests:', error);
        setInterests(fallbackInterests);
      }
    };
    fetchInterests();
  }, []);

  if (interests.length === 0) return null;

  return (
    <section id="interests" className="section interests">
      <div className="section-title">
        <h2>Area of Interest</h2>
        <p>What keeps me curious</p>
      </div>
      <div className="interest-grid">
        {interests.map((interest) => (
          <article key={interest._id} className="interest-card">
            <img
              src={interest.image?.startsWith('http') ? interest.image : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${interest.image}`}
              alt={interest.title}
            />
            <div className="interest-body">
              <h3>{interest.title}</h3>
              <p>{interest.description}</p>
              <div className="interest-projects">
                {interest.projects?.map((project, i) => (
                  <span key={i}>{project}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Interests;

