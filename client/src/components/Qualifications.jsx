import { useState, useEffect } from "react";
import "./Qualifications.css"; 

export default function Qualifications() {
  const [items, setItems] = useState([]);

  const loadData = async () => {
    try {
      const res = await fetch("/api/qualifications");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to load qualifications:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="qualifications">
      <h2 className="qualifications-title">My Qualifications</h2>

      {items.length === 0 ? (
        <p className="no-qualifications">No qualifications added yet.</p>
      ) : (
        <div className="qualifications-grid">
          {items.map((q) => (
            <div key={q._id} className="qualification-card">
              <h3 className="qualification-title">{q.title}</h3>
              <p className="qualification-name">{q.firstname} {q.lastname}</p>
              <p className="qualification-email">{q.email}</p>
              {q.completion && (
                <p className="qualification-date">
                  Completion: {new Date(q.completion).toLocaleDateString()}
                </p>
              )}
              <p className="qualification-description">{q.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
