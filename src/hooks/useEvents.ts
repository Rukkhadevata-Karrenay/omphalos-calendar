import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CalendarEvent, EventDraft } from '../types/event';

const STORAGE_KEY = 'omphalos-calendar-events-v1';

const isCalendarEvent = (value: unknown): value is CalendarEvent => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.date === 'string' &&
    typeof item.startTime === 'string' &&
    typeof item.endTime === 'string' &&
    typeof item.notes === 'string' &&
    typeof item.color === 'string'
  );
};

const createId = (): string => {
  if ('crypto' in window && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const readEvents = (): CalendarEvent[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isCalendarEvent);
  } catch {
    return [];
  }
};

export const useEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => readEvents());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = useCallback((draft: EventDraft) => {
    setEvents((current) =>
      [...current, { ...draft, id: createId() }].sort((left, right) =>
        `${left.date}${left.startTime}`.localeCompare(`${right.date}${right.startTime}`),
      ),
    );
  }, []);

  const updateEvent = useCallback((id: string, draft: EventDraft) => {
    setEvents((current) =>
      current
        .map((event) => (event.id === id ? { ...draft, id } : event))
        .sort((left, right) =>
          `${left.date}${left.startTime}`.localeCompare(`${right.date}${right.startTime}`),
        ),
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((current) => current.filter((event) => event.id !== id));
  }, []);

  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      grouped.set(event.date, [...(grouped.get(event.date) ?? []), event]);
    }
    return grouped;
  }, [events]);

  return {
    events,
    eventsByDate,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
