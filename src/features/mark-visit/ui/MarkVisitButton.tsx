import { cn } from '@bem-react/classname';

const detail = cn('SubscriptionDetail');

interface MarkVisitButtonProps {
  subId: string;
  remaining: number;
  onAddVisit: (id: string) => void;
}

export default function MarkVisitButton({ subId, remaining, onAddVisit }: MarkVisitButtonProps) {
  return (
    <div className={detail('Actions')}>
      <button
        onClick={() => onAddVisit(subId)}
        disabled={remaining === 0}
        className={detail('MarkBtn')}
      >
        Отметить занятие
      </button>
    </div>
  );
}
