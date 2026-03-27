import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface NotificationSettings {
  invoiceCreated: boolean;
  paymentReceived: boolean;
  lowStock: boolean;
  orderStatusChanged: boolean;
}

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    invoiceCreated: true,
    paymentReceived: true,
    lowStock: true,
    orderStatusChanged: true,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings/notifications');
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch notification settings:', error);
      } finally {
        setIsLoading(false)
      }
    };
    fetchSettings();
  }, []);

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    setIsUpdating(true);
    try {
      const updated = { ...settings, [key]: value };
      await api.post('/settings/notifications', { [key]: value });
      setSettings(updated);
      toast.success('Notification settings updated');
      return true;
    } catch (error) {
      toast.error('Failed to update notification settings');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    settings,
    isLoading,
    isUpdating,
    updateSetting
  };
}
