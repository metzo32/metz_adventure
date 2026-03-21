export type WishItem = {
  id?: number;
  title: string;
  category: string;
  memo: string;
  link: string;
  priority: number;
  is_done: number;
};

export type FormValues = {
  items: WishItem[];
};
