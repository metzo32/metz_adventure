import type { WishItem } from "@/app/wishlist/types";

const API = "http://localhost:4000/api/wishlist";

export async function fetchItems(): Promise<WishItem[]> {
  const res = await fetch(API);
  return res.json();
}

export async function createItem(item: Omit<WishItem, "id">) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return res.json();
}

export async function updateItem(id: number, item: Partial<WishItem>) {
  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return res.json();
}

export async function deleteItem(id: number) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
}
