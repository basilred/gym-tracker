import { cn } from '@bem-react/classname';
import { useMemo } from 'react';
import type { Subscription } from '@/entities/subscription';
import { calcSubscriptionStats } from '@/shared/lib/calcSubscriptionStats';
import { pluralize } from '@/shared/lib/pluralize';
import './SubscriptionStats.css';

const stats = cn('SubscriptionStats');

interface SubscriptionStatsProps {
  subscription: Subscription;
}

export default function SubscriptionStats({ subscription }: SubscriptionStatsProps) {
  const { frequency, daysSinceLastVisit, predictedEndDate, longestGapDays } = useMemo(
    () => calcSubscriptionStats(subscription),
    [subscription],
  );

  const frequencyText = frequency > 0
    ? `${pluralize(frequency, 'раз', 'раза', 'раз')} в неделю`
    : 'Нет посещений';

  const daysSinceText = daysSinceLastVisit !== null
    ? pluralize(daysSinceLastVisit, 'день', 'дня', 'дней') + ' назад'
    : null;

  const predictedText = predictedEndDate
    ? `~${new Date(predictedEndDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`
    : null;

  const gapText = longestGapDays !== null
    ? `Макс. перерыв: ${pluralize(longestGapDays, 'день', 'дня', 'дней')}`
    : null;

  return (
    <div className={stats()}>
      <p className={stats('Item')}>
        <span className={stats('Label')}>Частота:</span>{' '}
        <span className={stats('Value')}>{frequencyText}</span>
      </p>
      {daysSinceText && (
        <p className={stats('Item')}>
          <span className={stats('Label')}>Последний:</span>{' '}
          <span className={stats('Value')}>{daysSinceText}</span>
        </p>
      )}
      {predictedText && (
        <p className={stats('Item')}>
          <span className={stats('Label')}>Прогноз:</span>{' '}
          <span className={stats('Value')}>{predictedText}</span>
        </p>
      )}
      {gapText && (
        <p className={stats('Item')}>
          <span className={stats('Value')}>{gapText}</span>
        </p>
      )}
    </div>
  );
}
