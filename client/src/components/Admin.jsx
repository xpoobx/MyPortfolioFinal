import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Admin() {
  const { role } = useContext(AuthContext);

  if (role !== "admin") return <h2>Access Denied</h2>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p>Welcome, admin! Use the links below to manage your site.</p>

      <div className="admin-links">
        <Link to="/projects-crud">Manage Projects</Link>
        <Link to="/qualifications-crud">Manage Qualifications</Link>
        <Link to="/contacts-crud">View Contacts</Link>
        <Link to="/users-crud">Manage Users</Link>
      </div>
    </div>
  );
}
