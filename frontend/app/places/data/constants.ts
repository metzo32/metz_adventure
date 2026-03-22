import type { PlaceFormValues } from "../types";

export const TAGS = ["음식", "카페", "관광", "쇼핑", "숙소", "기타"] as const;

export const FILTER_TAGS = ["전체", ...TAGS];

export const TAG_OPTIONS = TAGS.map((t) => ({ label: t, value: t }));

export const RATING_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
  label: `★ ${(i * 0.5).toFixed(1)}`,
  value: i * 0.5,
}));

export const EMPTY_PLACE: PlaceFormValues = {
  title: "",
  memo: "",
  rating: 0,
  tag: "음식",
};
