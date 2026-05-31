import { cn } from "@bem-react/classname";
import { useState } from "react";

const form = cn("NewSubscriptionForm");

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
    <form onSubmit={handleSubmit} className={form()}>
      <h3 className={form("Title")}>Новый абонемент</h3>

      <input
        type="text"
        placeholder="Название (опционально)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={form("Input")}
      />

      <label className={form("Label")}>Количество занятий</label>
      <select
        value={total}
        onChange={(e) => setTotal(Number(e.target.value))}
        className={form("Select")}
      >
        <option value={8}>8 занятий</option>
        <option value={12}>12 занятий</option>
        <option value={16}>16 занятий</option>
      </select>

      <label className={form("Label")}>Дата начала</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className={form("Input")}
      />

      <button type="submit" className={form("SubmitBtn")}>
        Добавить
      </button>
    </form>
  );
}
