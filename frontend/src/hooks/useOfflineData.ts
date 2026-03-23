import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query"
import api from "@/lib/api"

type TableName = "items" | "categories" | "units" | "dealers" | "suppliers" | 
  "invoices" | "invoiceItems" | "purchaseOrders" | "purchaseOrderItems" | 
  "salesAreas" | "stockBatches" | "users" | "sales_targets" | "roles" | "permissions"

const tableToEndpoint: Record<TableName, string> = {
  items: "items",
  categories: "categories",
  units: "units",
  dealers: "dealers",
  suppliers: "suppliers",
  invoices: "invoices",
  invoiceItems: "invoice-items",
  purchaseOrders: "purchases",
  purchaseOrderItems: "purchase-order-items",
  salesAreas: "sales-areas",
  stockBatches: "stock-batches",
  users: "users",
  sales_targets: "sales-targets",
  roles: "roles",
  permissions: "permissions"
}

// Generic hook for fetching list data
export function useOfflineQuery<T>(
  tableName: TableName,
  options?: Partial<UseQueryOptions<T[], Error>>
) {
  const endpoint = tableToEndpoint[tableName]
  return useQuery<T[], Error>({
    queryKey: [tableName],
    queryFn: async () => {
      if (!endpoint) {
        console.warn(`No endpoint mapping for table: ${tableName}`)
        return []
      }
      const { data } = await api.get(endpoint)
      return Array.isArray(data) ? data : []
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

// Hook for fetching single item by ID
export function useOfflineQueryById<T>(
  tableName: TableName,
  id: number | null,
  options?: Partial<UseQueryOptions<T | null, Error>>
) {
  const endpoint = tableToEndpoint[tableName]
  return useQuery<T | null, Error>({
    queryKey: [tableName, id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await api.get(`${endpoint}/${id}`)
      return data
    },
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

// Generic hook for creating data
export function useOfflineCreate<T>(tableName: TableName) {
  const queryClient = useQueryClient()
  const endpoint = tableToEndpoint[tableName]
  
  return useMutation<T, Error, Omit<T, any>>({
    mutationFn: async (data) => {
      const resp = await api.post(endpoint, data)
      return resp.data
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] })
    },
  })
}

// Generic hook for updating data
export function useOfflineUpdate<T>(tableName: TableName) {
  const queryClient = useQueryClient()
  const endpoint = tableToEndpoint[tableName]
  
  return useMutation<T, Error, { id: number; data: Partial<T> }>({
    mutationFn: async ({ id, data }) => {
      const resp = await api.put(`${endpoint}/${id}`, data)
      return resp.data
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] })
    },
  })
}

// Generic hook for deleting data
export function useOfflineDelete(tableName: TableName) {
  const queryClient = useQueryClient()
  const endpoint = tableToEndpoint[tableName]
  
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`${endpoint}/${id}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] })
    },
  })
}

// Combined hook for full CRUD operations
export function useOfflineData<T>(tableName: TableName) {
  const query = useOfflineQuery<T>(tableName)
  const createMutation = useOfflineCreate<T>(tableName)
  const updateMutation = useOfflineUpdate<T>(tableName)
  const deleteMutation = useOfflineDelete(tableName)
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    
    update: (id: number, data: Partial<T>) => updateMutation.mutateAsync({ id, data }),
    isUpdating: updateMutation.isPending,
    
    delete: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}

export default {
  useOfflineQuery,
  useOfflineQueryById,
  useOfflineCreate,
  useOfflineUpdate,
  useOfflineDelete,
  useOfflineData,
}
