import { cn } from '@bem-react/classname';
import { SubscriptionList } from '@/widgets/subscription-list';
import { CreateSubscriptionForm } from '@/features/create-subscription';
import { useSubscriptions } from '@/entities/subscription';

const home = cn('Home');

export default function Home() {
  const { subscriptions } = useSubscriptions();

  return (
    <div className={home()}>
      <header>
        <h1 className={home('Title')}>Мои абонементы</h1>
      </header>
      <main>
        <SubscriptionList subscriptions={subscriptions} />
        <CreateSubscriptionForm />
      </main>
    </div>
  );
}
