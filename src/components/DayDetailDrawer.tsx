import { useEffect, useState } from 'react';
import type { CalendarEvent, EventDraft } from '../types/event';
import { formatDate, getOmphalosDate, parseDateKey } from '../utils/date';
import { getOmphalosClockState } from '../utils/omphalosTime';
import { EventForm } from './EventForm';
import { EventList } from './EventList';

type DayDetailDrawerProps = {
  dateKey: string | null;
  now: Date;
  events: CalendarEvent[];
  specialEvents?: CalendarEvent[];
  onClose: () => void;
  onAdd: (draft: EventDraft) => void;
  onUpdate: (id: string, draft: EventDraft) => void;
  onDelete: (id: string) => void;
};

export const DayDetailDrawer = ({
  dateKey,
  now,
  events,
  specialEvents = [],
  onClose,
  onAdd,
  onUpdate,
  onDelete,
}: DayDetailDrawerProps) => {
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    setEditingEvent(null);
  }, [dateKey]);

  if (!dateKey) {
    return null;
  }

  const date = parseDateKey(dateKey);
  const omphalosDate = getOmphalosDate(date);
  const clock = getOmphalosClockState(now);

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="day-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${dateKey} 日期详情`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="drawer-header">
          <div>
            <span className="eyebrow">日期详情</span>
            <h2>{formatDate(date)}</h2>
            <p>
              {omphalosDate.month.name} 第 {omphalosDate.day} 日 / 当前 {clock.period.name} 第 {clock.mark} 刻
            </p>
          </div>
          <button type="button" className="ghost-button compact" onClick={onClose}>
            关闭
          </button>
        </header>
        <section className="drawer-section">
          <h3>当天日程</h3>
          {specialEvents.length > 0 ? <EventList events={specialEvents} /> : null}
          <EventList
            events={events}
            emptyText={specialEvents.length > 0 ? '暂无个人日程。' : '暂无日程'}
            onEdit={setEditingEvent}
            onDelete={onDelete}
          />
        </section>
        <section className="drawer-section">
          <h3>{editingEvent ? '编辑日程' : '添加日程'}</h3>
          <EventForm
            selectedDate={dateKey}
            editingEvent={editingEvent}
            onCancelEdit={() => setEditingEvent(null)}
            onSubmit={(draft, editingId) => {
              if (editingId) {
                onUpdate(editingId, draft);
                setEditingEvent(null);
              } else {
                onAdd(draft);
              }
            }}
          />
        </section>
      </aside>
    </div>
  );
};
