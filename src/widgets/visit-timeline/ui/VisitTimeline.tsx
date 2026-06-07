import { cn } from '@bem-react/classname';
import { useState } from 'react';
import type { Visit } from '../../../entities/subscription/types';
import SwipeableVisit from './SwipeableVisit';

const timeline = cn('VisitTimeline');

interface VisitTimelineProps {
  visits: Visit[];
  onDeleteVisit: (visitId: string) => void;
  onEditVisit: (visitId: string, newDate: string) => void;
  startDate: string;
}

export default function VisitTimeline({ visits, onDeleteVisit, onEditVisit, startDate }: VisitTimelineProps) {
  const [editingVisitId, setEditingVisitId] = useState<string | null>(null);

  if (visits.length === 0) {
    return <p className={timeline('Empty')}>Пока нет посещений</p>;
  }

  const reversed = visits.slice().reverse();

  return (
    <div className={timeline()}>
      {reversed.map((v, i) => {
        const oi = visits.length - 1 - i;
        const prevDate = oi === 0 ? startDate : visits[oi - 1].date.substring(0, 10);
        const nextDate =
          oi === visits.length - 1 ? undefined : visits[oi + 1].date.substring(0, 10);
        const isEditing = editingVisitId === v.id;

        return (
          <SwipeableVisit
            key={v.id}
            visitData={v}
            onDelete={onDeleteVisit}
            isLast={i === reversed.length - 1}
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
