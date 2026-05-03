import { apiClient } from "./client";

export const getLabels = async () => {
  const { data } = await apiClient.get("/labels");
  return data;
};

export const createLabel = async (payload) => {
  const { data } = await apiClient.post("/labels", payload);
  return data;
};

export const updateLabel = async ({ labelId, payload }) => {
  const { data } = await apiClient.patch(`/labels/${labelId}`, payload);
  return data;
};

export const disableLabel = async (labelId) => {
  const { data } = await apiClient.delete(`/labels/${labelId}`);
  return data;
};
