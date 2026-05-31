import { cn } from "@bem-react/classname";
import { useState, useRef, useEffect, useCallback } from "react";

const visit = cn("SwipeableVisit");
const timeline = cn("VisitTimeline");

const DELETE_THRESHOLD = 80;

function SwipeableVisit({ visitData, onDelete, isLast }) {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const initialOffsetRef = useRef(0);
  const offsetRef = useRef(0);
  const contentRef = useRef(null);
  const rowRef = useRef(null);

  const updateOffset = useCallback((value) => {
    offsetRef.current = value;
    if (contentRef.current) {
      contentRef.current.style.setProperty("--swipe-offset", String(value));
    }
  }, []);

  const handleStart = useCallback(
    (clientX) => {
      startXRef.current = clientX;
      initialOffsetRef.current = offsetRef.current;
      setIsDragging(true);
    },
    []
  );

  const handleMove = useCallback(
    (clientX) => {
      const diff = startXRef.current - clientX;
      const newOffset = Math.max(
        0,
        Math.min(initialOffsetRef.current + diff, DELETE_THRESHOLD + 40)
      );
      updateOffset(newOffset);
    },
    [updateOffset]
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
      onDelete(visitData.id);
    }
  };

  const contentClass = visit("Content", { dragging: isDragging });

  return (
    <div className={visit()} ref={rowRef}>
      {!isLast && <div className={visit("Connector")} />}
      <div className={visit("Dot")} />
      <div className={visit("Wrapper")}>
        <div className={visit("DeleteBg")}>
          <button onClick={handleDelete} className={visit("DeleteBtn")}>
            Удалить
          </button>
        </div>
        <div ref={contentRef} className={contentClass}>
          <div className={visit("Row")}>
            <p className={visit("Date")}>
              {new Date(visitData.date).toLocaleDateString()}{" "}
              <span className={visit("Time")}>
                {new Date(visitData.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
            <button
              onClick={handleDelete}
              className={visit("HoverDelete")}
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
    return <p className={timeline("Empty")}>Пока нет посещений</p>;
  }

  const reversed = visits.slice().reverse();

  return (
    <div className={timeline()}>
      {reversed.map((v, i) => (
        <SwipeableVisit
          key={v.id}
          visitData={v}
          onDelete={onDeleteVisit}
          isLast={i === reversed.length - 1}
        />
      ))}
    </div>
  );
}
