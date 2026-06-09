import { cn } from '@bem-react/classname';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Subscription } from '@/entities/subscription';
import { calcProgress, useSubscriptions } from '@/entities/subscription';
import { useInlineEdit } from '@/shared/hooks/useInlineEdit';

const card = cn('SubscriptionCard');

interface SubscriptionCardProps {
  sub: Subscription;
}

export default function SubscriptionCard({ sub }: SubscriptionCardProps) {
  const { deleteSubscription, updateSubscription } = useSubscriptions();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    editing,
    editValue,
    setEditValue,
    textareaRef,
    startEditing: startEdit,
    commitEdit,
    handleKeyDown,
    autoResize,
  } = useInlineEdit(sub.name, (name) => updateSubscription(sub.id, { name }));

  const remaining = sub.totalSessions - sub.visits.length;
  const progress = calcProgress(sub.visits.length, sub.totalSessions);

  const startEditing = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Вы уверены, что хотите удалить абонемент "${sub.name}"?`)) {
      deleteSubscription(sub.id);
    }
    setMenuOpen(false);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={card()}>
      <div className={card('Menu')}>
        <button onClick={toggleMenu} aria-label="Options" className={card('MenuToggle')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        <div ref={menuRef} className={card('MenuDropdown', { expanded: menuOpen })}>
          <button onClick={handleDelete} className={card('MenuDeleteBtn')} aria-label="Удалить абонемент">
            Удалить
          </button>
        </div>
      </div>
      <Link to={`/subscription/${sub.id}`} className={card('Link')}>
        {editing ? (
          <textarea
            ref={textareaRef}
            className={card('EditInput')}
            value={editValue}
            onChange={(e) => { setEditValue(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            onBlur={commitEdit}
            rows={1}
            onClick={(e) => e.preventDefault()}
          />
        ) : (
          <h3 className={card('Title')}>
            <span className={card('TitleEditTrigger')} onClick={startEditing} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEditing(e); }} role="button" tabIndex={0}>
              {sub.name}
            </span>
          </h3>
        )}
        <p className={card('Date')}>
          С {new Date(sub.startDate).toLocaleDateString()}
        </p>

        <div className={card('Stats')}>
          Осталось {remaining} из {sub.totalSessions} занятий
        </div>

        <div className={card('ProgressBar')}>
          <div
            className={card('ProgressFill')}
            style={{ '--progress': `${progress}%` } as React.CSSProperties}
          />
        </div>
      </Link>
    </div>
  );
}
