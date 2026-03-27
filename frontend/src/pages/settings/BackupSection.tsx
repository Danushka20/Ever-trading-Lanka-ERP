import React, { useState, useRef } from 'react';
import { Database, Download, AlertTriangle, CheckCircle2, Loader2, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AIDialog } from '@/components/ui/ai-dialog';

export function BackupSection() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setStatus('idle');
    try {
      const response = await api.get('/backup/download', {
        responseType: 'blob',
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers if possible, otherwise use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `backup-${new Date().toISOString().split('T')[0]}.sql`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setStatus('success');
      toast.success('Backup downloaded successfully');
    } catch (error) {
      console.error('Backup download failed:', error);
      setStatus('error');
      toast.error('Failed to generate backup');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.sql')) {
      toast.error('Please select a .sql file');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setPendingFile(file);
    setIsRestoreDialogOpen(true);
  };

  const confirmRestore = async () => {
    if (!pendingFile) return;

    setIsRestoring(true);
    const formData = new FormData();
    formData.append('file', pendingFile);

    try {
      await api.post('/backup/restore', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Database restored successfully! The page will now reload.', {
        duration: 5000,
      });
      // Delay reload to allow user to see toast
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      console.error('Restore failed:', error);
      const errorMessage = error.response?.data?.message || 'Restore failed';
      toast.error(errorMessage);
    } finally {
      setIsRestoring(false);
      setIsRestoreDialogOpen(false);
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-8 space-y-8 duration-700 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Database Backup</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Generate and download a complete backup of your system data
          </p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-2xl">
          <Database className="w-8 h-8 text-indigo-600" />
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden shadow-sm border-slate-200/60">
          <CardHeader className="border-b bg-slate-50/50 border-slate-100">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Download className="w-5 h-5 text-indigo-500" />
              Full System Backup
            </CardTitle>
            <CardDescription>
              This will export all tables, records, and configurations from your database into a SQL file.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl space-y-4">
                <div className="flex gap-4 p-4 border bg-amber-50 rounded-xl border-amber-100/50">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm font-medium leading-relaxed text-amber-800">
                    Recommended to perform backups during low-activity periods. Large databases may take a few moments to generate.
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm font-medium text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    Includes all Sales, Inventory, and Financial data
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    Includes Sales Areas, Dealers, and Customer records
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    Includes User accounts and Permission settings
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center gap-4 min-w-[200px]">
                <Button 
                  onClick={handleDownload} 
                  disabled={isDownloading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200/50 h-12 rounded-xl transition-all duration-300 transform active:scale-[0.98]"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Backup
                    </>
                  )}
                </Button>

                {status === 'success' && (
                  <div className="flex items-center gap-2 text-sm font-semibold duration-300 text-emerald-600 animate-in fade-in zoom-in-95">
                    <CheckCircle2 className="w-4 h-4" />
                    Backup completed successfully
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-sm font-semibold duration-300 text-rose-600 animate-in fade-in zoom-in-95">
                    <AlertTriangle className="w-4 h-4" />
                    Failed to generate backup
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed shadow-sm border-slate-200/60 bg-slate-50/20">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-indigo-100">
              <Upload className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="mb-1 font-semibold text-slate-900">Restore Data</h3>
            <p className="max-w-md mb-6 text-sm text-slate-500">
              Select a previously downloaded SQL backup file to restore your entire database. 
              <span className="block mt-2 font-bold text-rose-500">
                Caution: This will overwrite all your current data!
              </span>
            </p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".sql" 
              className="hidden" 
            />
            
            <Button 
              onClick={handleRestoreClick}
              variant="outline"
              className="border-2 border-indigo-200 hover:bg-white hover:border-indigo-500 hover:text-indigo-600 rounded-xl px-8 h-12 transition-all duration-300"
            >
              <FileText className="w-5 h-5 mr-2" />
              Upload & Restore Backup
            </Button>
          </CardContent>
        </Card>

        {/* Restore Confirmation Dialog */}
        <AIDialog
          open={isRestoreDialogOpen}
          onOpenChange={setIsRestoreDialogOpen}
          variant="danger"
          title="Critical: Restore Database"
          description="You are about to restore the database from an external file."
          confirmText="Overwrite Everything"
          onConfirm={confirmRestore}
          isActionLoading={isRestoring}
        >
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-rose-800">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div className="text-sm font-medium leading-relaxed">
                <p className="font-bold mb-1 uppercase tracking-wider">Warning: Data Loss Imminent</p>
                All your current sales, items, dealers, and settings will be <strong>replaced completely</strong> by the data in:
                <div className="mt-2 font-mono text-xs bg-white/50 p-2 rounded border border-rose-200 truncate">
                  {pendingFile?.name}
                </div>
              </div>
            </div>
            
            <ul className="space-y-2 text-sm text-slate-600 px-2">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-slate-400" />
                This action cannot be undone
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-slate-400" />
                The system will reload automatically after success
              </li>
            </ul>
          </div>
        </AIDialog>
      </div>
    </div>
  );
}
