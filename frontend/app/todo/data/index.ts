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

export const INITIAL_TODOS: TodoItem[] = [
  {
    id: '1',
    category: 'attraction',
    name: '도이수텝 사원',
    address: 'Doi Suthep, Mueang Chiang Mai District, Chiang Mai 50200',
    mapUrl: '',
    visitDate: '2026-05-02',
    visitTime: '09:00',
    memo: '치앙마이 대표 사원. 케이블카 이용 가능. 입장 시 긴 바지 또는 사롱 착용 필수.',
    completed: false,
  },
  {
    id: '2',
    category: 'food',
    name: '카우소이 마에사이',
    address: 'Nimman Rd, Su Thep, Mueang Chiang Mai',
    mapUrl: '',
    visitDate: '2026-05-02',
    visitTime: '12:00',
    memo: '카우소이 맛집. 현지인 추천. 코코넛 커리 국수.',
    completed: false,
  },
  {
    id: '3',
    category: 'cafe',
    name: '리스트레토 로스터스',
    address: '15/1 Nimmanhaemin Rd, Suthep, Mueang Chiang Mai',
    mapUrl: '',
    visitDate: '2026-05-03',
    visitTime: '10:00',
    memo: '치앙마이 유명 스페셜티 카페. 싱글 오리진 원두.',
    completed: false,
  },
  {
    id: '4',
    category: 'shopping',
    name: '나이트 바자',
    address: 'Night Bazaar, Chang Khlan Rd, Chiang Mai',
    mapUrl: '',
    visitDate: '2026-05-03',
    visitTime: '19:00',
    memo: '야시장. 기념품 및 현지 공예품 구매 예정.',
    completed: false,
  },
  {
    id: '5',
    category: 'accommodation',
    name: '님만 헤민 호텔 체크인',
    address: 'Nimmanhaemin Rd, Suthep, Mueang Chiang Mai',
    mapUrl: '',
    visitDate: '2026-05-01',
    visitTime: '15:00',
    memo: '체크인 시간 15:00. 얼리 체크인 요청 예정.',
    completed: false,
  },
];
