'use client'

import { useState, useEffect } from 'react'

interface FileItem {
  id: string
  name: string
  type: string
  size: number
  category: 'env' | 'media' | 'documents' | 'code' | 'other'
  uploadDate: string
  path: string
  secure: boolean
}

export default function Files() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'env' | 'media' | 'documents' | 'code'>('all')
  const [isDesktop, setIsDesktop] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    setIsDesktop(!!(window as any).electronAPI)
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
        setFiles(data.files || defaultFiles)
      } else {
        setFiles(defaultFiles)
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
      setFiles(defaultFiles)
    } finally {
      setLoading(false)
    }
  }

  const defaultFiles: FileItem[] = [
    {
      id: '1',
      name: '.env.production',
      type: 'env',
      size: 2048,
      category: 'env',
      uploadDate: '2024-01-20',
      path: '/secure/.env.production',
      secure: true
    },
    {
      id: '2',
      name: 'API_KEYS.env',
      type: 'env',
      size: 1536,
      category: 'env',
      uploadDate: '2024-01-19',
      path: '/secure/API_KEYS.env',
      secure: true
    },
    {
      id: '3',
      name: 'luxury-platform-demo.mp4',
      type: 'video',
      size: 52428800,
      category: 'media',
      uploadDate: '2024-01-18',
      path: '/media/luxury-platform-demo.mp4',
      secure: false
    },
    {
      id: '4',
      name: 'business-plan-2024.pdf',
      type: 'pdf',
      size: 2097152,
      category: 'documents',
      uploadDate: '2024-01-17',
      path: '/docs/business-plan-2024.pdf',
      secure: true
    },
    {
      id: '5',
      name: 'ai-beast-source.zip',
      type: 'zip',
      size: 10485760,
      category: 'code',
      uploadDate: '2024-01-16',
      path: '/code/ai-beast-source.zip',
      secure: true
    }
  ]

  const filteredFiles = files.filter(file => {
    if (filter === 'all') return true
    return file.category === filter
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'env': return '🔐'
      case 'video': return '🎥'
      case 'pdf': return '📄'
      case 'zip': return '📦'
      case 'image': return '🖼️'
      case 'code': return '💻'
      default: return '📁'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'env': return 'bg-red-100 text-red-800'
      case 'media': return 'bg-purple-100 text-purple-800'
      case 'documents': return 'bg-blue-100 text-blue-800'
      case 'code': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const token = localStorage.getItem('td-portal-token')
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        await fetchFiles()
        console.log('File uploaded successfully')
      } else {
        console.error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      event.target.value = ''
    }
  }

  const deleteFile = async (fileId: string) => {
    try {
      const token = localStorage.getItem('td-portal-token')
      const response = await fetch(`/api/files/delete/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        setFiles(files.filter(f => f.id !== fileId))
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (loading) {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isDesktop ? '📁 Secure File Vault' : 'File Manager'}
          </h2>
          <p className="text-gray-600">
            {isDesktop ? 'Encrypted storage for sensitive files and media' : 'Upload and manage your files'}
          </p>
        </div>
        <label className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
          {isDesktop ? '🔒 Upload Secure File' : '+ Upload File'}
          <input 
            type="file" 
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Uploading...</span>
            <span className="text-sm text-blue-700">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* AI Beast Storage Stats (Desktop Only) */}
      {isDesktop && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{files.filter(f => f.category === 'env').length}</div>
            <div className="text-sm opacity-90">Secure .env Files</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{files.filter(f => f.category === 'media').length}</div>
            <div className="text-sm opacity-90">Media Assets</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{files.filter(f => f.secure).length}</div>
            <div className="text-sm opacity-90">Encrypted Files</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}</div>
            <div className="text-sm opacity-90">Total Storage</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['all', 'env', 'media', 'documents', 'code'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                filter === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'env' ? 'Environment' : tab} ({files.filter(f => tab === 'all' ? true : f.category === tab).length})
            </button>
          ))}
        </nav>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFiles.map((file) => (
          <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getFileIcon(file.type)}</span>
                {file.secure && <span className="text-sm">🔒</span>}
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(file.category)}`}>
                {file.category}
              </span>
            </div>

            <h3 className="font-medium text-gray-900 text-sm mb-2 truncate" title={file.name}>
              {file.name}
            </h3>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Size: {formatFileSize(file.size)}</div>
              <div>Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</div>
              {file.secure && (
                <div className="text-red-600 font-medium">🔐 Encrypted</div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
              <button className="text-xs text-blue-600 hover:text-blue-900">
                Download
              </button>
              <div className="flex gap-2">
                <button className="text-xs text-gray-600 hover:text-gray-900">
                  Share
                </button>
                <button 
                  onClick={() => deleteFile(file.id)}
                  className="text-xs text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' ? 'Upload your first file to get started' : `No ${filter} files found`}
          </p>
          <label className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
            {isDesktop ? '🔒 Upload Secure File' : 'Upload File'}
            <input 
              type="file" 
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  )
} 