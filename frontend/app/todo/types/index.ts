export type TodoCategory =
  | 'food'
  | 'attraction'
  | 'cafe'
  | 'shopping'
  | 'transport'
  | 'accommodation'
  | 'other';

export interface TodoItem {
  id: string;
  category: TodoCategory;
  name: string;
  address: string;
  mapUrl: string;
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:mm
  memo: string;
  completed: boolean;
}
