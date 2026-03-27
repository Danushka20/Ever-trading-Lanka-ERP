import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface PreferenceData {
  language: string;
  timezone: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
  dateFormat: string;
  rowsPerPage: number;
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<PreferenceData>({
    language: 'en',
    timezone: 'UTC',
    currency: 'LKR',
    theme: 'system',
    dateFormat: 'YYYY-MM-DD',
    rowsPerPage: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/settings/preferences');
      if (response.data) {
        setPreferences(response.data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      // Fallback to defaults or local storage if needed
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = async (newData: Partial<PreferenceData>) => {
    setIsSaving(true);
    try {
      const updated = { ...preferences, ...newData };
      await api.post('/settings/preferences', updated);
      setPreferences(updated);
      toast.success('Preferences updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    isLoading,
    isSaving,
    updatePreferences,
    refresh: fetchPreferences
  };
}
