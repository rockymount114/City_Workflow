'use client'

import { useState, useEffect } from 'react'
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import CreateApplicationModal from './CreateApplicationModal'
import EditApplicationModal from './EditApplicationModal'
import DeleteApplicationModal from './DeleteApplicationModal'
import ViewApplicationModal from './ViewApplicationModal'
import { CreateApplicationInput } from '@/src/lib/validations/application'

interface Application {
  id: string
  name: string
  description: string
  isActive: boolean
  requiresApproval: boolean
  approvalWorkflow: string[]
  createdAt: string
  updatedAt: string
  customFields: ApplicationField[]
}

interface ApplicationField {
  id: string
  name: string
  type: string
  required: boolean
  order: number
}

export default function ApplicationManagement() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = applications.filter(application => {
    const matchesSearch =
      application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !selectedStatus ||
      (selectedStatus === 'active' && application.isActive) ||
      (selectedStatus === 'inactive' && !application.isActive)

    return matchesSearch && matchesStatus
  })

  const handleCreateApplication = async (applicationData: CreateApplicationInput) => {
    try {
      const response = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      })

      if (response.ok) {
        fetchApplications()
        setShowCreateModal(false)
      }
    } catch (error) {
      console.error('Error creating application:', error)
    }
  }

  const handleEditApplication = async (applicationData: CreateApplicationInput) => {
    if (!selectedApplication) return

    try {
      const response = await fetch(`/api/admin/applications/${selectedApplication.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      })

      if (response.ok) {
        fetchApplications()
        setShowEditModal(false)
        setSelectedApplication(null)
      }
    } catch (error) {
      console.error('Error updating application:', error)
    }
  }

  const handleDeleteApplication = async () => {
    if (!selectedApplication) return

    try {
      const response = await fetch(`/api/admin/applications/${selectedApplication.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchApplications()
        setShowDeleteModal(false)
        setSelectedApplication(null)
      }
    } catch (error) {
      console.error('Error deleting application:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Application
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{application.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  application.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {application.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{application.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <span className="text-gray-500">Approval Required:</span>
                  <span className="ml-2 font-medium">
                    {application.requiresApproval ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500">Fields:</span>
                  <span className="ml-2 font-medium">{application.customFields?.length || 0}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 font-medium">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedApplication(application)
                    setShowViewModal(true)
                  }}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => {
                    setSelectedApplication(application)
                    setShowEditModal(true)
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedApplication(application)
                    setShowDeleteModal(true)
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedStatus ? 'Try adjusting your search or filter.' : 'Get started by creating a new application.'}
          </p>
        </div>
      )}

      {showCreateModal && (
        <CreateApplicationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateApplication}
        />
      )}

      {showEditModal && selectedApplication && (
        <EditApplicationModal
          application={selectedApplication}
          onClose={() => {
            setShowEditModal(false)
            setSelectedApplication(null)
          }}
          onSubmit={handleEditApplication}
        />
      )}

      {showDeleteModal && selectedApplication && (
        <DeleteApplicationModal
          application={selectedApplication}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedApplication(null)
          }}
          onConfirm={handleDeleteApplication}
        />
      )}

      {showViewModal && selectedApplication && (
        <ViewApplicationModal
          application={selectedApplication}
          onClose={() => {
            setShowViewModal(false)
            setSelectedApplication(null)
          }}
        />
      )}
    </div>
  )
}