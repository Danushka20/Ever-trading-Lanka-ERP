import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { BaseDialog } from "@/components/ui/base-dialog"
import { FormGrid } from "@/components/ui/form-grid"
import { toast } from 'sonner'
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBCategory } from "@/lib/types"

interface CategoryFormData {
  name: string
  category_number: string
  description: string
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: DBCategory | null
  onSuccess: () => void
}

export function CategoryDialog({ open, onOpenChange, category, onSuccess }: CategoryDialogProps) {
  const { 
    create: createCategory, 
    update: updateCategory,
    delete: deleteCategory
  } = useOfflineData<DBCategory>("categories")

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '', category_number: '', description: '',
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          name: category.name,
          category_number: category.category_number || '',
          description: category.description || '',
        })
      } else {
        setFormData({ name: '', category_number: '', description: '' })
      }
    }
  }, [open, category])

  const handleInputChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...formData,
      }
      if (category?.id) {
        await updateCategory(category.id, payload)
        toast.success('Category updated successfully')
      } else {
        await createCategory(payload)
        toast.success('Category created successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      console.error('Submit error', err)
      toast.error(err.response?.data?.message || 'Failed to save category')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!category?.id) return
    if (!confirm('Are you sure you want to delete this category?')) return

    setLoading(true)
    try {
      await deleteCategory(category.id)
      toast.success('Category deleted successfully')
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      console.error('Delete error', err)
      toast.error(err.response?.data?.message || 'Failed to delete category')
    } finally {
      setLoading(false)
    }
  }

  const DialogFooterBtns = (
    <>
      {category?.id && (
        <Button
          type="button"
          className="h-11 bg-red-600 hover:bg-red-700 text-white"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      )}
      <Button type="button" variant="outline" className="h-11" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button type="submit" disabled={loading} className="bg-blue-600 h-11 hover:bg-blue-700">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
            <span>Saving...</span>
          </div>
        ) : (category ? 'Update Category' : 'Add Category')}
      </Button>
    </>
  )

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={category ? 'Edit Category' : 'Add New Category'}
      description={category ? 'Update category information below.' : 'Create a new item category.'}
      onSubmit={handleSubmit}
      footer={DialogFooterBtns}
    >
      <FormGrid columns={2}>
        <FormField label="Category Name" required>
          <Input 
            className="h-11" placeholder="Enter category name"
            value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} 
          />
        </FormField>
        <FormField label="Category Number">
          <Input 
            className="h-11" placeholder="e.g. C001"
            value={formData.category_number} onChange={(e) => handleInputChange('category_number', e.target.value)} 
          />
        </FormField>
      </FormGrid>

      <FormGrid columns={1} className="mt-6">
        <FormField label="Description">
          <Textarea 
            rows={3} placeholder="Category description..."
            value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} 
          />
        </FormField>
      </FormGrid>
    </BaseDialog>
  )
}
