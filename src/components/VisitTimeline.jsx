import { useState, useRef, useEffect, useCallback } from "react";

const DELETE_THRESHOLD = 80;

function SwipeableVisit({
  visit,
  onDelete,
  onEdit,
  minDate,
  maxDate,
  isLast,
  isEditing,
  onStartEdit,
  onStopEdit,
}) {
  const [offset, setOffset] = useState(0);
  const startXRef = useRef(0);
  const initialOffsetRef = useRef(0);
  const offsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const rowRef = useRef(null);

  const handleStart = useCallback((clientX) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    initialOffsetRef.current = offsetRef.current;
  }, []);

  const handleMove = useCallback((clientX) => {
    if (!isDraggingRef.current) return;
    const diff = startXRef.current - clientX;
    const newOffset = Math.max(
      0,
      Math.min(initialOffsetRef.current + diff, DELETE_THRESHOLD + 40)
    );
    offsetRef.current = newOffset;
    setOffset(newOffset);
  }, []);

  const handleEnd = useCallback(() => {
    isDraggingRef.current = false;
    if (offsetRef.current > DELETE_THRESHOLD) {
      offsetRef.current = DELETE_THRESHOLD + 20;
      setOffset(DELETE_THRESHOLD + 20);
    } else {
      offsetRef.current = 0;
      setOffset(0);
    }
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const onTouchStart = (e) => {
      if (isEditing) return;
      if (e.touches.length === 1) handleStart(e.touches[0].clientX);
    };
    const onTouchMove = (e) => {
      if (isEditing) return;
      if (e.touches.length === 1) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => {
      if (isEditing) return;
      handleEnd();
    };

    row.addEventListener("touchstart", onTouchStart, { passive: true });
    row.addEventListener("touchmove", onTouchMove, { passive: true });
    row.addEventListener("touchend", onTouchEnd);

    return () => {
      row.removeEventListener("touchstart", onTouchStart);
      row.removeEventListener("touchmove", onTouchMove);
      row.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleStart, handleMove, handleEnd, isEditing]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (isEditing) return;
      handleMove(e.clientX);
    };
    const onMouseUp = () => {
      if (isEditing) return;
      handleEnd();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e) => {
      if (isEditing) return;
      handleStart(e.clientX);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const row = rowRef.current;
    if (!row) return;

    row.addEventListener("mousedown", onMouseDown);

    return () => {
      row.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [handleStart, handleMove, handleEnd, isEditing]);

  const handleDelete = () => {
    if (window.confirm("Удалить это посещение?")) {
      onDelete(visit.id);
    }
  };

  return (
    <div className="mb-4 relative group" ref={rowRef}>
      {!isLast && (
        <div
          className="absolute w-px bg-gray-300"
          style={{
            left: "calc(-18px + 5.5px)",
            top: "19px",
            bottom: "-23px",
          }}
        />
      )}
      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[18px] top-[7px]" />
      <div className="overflow-hidden rounded-lg">
        <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center bg-red-500 rounded-lg">
          <button
            onClick={handleDelete}
            className="w-full h-full text-white font-medium text-sm cursor-pointer"
          >
            Удалить
          </button>
        </div>
        <div
          className="relative bg-white"
          style={{
            transform: `translateX(-${offset}px)`,
            transition:
              offset === 0 || offset >= DELETE_THRESHOLD + 20
                ? "transform 0.2s ease"
                : "none",
          }}
        >
          <div className="flex items-center justify-between pr-2">
            {isEditing ? (
              <input
                type="date"
                defaultValue={visit.date.substring(0, 10)}
                min={minDate}
                max={maxDate}
                className="font-medium ml-2 border border-blue-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:border-blue-500"
                autoFocus
                onChange={(e) => {
                  onEdit(visit.id, e.target.value);
                }}
                onBlur={() => {
                  onStopEdit();
                }}
              />
            ) : (
              <p
                className="font-medium ml-2 cursor-pointer"
                onClick={() => onStartEdit()}
              >
                {new Date(visit.date).toLocaleDateString()}{" "}
                <span className="text-sm text-gray-500">
                  {new Date(visit.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            )}
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 px-2 text-lg leading-none transition-opacity cursor-pointer"
              title="Удалить"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VisitTimeline({ visits, onDeleteVisit, onEditVisit, startDate }) {
  const [editingVisitId, setEditingVisitId] = useState(null);

  if (visits.length === 0) {
    return <p className="text-center text-gray-500 mt-6">Пока нет посещений</p>;
  }

  return (
    <div className="mt-6 pl-4 max-w-md mx-auto">
      {visits
        .slice()
        .reverse()
        .map((v, i) => {
          const oi = visits.length - 1 - i;
          const prevDate = oi === 0 ? startDate : visits[oi - 1].date.substring(0, 10);
          const nextDate = oi === visits.length - 1 ? undefined : visits[oi + 1].date.substring(0, 10);
          const isEditing = editingVisitId === v.id;

          return (
            <SwipeableVisit
              key={v.id}
              visit={v}
              onDelete={onDeleteVisit}
              isLast={i === visits.length - 1}
              isEditing={isEditing}
              onStartEdit={() => setEditingVisitId(v.id)}
              onStopEdit={() => setEditingVisitId(null)}
              onEdit={(visitId, newDate) => {
                onEditVisit(visitId, newDate);
                setEditingVisitId(null);
              }}
              minDate={prevDate}
              maxDate={nextDate}
            />
          );
        })}
    </div>
  );
}
