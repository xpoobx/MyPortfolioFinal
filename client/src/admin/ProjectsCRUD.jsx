import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProjectsCRUD() {
  const { token, role } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    firstname: "",
    lastname: "",
    email: "",
    completion: "",
    description: "",
    image: ""
  });
  const [editingId, setEditingId] = useState(null);

  if (role !== "admin") return <p>Admin only</p>;

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/api/projects/${editingId}`
        : `${API_URL}/api/projects`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({
          title: "",
          firstname: "",
          lastname: "",
          email: "",
          completion: "",
          description: "",
          image: ""
        });
        setEditingId(null);
        fetchProjects();
      } else {
        alert(data.message || "Error saving project");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title || "",
      firstname: project.firstname || "",
      lastname: project.lastname || "",
      email: project.email || "",
      completion: project.completion ? project.completion.slice(0, 10) : "",
      description: project.description || "",
      image: project.image || ""
    });
    setEditingId(project._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchProjects();
      else alert("Failed to delete project");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="projects-crud-page">
      <h1>Projects Management</h1>

      <div className="crud-form-card">
        <form onSubmit={handleSubmit} className="crud-form">
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <input name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required />
          <input name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="completion" type="date" value={formData.completion || ""} onChange={handleChange} />
          <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <input name="image" placeholder="Image URL" value={formData.image || ""} onChange={handleChange} required />
          <button type="submit">{editingId ? "Update Project" : "Add Project"}</button>
        </form>
      </div>

      <div className="projects-crud-grid">
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          projects.map(project => (
            <div key={project._id} className="project-card">
              {project.image && <img src={project.image} alt={project.title} className="project-img" />}
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <p><strong>By:</strong> {project.firstname} {project.lastname} | <strong>Email:</strong> {project.email}</p>
              {project.completion && <p><strong>Completion:</strong> {new Date(project.completion).toLocaleDateString()}</p>}
              <div className="crud-buttons">
                <button onClick={() => handleEdit(project)}>Edit</button>
                <button onClick={() => handleDelete(project._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
