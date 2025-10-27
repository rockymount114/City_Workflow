'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'

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
  customFields: ApplicationField[]
}

interface ViewApplicationModalProps {
  application: Application
  onClose: () => void
}

export default function ViewApplicationModal({ application, onClose }: ViewApplicationModalProps) {
  const roleLabels = {
    ADMIN: 'Admin',
    APPROVER_L1: 'Level 1 Approver',
    APPROVER_L2: 'Level 2 Approver',
    APPLICANT: 'Applicant'
  }

  const fieldTypeLabels = {
    text: 'Text',
    textarea: 'Text Area',
    number: 'Number',
    date: 'Date',
    select: 'Select',
    checkbox: 'Checkbox',
    file: 'File Upload'
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Name</label>
                  <p className="text-sm text-gray-900">{application.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Description</label>
                  <p className="text-sm text-gray-900">{application.description || 'No description provided'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    application.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {application.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Configuration</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Requires Approval</label>
                  <p className="text-sm text-gray-900">{application.requiresApproval ? 'Yes' : 'No'}</p>
                </div>
                {application.requiresApproval && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Approval Workflow</label>
                    <div className="space-y-1">
                      {application.approvalWorkflow.map((role, index) => (
                        <span key={role} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                          {index + 1}. {roleLabels[role as keyof typeof roleLabels]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900">{new Date(application.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Form Fields ({application.customFields?.length || 0})</h4>
            {application.customFields && application.customFields.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Field Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Required
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {application.customFields.map((field) => (
                      <tr key={field.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {field.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {fieldTypeLabels[field.type as keyof typeof fieldTypeLabels] || field.type}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            field.required
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {field.required ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {field.order}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No form fields configured for this application.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}