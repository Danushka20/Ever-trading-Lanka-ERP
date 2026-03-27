import { useState, useEffect } from 'react'
import { CompanyInfoForm } from './settings/CompanyInfoForm'
import { SettingsSidebar } from './settings/SettingsSidebar'
import api from '@/lib/api'
import { PreferencesSection } from './settings/PreferencesSection'
import { NotificationsSection } from './settings/NotificationsSection'
import { SecuritySection } from './settings/SecuritySection'
import { TeamSection } from './settings/TeamSection'
import { HelpSection } from './settings/HelpSection'
import { BackupSection } from './settings/BackupSection'
import type { CompanyData } from './settings/CompanyInfoForm'
import { PageHeader } from "@/components/ui/page-header"

export function Settings() {
  const [activeTab, setActiveTab] = useState('company')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [companyInfo, setCompanyInfo] = useState<CompanyData>({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    taxId: '',
    registrationNumber: '',
  })

  const [formData, setFormData] = useState<CompanyData>(companyInfo)

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await api.get('/company-info')
        if (response.data) {
          setCompanyInfo(response.data)
          setFormData(response.data)
        }
      } catch (error) {
        console.error('Error fetching company information:', error)
      }
    }

    if (activeTab === 'company') {
      fetchCompanyInfo()
    }
  }, [activeTab])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async (logoFile: File | null) => {
    setIsSaving(true)
    try {
      const formDataToSend = new FormData()
      
      // Only append editable fields (exclude updatedAt which is read-only)
      const fieldsToSend = ['name', 'email', 'phone', 'website', 'address', 'city', 'state', 'zipCode', 'country', 'taxId', 'registrationNumber']
      
      fieldsToSend.forEach((key) => {
        const value = formData[key as keyof CompanyData]
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value as string)
        }
      })

      // Append logo if it exists
      if (logoFile) {
        formDataToSend.append('logo', logoFile)
      }

      const response = await api.post('/company-info', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data && response.data.data) {
        setCompanyInfo(response.data.data)
        setFormData(response.data.data)
      }
      setIsEditing(false)
      console.log('Company information saved')
    } catch (error) {
      console.error('Error saving company information:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(companyInfo)
    setIsEditing(false)
  }

  return (
    <div className="flex-1 min-h-screen p-8 pt-6 space-y-8 bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <PageHeader 
          title="Settings" 
          description="Manage your organizational parameters and user workspace preferences" 
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Settings Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04),0_4px_6px_-2px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-500 min-h-[600px]">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === 'company' && (
                  <CompanyInfoForm
                    formData={formData}
                    isEditing={isEditing}
                    isSaving={isSaving}
                    onInputChange={handleInputChange}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                )}

                {activeTab === 'preferences' && <PreferencesSection />}

                {activeTab === 'notifications' && <NotificationsSection />}

                {activeTab === 'security' && <SecuritySection />}

                {activeTab === 'team' && <TeamSection />}

                {activeTab === 'backup' && <BackupSection />}

                {activeTab === 'help' && <HelpSection />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
