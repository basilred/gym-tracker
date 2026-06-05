import { cn } from '@bem-react/classname';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { Subscription } from '../../../entities/subscription/types';
import { calcProgress } from '../../../entities/subscription/lib/calcProgress';

const card = cn('SubscriptionCard');

interface SubscriptionCardProps {
  sub: Subscription;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<Subscription, 'name'>>) => void;
}

export default function SubscriptionCard({ sub, onDelete, onUpdate }: SubscriptionCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(sub.name);
  const menuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remaining = sub.totalSessions - sub.visits.length;
  const progress = calcProgress(sub.visits.length, sub.totalSessions);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  const startEditing = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditValue(sub.name);
    setEditing(true);
  };

  const commitEdit = () => {
    setEditing(false);
    if (editValue !== sub.name) {
      onUpdate(sub.id, { name: editValue });
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditValue(sub.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      autoResize();
    }
  }, [editing, autoResize]);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Вы уверены, что хотите удалить абонемент "${sub.name}"?`)) {
      onDelete(sub.id);
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
        {menuOpen && (
          <div ref={menuRef} className={card('MenuDropdown')}>
            <button onClick={handleDelete} className={card('MenuDelete')} aria-label="Удалить абонемент">
              Удалить
            </button>
          </div>
        )}
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
