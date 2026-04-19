import { b as useQueryClient } from "./index-0LLgf19x.js";
import { u as useQuery, a as useActor, b as useMutation, c as createActor } from "./backend-DIaqbPiA.js";
function useBackendActor() {
  return useActor(createActor);
}
function useListCustomers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCustomers();
    },
    enabled: !!actor && !isFetching
  });
}
function useAddCustomer() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      address,
      phone
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addCustomer(name, address, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });
}
function useUpdateCustomer() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      address,
      phone
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateCustomer(id, name, address, phone);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({
        queryKey: ["customer", vars.id.toString()]
      });
    }
  });
}
function useDeleteCustomer() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteCustomer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });
}
export {
  useAddCustomer as a,
  useUpdateCustomer as b,
  useDeleteCustomer as c,
  useListCustomers as u
};
