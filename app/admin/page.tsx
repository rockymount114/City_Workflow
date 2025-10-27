import { Metadata } from 'next'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Overview',
  description: 'Administrative dashboard overview',
}

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      <AdminDashboard />
    </div>
  )
}