import type { WishItem } from "../types";

export const CATEGORIES = ["전체", "음식", "카페", "관광", "쇼핑", "숙소", "기타"];
export const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c !== "전체").map((c) => ({ label: c, value: c }));
export const TABLE_COLUMNS = [
  { label: "항목명",   className: "w-[23%]" },
  { label: "카테고리", className: "w-[8%]"  },
  { label: "우선순위", className: "w-[8%]"  },
  { label: "메모",     className: "w-[23%]" },
  { label: "링크",     className: "w-[23%]" },
  { label: "상태",     className: "w-[8%]"  },
  { label: "Action",  className: "w-[8%]"  },
];
export const PRIORITY_OPTIONS = [
  { value: 1, label: "낮음" },
  { value: 2, label: "보통" },
  { value: 3, label: "높음" },
];
export const PRIORITIES: Record<number, { label: string; color: string }> = {
  1: { label: "낮음", color: "bg-blue-100 text-blue-600" },
  2: { label: "보통", color: "bg-yellow-100 text-yellow-600" },
  3: { label: "높음", color: "bg-red-100 text-red-600" },
};
export const EMPTY_ITEM: Omit<WishItem, "id"> = {
  title: "",
  category: "기타",
  memo: "",
  link: "",
  priority: 2,
  is_done: 0,
};
