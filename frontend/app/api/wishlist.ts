import type { WishItem } from "@/app/wishlist/types";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`;

const tripHeaders = (tripId: number) => ({
  "Content-Type": "application/json",
  "x-trip-id": String(tripId),
});

export const fetchItems = async (tripId: number): Promise<WishItem[]> => {
  const res = await fetch(API, { headers: tripHeaders(tripId) });
  return res.json();
};

export const createItem = async (item: Omit<WishItem, "id">, tripId: number) => {
  const res = await fetch(API, {
    method: "POST",
    headers: tripHeaders(tripId),
    body: JSON.stringify(item),
  });
  return res.json();
};

export const updateItem = async (id: number, item: Partial<WishItem>) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return res.json();
};

export const deleteItem = async (id: number) => {
  await fetch(`${API}/${id}`, { method: "DELETE" });
};
