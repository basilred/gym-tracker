import { cn } from '@bem-react/classname';
import { SubscriptionCard } from '../../subscription-card';
import type { Subscription } from '../../../entities/subscription/types';

const list = cn('SubscriptionList');

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onDelete: (id: string) => void;
}

export default function SubscriptionList({ subscriptions, onDelete }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <p className={list('Empty')}>
        Пока нет абонементов. Создайте первый!
      </p>
    );
  }

  return (
    <div className={list()}>
      {subscriptions.map((sub) => (
        <SubscriptionCard key={sub.id} sub={sub} onDelete={onDelete} />
      ))}
    </div>
  );
}
