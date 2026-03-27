import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Save, Upload, Download, X, Image as ImageIcon, CheckCircle2, Clock, MapPin, FileText } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export interface CompanyData {
  name: string
  email: string
  phone: string
  website: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  taxId: string
  registrationNumber: string
  logo?: string | null
  updatedAt?: string | null
}

interface CompanyInfoFormProps {
  formData: CompanyData
  isEditing: boolean
  isSaving: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEdit: () => void
  onSave: (logoFile: File | null) => void
  onCancel: () => void
}

export function CompanyInfoForm({
  formData,
  isEditing,
  isSaving,
  onInputChange,
  onEdit,
  onSave,
  onCancel,
}: CompanyInfoFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(formData.logo || null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; url: string }>>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  // Update preview when formData.logo changes (e.g. after fetch)
  useEffect(() => {
    if (formData.logo) {
      // Backend returns URL via asset(Storage::url()) or similar
      // Ensure we don't double prepend if the backend already returned a full URL
      const logoUrl = formData.logo.startsWith('http') 
        ? formData.logo 
        : `http://localhost:8000${formData.logo.startsWith('/') ? '' : '/'}${formData.logo}`;
      
      setLogoPreview(logoUrl);
    }
  }, [formData.logo])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      const fileSizeKB = (file.size / 1024).toFixed(2)
      
      setUploadedFiles([
        ...uploadedFiles,
        {
          name: file.name,
          size: `${fileSizeKB} KB`,
          url: fileUrl,
        },
      ])
    }
    if (pdfInputRef.current) {
      pdfInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
  }

  const handleDownloadLogo = () => {
    if (logoPreview) {
      const link = document.createElement('a')
      link.href = logoPreview
      link.download = 'company-logo.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleDownloadFile = (url: string, name: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSaveWithFeedback = (logoFile: File | null) => {
    onSave(logoFile)
    // Show success message
    // The timestamp will be updated from formData.updatedAt which comes from backend
    setShowSuccess(true)
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }

  // Update lastUpdated when formData.updatedAt changes
  useEffect(() => {
    if (formData.updatedAt) {
      try {
        setLastUpdated(new Date(formData.updatedAt))
      } catch (error) {
        console.error('Error parsing updatedAt:', error)
      }
    }
  }, [formData.updatedAt])

  return (
    <div className="flex flex-col bg-white">
      <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between px-8 py-6 border-b bg-white/50 backdrop-blur-sm">
        <div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Company Profile</CardTitle>
          <CardDescription className="mt-1 text-slate-500">Manage your organization's identity and global branding</CardDescription>
          
          {/* Last Updated Status */}
          {lastUpdated && !isEditing && (
            <div className="flex items-center gap-2 mt-3 text-xs text-emerald-600">
              <Clock className="w-4 h-4" />
              <span>Last updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • {lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>
        
        {/* Success Notification */}
        {showSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white duration-300 bg-emerald-600 rounded-xl animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            Changes saved successfully
          </div>
        )}

        {!isEditing ? (
          <Button onClick={onEdit} variant="outline" className="gap-2 px-5 transition-all shadow-sm rounded-xl h-11 border-slate-200 hover:bg-slate-50 hover:text-indigo-600">
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button onClick={() => handleSaveWithFeedback(logoFile)} disabled={isSaving} className="px-5 text-white transition-all bg-indigo-600 shadow-lg hover:bg-indigo-700 rounded-xl h-11 shadow-indigo-200">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button onClick={onCancel} variant="ghost" className="px-5 transition-all rounded-xl h-11 text-slate-500 hover:text-slate-900">Cancel</Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-8 space-y-10">
        {/* Logo Section */}
        <div className="flex flex-col items-start gap-10 md:flex-row">
          <div className="space-y-4">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Corporate Identity</Label>
            <div className="relative group">
              <div className="flex items-center justify-center overflow-hidden transition-all duration-300 border-2 border-dashed w-44 h-44 rounded-3xl border-slate-200 bg-slate-50/50 group-hover:border-indigo-400 group-hover:bg-indigo-50/30 group-hover:shadow-inner">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="object-contain w-full h-full p-4 transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <ImageIcon className="w-12 h-12" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">No Logo</span>
                  </div>
                )}
                
                {isEditing && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button size="sm" onClick={() => logoInputRef.current?.click()} className="font-bold bg-white shadow-xl text-slate-900 hover:bg-slate-100 rounded-xl">
                      Change
                    </Button>
                  </div>
                )}
              </div>
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/png,image/jpeg,image/jpg,image/webp,image/gif" className="hidden" />
              {!isEditing && logoPreview && (
                <Button variant="ghost" size="sm" onClick={handleDownloadLogo} className="absolute w-10 h-10 p-0 transition-all bg-white border shadow-lg -bottom-2 -right-2 rounded-2xl border-slate-100 text-slate-600 hover:text-indigo-600 hover:scale-110">
                  <Download className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 pt-4 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-[13px] font-semibold text-slate-700 ml-1">Legal Entity Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={onInputChange} disabled={!isEditing} className="h-12 transition-all bg-white rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50/50" />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="website" className="text-[13px] font-semibold text-slate-700 ml-1">Official Website</Label>
                <Input id="website" name="website" value={formData.website} onChange={onInputChange} disabled={!isEditing} className="h-12 transition-all bg-white rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50/50" />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-[13px] font-semibold text-slate-700 ml-1">Business Email</Label>
                <Input id="email" name="email" value={formData.email} onChange={onInputChange} disabled={!isEditing} className="h-12 transition-all bg-white rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50/50" />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="phone" className="text-[13px] font-semibold text-slate-700 ml-1">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={onInputChange} disabled={!isEditing} className="h-12 transition-all bg-white rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="pt-10 space-y-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 text-indigo-600 rounded-lg bg-indigo-50">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Headquarters Location</h3>
              <p className="text-sm text-slate-500">The registered physical point of presence for your company</p>
            </div>
          </div>
          <div className="grid grid-cols-1 pt-2 md:grid-cols-3 gap-x-8 gap-y-6">
            <div className="md:col-span-3 space-y-2.5">
              <Label htmlFor="address" className="text-[13px] font-semibold text-slate-700 ml-1">Street Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={onInputChange} disabled={!isEditing} className="h-12 transition-all bg-white rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="city" className="text-[13px] font-semibold text-slate-700 ml-1">City</Label>
              <Input id="city" name="city" value={formData.city} onChange={onInputChange} disabled={!isEditing} className="h-12 transition-all bg-white rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="state" className="text-[13px] font-semibold text-slate-700 ml-1">State / Province</Label>
              <Input id="state" name="state" value={formData.state} onChange={onInputChange} disabled={!isEditing} className="h-12 transition-all bg-white rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="zipCode" className="text-[13px] font-semibold text-slate-700 ml-1">ZIP / Postal Code</Label>
              <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={onInputChange} disabled={!isEditing} className="h-12 transition-all bg-white rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="pt-10 space-y-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Verification Documents</h3>
                <p className="text-sm text-slate-500">Legal certs & registration records for compliance</p>
              </div>
            </div>
            {isEditing && (
              <Button size="sm" variant="outline" onClick={() => pdfInputRef.current?.click()} className="h-10 px-4 transition-all rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600">
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
            )}
            <input type="file" ref={pdfInputRef} onChange={handlePdfUpload} accept=".pdf,.doc,.docx" className="hidden" />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 transition-all duration-300 border group rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-md">
                <div className="flex items-center min-w-0 gap-4">
                  <div className="flex items-center justify-center text-indigo-600 transition-transform bg-white border shadow-sm w-11 h-11 border-slate-100 rounded-xl group-hover:scale-110">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate text-slate-900">{file.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{file.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDownloadFile(file.url, file.name)} className="p-2 transition-colors rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                    <Download className="w-4 h-4" />
                  </button>
                  {isEditing && (
                    <button onClick={() => handleRemoveFile(index)} className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {uploadedFiles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed md:col-span-2 lg:col-span-3 border-slate-100 rounded-2xl bg-slate-50/30">
                <div className="flex items-center justify-center w-12 h-12 mb-3 bg-white border rounded-full shadow-sm border-slate-100">
                  <X className="w-6 h-6 text-slate-200" />
                </div>
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Archive Safe Empty</p>
                <p className="text-[11px] text-slate-400 mt-1">No identification documents have been uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </div>
  )
}
           