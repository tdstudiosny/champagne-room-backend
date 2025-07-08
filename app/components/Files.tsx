'use client'

import { useEffect, useState } from 'react'

export default function Files() {
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingFiles, setUploadingFiles] = useState(false)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('td-portal-token')
      const response = await fetch('/api/files/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files)
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingFiles(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const token = localStorage.getItem('td-portal-token')
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
      
      if (response.ok) {
        fetchFiles() // Refresh the file list
      }
    } catch (error) {
      console.error('Failed to upload file:', error)
    } finally {
      setUploadingFiles(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return '🖼️'
    if (mimetype.startsWith('video/')) return '🎥'
    if (mimetype.startsWith('audio/')) return '🎵'
    if (mimetype.includes('pdf')) return '📄'
    if (mimetype.includes('text/')) return '📝'
    if (mimetype.includes('application/json')) return '📊'
    return '📄'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading files...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">File Manager</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploadingFiles}
          />
          <label
            htmlFor="file-upload"
            className={`btn-primary ${uploadingFiles ? 'opacity-50' : ''}`}
          >
            {uploadingFiles ? 'Uploading...' : 'Upload File'}
          </label>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold mb-2">No files yet</h3>
          <p className="text-gray-600">Upload your first file to get started</p>
        </div>
      ) : (
        <div className="file-grid">
          {files.map((file: any) => (
            <div key={file.id} className="file-item">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {getFileIcon(file.mimetype)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm truncate">
                    {file.originalName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {file.category}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-ghost text-sm">
                  Download
                </button>
                <button className="btn-ghost text-sm text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 