export default function VisitTimeline({ visits }) {
  if (visits.length === 0) {
    return <p className="text-center text-gray-500 mt-6">Пока нет посещений</p>;
  }

  return (
    <div className="mt-6 border-l border-gray-300 pl-4 max-w-md mx-auto">
      {visits
        .slice()
        .reverse()
        .map((v) => (
          <div key={v.id} className="mb-4 relative">
            <div className="w-3 h-3 bg-blue-500 rounded-full absolute -left-[14px] -top-[-6px]" />
            <p className="font-medium">
              {new Date(v.date).toLocaleDateString()}{" "}
              <span className="text-sm text-gray-500">
                {new Date(v.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>
        ))}
    </div>
  );
}
