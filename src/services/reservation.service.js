import { http } from "@/api/http";

export const getReservations = () =>
  http.get("/reservations");

export const createReservation = (data) =>
  http.post("/reservations", data);

export const updateReservation = (id, data) =>
  http.put(`/reservations/${id}`, data);

export const deleteReservation = (id) =>
  http.delete(`/reservations/${id}`);

export const patchReservationStatus = (id, status) =>
  http.patch(`/reservations/${id}`, { status });
  
export const getSpaces = () =>
  http.get("/spaces");
