import { cn } from '@bem-react/classname';
import { useParams, Link } from 'react-router-dom';
import { SubscriptionDetail } from '@/widgets/subscription-detail';
import { useSubscriptions } from '@/entities/subscription';

const page = cn('SubscriptionPage');

export default function SubscriptionPage() {
  const { id } = useParams<{ id: string }>();
  const { getSubscription } = useSubscriptions();
  const sub = id ? getSubscription(id) : undefined;

  if (!sub || !id) {
    return (
      <div className={page('NotFound')}>
        <p>Абонемент не найден.</p>
        <Link to="/" className={page('BackLink')}>
          ← Вернуться назад
        </Link>
      </div>
    );
  }

  return (
    <div className={page()}>
      <header>
        <Link to="/" className={page('BackLink')} aria-label="Вернуться на главную">
          ← Назад
        </Link>
      </header>
      <main>
        <SubscriptionDetail subId={id} />
      </main>
    </div>
  );
}
