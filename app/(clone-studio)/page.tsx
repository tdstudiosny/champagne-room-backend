'use client'

import { useState, useEffect } from 'react'

interface ClonedSite {
  id: string
  originalUrl: string
  clonedUrl: string
  name: string
  status: 'cloning' | 'completed' | 'failed'
  progress: number
  createdAt: string
  improvements: string[]
  revenue: number
}

export default function CloneStudioPage() {
  const [targetUrl, setTargetUrl] = useState('')
  const [isCloning, setIsCloning] = useState(false)
  const [cloneProgress, setCloneProgress] = useState(0)
  const [clonedSites, setClonedSites] = useState<ClonedSite[]>([])
  const [analysisData, setAnalysisData] = useState<any>(null)

  useEffect(() => {
    // Load cloned sites history
    loadClonedSites()
  }, [])

  const loadClonedSites = () => {
    // Sample data for demo
    const sampleSites: ClonedSite[] = [
      {
        id: '1',
        originalUrl: 'https://luxury-competitor.com',
        clonedUrl: 'https://tyler-luxury-clone.com',
        name: 'Luxury Competitor Clone',
        status: 'completed',
        progress: 100,
        createdAt: '2024-01-20',
        improvements: ['Added premium checkout', 'Enhanced mobile UX', 'Improved conversion funnel'],
        revenue: 12500
      },
      {
        id: '2',
        originalUrl: 'https://successful-adult-site.com',
        clonedUrl: 'https://tyler-adult-clone.com',
        name: 'Adult Content Platform Clone',
        status: 'completed',
        progress: 100,
        createdAt: '2024-01-18',
        improvements: ['Better payment integration', 'Enhanced privacy features', 'Optimized performance'],
        revenue: 8750
      }
    ]
    setClonedSites(sampleSites)
  }

  const analyzeWebsite = async () => {
    if (!targetUrl) return

    setIsCloning(true)
    setCloneProgress(10)

    try {
      // Simulate AI analysis
      setCloneProgress(30)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockAnalysis = {
        title: 'High-Converting Luxury E-commerce Site',
        description: 'Premium product showcase with sophisticated checkout flow',
        technologies: ['React', 'Stripe', 'Shopify', 'AWS'],
        conversionRate: '3.2%',
        monthlyRevenue: '$45,000',
        keyFeatures: [
          'Premium product galleries',
          'One-click checkout',
          'VIP membership system',
          'Live chat support',
          'Mobile-first design'
        ],
        opportunities: [
          'Add subscription model (+40% revenue)',
          'Implement AI recommendations (+25% conversion)',
          'Optimize mobile funnel (+15% mobile sales)',
          'Add social proof (+20% trust)'
        ]
      }
      
      setAnalysisData(mockAnalysis)
      setCloneProgress(60)
      
    } catch (error) {
      console.error('Analysis failed:', error)
      setIsCloning(false)
    }
  }

  const startCloning = async () => {
    if (!analysisData) return

    setCloneProgress(70)
    
    // Simulate cloning process
    const intervals = [80, 90, 95, 100]
    for (const progress of intervals) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCloneProgress(progress)
    }

    // Add to cloned sites
    const newClone: ClonedSite = {
      id: Date.now().toString(),
      originalUrl: targetUrl,
      clonedUrl: `https://tyler-clone-${Date.now()}.com`,
      name: analysisData.title + ' Clone',
      status: 'completed',
      progress: 100,
      createdAt: new Date().toISOString(),
      improvements: analysisData.opportunities.slice(0, 3),
      revenue: 0
    }

    setClonedSites([newClone, ...clonedSites])
    setIsCloning(false)
    setCloneProgress(0)
    setTargetUrl('')
    setAnalysisData(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cloning': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔄 AI Beast Clone Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Paste any URL and watch Tyler's AI Beast analyze, clone, and improve it in minutes. 
            Turn competitor sites into revenue-generating assets.
          </p>
        </div>

        {/* Clone Input */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Target Website URL
              </label>
              <div className="flex gap-4">
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://competitor-website.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  disabled={isCloning}
                />
                <button
                  onClick={analyzeWebsite}
                  disabled={!targetUrl || isCloning}
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCloning ? '🤖 Analyzing...' : '🔍 Analyze & Clone'}
                </button>
              </div>
            </div>

            {/* Clone Progress */}
            {isCloning && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>AI Beast Progress</span>
                  <span>{cloneProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${cloneProgress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {cloneProgress < 30 && '🕵️ Analyzing competitor structure...'}
                  {cloneProgress >= 30 && cloneProgress < 60 && '🧠 AI identifying revenue opportunities...'}
                  {cloneProgress >= 60 && cloneProgress < 100 && '🔄 Cloning and optimizing...'}
                  {cloneProgress === 100 && '✅ Clone complete! Ready to deploy.'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {analysisData && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🧠 AI Analysis Results</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Site Overview</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Title:</strong> {analysisData.title}</div>
                    <div><strong>Description:</strong> {analysisData.description}</div>
                    <div><strong>Conversion Rate:</strong> {analysisData.conversionRate}</div>
                    <div><strong>Monthly Revenue:</strong> {analysisData.monthlyRevenue}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.technologies.map((tech: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-1">
                    {analysisData.keyFeatures.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 AI Improvement Opportunities</h3>
                <div className="space-y-3">
                  {analysisData.opportunities.map((opportunity: string, index: number) => (
                    <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 font-medium">
                        <span>💡</span>
                        {opportunity}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={startCloning}
                  className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  🚀 Clone with AI Improvements
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cloned Sites History */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Clone History</h2>
          
          {clonedSites.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clones yet</h3>
              <p className="text-gray-600">Start by analyzing and cloning your first competitor site</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {clonedSites.map((site) => (
                <div key={site.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{site.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(site.status)}`}>
                      {site.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-gray-500">Original:</div>
                      <div className="text-blue-600 truncate">{site.originalUrl}</div>
                    </div>
                    
                    <div>
                      <div className="text-gray-500">Clone URL:</div>
                      <div className="text-green-600 truncate">{site.clonedUrl}</div>
                    </div>

                    <div>
                      <div className="text-gray-500 mb-1">AI Improvements:</div>
                      <ul className="space-y-1">
                        {site.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs">
                            <span className="text-green-600">✓</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500">Revenue Generated</div>
                        <div className="text-lg font-bold text-green-600">
                          ${site.revenue.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(site.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200">
                      View Clone
                    </button>
                    <button className="flex-1 px-3 py-2 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200">
                      Deploy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 