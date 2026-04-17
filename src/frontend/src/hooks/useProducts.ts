import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Product } from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useProducts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProduct(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useAddProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      price,
      stock,
      gst,
      hsn,
    }: {
      name: string;
      price: bigint;
      stock: bigint;
      gst: bigint;
      hsn: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addProduct(name, price, stock, gst, hsn);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      price,
      stock,
      gst,
      hsn,
    }: {
      id: bigint;
      name: string;
      price: bigint;
      stock: bigint;
      gst: bigint;
      hsn: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateProduct(id, name, price, stock, gst, hsn);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
