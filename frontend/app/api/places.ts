import type { Place, PlaceFormValues } from "@/app/places/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/places`;

const assertOk = async (res: Response) => {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
};

const toPlace = (row: Record<string, unknown>): Place => ({
  id: row.id as number,
  title: row.name as string,
  memo: (row.review as string) ?? "",
  rating: (row.rating as number) ?? 0,
  tag: (row.category as string) ?? "기타",
  imageUrl: (row.image_url as string) ?? undefined,
});

const toFormData = (data: PlaceFormValues, imageFile?: File | null): FormData => {
  const fd = new FormData();
  fd.append("name", data.title);
  fd.append("review", data.memo);
  fd.append("rating", String(data.rating));
  fd.append("category", data.tag);
  if (imageFile) fd.append("image", imageFile);
  return fd;
};

export const fetchPlaces = async (userId: string): Promise<Place[]> => {
  const res = await fetch(BASE_URL, { headers: { "x-user-id": userId } });
  await assertOk(res);
  const rows = await res.json();
  return rows.map(toPlace);
};

export const createPlace = async (
  data: PlaceFormValues,
  imageFile?: File | null,
  userId?: string
): Promise<Place> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "x-user-id": userId ?? "" },
    body: toFormData(data, imageFile),
  });
  await assertOk(res);
  return toPlace(await res.json());
};

export const updatePlace = async (
  id: number,
  data: PlaceFormValues,
  imageFile?: File | null,
  userId?: string
): Promise<Place> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "x-user-id": userId ?? "" },
    body: toFormData(data, imageFile),
  });
  await assertOk(res);
  return toPlace(await res.json());
};

export const deletePlace = async (id: number, userId?: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { "x-user-id": userId ?? "" },
  });
  await assertOk(res);
};
