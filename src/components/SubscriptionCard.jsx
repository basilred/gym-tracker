import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function SubscriptionCard({ sub, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const remaining = sub.totalSessions - sub.visits.length;
  const progress = (sub.visits.length / sub.totalSessions) * 100;

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Вы уверены, что хотите удалить абонемент "${sub.name}"?`)) {
      onDelete(sub.id);
    }
    setMenuOpen(false);
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="relative bg-white rounded-2xl shadow p-4 hover:shadow-md transition">
      <div className="absolute top-2 right-2">
        <button
          onClick={toggleMenu}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
          aria-label="Options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10"
          >
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Удалить
            </button>
          </div>
        )}
      </div>
      <Link to={`/subscription/${sub.id}`} className="block">
        <h3 className="text-lg font-semibold pr-8">{sub.name}</h3>
        <p className="text-sm text-gray-500">
          С {new Date(sub.startDate).toLocaleDateString()}
        </p>

        <div className="mt-2 text-sm font-medium">
          Осталось {remaining} из {sub.totalSessions} занятий
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Link>
    </div>
  );
}
