import { useSubscriptions } from "../hooks/useSubscriptions";
import SubscriptionList from "../components/SubscriptionList";
import NewSubscriptionForm from "../components/NewSubscriptionForm";

export default function Home() {
  const { subscriptions, addSubscription } = useSubscriptions();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Мои абонементы</h1>
      <SubscriptionList subscriptions={subscriptions} />
      <NewSubscriptionForm onAdd={addSubscription} />
    </div>
  );
}
