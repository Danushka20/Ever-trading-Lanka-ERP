import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBSupplier } from "@/lib/types"
import { BaseDialog } from "@/components/ui/base-dialog"
import { 
  User, 
  PhoneCall, 
  MapPin, 
  CreditCard, 
  Loader2 
} from "lucide-react"

// Import steps
import { GeneralStep } from "./components/GeneralStep"
import { ContactStep } from "./components/ContactStep"
import { AddressStep } from "./components/AddressStep"
import { FinancialsStep } from "./components/FinancialsStep"

interface SupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: DBSupplier | null
  onSuccess: () => void
  readOnly?: boolean
}

export function SupplierDialog({ open, onOpenChange, supplier, onSuccess, readOnly = false }: SupplierDialogProps) {
  const { create, update } = useOfflineData<DBSupplier>("suppliers")
  
  const [formData, setFormData] = useState<Partial<DBSupplier>>({
    name: '', 
    contact_person: '', 
    email: '', 
    phone: '', 
    secondary_phone: '',
    whatsapp_number: '',
    address: '', 
    address_line1: '',
    address_line2: '',
    address_line3: '',
    main_town: '',
    tax_id: '',
    tin_number: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (supplier) {
        setFormData({
          ...supplier
        })
      } else {
        setFormData({ 
          name: '', contact_person: '', email: '', phone: '', secondary_phone: '',
          whatsapp_number: '', address: '', address_line1: '', address_line2: '',
          address_line3: '', main_town: '', tax_id: '', tin_number: '' 
        })
      }
    }
  }, [open, supplier])

  const handleInputChange = (field: keyof DBSupplier, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return toast.error("Business name is required")
    
    setLoading(true)
    try {
      if (supplier?.id) {
        await update(supplier.id, { ...formData, is_active: supplier.is_active });
        toast.success('Supplier updated successfully')
      } else {
        await create({ ...formData, is_active: true } as any)
        toast.success('Supplier created successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      console.error('Submit error', err)
      toast.error(err.response?.data?.message || 'Failed to save supplier')
    } finally {
      setLoading(false)
    }
  }

  const DialogFooterBtns = (
    <div className="flex justify-end gap-3 w-full">
      <Button variant="outline" type="button" className="h-11" onClick={() => onOpenChange(false)} disabled={loading}>
        {readOnly ? 'Close' : 'Cancel'}
      </Button>
      {!readOnly && (
        <Button type="submit" disabled={loading} className="bg-blue-600 h-11 hover:bg-blue-700 min-w-32">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {supplier ? 'Update Supplier' : 'Add Supplier'}
        </Button>
      )}
    </div>
  )

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={readOnly ? 'Review Supplier' : (supplier ? 'Edit Supplier' : 'Add New Supplier')}
      description={readOnly ? 'Review supplier information.' : (supplier ? 'Update supplier information below.' : 'Add a new supplier to your directory.')}
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

        {/* Contact Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-emerald-50 rounded-md text-emerald-600">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Contact Details</h3>
          </div>
          <ContactStep formData={formData} onChange={handleInputChange} readOnly={readOnly} />
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-amber-50 rounded-md text-amber-600">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Address Information</h3>
          </div>
          <AddressStep formData={formData} onChange={handleInputChange} readOnly={readOnly} />
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-purple-50 rounded-md text-purple-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Financial & Tax Details</h3>
          </div>
          <FinancialsStep formData={formData} onChange={handleInputChange} readOnly={readOnly} />
        </div>
      </div>
    </BaseDialog>
  )
}
