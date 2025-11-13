import { useParams, Link } from "react-router-dom";
import { useSubscriptions } from "../hooks/useSubscriptions";
import SubscriptionDetail from "../components/SubscriptionDetail";

export default function SubscriptionPage() {
  const { id } = useParams();
  const { getSubscription, addVisit } = useSubscriptions();
  const sub = getSubscription(id);

  if (!sub) {
    return (
      <div className="p-6 text-center">
        <p>Абонемент не найден.</p>
        <Link to="/" className="text-blue-500 underline">
          ← Вернуться назад
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link to="/" className="text-blue-500 underline text-sm">
        ← Назад
      </Link>
      <SubscriptionDetail sub={sub} onAddVisit={addVisit} />
    </div>
  );
}
