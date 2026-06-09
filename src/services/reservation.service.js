import { http } from "@/api/http";

export const getReservations = () =>
  http.get("/reservations");

export const createReservation = (data) =>
  http.post("/reservations", data);