'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CreateApplicationInput } from '@/src/lib/validations/application'

interface ApplicationField {
  id: string
  name: string
  type: string
  required: boolean
  order: number
}

interface Application {
  id: string
  name: string
  description: string
  isActive: boolean
  requiresApproval: boolean
  approvalWorkflow: string[]
  createdAt: string
  updatedAt: string
  fields: ApplicationField[]
}

interface EditApplicationModalProps {
  application: Application
  onClose: () => void
  onSubmit: (applicationData: CreateApplicationInput) => void
}

export default function EditApplicationModal({ application, onClose, onSubmit }: EditApplicationModalProps) {
  const [formData, setFormData] = useState({
    name: application.name,
    description: application.description,
    isActive: application.isActive,
    requiresApproval: application.requiresApproval,
    approvalWorkflow: application.approvalWorkflow
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Application name is required')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        requiresApproval: formData.requiresApproval,
        approvalWorkflow: formData.approvalWorkflow
      })
    } catch {
      setError('Failed to update application')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleApprovalWorkflowChange = (role: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        approvalWorkflow: [...formData.approvalWorkflow, role]
      })
    } else {
      setFormData({
        ...formData,
        approvalWorkflow: formData.approvalWorkflow.filter(r => r !== role)
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Application</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Application Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Application is active
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requiresApproval"
                name="requiresApproval"
                checked={formData.requiresApproval}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requiresApproval" className="ml-2 block text-sm text-gray-900">
                Requires approval
              </label>
            </div>
          </div>

          {formData.requiresApproval && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Workflow
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="approver_l1"
                    checked={formData.approvalWorkflow.includes('APPROVER_L1')}
                    onChange={(e) => handleApprovalWorkflowChange('APPROVER_L1', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="approver_l1" className="ml-2 block text-sm text-gray-900">
                    Level 1 Approver
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="approver_l2"
                    checked={formData.approvalWorkflow.includes('APPROVER_L2')}
                    onChange={(e) => handleApprovalWorkflowChange('APPROVER_L2', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="approver_l2" className="ml-2 block text-sm text-gray-900">
                    Level 2 Approver
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="admin"
                    checked={formData.approvalWorkflow.includes('ADMIN')}
                    onChange={(e) => handleApprovalWorkflowChange('ADMIN', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="admin" className="ml-2 block text-sm text-gray-900">
                    Admin
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}