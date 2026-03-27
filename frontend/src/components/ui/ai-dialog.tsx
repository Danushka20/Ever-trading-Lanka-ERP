import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, Loader2 } from 'lucide-react';

export type DialogVariant = 'default' | 'success' | 'danger' | 'warning' | 'info';

interface AIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: DialogVariant;
  showCloseButton?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  loading?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isActionLoading?: boolean;
}

const variantStyles = {
  default: {
    icon: null,
    iconColor: 'text-slate-500',
    headerBg: 'bg-white',
    buttonColor: 'bg-slate-900 hover:bg-slate-800',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    headerBg: 'bg-emerald-50',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
  },
  danger: {
    icon: AlertCircle,
    iconColor: 'text-rose-500',
    headerBg: 'bg-rose-50',
    buttonColor: 'bg-rose-600 hover:bg-rose-700',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    headerBg: 'bg-amber-50',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    headerBg: 'bg-blue-50',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
};

const maxWidthClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  full: 'sm:max-w-[95vw]',
};

/**
 * AIDialog is a enhanced version of the base dialog component 
 * with built-in variants, loading states, and consistent styling.
 */
export function AIDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  variant = 'default',
  maxWidth = 'md',
  loading = false,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isActionLoading = false,
}: AIDialogProps) {
  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          maxWidthClasses[maxWidth],
          "p-0 overflow-hidden border-none shadow-2xl rounded-3xl"
        )}
      >
        {/* Header Section */}
        <div className={cn("px-6 pt-8 pb-6", style.headerBg)}>
          <DialogHeader className="flex flex-row items-start gap-4 space-y-0 text-left">
            {Icon && (
              <div className={cn("p-3 rounded-2xl bg-white shadow-sm shrink-0", style.iconColor)}>
                <Icon className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1 min-w-0 pr-6">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="mt-1.5 text-sm font-medium text-slate-500 leading-relaxed">
                  {description}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* Content Section */}
        {(children || loading) && (
          <div className="px-6 py-6 bg-white">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-sm font-bold tracking-widest uppercase text-slate-400">Loading Content...</p>
              </div>
            ) : (
              children
            )}
          </div>
        )}

        {/* Footer Section */}
        <div className="px-6 py-5 italic transition-all duration-300 border-t bg-slate-50 border-slate-100">
          {footer ? (
            footer
          ) : (
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isActionLoading}
                className="px-6 font-bold transition-all h-11 text-slate-500 hover:text-slate-900 rounded-xl"
              >
                {cancelText}
              </Button>
              {onConfirm && (
                <Button
                  onClick={onConfirm}
                  disabled={isActionLoading}
                  className={cn(
                    "h-11 px-8 font-bold text-white shadow-lg rounded-xl active:scale-[0.98] transition-all",
                    style.buttonColor
                  )}
                >
                  {isActionLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    confirmText
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
