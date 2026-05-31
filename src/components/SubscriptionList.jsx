import { cn } from "@bem-react/classname";
import SubscriptionCard from "./SubscriptionCard";

const list = cn("SubscriptionList");

export default function SubscriptionList({ subscriptions, onDelete }) {
  if (subscriptions.length === 0) {
    return (
      <p className={list("Empty")}>
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
