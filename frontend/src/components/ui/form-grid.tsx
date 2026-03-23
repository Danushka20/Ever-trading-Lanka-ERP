import { cn } from "@/lib/utils";

interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2;
  className?: string;
  bordered?: boolean;
}

export function FormGrid({ children, columns = 2, className, bordered }: FormGridProps) {
  return (
    <div 
      className={cn(
        "grid gap-6",
        columns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
        bordered && "border-t pt-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ title, className }: { title: string; className?: string }) {
  return (
    <h3 className={cn("text-lg font-semibold text-slate-900 border-b pb-2 mb-4", className)}>
      {title}
    </h3>
  );
}
