import { cn } from '@bem-react/classname';
import { useSubscriptions } from '../../../entities/subscription';
import { SubscriptionList } from '../../../widgets/subscription-list';
import CreateSubscriptionForm from '../../../features/create-subscription/ui/NewSubscriptionForm';

const home = cn('Home');

export default function Home() {
  const { subscriptions, addSubscription, deleteSubscription } = useSubscriptions();

  return (
    <div className={home()}>
      <h1 className={home('Title')}>Мои абонементы</h1>
      <SubscriptionList subscriptions={subscriptions} onDelete={deleteSubscription} />
      <CreateSubscriptionForm onAdd={addSubscription} />
    </div>
  );
}
