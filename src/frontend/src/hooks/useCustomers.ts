import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Customer } from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useListCustomers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomer(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Customer | null>({
    queryKey: ["customer", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCustomer(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useAddCustomer() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      address,
      phone,
    }: {
      name: string;
      address: string;
      phone: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addCustomer(name, address, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useUpdateCustomer() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      address,
      phone,
    }: {
      id: bigint;
      name: string;
      address: string;
      phone: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateCustomer(id, name, address, phone);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({
        queryKey: ["customer", vars.id.toString()],
      });
    },
  });
}

export function useDeleteCustomer() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteCustomer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
