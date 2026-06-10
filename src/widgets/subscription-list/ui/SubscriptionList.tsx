import { cn } from '@bem-react/classname';
import { SubscriptionCard } from '@/widgets/subscription-card';
import type { Subscription } from '@/entities/subscription';

const list = cn('SubscriptionList');

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

export default function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <p className={list('Empty')}>
        Пока нет абонементов. Создайте первый!
      </p>
    );
  }

  return (
    <ul className={list()}>
      {subscriptions.map((sub) => (
        <li key={sub.id} className={list('Item')}><SubscriptionCard sub={sub} /></li>
      ))}
    </ul>
  );
}
