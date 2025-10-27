'use client'

import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Application {
  id: string
  name: string
  description: string
}

interface DeleteApplicationModalProps {
  application: Application
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteApplicationModal({ application, onClose, onConfirm }: DeleteApplicationModalProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error('Error deleting application:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Delete Application</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center mb-4">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mr-3" />
          <div>
            <p className="text-sm text-gray-700">
              Are you sure you want to delete this application?
            </p>
            <p className="text-sm font-medium text-gray-900">
              {application.name}
            </p>
            {application.description && (
              <p className="text-xs text-gray-500 mt-1">
                {application.description}
              </p>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> This action cannot be undone. All associated requests and data will be permanently deleted.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Application'}
          </button>
        </div>
      </div>
    </div>
  )
}