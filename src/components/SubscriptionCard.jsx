import { cn } from "@bem-react/classname";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const card = cn("SubscriptionCard");

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
    <div className={card()}>
      <div className={card("Menu")}>
        <button onClick={toggleMenu} aria-label="Options" className={card("MenuToggle")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        {menuOpen && (
          <div ref={menuRef} className={card("MenuDropdown")}>
            <button onClick={handleDelete} className={card("MenuDelete")}>
              Удалить
            </button>
          </div>
        )}
      </div>
      <Link to={`/subscription/${sub.id}`} className={card("Link")}>
        <h3 className={card("Title")}>{sub.name}</h3>
        <p className={card("Date")}>
          С {new Date(sub.startDate).toLocaleDateString()}
        </p>

        <div className={card("Stats")}>
          Осталось {remaining} из {sub.totalSessions} занятий
        </div>

        <div className={card("ProgressBar")}>
          <div
            className={card("ProgressFill")}
            style={{ "--progress": `${progress}%` }}
          />
        </div>
      </Link>
    </div>
  );
}
