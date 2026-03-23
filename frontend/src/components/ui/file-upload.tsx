import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload, X, File, Image, FileText, FileSpreadsheet, FileArchive, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "./button"
import { Progress } from "./progress"

// Types
export interface FileInfo {
  id: string
  file: File
  name: string
  size: number
  type: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
  url?: string
}

export interface FileUploadProps {
  value?: FileInfo[]
  onChange?: (files: FileInfo[]) => void
  onUpload?: (file: File) => Promise<{ url: string } | void>
  accept?: string
  maxSize?: number // in bytes
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  className?: string
  // Display options
  variant?: "dropzone" | "button" | "minimal"
  showPreview?: boolean
  showProgress?: boolean
  // Custom content
  title?: string
  description?: string
  buttonText?: string
}

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image
  if (type.includes("spreadsheet") || type.includes("excel")) return FileSpreadsheet
  if (type.includes("zip") || type.includes("archive")) return FileArchive
  if (type.includes("pdf") || type.includes("document")) return FileText
  return File
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// File Preview Component
function FilePreview({
  fileInfo,
  onRemove,
  showProgress,
}: {
  fileInfo: FileInfo
  onRemove?: () => void
  showProgress?: boolean
}) {
  const Icon = getFileIcon(fileInfo.type)
  const isImage = fileInfo.type.startsWith("image/")
  const [preview, setPreview] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isImage && fileInfo.file) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(fileInfo.file)
    }
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [fileInfo.file, isImage])

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
      {/* Preview/Icon */}
      <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
        {isImage && preview ? (
          <img src={preview} alt={fileInfo.name} className="h-full w-full object-cover" />
        ) : (
          <Icon className="h-5 w-5 text-slate-500" />
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{fileInfo.name}</p>
        <p className="text-xs text-slate-500">{formatFileSize(fileInfo.size)}</p>
        {showProgress && fileInfo.status === "uploading" && (
          <Progress value={fileInfo.progress} className="h-1 mt-2" />
        )}
        {fileInfo.status === "error" && (
          <p className="text-xs text-red-600 mt-1">{fileInfo.error || "Upload failed"}</p>
        )}
      </div>

      {/* Status/Actions */}
      <div className="shrink-0">
        {fileInfo.status === "uploading" && (
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
        )}
        {fileInfo.status === "success" && (
          <CheckCircle className="h-5 w-5 text-emerald-600" />
        )}
        {fileInfo.status === "error" && (
          <AlertCircle className="h-5 w-5 text-red-600" />
        )}
        {(fileInfo.status === "pending" || fileInfo.status === "success") && onRemove && (
          <button
            onClick={onRemove}
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        )}
      </div>
    </div>
  )
}

// Main FileUpload Component
export function FileUpload({
  value = [],
  onChange,
  onUpload,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  multiple = false,
  disabled = false,
  className,
  variant = "dropzone",
  showPreview = true,
  showProgress = true,
  title = "Upload files",
  description = "Drag and drop files here, or click to browse",
  buttonText = "Choose files",
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = async (files: File[]) => {
    const remainingSlots = maxFiles - value.length
    const filesToProcess = multiple ? files.slice(0, remainingSlots) : [files[0]]

    const newFileInfos: FileInfo[] = []

    for (const file of filesToProcess) {
      // Validate size
      if (file.size > maxSize) {
        newFileInfos.push({
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          status: "error",
          error: `File size exceeds ${formatFileSize(maxSize)}`,
        })
        continue
      }

      // Validate type
      if (accept) {
        const acceptedTypes = accept.split(",").map((t) => t.trim())
        const isValidType = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return file.name.toLowerCase().endsWith(type.toLowerCase())
          }
          if (type.endsWith("/*")) {
            const category = type.slice(0, -2)
            return file.type.startsWith(category)
          }
          return file.type === type
        })

        if (!isValidType) {
          newFileInfos.push({
            id: generateId(),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: "error",
            error: "File type not accepted",
          })
          continue
        }
      }

      const fileInfo: FileInfo = {
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: onUpload ? "pending" : "success",
      }

      newFileInfos.push(fileInfo)
    }

    const updatedFiles = multiple ? [...value, ...newFileInfos] : newFileInfos
    onChange?.(updatedFiles)

    // Auto-upload if handler provided
    if (onUpload) {
      for (const fileInfo of newFileInfos.filter((f) => f.status === "pending")) {
        await uploadFile(fileInfo, updatedFiles)
      }
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const uploadFile = async (fileInfo: FileInfo, allFiles: FileInfo[]) => {
    if (!onUpload) return

    const updateFileInfo = (updates: Partial<FileInfo>) => {
      const newFiles = allFiles.map((f) =>
        f.id === fileInfo.id ? { ...f, ...updates } : f
      )
      onChange?.(newFiles)
      return newFiles
    }

    updateFileInfo({ status: "uploading", progress: 0 })

    try {
      const result = await onUpload(fileInfo.file)
      updateFileInfo({
        status: "success",
        progress: 100,
        url: result?.url,
      })
    } catch (error) {
      updateFileInfo({
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      })
    }
  }

  const handleRemove = (id: string) => {
    onChange?.(value.filter((f) => f.id !== id))
  }

  const canAddMore = value.length < maxFiles

  // Button variant
  if (variant === "button") {
    return (
      <div className={cn("space-y-3", className)}>
        <div>
          <Button
            type="button"
            variant="outline"
            disabled={disabled || !canAddMore}
            onClick={() => inputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {buttonText}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
        </div>
        {showPreview && value.length > 0 && (
          <div className="space-y-2">
            {value.map((fileInfo) => (
              <FilePreview
                key={fileInfo.id}
                fileInfo={fileInfo}
                onRemove={() => handleRemove(fileInfo.id)}
                showProgress={showProgress}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Minimal variant
  if (variant === "minimal") {
    return (
      <div className={cn("space-y-2", className)}>
        <label
          className={cn(
            "inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Upload className="h-4 w-4" />
          <span className="underline">{buttonText}</span>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled || !canAddMore}
          />
        </label>
        {showPreview && value.length > 0 && (
          <div className="space-y-1.5">
            {value.map((fileInfo) => (
              <div key={fileInfo.id} className="flex items-center gap-2 text-sm">
                <File className="h-4 w-4 text-slate-400" />
                <span className="truncate">{fileInfo.name}</span>
                <button
                  onClick={() => handleRemove(fileInfo.id)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Dropzone variant (default)
  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && canAddMore && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer",
          isDragging && "border-blue-400 bg-blue-50",
          !isDragging && !disabled && "border-slate-300 hover:border-slate-400 hover:bg-slate-50",
          disabled && "opacity-50 cursor-not-allowed bg-slate-50"
        )}
      >
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Upload className="h-6 w-6 text-slate-600" />
        </div>
        <p className="text-sm font-medium text-slate-700 mb-1">{title}</p>
        <p className="text-sm text-slate-500 text-center mb-4">{description}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || !canAddMore}
          onClick={(e) => {
            e.stopPropagation()
            inputRef.current?.click()
          }}
        >
          {buttonText}
        </Button>
        <p className="text-xs text-slate-400 mt-3">
          Max {formatFileSize(maxSize)} per file
          {multiple && ` • ${maxFiles - value.length} files remaining`}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {showPreview && value.length > 0 && (
        <div className="space-y-2">
          {value.map((fileInfo) => (
            <FilePreview
              key={fileInfo.id}
              fileInfo={fileInfo}
              onRemove={() => handleRemove(fileInfo.id)}
              showProgress={showProgress}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Single Image Upload Component
export function ImageUpload({
  value,
  onChange,
  onUpload,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  className,
  placeholder,
}: {
  value?: string
  onChange?: (url: string | null) => void
  onUpload?: (file: File) => Promise<{ url: string }>
  accept?: string
  maxSize?: number
  disabled?: boolean
  className?: string
  placeholder?: React.ReactNode
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [preview, setPreview] = React.useState<string | null>(value || null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setPreview(value || null)
  }, [value])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate
    if (file.size > maxSize) {
      setError(`File size exceeds ${formatFileSize(maxSize)}`)
      return
    }

    // Preview
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    // Upload
    if (onUpload) {
      setIsUploading(true)
      try {
        const result = await onUpload(file)
        onChange?.(result.url)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed")
        setPreview(value || null)
      } finally {
        setIsUploading(false)
      }
    } else {
      // Just use the preview URL
      onChange?.(preview || null)
    }

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange?.(null)
  }

  return (
    <div className={cn("relative", className)}>
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Upload"
            className="w-full h-40 object-cover rounded-lg border border-slate-200"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
            >
              Remove
            </Button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            disabled
              ? "opacity-50 cursor-not-allowed bg-slate-50"
              : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
          )}
        >
          {placeholder || (
            <>
              <Image className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">Click to upload image</p>
            </>
          )}
        </div>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  )
}

export default FileUpload
