import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const role = data.role;
        login(data.token, role);

        if (role === "admin") navigate("/admin");
        else navigate("/dashboard");

        console.log("Login successful:", data);
      } else {
        const errorMsg = data.message || "Login failed";
        setError(errorMsg);
        console.log("Login failed:", data);
      }
    } catch (err) {
      console.error("Server error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSignin} className="signin-form">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
