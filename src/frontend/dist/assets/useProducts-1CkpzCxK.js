import { b as useQueryClient } from "./index-BmkvLqip.js";
import { u as useQuery, a as useActor, b as useMutation, c as createActor } from "./backend-DxYwS8Zo.js";
function useBackendActor() {
  return useActor(createActor);
}
function useProducts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching
  });
}
function useAddProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      price,
      stock,
      gst,
      hsn
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addProduct(name, price, stock, gst, hsn);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useUpdateProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      price,
      stock,
      gst,
      hsn
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateProduct(id, name, price, stock, gst, hsn);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useDeleteProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
export {
  useAddProduct as a,
  useUpdateProduct as b,
  useDeleteProduct as c,
  useProducts as u
};
