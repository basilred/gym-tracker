import { cn } from '@bem-react/classname';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Subscription } from '@/entities/subscription';
import { calcProgress, useSubscriptions } from '@/entities/subscription';
import { useInlineEdit } from '@/shared/hooks/useInlineEdit';
import { InlineEdit } from '@/shared/ui/InlineEdit';

const card = cn('SubscriptionCard');

interface SubscriptionCardProps {
  sub: Subscription;
}

export default function SubscriptionCard({ sub }: SubscriptionCardProps) {
  const { deleteSubscription, updateSubscription } = useSubscriptions();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const hook = useInlineEdit(sub.name, (name) => updateSubscription(sub.id, { name }));

  const remaining = sub.totalSessions - sub.visits.length;
  const progress = calcProgress(sub.visits.length, sub.totalSessions);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm(`Вы уверены, что хотите удалить абонемент "${sub.name}"?`)) {
      deleteSubscription(sub.id);
    }
    setMenuOpen(false);
  };

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu, menuOpen]);

  return (
    <div className={card()}>
      <div className={card('Menu')}>
        <button ref={toggleRef} onClick={toggleMenu} aria-label="Меню" className={card('MenuToggle')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        {menuOpen && (
          <div ref={menuRef} className={card('MenuDropdown', { expanded: true })}>
            <button onClick={handleDelete} className={card('MenuDeleteBtn')} aria-label="Удалить абонемент">
              Удалить
            </button>
          </div>
        )}
      </div>
      <InlineEdit hook={hook} value={sub.name} as="h3" />
      <Link to={`/subscription/${sub.id}`} className={card('Link')}>
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
