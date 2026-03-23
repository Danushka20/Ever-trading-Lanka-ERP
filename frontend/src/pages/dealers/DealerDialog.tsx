import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBDealer, DBSalesArea } from "@/lib/types"
import { Loader2, User, MapPin, CreditCard, FileText } from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog";

// Import components
import { GeneralStep } from "./components/GeneralStep";
import { AddressStep } from "./components/AddressStep";
import { FinancialsStep } from "./components/FinancialsStep";
import { NotesStep } from "./components/NotesStep";

interface DealerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealer?: DBDealer | null;
  onSuccess: () => void;
  readOnly?: boolean;
}

export function DealerDialog({ open, onOpenChange, dealer, onSuccess, readOnly = false }: DealerDialogProps) {
  const { create, update } = useOfflineData<DBDealer>("dealers");
  const { data: areas = [] } = useOfflineData<DBSalesArea>("salesAreas");
  const { data: users = [] } = useOfflineData<any>("users");

  const [formData, setFormData] = useState<Partial<DBDealer>>({
    name: '', email: '', phone: '', secondary_phone: '', fax_number: '', 
    address_line1: '', address_line2: '', address_line3: '', main_town: '',
    category: '', sales_type: '', salesperson_id: '', sales_area_id: undefined,
    credit_limit: 0, percentage: 0, general_note: '', is_active: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (dealer) {
        setFormData({ 
            ...dealer,
            category: dealer.category || '',
            sales_area_id: dealer.sales_area_id ? Number(dealer.sales_area_id) : undefined,
            salesperson_id: dealer.salesperson_id ? String(dealer.salesperson_id) : ''
        });
      } else {
        setFormData({
          name: '', email: '', phone: '', secondary_phone: '', fax_number: '', 
          address_line1: '', address_line2: '', address_line3: '', main_town: '',
          category: '', sales_type: '', salesperson_id: '', sales_area_id: undefined,
          credit_limit: 0, percentage: 0, general_note: '', is_active: true
        });
      }
    }
  }, [open, dealer]);

  const selectedArea = areas.find(a => a.id === formData.sales_area_id);

  const handleInputChange = (field: keyof DBDealer, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Name is required");
    if (!formData.category) return toast.error("Dealer category is required");
    
    setLoading(true);
    try {
      if (dealer?.id) {
        await update(dealer.id, formData);
        toast.success("Dealer updated successfully");
      } else {
        await create(formData as any);
        toast.success("Dealer created successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to save dealer");
    } finally {
      setLoading(false);
    }
  };

  const DialogFooterBtns = (
    <div className="flex justify-end gap-3 w-full">
      <Button variant="outline" type="button" className="h-11" onClick={() => onOpenChange(false)} disabled={loading}>
        {readOnly ? 'Close' : 'Cancel'}
      </Button>
      {!readOnly && (
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 h-11 min-w-32">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {dealer ? 'Update Dealer' : 'Add Dealer'}
        </Button>
      )}
    </div>
  );

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={readOnly ? 'Review Dealer' : (dealer ? 'Edit Dealer' : 'Add New Dealer')}
      description={readOnly ? 'Review dealer information.' : (dealer ? 'Update dealer information below.' : 'Add a new dealer to your directory.')}
      onSubmit={handleSubmit}
      footer={DialogFooterBtns}
      maxWidth="sm:max-w-2xl"
    >
      <div className="space-y-8 pb-4">
        {/* General Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">General Information</h3>
          </div>
          <GeneralStep formData={formData} onChange={handleInputChange} readOnly={readOnly} />
        </div>

        {/* Address & Area Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-amber-50 rounded-md text-amber-600">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Address & Area Details</h3>
          </div>
          <AddressStep formData={formData} areas={areas} selectedArea={selectedArea} onChange={handleInputChange} readOnly={readOnly} />
        </div>

        {/* Financial & Sales Targets */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-purple-50 rounded-md text-purple-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Financial & Sales Targets</h3>
          </div>
          <FinancialsStep formData={formData} users={users} onChange={handleInputChange} readOnly={readOnly} />
        </div>

        {/* General Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-slate-50 rounded-md text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">General Notes</h3>
          </div>
          <NotesStep formData={formData} onChange={handleInputChange} readOnly={readOnly} />
        </div>
      </div>
    </BaseDialog>
  );
}

