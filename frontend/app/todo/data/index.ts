import { TodoCategory, TodoItem } from '../types';

export const CATEGORY_LABELS: Record<TodoCategory, string> = {
  food: '음식',
  attraction: '관광',
  cafe: '카페',
  shopping: '쇼핑',
  transport: '교통',
  accommodation: '숙소',
  other: '기타',
};

export const CATEGORY_COLORS: Record<TodoCategory, string> = {
  food: '#FF6B6B',
  attraction: '#4ECDC4',
  cafe: '#A78BFA',
  shopping: '#F59E0B',
  transport: '#3B82F6',
  accommodation: '#10B981',
  other: '#6B7280',
};

export const CATEGORY_BG: Record<TodoCategory, string> = {
  food: '#FFF5F5',
  attraction: '#F0FDFB',
  cafe: '#F5F3FF',
  shopping: '#FFFBEB',
  transport: '#EFF6FF',
  accommodation: '#F0FDF4',
  other: '#F9FAFB',
};

export const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as TodoCategory[]).map((cat) => ({
  label: CATEGORY_LABELS[cat],
  value: cat,
  color: CATEGORY_COLORS[cat],
  backgroundColor: CATEGORY_BG[cat],
  borderColor: CATEGORY_COLORS[cat] + '40',
}));

