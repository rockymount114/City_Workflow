import { Metadata } from 'next'
import UserManagement from '@/components/admin/UserManagement'

export const metadata: Metadata = {
  title: 'User Management - Admin',
  description: 'Manage users and their roles',
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      </div>
      <UserManagement />
    </div>
  )
}