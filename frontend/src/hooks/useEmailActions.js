import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEmailActions, getEmailActionSummary, setEmailActionChecked } from "../api/emailActions.api";

export const useEmailActions = (params) =>
  useQuery({
    queryKey: ["email-actions", params],
    queryFn: () => getEmailActions(params)
  });

export const useEmailActionSummary = () =>
  useQuery({
    queryKey: ["email-action-summary"],
    queryFn: getEmailActionSummary
  });

export const useSetEmailActionChecked = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setEmailActionChecked,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-actions"] });
      queryClient.invalidateQueries({ queryKey: ["email-action-summary"] });
      queryClient.invalidateQueries({ queryKey: ["profile-settings"] });
    }
  });
};
