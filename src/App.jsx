import { useState } from "react";
import LandingPage from "./components/LandingPage";
import StudentPortal from "./components/StudentPortal/StudentPortal";
import TutorPortal from "./components/TutorPortal/TutorPortal";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import "./styles/global.css";

export default function App() {
  const [activePortal, setActivePortal] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user, portal) => {
    setCurrentUser(user);
    setActivePortal(portal);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePortal("landing");
  };

  if (activePortal === "student") return <StudentPortal user={currentUser} onLogout={handleLogout} />;
  if (activePortal === "tutor") return <TutorPortal user={currentUser} onLogout={handleLogout} />;
  if (activePortal === "admin") return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  return <LandingPage onEnterPortal={(portal) => setActivePortal(portal)} />;
}
