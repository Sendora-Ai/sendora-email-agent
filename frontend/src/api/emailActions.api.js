import { apiClient } from "./client";

export const getEmailActions = async (params = {}) => {
  const { data } = await apiClient.get("/email-actions", { params });
  return data;
};

export const getEmailActionSummary = async () => {
  const { data } = await apiClient.get("/email-actions/summary");
  return data;
};

export const setEmailActionChecked = async ({ id, checked }) => {
  const { data } = await apiClient.patch(`/email-actions/${id}/check`, { checked });
  return data;
};
