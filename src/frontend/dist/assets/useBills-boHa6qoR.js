import { c as createLucideIcon, b as useQueryClient } from "./index-BmkvLqip.js";
import { b as useMutation, u as useQuery, a as useActor, c as createActor } from "./backend-DxYwS8Zo.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
const Printer = createLucideIcon("printer", __iconNode);
function useBackendActor() {
  return useActor(createActor);
}
function useListBills() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBills();
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateBill() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerName,
      customerId,
      customerAddress,
      lineItems
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveBill(
        customerName,
        customerId,
        customerAddress,
        lineItems
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    }
  });
}
export {
  Printer as P,
  useListBills as a,
  useCreateBill as u
};
