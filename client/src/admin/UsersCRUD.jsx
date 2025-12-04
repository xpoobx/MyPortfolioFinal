import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function UsersCRUD() {
  const { token, role } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [editingId, setEditingId] = useState(null);

  if (role !== "admin") return <p>Admin only</p>;

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/api/users/${editingId}`
        : `${API_URL}/api/users`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ name: "", email: "", password: "", role: "user" });
        setEditingId(null);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.message || "Error saving user");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleEdit = (u) => {
    setFormData({
      name: u.name || "",
      email: u.email || "",
      password: "",
      role: u.role || "user"
    });
    setEditingId(u._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) fetchUsers();
      else alert("Failed to delete user");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="users-crud">
      <h1>Users Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <hr />

      {users.map((u) => (
        <div key={u._id} className="user-card">
          <p>
            {u.name} | {u.email} | {u.role}
          </p>
          <button onClick={() => handleEdit(u)}>Edit</button>
          <button onClick={() => handleDelete(u._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
