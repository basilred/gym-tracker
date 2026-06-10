import { cn } from '@bem-react/classname';
import { useState } from 'react';
import { useSubscriptions } from '@/entities/subscription';

const form = cn('NewSubscriptionForm');

function getTodayLocal(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function NewSubscriptionForm() {
  const { addSubscription } = useSubscriptions();
  const [name, setName] = useState('');
  const [total, setTotal] = useState(12);
  const [startDate, setStartDate] = useState(getTodayLocal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSubscription(name, total, startDate);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className={form()}>
      <h2 className={form('Title')}>Новый абонемент</h2>

      <label htmlFor="subscription-name" className={form('Label')}>Название абонемента</label>
      <input
        id="subscription-name"
        type="text"
        placeholder="Название (опционально)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={form('Input')}
      />

      <label htmlFor="subscription-total" className={form('Label')}>Количество занятий</label>
      <select
        id="subscription-total"
        value={total}
        onChange={(e) => setTotal(Number(e.target.value))}
        className={form('Select')}
      >
        <option value={8}>8 занятий</option>
        <option value={12}>12 занятий</option>
        <option value={16}>16 занятий</option>
      </select>

      <label htmlFor="subscription-start" className={form('Label')}>Дата начала</label>
      <input
        id="subscription-start"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className={form('Input')}
      />

      <button type="submit" className={form('SubmitBtn')}>
        Добавить
      </button>
    </form>
  );
}
