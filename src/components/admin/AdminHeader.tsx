'use client'

import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            City Workflow
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-700 font-medium">Admin Panel</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Welcome, {session?.user?.name || session?.user?.email}
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}