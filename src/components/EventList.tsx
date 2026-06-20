import type { CSSProperties } from 'react';
import type { CalendarEvent } from '../types/event';
import { getEventBorderColor, isGradientColor } from '../utils/eventColor';

type EventListProps = {
  events: CalendarEvent[];
  emptyText?: string;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
};

export const EventList = ({ events, emptyText = '暂无日程', onEdit, onDelete }: EventListProps) => {
  if (events.length === 0) {
    return <p className="empty-state">{emptyText}</p>;
  }

  return (
    <div className="event-list">
      {events.map((event) => {
        const isSystemEvent = event.id.startsWith('omphalos-day-');
        return (
        <article
          className={[
            'event-item',
            isGradientColor(event.color) ? 'has-gradient-event' : '',
            isSystemEvent ? 'system-event' : '',
          ].join(' ')}
          key={event.id}
          style={
            {
              '--event-accent': event.color,
              '--event-ring-color': getEventBorderColor(event.color),
              borderColor: getEventBorderColor(event.color),
            } as CSSProperties
          }
        >
          <div className="event-color" style={{ background: event.color }} />
          <div className="event-content">
            <div className="event-line">
              <strong>{event.title}</strong>
              <span>
                {event.startTime} - {event.endTime}
              </span>
            </div>
            {event.notes ? <p>{event.notes}</p> : null}
          </div>
          {(onEdit || onDelete) && (
            <div className="event-actions">
              {onEdit && (
                <button type="button" className="ghost-button compact" onClick={() => onEdit(event)}>
                  编辑
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="ghost-button compact danger"
                  onClick={() => onDelete(event.id)}
                >
                  删除
                </button>
              )}
            </div>
          )}
        </article>
        );
      })}
    </div>
  );
};
