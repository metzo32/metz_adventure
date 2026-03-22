export type PastTrip = {
  id: number;
  name: string;
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  memo: string;
  total_expense_krw: number;
};

export type StepEntry = {
  id: number;
  date: string;
  count: number;
  memo: string;
  trip_id: number;
};

export type Flight = {
  id: number;
  trip_id: number;
  type: "outbound" | "return";
  departure_place: string;
  departure_time: string;
  arrival_place: string;
  arrival_time: string;
  created_at: string;
};

export type AddFlightForm = {
  type: "outbound" | "return";
  departure_place: string;
  departure_time: string;
  arrival_place: string;
  arrival_time: string;
};

export type AddStepsForm = {
  date: string;
  count: number;
  memo: string;
};
