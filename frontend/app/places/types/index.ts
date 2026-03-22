export interface Place {
  id: number;
  title: string;
  memo: string;
  rating: number;
  tag: string;
  imageUrl?: string;
}

export interface PlaceFormValues {
  title: string;
  memo: string;
  rating: number;
  tag: string;
}
