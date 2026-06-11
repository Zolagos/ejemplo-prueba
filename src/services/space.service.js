import { http } from "@/api/http";

export const getSpaces = () =>
  http.get("/spaces");

export const createSpace = (data) =>
  http.post("/spaces", data);