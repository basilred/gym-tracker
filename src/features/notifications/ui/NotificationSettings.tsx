import { cn } from '@bem-react/classname';
import { useState, useEffect } from 'react';
import type { NotificationSettings as Settings } from '../model/types';
import { useNotifications } from '../model/useNotifications';
import './NotificationSettings.css';

const ns = cn('NotificationSettings');

interface NotificationSettingsProps {
  onClose: () => void;
}

export default function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const { settings, updateSettings, permission, requestPermission } = useNotifications();
  const [draft, setDraft] = useState<Settings>(settings);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(draft);
    onClose();
  };

  const handleToggle = (key: 'enabled' | 'stale' | 'expired' | 'almost-finished' | 'milestone') => {
    if (key === 'enabled') {
      setDraft((prev) => ({ ...prev, enabled: !prev.enabled }));
    } else {
      setDraft((prev) => ({
        ...prev,
        types: { ...prev.types, [key]: !prev.types[key] },
      }));
    }
  };

  return (
    <div className={ns('Overlay')} onClick={onClose} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }} role="presentation">
      <div className={ns('Modal')} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} role="presentation">
        <h2 className={ns('Title')}>Настройки уведомлений</h2>

        <div className={ns('Field')}>
          <span className={ns('Label')}>Уведомления</span>
          <button
            className={ns('Toggle', { active: draft.enabled })}
            onClick={() => handleToggle('enabled')}
            aria-label="Включить уведомления"
          >
            <span className={ns('ToggleKnob')} />
          </button>
        </div>

        <div className={ns('Field')}>
          <span className={ns('Label')}>Порог дней (старость)</span>
          <input
            className={ns('Input')}
            type="number"
            min={1}
            max={90}
            value={draft.staleThresholdDays}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, staleThresholdDays: Number(e.target.value) }))
            }
            aria-label="Порог дней для определения заброшенного абонемента"
          />
        </div>

        <div className={ns('Field')}>
          <span className={ns('Label')}>Заброшен</span>
          <button
            className={ns('Toggle', { active: draft.types.stale })}
            onClick={() => handleToggle('stale')}
            aria-label="Уведомлять о заброшенных абонементах"
          >
            <span className={ns('ToggleKnob')} />
          </button>
        </div>

        <div className={ns('Field')}>
          <span className={ns('Label')}>Закончен</span>
          <button
            className={ns('Toggle', { active: draft.types.expired })}
            onClick={() => handleToggle('expired')}
            aria-label="Уведомлять о законченных абонементах"
          >
            <span className={ns('ToggleKnob')} />
          </button>
        </div>

        <div className={ns('Field')}>
          <span className={ns('Label')}>Скоро закончится</span>
          <button
            className={ns('Toggle', { active: draft.types['almost-finished'] })}
            onClick={() => handleToggle('almost-finished')}
            aria-label="Уведомлять о скоро заканчивающихся абонементах"
          >
            <span className={ns('ToggleKnob')} />
          </button>
        </div>

        <div className={ns('Field')}>
          <span className={ns('Label')}>Достижения</span>
          <button
            className={ns('Toggle', { active: draft.types.milestone })}
            onClick={() => handleToggle('milestone')}
            aria-label="Уведомлять о достижениях"
          >
            <span className={ns('ToggleKnob')} />
          </button>
        </div>

        {permission === 'denied' && (
          <div className={ns('PermissionNote')}>
            Уведомления заблокированы в настройках браузера. Разрешите их вручную.
          </div>
        )}

        {permission !== 'granted' && permission !== 'denied' && (
          <div className={ns('Field')}>
            <span className={ns('Label')}>Разрешить уведомления</span>
            <button
              className={ns('Button')}
              onClick={requestPermission}
            >
              Запросить
            </button>
          </div>
        )}

        <div className={ns('Actions')}>
          <button className={ns('Button')} onClick={onClose}>Отмена</button>
          <button className={ns('Button', { primary: true })} onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
}
