import { useEffect, useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  return (
    <div className="projects-page">
      <h1>My Projects</h1>

      {projects.length === 0 ? (
        <p>No projects to display.</p>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div className="project-card" key={project._id}>
              {project.image && (
                <img src={project.image} alt={project.title} className="project-img" />
              )}
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <p><strong>By:</strong> {project.firstname} {project.lastname}</p>
              {project.completion && (
                <p><strong>Completed:</strong> {new Date(project.completion).toLocaleDateString()}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
