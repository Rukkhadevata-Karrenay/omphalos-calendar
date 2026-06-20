export type EventColorOption = {
  label: string;
  value: string;
};

export const EVENT_COLOR_OPTIONS: EventColorOption[] = [
  { label: '红', value: '#df5959' },
  { label: '绿', value: '#74d28a' },
  { label: '蓝', value: '#69a8ff' },
  { label: '紫', value: '#a477ff' },
  { label: '粉', value: '#ff7ebd' },
  { label: '黄紫渐变', value: 'linear-gradient(to bottom right, #ffe66d 0%, #8f5cff 100%)' },
  { label: '白', value: '#fff7e8' },
];

export const DEFAULT_EVENT_COLOR = EVENT_COLOR_OPTIONS[0].value;
