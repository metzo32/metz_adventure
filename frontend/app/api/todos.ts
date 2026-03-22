import type { TodoItem } from "@/app/todo/types";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/todos`;

const tripHeaders = (tripId: number) => ({
  "Content-Type": "application/json",
  "x-trip-id": String(tripId),
});

const mapRow = (row: Record<string, unknown>): TodoItem => ({
  id: String(row.id),
  category: row.category as TodoItem["category"],
  name: (row.title as string) ?? "",
  address: (row.address as string) ?? "",
  mapUrl: (row.map_url as string) ?? "",
  visitDate: (row.due_date as string) ?? "",
  visitTime: (row.visit_time as string) ?? "",
  memo: (row.memo as string) ?? "",
  completed: row.is_completed === 1,
});

export const fetchTodos = async (tripId: number): Promise<TodoItem[]> => {
  const res = await fetch(API, { headers: tripHeaders(tripId) });
  if (!res.ok) throw new Error("일정을 불러오지 못했습니다.");
  const rows = await res.json();
  return rows.map(mapRow);
};

export const createTodo = async (
  tripId: number,
  data: Omit<TodoItem, "id" | "completed">
): Promise<TodoItem> => {
  const res = await fetch(API, {
    method: "POST",
    headers: tripHeaders(tripId),
    body: JSON.stringify({
      title: data.name,
      category: data.category,
      due_date: data.visitDate,
      visit_time: data.visitTime,
      address: data.address,
      map_url: data.mapUrl,
      memo: data.memo,
    }),
  });
  if (!res.ok) throw new Error("일정 추가에 실패했습니다.");
  return mapRow(await res.json());
};

export const updateTodo = async (
  id: string,
  data: Partial<Pick<TodoItem, "completed" | "name" | "category" | "visitDate" | "visitTime" | "address" | "mapUrl" | "memo">>
): Promise<TodoItem> => {
  const body: Record<string, unknown> = {};
  if (data.completed !== undefined) body.is_completed = data.completed ? 1 : 0;
  if (data.name !== undefined) body.title = data.name;
  if (data.category !== undefined) body.category = data.category;
  if (data.visitDate !== undefined) body.due_date = data.visitDate;
  if (data.visitTime !== undefined) body.visit_time = data.visitTime;
  if (data.address !== undefined) body.address = data.address;
  if (data.mapUrl !== undefined) body.map_url = data.mapUrl;
  if (data.memo !== undefined) body.memo = data.memo;

  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("일정 수정에 실패했습니다.");
  return mapRow(await res.json());
};

export const deleteTodo = async (id: string): Promise<void> => {
  await fetch(`${API}/${id}`, { method: "DELETE" });
};
