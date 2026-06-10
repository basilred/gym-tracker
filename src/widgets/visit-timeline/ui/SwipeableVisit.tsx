import { cn } from '@bem-react/classname';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { Visit } from '@/entities/subscription';

const visit = cn('SwipeableVisit');

const DELETE_THRESHOLD = 80;

interface SwipeableVisitProps {
  visitData: Visit;
  onDelete: (id: string) => void;
  onEdit: (visitId: string, newDate: string) => void;
  isLast: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  minDate: string;
  maxDate?: string;
}

export default function SwipeableVisit({
  visitData,
  onDelete,
  onEdit,
  isLast,
  isEditing,
  onStartEdit,
  onStopEdit,
  minDate,
  maxDate,
}: SwipeableVisitProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const initialOffsetRef = useRef(0);
  const offsetRef = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const wasSwipingRef = useRef(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const updateOffset = useCallback((value: number) => {
    offsetRef.current = value;
    if (contentRef.current) {
      contentRef.current.style.setProperty('--swipe-offset', String(value));
    }
  }, []);

  const handleStart = useCallback(
    (clientX: number) => {
      if (isEditing) return;
      startXRef.current = clientX;
      initialOffsetRef.current = offsetRef.current;
      wasSwipingRef.current = false;
      setIsDragging(true);
    },
    [isEditing]
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (isEditing) return;
      const diff = startXRef.current - clientX;
      if (Math.abs(diff) > 5) {
        wasSwipingRef.current = true;
      }
      const newOffset = Math.max(
        0,
        Math.min(initialOffsetRef.current + diff, DELETE_THRESHOLD + 40)
      );
      updateOffset(newOffset);
    },
    [isEditing, updateOffset]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    if (offsetRef.current > DELETE_THRESHOLD) {
      updateOffset(DELETE_THRESHOLD + 20);
    } else {
      updateOffset(0);
    }
  }, [updateOffset]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const onTouchStart = (e: TouchEvent) => {
      if (isEditing) return;
      if (e.touches.length === 1) handleStart(e.touches[0].clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isEditing) return;
      if (e.touches.length === 1) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();

    row.addEventListener('touchstart', onTouchStart, { passive: true });
    row.addEventListener('touchmove', onTouchMove, { passive: true });
    row.addEventListener('touchend', onTouchEnd);

    return () => {
      row.removeEventListener('touchstart', onTouchStart);
      row.removeEventListener('touchmove', onTouchMove);
      row.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleStart, handleMove, handleEnd, isEditing]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isEditing) return;
      handleMove(e.clientX);
    };
    const onMouseUp = () => {
      if (isEditing) return;
      handleEnd();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (isEditing) return;
      handleStart(e.clientX);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const row = rowRef.current;
    if (!row) return;

    row.addEventListener('mousedown', onMouseDown);

    return () => {
      row.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleStart, handleMove, handleEnd, isEditing]);

  const handleDelete = () => {
    if (window.confirm('Удалить это посещение?')) {
      onDelete(visitData.id);
    }
  };

  useEffect(() => {
    if (isEditing && dateInputRef.current) {
      dateInputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      handleDelete();
    } else if (e.key === 'Escape') {
      updateOffset(0);
      setIsDragging(false);
    }
  };

  const contentClass = visit('Content', { dragging: isDragging });

  /* eslint-disable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions */
  return (
    <div
      className={visit()}
      ref={rowRef}
      tabIndex={0}
      role="group"
      aria-label={`Посещение от ${new Date(visitData.date).toLocaleDateString()}`}
      onKeyDown={handleKeyDown}
    >
      {!isLast && <div className={visit('Connector')} />}
      <div className={visit('Dot')} />
      <div className={visit('Wrapper')}>
        <div className={visit('DeleteBg')}>
          <button onClick={handleDelete} className={visit('DeleteBtn')}>
            Удалить
          </button>
        </div>
        <div ref={contentRef} className={contentClass}>
          <div className={visit('Row')}>
            {isEditing ? (
              <input
                type="date"
                defaultValue={visitData.date.substring(0, 10)}
                min={minDate}
                max={maxDate}
                className={visit('DateInput')}
                ref={dateInputRef}
                onChange={(e) => {
                  onEdit(visitData.id, e.target.value);
                }}
                onBlur={() => {
                  onStopEdit();
                }}
              />
            ) : (
              <button
                className={visit('Date')}
                onClick={() => {
                  if (wasSwipingRef.current) {
                    wasSwipingRef.current = false;
                    return;
                  }
                  onStartEdit();
                }}
              >
                {new Date(visitData.date).toLocaleDateString()}{' '}
                <span className={visit('Time')}>
                  {new Date(visitData.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </button>
            )}
            <button
              onClick={handleDelete}
              className={visit('HoverDeleteBtn')}
              aria-label="Удалить посещение"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions */
}
