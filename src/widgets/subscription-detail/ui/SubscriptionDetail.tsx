import { cn } from '@bem-react/classname';
import { VisitTimeline } from '../../visit-timeline';
import { MarkVisitButton } from '../../../features/mark-visit';
import type { Subscription } from '../../../entities/subscription/types';
import { calcProgress } from '../../../entities/subscription/lib/calcProgress';

const detail = cn('SubscriptionDetail');

interface SubscriptionDetailProps {
  sub: Subscription;
  onAddVisit: (id: string) => void;
  onDeleteVisit: (subId: string, visitId: string) => void;
  onEditVisit: (subId: string, visitId: string, newDate: string) => void;
}

export default function SubscriptionDetail({ sub, onAddVisit, onDeleteVisit, onEditVisit }: SubscriptionDetailProps) {
  const remaining = sub.totalSessions - sub.visits.length;
  const progress = calcProgress(sub.visits.length, sub.totalSessions);

  return (
    <div className={detail()}>
      <h2 className={detail('Title')}>{sub.name}</h2>
      <p className={detail('Date')}>
        Начало: {new Date(sub.startDate).toLocaleDateString()}
      </p>
      <p className={detail('Remaining')}>
        Осталось {remaining} из {sub.totalSessions} занятий
      </p>

      <div className={detail('ProgressBar')}>
        <div
          className={detail('ProgressFill')}
          style={{ '--progress': `${progress}%` } as React.CSSProperties}
        />
      </div>

      <MarkVisitButton subId={sub.id} remaining={remaining} onAddVisit={onAddVisit} />

      <VisitTimeline
        visits={sub.visits}
        onDeleteVisit={(visitId: string) => onDeleteVisit(sub.id, visitId)}
        onEditVisit={(visitId: string, newDate: string) => onEditVisit(sub.id, visitId, newDate)}
        startDate={sub.startDate}
      />
    </div>
  );
}
