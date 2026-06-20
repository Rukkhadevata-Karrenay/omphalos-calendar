export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
  color: string;
};

export type EventDraft = Omit<CalendarEvent, 'id'>;
