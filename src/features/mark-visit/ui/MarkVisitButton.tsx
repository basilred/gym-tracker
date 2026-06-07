import { cn } from '@bem-react/classname';

const markBtn = cn('MarkVisitButton');

interface MarkVisitButtonProps {
  subId: string;
  remaining: number;
  onAddVisit: (id: string) => void;
}

export default function MarkVisitButton({ subId, remaining, onAddVisit }: MarkVisitButtonProps) {
  return (
    <div className={markBtn('Actions')}>
      <button
        onClick={() => onAddVisit(subId)}
        disabled={remaining === 0}
        className={markBtn('MarkBtn')}
      >
        Отметить занятие
      </button>
    </div>
  );
}
