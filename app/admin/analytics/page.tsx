import { Metadata } from 'next'
import AdminAnalytics from '@/components/admin/AdminAnalytics'

export const metadata: Metadata = {
  title: 'Analytics - Admin',
  description: 'System analytics and reporting',
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
      </div>
      <AdminAnalytics />
    </div>
  )
}