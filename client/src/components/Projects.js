import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { fallbackProjects } from '../data/fallback';

const Projects = () => {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(fallbackProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(fallbackProjects);
      }
    };
    fetchProjects();
  }, []);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="section projects">
      <div className="section-title">
        <h2>Projects</h2>
        <p>Selected work</p>
      </div>
      <div className="projects-grid">
        {projects.map((project) => (
          <article key={project._id} className="card">
            <div className="card-body">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tags">
                {project.tags?.map((tag, i) => (
                  <span key={i}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="card-footer">
              {project.codeLink && (
                <a href={project.codeLink} target="_blank" rel="noreferrer" className="link">Code</a>
              )}
              {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noreferrer" className="link">Live Demo</a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;

