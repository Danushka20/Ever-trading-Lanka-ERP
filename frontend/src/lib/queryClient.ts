import { QueryClient } from "@tanstack/react-query"

// Create the query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Retry 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch when reconnecting
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 3,
    },
  },
})

export default queryClient
