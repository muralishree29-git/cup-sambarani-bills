import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Bill, LineItem } from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useListBills() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Bill[]>({
    queryKey: ["bills"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBills();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBill(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Bill | null>({
    queryKey: ["bill", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getBill(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateBill() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerName,
      customerId,
      customerAddress,
      lineItems,
    }: {
      customerName: string | null;
      customerId: bigint | null;
      customerAddress: string | null;
      lineItems: LineItem[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveBill(
        customerName,
        customerId,
        customerAddress,
        lineItems,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
}
