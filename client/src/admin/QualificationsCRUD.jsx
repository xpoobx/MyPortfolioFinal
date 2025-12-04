import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Use relative paths so it works both locally and in production
const API = "/api";

export default function QualificationsCRUD() {
  const { token, role } = useContext(AuthContext);
  const [qualifications, setQualifications] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    firstname: "",
    lastname: "",
    email: "",
    completion: "",
    description: ""
  });
  const [editingId, setEditingId] = useState(null);

  if (role !== "admin") return <p>Admin only</p>;

  const fetchQualifications = async () => {
    try {
      const res = await fetch(`${API}/qualifications`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      setQualifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQualifications();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API}/qualifications/${editingId}`
        : `${API}/qualifications`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ title: "", firstname: "", lastname: "", email: "", completion: "", description: "" });
        setEditingId(null);
        fetchQualifications();
      } else {
        const data = await res.json();
        alert(data.message || "Error saving qualification");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleEdit = (q) => {
    setFormData({
      title: q.title || "",
      firstname: q.firstname || "",
      lastname: q.lastname || "",
      email: q.email || "",
      completion: q.completion ? q.completion.slice(0,10) : "",
      description: q.description || ""
    });
    setEditingId(q._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this qualification?")) return;
    try {
      const res = await fetch(`${API}/qualifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchQualifications();
      else alert("Failed to delete qualification");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="qualifications-crud">
      <h1>Qualifications Management</h1>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required />
        <input name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="completion" type="date" placeholder="Completion Date" value={formData.completion} onChange={handleChange} />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <hr />

      <div className="qualifications-grid">
        {qualifications.map(q => (
          <div key={q._id} className="qualification-card">
            <h3>{q.title}</h3>
            <p>{q.firstname} {q.lastname} | {q.email}</p>
            {q.completion && <p>Completed: {new Date(q.completion).toLocaleDateString()}</p>}
            <p>{q.description}</p>
            <button onClick={() => handleEdit(q)}>Edit</button>
            <button onClick={() => handleDelete(q._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
