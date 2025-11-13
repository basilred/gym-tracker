import SubscriptionCard from "./SubscriptionCard";

export default function SubscriptionList({ subscriptions, onDelete }) {
  if (subscriptions.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        Пока нет абонементов. Создайте первый!
      </p>
    );
  }

  return (
    <div className="grid gap-4 mt-4">
      {subscriptions.map((sub) => (
        <SubscriptionCard key={sub.id} sub={sub} onDelete={onDelete} />
      ))}
    </div>
  );
}
