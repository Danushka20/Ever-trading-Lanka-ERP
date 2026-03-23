import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { BaseDialog } from "@/components/ui/base-dialog"
import { FormGrid, SectionTitle } from "@/components/ui/form-grid"
import { Combobox } from "@/components/ui/combobox"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
import { CategoryDialog } from "./CategoryDialog"
import { toast } from 'sonner'
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBItem, DBCategory } from "@/lib/types"

interface ItemFormData {
  name: string
  sku: string
  category_id: string
  unit_id: string
  buy_price: number
  unit_price: number
  description: string
  reorder_level: number
  is_active: boolean
}

interface ItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: DBItem | null
  onSuccess: () => void
}

export function ItemDialog({ open, onOpenChange, item, onSuccess }: ItemDialogProps) {
  const { create: createItem, update: updateItem } = useOfflineData<DBItem>("items")
  const { data: categories, delete: deleteCategory } = useOfflineData<DBCategory>("categories")

  const [formData, setFormData] = useState<ItemFormData>({
    name: '', sku: '', category_id: '', unit_id: '', buy_price: 0, unit_price: 0,
    description: '', reorder_level: 0, is_active: true,
  })

  const [loading, setLoading] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [categoryDeleteDialogOpen, setCategoryDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (open) {
      if (item) {
        setFormData({
          name: item.name,
          sku: item.sku || '',
          category_id: item.category_id?.toString() || '',
          unit_id: item.unit_id?.toString() || '',
          buy_price: Number(item.buy_price || 0),
          unit_price: Number(item.unit_price || 0),
          description: item.description || '',
          reorder_level: item.reorder_level || 0,
          is_active: !!item.is_active,
        })
      } else {
        setFormData({
          name: '', sku: '', category_id: '', unit_id: '', buy_price: 0, unit_price: 0,
          description: '', reorder_level: 0, is_active: true,
        })
      }
    }
  }, [open, item])


  const handleInputChange = (field: keyof ItemFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: Partial<DBItem> = {
        ...formData,
        sku: formData.sku || undefined,
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        unit_id: formData.unit_id ? parseInt(formData.unit_id) : undefined,
        buy_price: Number(formData.buy_price || 0),
        unit_price: Number(formData.unit_price || 0),
        total_stock: item?.total_stock || 0,
      }
      if (item?.id) {
        await updateItem(item.id, payload)
        toast.success('Item updated successfully')
      } else {
        await createItem(payload)
        toast.success('Item created successfully')
      }
      onSuccess?.()
      onOpenChange(false)
    } catch (err: any) {
      console.error('Submit error', err)
      toast.error(err.response?.data?.message || 'Failed to save item')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!formData.category_id) {
      toast.error('Select a category to delete')
      return
    }

    const selectedCategory = categories.find(cat => cat.id?.toString() === formData.category_id)
    if (!selectedCategory?.id) {
      toast.error('Selected category not found')
      return
    }

    setCategoryDeleteDialogOpen(true)
  }

  const confirmDeleteCategory = async () => {
    const selectedCategory = categories.find(cat => cat.id?.toString() === formData.category_id)
    if (!selectedCategory?.id) {
      toast.error('Selected category not found')
      setCategoryDeleteDialogOpen(false)
      return
    }

    setDeletingCategory(true)
    try {
      await deleteCategory(selectedCategory.id)
      setFormData(prev => ({ ...prev, category_id: '' }))
      toast.success('Category deleted successfully')
      setCategoryDeleteDialogOpen(false)
    } catch (err: any) {
      console.error('Delete category error', err)
      toast.error(err.response?.data?.message || 'Failed to delete category')
    } finally {
      setDeletingCategory(false)
    }
  }

  // Build category options
  const getCategoryOptions = () => {
    return categories.map(cat => ({
      value: cat.id.toString(),
      label: cat.name
    }))
  }

  const DialogFooterBtns = (
    <>
      <Button
        type="button"
        variant="outline"
        className="px-5 h-11 border-slate-200 hover:bg-slate-50"
        onClick={() => onOpenChange(false)}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={loading}
        className="px-6 shadow-sm h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
            <span>Saving...</span>
          </div>
        ) : (item ? 'Update Item' : 'Add Item')}
      </Button>
    </>
  )

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={item ? 'Edit Item' : 'Add New Item'}
      description={item ? 'Update item information below.' : 'Add a new inventory item.'}
      onSubmit={handleSubmit}
      footer={DialogFooterBtns}
    >
      <div className="p-4 border shadow-sm rounded-xl border-slate-100 bg-gradient-to-b from-white to-slate-50/40">
        <FormGrid>
          <FormField label="Item Name" required>
            <Input
              className="bg-white h-11 border-slate-200"
              placeholder="Enter item name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </FormField>
          <FormField label="Item Code">
            <Input
              className="bg-white h-11 border-slate-200"
              placeholder="Enter item code"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
            />
          </FormField>
        </FormGrid>
        <FormGrid className="mt-4">
          <FormField label="Category">
             <div className="flex gap-2">
              <Combobox
                options={[{ value: "none", label: "No Category" }, ...getCategoryOptions()]}
                value={formData.category_id || "none"}
                onChange={(value) => {
                  const selectedValue = Array.isArray(value) ? value[0] : value
                  handleInputChange('category_id', selectedValue === "none" ? '' : selectedValue)
                }}
                placeholder="Select category"
                searchPlaceholder="Search category..."
                emptyText="No categories found"
                clearable={false}
                className="w-full"
                inputClassName="min-h-11 bg-white border-slate-200"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 border-slate-200 shrink-0 hover:bg-blue-50"
                onClick={() => setCategoryDialogOpen(true)}
                title="Add New Category"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="text-red-600 border-red-200 h-11 w-11 shrink-0 hover:text-red-700 hover:bg-red-50"
                onClick={handleDeleteCategory}
                title="Delete Selected Category"
                disabled={!formData.category_id || deletingCategory || loading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
             </div>
          </FormField>
        </FormGrid>
      </div>

      <CategoryDialog 
        open={categoryDialogOpen} 
        onOpenChange={setCategoryDialogOpen}
        onSuccess={() => setCategoryDialogOpen(false)}
      />

      <ConfirmDialog
        open={categoryDeleteDialogOpen}
        onOpenChange={setCategoryDeleteDialogOpen}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteCategory}
        variant="danger"
        loading={deletingCategory}
      />

      <div className="p-4 mt-6 bg-white border shadow-sm rounded-xl border-slate-100">
        <FormGrid>
          <FormField label="Reorder Level">
            <Input
              className="bg-white h-11 border-slate-200"
              type="number"
              min="0"
              placeholder="Minimum stock level"
              value={formData.reorder_level}
              onChange={(e) => handleInputChange('reorder_level', parseInt(e.target.value) || 0)}
            />
          </FormField>
        </FormGrid>
      </div>

      <SectionTitle title="Pricing" className="mt-8" />
      <div className="p-4 border shadow-sm rounded-xl border-slate-100 bg-gradient-to-b from-white to-slate-50/40">
        <FormGrid>
          <FormField label="Unit Cost Price">
            <div className="relative">
              <span className="absolute text-sm font-medium -translate-y-1/2 left-3 top-1/2 text-slate-500">Rs</span>
              <Input
                className="bg-white h-11 pl-11 border-slate-200"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter unit cost price"
                value={formData.buy_price}
                onChange={(e) => handleInputChange('buy_price', parseFloat(e.target.value) || 0)}
              />
            </div>
          </FormField>
          <FormField label="Unit Selling Price">
            <div className="relative">
              <span className="absolute text-sm font-medium -translate-y-1/2 left-3 top-1/2 text-slate-500">Rs</span>
              <Input
                className="bg-white h-11 pl-11 border-slate-200"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter unit selling price"
                value={formData.unit_price}
                onChange={(e) => handleInputChange('unit_price', parseFloat(e.target.value) || 0)}
              />
            </div>
          </FormField>
        </FormGrid>
      </div>

      <div className="p-4 mt-6 bg-white border shadow-sm rounded-xl border-slate-100">
        <FormGrid columns={1}>
          <FormField label="Description">
            <Textarea
              rows={3}
              className="bg-white border-slate-200"
              placeholder="Item description..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </FormField>
        </FormGrid>
      </div>

      <div className="flex items-center justify-between p-4 mt-6 border rounded-xl border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div>
          <p className="font-medium text-slate-900">Active Status</p>
          <p className="text-sm text-slate-500">Enable or disable this item in the system</p>
        </div>
        <Switch 
          checked={formData.is_active} 
          onCheckedChange={(checked) => handleInputChange('is_active', checked)} 
        />
      </div>
    </BaseDialog>
  )
}
