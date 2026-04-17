import { b as useQueryClient } from "./index-BmkvLqip.js";
import { u as useQuery, b as useMutation, a as useActor, c as createActor } from "./backend-DxYwS8Zo.js";
function useBackendActor() {
  return useActor(createActor);
}
function useProducerSettings() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["producerSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProducerSettings();
    },
    enabled: !!actor && !isFetching
  });
}
function useSetProducerSettings() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setProducerSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["producerSettings"] });
    }
  });
}
export {
  useSetProducerSettings as a,
  useProducerSettings as u
};
