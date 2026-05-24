import { useState, useRef, useEffect, useCallback } from "react";

const DELETE_THRESHOLD = 80;

function SwipeableVisit({ visit, onDelete, isFirst }) {
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
      if (e.touches.length === 1) handleStart(e.touches[0].clientX);
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 1) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();

    row.addEventListener("touchstart", onTouchStart, { passive: true });
    row.addEventListener("touchmove", onTouchMove, { passive: true });
    row.addEventListener("touchend", onTouchEnd);

    return () => {
      row.removeEventListener("touchstart", onTouchStart);
      row.removeEventListener("touchmove", onTouchMove);
      row.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  useEffect(() => {
    const onMouseMove = (e) => {
      handleMove(e.clientX);
    };
    const onMouseUp = () => {
      handleEnd();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e) => {
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
  }, [handleStart, handleMove, handleEnd]);

  const handleDelete = () => {
    if (window.confirm("Удалить это посещение?")) {
      onDelete(visit.id);
    }
  };

  return (
    <div className="mb-4 relative group" ref={rowRef}>
      {!isFirst && (
        <div
          className="absolute w-px bg-gray-300"
          style={{ left: "-16px", top: "-16px", height: "29px" }}
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
            <p className="font-medium ml-2">
              {new Date(visit.date).toLocaleDateString()}{" "}
              <span className="text-sm text-gray-500">
                {new Date(visit.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
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

export default function VisitTimeline({ visits, onDeleteVisit }) {
  if (visits.length === 0) {
    return <p className="text-center text-gray-500 mt-6">Пока нет посещений</p>;
  }

  return (
    <div className="mt-6 pl-4 max-w-md mx-auto">
      {visits
        .slice()
        .reverse()
        .map((v, i) => (
          <SwipeableVisit key={v.id} visit={v} onDelete={onDeleteVisit} isFirst={i === 0} />
        ))}
    </div>
  );
}
