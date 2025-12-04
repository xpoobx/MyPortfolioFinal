import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3000/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Message sent successfully!");
        setFormData({ firstname: "", lastname: "", email: "" });
      } else {
        setError(data.message || "Failed to send contact");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Me</h1>
      <div className="contact-card">
        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
          <input
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
