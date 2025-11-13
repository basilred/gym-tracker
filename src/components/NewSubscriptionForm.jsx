import { useState } from "react";

export default function NewSubscriptionForm({ onAdd }) {
  const [name, setName] = useState("");
  const [total, setTotal] = useState(12);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(name, total, startDate);
    setName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-4 shadow mt-6 max-w-md mx-auto"
    >
      <h3 className="text-lg font-semibold mb-3 text-center">
        Новый абонемент
      </h3>
      <input
        type="text"
        placeholder="Название (опционально)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <label className="block mb-1">Количество занятий</label>
      <select
        value={total}
        onChange={(e) => setTotal(Number(e.target.value))}
        className="w-full border p-2 rounded mb-3"
      >
        <option value={8}>8 занятий</option>
        <option value={12}>12 занятий</option>
        <option value={16}>16 занятий</option>
      </select>

      <label className="block mb-1">Дата начала</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
      >
        Добавить
      </button>
    </form>
  );
}
