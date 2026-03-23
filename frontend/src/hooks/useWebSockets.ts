import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { echo } from '@/lib/echo';

export function useWebSockets() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = echo.channel('app-updates');
    
    channel.listen('.entity.updated', (data: { tableName: string, id: any }) => {
      console.log(`Real-time update received for ${data.tableName}`);
      
      // Invalidate React Query to update UI components
      queryClient.invalidateQueries({ queryKey: [data.tableName] });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: [data.tableName, data.id] });
      }
    });

    return () => {
      echo.leaveChannel('app-updates');
    };
  }, [queryClient]);
}
