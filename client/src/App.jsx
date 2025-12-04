import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// --- IMPORT COMPONENTS ---
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Contact from "./components/Contact";
import Projects from "./components/Projects"; 
import ProjectsCRUD from "./admin/ProjectsCRUD"; 
import QualificationsCRUD from "./admin/QualificationsCRUD"; 
import UsersCRUD from "./admin/UsersCRUD"; 
import Qualifications from "./components/Qualifications"; 
import Admin from "./components/Admin";
import ContactsCRUD from "./admin/ContactsCRUD";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

// --- PROTECTED WRAPPER ---
function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <SignIn />;
}

// --- PORTFOLIO SECTION COMPONENTS ---
function Home() {
  return (
    <div className="home">
      <img src="/logo.png" alt="Logo" className="home-logo" />
      <h1>Welcome!</h1>
      <p>Im looking to expand my skills in programming and further explore my love of computers.</p>
      <Link to="/about" className="btn">Learn About Me</Link>
    </div>
  );
}

function About() {
return (
<div className="about">
<h1>About Me</h1>
<img src="/portrait.png" alt="My portrait" />
<p>Hello, my name is Dante, and I am passionate about Software Engineering and Web Design. I started the Software Engineering Technology course 
    at Centennial College last year, and am currently in my 3rd semester. I am currently really excited to further hone my skills in coding as 
    I test my skills on outside projects as well as in the classroom.</p>
<a href="/resume.pdf" target="_blank" rel="noreferrer">Resume</a>
</div>
);
}

function Services() {
  const services = [
    { id: 1, title: "Programming", image: "/service-programming.png" },
    { id: 2, title: "Art Design", image: "/service-art.png" },
    { id: 3, title: "Troubleshooting", image: "/service-troubleshooting.png" }
  ];

  return (
    <div className="services-page">
      <h1>Services</h1>
      <div className="services-grid">
        {services.map(s => (
          <div className="service-card" key={s.id}>
            <img src={s.image} alt={s.title} className="service-img" />
            <h2>{s.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN APP ---
function AppContent() {
  const { token, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="app">
        <nav>
          <div className="logo">Dante Pellico</div>
          <span className="site-title">My Portfolio</span>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/qualifications">Qualifications</Link>

            {/* Auth links */}
            {!token && (
              <>
                <Link to="/signin">Sign In</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            )}

            {/* Admin links */}
            {token && (
              <>
                <Link to="/admin">Admin</Link>
                <button onClick={logout} style={{ marginLeft: "10px" }}>Logout</button>
              </>
            )}
          </div>
        </nav>

        <main>
          <Routes>
            {/* Portfolio routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/qualifications" element={<Qualifications />} />

            {/* Admin route */}
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

            {/* Auth */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin CRUD */}
            <Route path="/contacts-crud" element={<ProtectedRoute><ContactsCRUD /></ProtectedRoute>} />
            <Route path="/projects-crud" element={<ProtectedRoute><ProjectsCRUD /></ProtectedRoute>} />
            <Route path="/qualifications-crud" element={<ProtectedRoute><QualificationsCRUD /></ProtectedRoute>} />
            <Route path="/users-crud" element={<ProtectedRoute><UsersCRUD /></ProtectedRoute>} />
          </Routes>
        </main>

        <footer>© 2025 My Portfolio</footer>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
