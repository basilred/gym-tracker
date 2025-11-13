import VisitTimeline from "./VisitTimeline";

export default function SubscriptionDetail({ sub, onAddVisit }) {
  const remaining = sub.totalSessions - sub.visits.length;
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6 mt-6">
      <h2 className="text-xl font-semibold text-center">{sub.name}</h2>
      <p className="text-center text-gray-500">
        Начало: {new Date(sub.startDate).toLocaleDateString()}
      </p>
      <p className="text-2xl text-center font-bold mt-3">
        Осталось {remaining} из {sub.totalSessions} занятий
      </p>

      <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
        <div
          className="bg-blue-500 h-3 rounded-full"
          style={{
            width: `${(sub.visits.length / sub.totalSessions) * 100}%`,
          }}
        />
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => onAddVisit(sub.id)}
          disabled={remaining === 0}
          className={`px-6 py-3 text-lg font-medium rounded-xl text-white transition ${
            remaining === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Отметить занятие
        </button>
      </div>

      <VisitTimeline visits={sub.visits} />
    </div>
  );
}
