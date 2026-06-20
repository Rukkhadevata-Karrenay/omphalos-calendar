import { useEffect, useState } from 'react';
import { DEFAULT_EVENT_COLOR, EVENT_COLOR_OPTIONS } from '../data/eventColors';
import type { CalendarEvent, EventDraft } from '../types/event';
import { isGradientColor } from '../utils/eventColor';

type EventFormProps = {
  selectedDate: string;
  editingEvent: CalendarEvent | null;
  onSubmit: (draft: EventDraft, editingId: string | null) => void;
  onCancelEdit: () => void;
};

const createInitialDraft = (date: string): EventDraft => ({
  title: '',
  date,
  startTime: '09:00',
  endTime: '10:00',
  notes: '',
  color: DEFAULT_EVENT_COLOR,
});

export const EventForm = ({
  selectedDate,
  editingEvent,
  onSubmit,
  onCancelEdit,
}: EventFormProps) => {
  const [draft, setDraft] = useState<EventDraft>(() => createInitialDraft(selectedDate));

  useEffect(() => {
    setDraft(editingEvent ?? createInitialDraft(selectedDate));
  }, [editingEvent, selectedDate]);

  const updateField = <Key extends keyof EventDraft>(key: Key, value: EventDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const getSwatchBackground = (color: string) =>
    isGradientColor(color)
      ? 'linear-gradient(135deg, #ffe66d 0 49.5%, #8f5cff 50.5% 100%)'
      : color;

  return (
    <form
      className="event-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(
          {
            ...draft,
            title: draft.title.trim(),
            notes: draft.notes.trim(),
          },
          editingEvent?.id ?? null,
        );
        if (!editingEvent) {
          setDraft(createInitialDraft(selectedDate));
        }
      }}
    >
      <div className="form-grid">
        <label>
          标题
          <input
            required
            value={draft.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="例如：模拟宇宙复盘"
          />
        </label>
        <label>
          日期
          <input
            required
            type="date"
            value={draft.date}
            onChange={(event) => updateField('date', event.target.value)}
          />
        </label>
        <label>
          开始时间
          <input
            required
            type="time"
            value={draft.startTime}
            onChange={(event) => updateField('startTime', event.target.value)}
          />
        </label>
        <label>
          结束时间
          <input
            required
            type="time"
            value={draft.endTime}
            onChange={(event) => updateField('endTime', event.target.value)}
          />
        </label>
      </div>
      <label>
        备注
        <textarea
          value={draft.notes}
          onChange={(event) => updateField('notes', event.target.value)}
          placeholder="写下要记住的线索、地点或待办。"
        />
      </label>
      <fieldset className="color-field">
        <legend>颜色标签</legend>
        <div className="color-options">
          {EVENT_COLOR_OPTIONS.map((color) => (
            <button
              aria-label={`选择颜色 ${color.label}`}
              className={[
                'color-swatch',
                draft.color === color.value ? 'selected' : '',
                isGradientColor(color.value) ? 'split-swatch' : '',
              ].join(' ')}
              key={color.value}
              onClick={() => updateField('color', color.value)}
              style={{ background: getSwatchBackground(color.value) }}
              type="button"
              title={color.label}
            >
              <span>{color.label}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <div className="form-actions">
        {editingEvent ? (
          <button type="button" className="ghost-button" onClick={onCancelEdit}>
            取消编辑
          </button>
        ) : null}
        <button type="submit" className="primary-button">
          {editingEvent ? '保存修改' : '添加日程'}
        </button>
      </div>
    </form>
  );
};
