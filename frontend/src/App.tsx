import { QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import AppRouter from "@/router/AppRouter"
import { Toaster } from "sonner"
import { queryClient } from "@/lib/queryClient"
import { useWebSockets } from "@/hooks/useWebSockets"

function WebSocketHandler() {
  useWebSockets()
  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketHandler />
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
