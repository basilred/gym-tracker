import { cn } from "@bem-react/classname";
import VisitTimeline from "./VisitTimeline";

const detail = cn("SubscriptionDetail");

export default function SubscriptionDetail({ sub, onAddVisit, onDeleteVisit }) {
  const remaining = sub.totalSessions - sub.visits.length;
  const progress = (sub.visits.length / sub.totalSessions) * 100;

  return (
    <div className={detail()}>
      <h2 className={detail("Title")}>{sub.name}</h2>
      <p className={detail("Date")}>
        Начало: {new Date(sub.startDate).toLocaleDateString()}
      </p>
      <p className={detail("Remaining")}>
        Осталось {remaining} из {sub.totalSessions} занятий
      </p>

      <div className={detail("ProgressBar")}>
        <div
          className={detail("ProgressFill")}
          style={{ "--progress": `${progress}%` }}
        />
      </div>

      <div className={detail("Actions")}>
        <button
          onClick={() => onAddVisit(sub.id)}
          disabled={remaining === 0}
          className={detail("MarkBtn")}
        >
          Отметить занятие
        </button>
      </div>

      <VisitTimeline visits={sub.visits} onDeleteVisit={(visitId) => onDeleteVisit(sub.id, visitId)} />
    </div>
  );
}
