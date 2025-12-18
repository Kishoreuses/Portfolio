import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { fallbackCertifications } from '../data/fallback';

const Certifications = () => {
  const [certifications, setCertifications] = useState(fallbackCertifications);
  const [index, setIndex] = useState(0);
  const [activeCert, setActiveCert] = useState(null);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const data = await api.getCertifications();
        if (data && data.length > 0) {
          setCertifications(data);
        } else {
          setCertifications(fallbackCertifications);
        }
      } catch (error) {
        console.error('Error fetching certifications:', error);
        setCertifications(fallbackCertifications);
      }
    };
    fetchCertifications();
  }, []);

  useEffect(() => {
    if (certifications.length === 0) return;

    const move = (animate = true) => {
      if (!trackRef.current) return;
      const first = trackRef.current.querySelector(':scope > *');
      if (!first) return;
      const rect = first.getBoundingClientRect();
      const cardWidth = rect.width;
      const gap = 16;
      const offset = -(index * (cardWidth + gap));
      trackRef.current.style.transition = animate ? 'transform 450ms ease' : 'none';
      trackRef.current.style.transform = `translateX(${offset}px)`;
    };

    const next = () => {
      setIndex(prev => {
        const newIndex = prev + 1;
        if (newIndex >= certifications.length) {
          setTimeout(() => setIndex(0), 460);
          return certifications.length;
        }
        return newIndex;
      });
    };

    timerRef.current = setInterval(next, 3200);
    move();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [certifications, index]);

  const handlePrev = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIndex(prev => (prev <= 0 ? certifications.length - 1 : prev - 1));
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1 >= certifications.length ? 0 : prev + 1));
    }, 3200);
  };

  const handleNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIndex(prev => (prev + 1 >= certifications.length ? 0 : prev + 1));
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1 >= certifications.length ? 0 : prev + 1));
    }, 3200);
  };

  const handleMouseEnter = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleMouseLeave = () => {
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1 >= certifications.length ? 0 : prev + 1));
    }, 3200);
  };

  const handleImageClick = (cert) => {
    setActiveCert(cert);
  };

  const closeModal = () => {
    setActiveCert(null);
  };

  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="section certifications">
      <div className="section-title">
        <h2>Certifications</h2>
        <p>Featured credentials</p>
      </div>
      <div className="cert-marquee">
        <button className="cert-btn prev" onClick={handlePrev} aria-label="Previous certification">‹</button>
        <div className="cert-window" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="cert-track" ref={trackRef}>
            {certifications.map((cert, i) => (
              <article key={cert._id || i} className="cert-card card shadow-sm">
                <img
                  src={cert.image?.startsWith('http') ? cert.image : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${cert.image}`}
                  alt={`${cert.title} certificate`}
                  onClick={() => handleImageClick(cert)}
                  style={{ cursor: 'zoom-in' }}
                />
                <div className="card-body cert-body">
                  <h3 className="card-title">{cert.title}</h3>
                  <p className="card-text">{cert.issuer} · {cert.year}</p>
                </div>
              </article>
            ))}
            {certifications.map((cert, i) => (
              <article key={`dup-${cert._id || i}`} className="cert-card card shadow-sm">
                <img
                  src={cert.image?.startsWith('http') ? cert.image : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${cert.image}`}
                  alt={`${cert.title} certificate`}
                  onClick={() => handleImageClick(cert)}
                  style={{ cursor: 'zoom-in' }}
                />
                <div className="card-body cert-body">
                  <h3 className="card-title">{cert.title}</h3>
                  <p className="card-text">{cert.issuer} · {cert.year}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <button className="cert-btn next" onClick={handleNext} aria-label="Next certification">›</button>
      </div>
      {activeCert && (
        <div className="cert-modal-backdrop" onClick={closeModal}>
          <div className="cert-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="cert-modal-close"
              type="button"
              onClick={closeModal}
              aria-label="Close certificate"
            >
              ×
            </button>
            <img
              src={activeCert.image?.startsWith('http') ? activeCert.image : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${activeCert.image}`}
              alt={`${activeCert.title} full certificate`}
              className="cert-modal-image"
            />
            <div className="cert-modal-meta">
              <h3>{activeCert.title}</h3>
              <p>{activeCert.issuer} · {activeCert.year}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certifications;

