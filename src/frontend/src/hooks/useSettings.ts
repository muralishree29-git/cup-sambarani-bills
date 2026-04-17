import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { ProducerSettings } from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useProducerSettings() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ProducerSettings | null>({
    queryKey: ["producerSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProducerSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetProducerSettings() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: ProducerSettings) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setProducerSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["producerSettings"] });
    },
  });
}
