import { cn } from "@bem-react/classname";
import { useParams, Link } from "react-router-dom";
import { useSubscriptions } from "../hooks/useSubscriptions";
import SubscriptionDetail from "../components/SubscriptionDetail";

const page = cn("SubscriptionPage");

export default function SubscriptionPage() {
  const { id } = useParams();
  const { getSubscription, addVisit, removeVisit } = useSubscriptions();
  const sub = getSubscription(id);

  if (!sub) {
    return (
      <div className={page("NotFound")}>
        <p>Абонемент не найден.</p>
        <Link to="/" className={page("BackLink")}>
          ← Вернуться назад
        </Link>
      </div>
    );
  }

  return (
    <div className={page()}>
      <Link to="/" className={page("BackLink")}>
        ← Назад
      </Link>
      <SubscriptionDetail sub={sub} onAddVisit={addVisit} onDeleteVisit={removeVisit} />
    </div>
  );
}
