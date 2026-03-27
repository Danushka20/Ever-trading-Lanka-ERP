import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useSecurity() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdating2FA, setIsUpdating2FA] = useState(false);

  const changePassword = async (passwordData: any) => {
    setIsChangingPassword(true);
    try {
      await api.post('/settings/security/change-password', passwordData);
      toast.success('Password changed successfully');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  const updateTwoFactor = async (enabled: boolean) => {
    setIsUpdating2FA(true);
    try {
      await api.post('/settings/security/2fa', { enabled });
      toast.success(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`);
      return true;
    } catch (error) {
      toast.error('Failed to update 2FA settings');
      return false;
    } finally {
      setIsUpdating2FA(false);
    }
  };

  return {
    isChangingPassword,
    isUpdating2FA,
    changePassword,
    updateTwoFactor
  };
}
