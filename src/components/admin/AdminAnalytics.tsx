'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline'

interface AnalyticsData {
  totalRequests: number
  approvedRequests: number
  rejectedRequests: number
  pendingRequests: number
  averageProcessingTime: number
  topApplications: Array<{
    name: string
    count: number
  }>
  monthlyTrends: Array<{
    month: string
    requests: number
    approved: number
  }>
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    pendingRequests: 0,
    averageProcessingTime: 0,
    topApplications: [],
    monthlyTrends: []
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Requests',
      value: analytics.totalRequests,
      icon: DocumentTextIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Approved',
      value: analytics.approvedRequests,
      icon: ChartBarIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Rejected',
      value: analytics.rejectedRequests,
      icon: DocumentTextIcon,
      color: 'bg-red-500'
    },
    {
      name: 'Pending',
      value: analytics.pendingRequests,
      icon: ClockIcon,
      color: 'bg-yellow-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.name}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Applications</h3>
          {analytics.topApplications.length > 0 ? (
            <div className="space-y-3">
              {analytics.topApplications.map((app, index) => (
                <div key={app.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{index + 1}. {app.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{app.count} requests</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No application data available</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Average Processing Time</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{analytics.averageProcessingTime} hours</p>
            <p className="text-sm text-gray-500 mt-1">From submission to final decision</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
        {analytics.monthlyTrends.length > 0 ? (
          <div className="space-y-4">
            {analytics.monthlyTrends.map((trend) => (
              <div key={trend.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{trend.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{trend.requests} total</span>
                  <span className="text-sm text-green-600">{trend.approved} approved</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No trend data available</p>
        )}
      </div>
    </div>
  )
}