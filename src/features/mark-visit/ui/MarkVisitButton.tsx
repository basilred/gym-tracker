import { cn } from '@bem-react/classname';
import { useSubscriptions } from '@/entities/subscription';

const markBtn = cn('MarkVisitButton');

interface MarkVisitButtonProps {
  subId: string;
}

export default function MarkVisitButton({ subId }: MarkVisitButtonProps) {
  const { getSubscription, addVisit } = useSubscriptions();
  const sub = getSubscription(subId);
  const remaining = sub ? sub.totalSessions - sub.visits.length : 0;

  return (
    <div className={markBtn('Actions')}>
      <button
        onClick={() => addVisit(subId)}
        disabled={remaining === 0}
        className={markBtn('MarkBtn')}
      >
        Отметить занятие
      </button>
    </div>
  );
}
