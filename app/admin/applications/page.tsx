import { Metadata } from 'next'
import ApplicationManagement from '@/components/admin/ApplicationManagement'

export const metadata: Metadata = {
  title: 'Application Management - Admin',
  description: 'Manage applications and their configurations',
}

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Application Management</h1>
      </div>
      <ApplicationManagement />
    </div>
  )
}