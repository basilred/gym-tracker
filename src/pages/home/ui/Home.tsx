import { cn } from '@bem-react/classname';
import { useState } from 'react';
import { SubscriptionList } from '@/widgets/subscription-list';
import { CreateSubscriptionForm } from '@/features/create-subscription';
import { NotificationSettings } from '@/features/notifications';
import { useSubscriptions } from '@/entities/subscription';

const home = cn('Home');

export default function Home() {
  const { subscriptions } = useSubscriptions();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={home()}>
      <header>
        <h1 className={home('Title')}>Мои абонементы</h1>
        <button
          onClick={() => setShowSettings(true)}
          aria-label="Настройки уведомлений"
          style={{
            background: 'none',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'block',
            margin: '0 auto 1rem',
          }}
        >
          Уведомления
        </button>
      </header>
      <main>
        <SubscriptionList subscriptions={subscriptions} />
        <CreateSubscriptionForm />
      </main>
      {showSettings && <NotificationSettings onClose={() => setShowSettings(false)} />}
    </div>
  );
}
