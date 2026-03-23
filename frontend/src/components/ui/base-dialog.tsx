import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  maxWidth?: string;
}

export function BaseDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  onSubmit,
  className,
  maxWidth = "sm:max-w-150",
}: BaseDialogProps) {
  const innerContent = (
    <div className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        {description && (
          <DialogDescription>{description}</DialogDescription>
        )}
      </DialogHeader>
      <div className={cn("py-2", className)}>
        {children}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(maxWidth, "max-h-[90vh] p-0 flex flex-col overflow-hidden")}>
        {onSubmit ? (
          <form onSubmit={onSubmit} className="flex flex-col h-full max-h-[90vh] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              {innerContent}
            </div>
            {footer && (
              <DialogFooter className="border-t p-6 mt-0 shrink-0 bg-white">
                {footer}
              </DialogFooter>
            )}
          </form>
        ) : (
          <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              {innerContent}
            </div>
            {footer && (
              <DialogFooter className="border-t p-6 mt-0 shrink-0 bg-white">
                {footer}
              </DialogFooter>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
