// Sidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, FaFileUpload, FaBriefcase, FaCheckCircle, FaUserPlus, 
  FaBars, FaAngleDoubleLeft, FaAngleDoubleRight, FaEye, FaInfoCircle
} from 'react-icons/fa';

const navItems = [
  { to: "/", label: "Home", icon: <FaHome /> },
  { to: "/signup", label: "Sign Up", icon: <FaUserPlus /> },
  { to: "/upload", label: "Upload", icon: <FaFileUpload /> },
  { to: "/recommended", label: "Matches", icon: <FaBriefcase /> },
  { to: "/applied", label: "Applied", icon: <FaCheckCircle /> },
  { to: "/resume", label: "View Resume", icon: <FaEye /> },
  { to: "/about", label: "About Us", icon: <FaInfoCircle /> }, // <-- Added About Us
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsOpen(false);
      else setIsOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <aside className={`h-screen bg-slate-950 text-white shadow-xl transition-all duration-300 fixed top-0 left-0 z-40 
        ${isOpen ? 'w-64' : 'w-20'} overflow-hidden`}>
        
        <div className="flex justify-between items-center px-4 py-6">
          {isOpen && <h1 className="text-2xl font-bold">Job Genie</h1>}
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-2">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-lg font-medium 
                ${pathname === to ? 'bg-indigo-700' : 'hover:bg-slate-800'}`}
            >
              {icon}
              {isOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
