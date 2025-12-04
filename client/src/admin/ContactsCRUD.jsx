import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ContactsCRUD() {
  const { token, role } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (role === "admin") {
      fetch("http://localhost:3000/api/contacts", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setContacts)
        .catch(err => {
          console.error(err);
          setError("Server error");
        });
    }
  }, [token, role]);

  if (role !== "admin") return <h2>Access Denied!</h2>;

  return (
    <div className="contacts-crud">
  <h2>Submitted Contacts</h2>
  {error && <p>{error}</p>}
  {contacts.length === 0 ? (
    <p>No contacts submitted yet.</p>
  ) : (
    <table className="contacts-table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(c => (
          <tr key={c._id}>
            <td data-label="First Name">{c.firstname}</td>
            <td data-label="Last Name">{c.lastname}</td>
            <td data-label="Email">{c.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
  );
}
