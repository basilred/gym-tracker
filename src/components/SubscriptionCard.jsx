import { Link } from "react-router-dom";

export default function SubscriptionCard({ sub }) {
  const remaining = sub.totalSessions - sub.visits.length;
  const progress = (sub.visits.length / sub.totalSessions) * 100;

  return (
    <Link
      to={`/subscription/${sub.id}`}
      className="block bg-white rounded-2xl shadow p-4 hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold">{sub.name}</h3>
      <p className="text-sm text-gray-500">
        С {new Date(sub.startDate).toLocaleDateString()}
      </p>

      <div className="mt-2 text-sm font-medium">
        Осталось {remaining} из {sub.totalSessions} занятий
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Link>
  );
}
