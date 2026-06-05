import { cn } from '@bem-react/classname';
import { useParams, Link } from 'react-router-dom';
import { useSubscriptions } from '../../../entities/subscription';
import { SubscriptionDetail } from '../../../widgets/subscription-detail';

const page = cn('SubscriptionPage');

export default function SubscriptionPage() {
  const { id } = useParams<{ id: string }>();
  const { getSubscription, addVisit, removeVisit, editVisit } = useSubscriptions();
  const sub = id ? getSubscription(id) : undefined;

  if (!sub) {
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
        <Link to="/" className={page('BackLink')} aria-label="Вернуться на главную">
          ← Назад
        </Link>
      <SubscriptionDetail sub={sub} onAddVisit={addVisit} onDeleteVisit={removeVisit} onEditVisit={editVisit} />
    </div>
  );
}
