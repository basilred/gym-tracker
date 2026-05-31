import { cn } from "@bem-react/classname";
import { useSubscriptions } from "../hooks/useSubscriptions";
import SubscriptionList from "../components/SubscriptionList";
import NewSubscriptionForm from "../components/NewSubscriptionForm";

const home = cn("Home");

export default function Home() {
  const { subscriptions, addSubscription, deleteSubscription } = useSubscriptions();

  return (
    <div className={home()}>
      <h1 className={home("Title")}>Мои абонементы</h1>
      <SubscriptionList subscriptions={subscriptions} onDelete={deleteSubscription} />
      <NewSubscriptionForm onAdd={addSubscription} />
    </div>
  );
}
